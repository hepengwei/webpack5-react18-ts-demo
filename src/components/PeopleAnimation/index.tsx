// @ts-nocheck
import React, { useLayoutEffect, useRef } from "react";
import ReactDOM from "react-dom";
import people from "images/people.png";
import gift from "images/gift.png";
import coin1 from "images/coin1.png";
import coin2 from "images/coin2.png";
import coin3 from "images/coin3.png";
import coin4 from "images/coin4.png";
import coin5 from "images/coin5.png";
import coin6 from "images/coin6.png";
import coin7 from "images/coin7.png";
import styles from "./index.module.less";

let coinMaxTop = 600;
const a = 80; // 椭圆轨迹的长半径
const b = 40; // 椭圆轨迹的短半径
let direction = "CCW"; // 逆时针
const speed = 1.5; // 运动速度
let rotate = 0; // 椭圆轨迹的旋转角度
let transformX = 0; // 椭圆在x轴上的平移距离
let transformY = 0; // 椭圆在y轴上的平移距离
let vXG = 0.1; // 币在x方向的阻力系数

let shouldCoinsMoving = false;
let isCoinsMoving = false;
// 币开始掉落的初始位置
const initIconPos = {
  icon1: {
    top: 60,
    left: 32,
    vx: -4.5,
  },
  icon2: {
    top: 30,
    left: 34,
    vx: -3,
  },
  icon3: {
    top: 50,
    left: 36,
    vx: 0,
  },
  icon4: {
    top: 80,
    left: 38,
    vx: 1,
  },
  icon5: {
    top: 36,
    left: 40,
    vx: 3,
  },
  icon6: {
    top: 60,
    left: 42,
    vx: 2,
  },
  icon7: {
    top: 90,
    left: 44,
    vx: 5,
  },
};
// 币掉落时相关的数据
const iconData = {
  icon1: {
    top: initIconPos.icon1.top,
    left: initIconPos.icon1.left,
    vx: -4.5,
    vy: 0,
    g: 0.2,
    opacity: 0,
    isMoving: false,
  },
  icon2: {
    top: initIconPos.icon2.top,
    left: initIconPos.icon2.left,
    vx: -3,
    vy: 0,
    g: 0.3,
    opacity: 0,
    isMoving: false,
  },
  icon3: {
    top: initIconPos.icon3.top,
    left: initIconPos.icon3.left,
    vx: 0,
    vy: 0,
    g: 0.2,
    opacity: 0,
    isMoving: false,
  },
  icon4: {
    top: initIconPos.icon4.top,
    left: initIconPos.icon4.left,
    vx: 1,
    vy: 0,
    g: 0.3,
    opacity: 0,
    isMoving: false,
  },
  icon5: {
    top: initIconPos.icon5.top,
    left: initIconPos.icon5.left,
    vx: 3,
    vy: 0,
    g: 0.4,
    opacity: 0,
    isMoving: false,
  },
  icon6: {
    top: initIconPos.icon6.top,
    left: initIconPos.icon6.left,
    vx: 2,
    vy: 0,
    g: 0.5,
    opacity: 0,
    isMoving: false,
  },
  icon7: {
    top: initIconPos.icon7.top,
    left: initIconPos.icon7.left,
    vx: 5,
    vy: 0,
    g: 0.3,
    opacity: 0,
    isMoving: false,
  },
};

// 根据当前未转换坐标获取椭圆下一个未转换点的坐标
function getEllipseNextPos(a, b, direction, x, y, speed = 1) {
  let nextX = x;
  let nextY = y;
  if (x >= a) {
    nextX = x - speed;
  } else if (x <= -a) {
    nextX = x + speed;
  } else {
    if (direction === "CCW") {
      if (y > 0) {
        nextX = x - speed;
      } else {
        nextX = x + speed;
      }
    } else {
      if (y < 0) {
        nextX = x - speed;
      } else {
        nextX = x + speed;
      }
    }
  }
  if (nextX > a) {
    nextX = a;
  } else if (nextX < -a) {
    nextX = -a;
  }
  nextY = getEllipseY(a, b, nextX);
  if (nextY > 0) {
    if (x >= a) {
      if (direction !== "CCW") {
        nextY = -nextY;
      }
    } else if (x <= -a) {
      if (direction === "CCW") {
        nextY = -nextY;
      }
    } else {
      if (y < 0) {
        nextY = -nextY;
      }
    }
  }
  return { nextX, nextY };
}

// 根据x坐标获取椭圆对应y坐标的绝对值
function getEllipseY(a, b, x) {
  let y = 0;
  if (x > -a && x < a) {
    y = Math.sqrt((1 - Math.pow(x, 2) / Math.pow(a, 2)) * Math.pow(b, 2));
  }
  return y;
}

// 获取椭圆旋转并平移后的坐标位置
function getEllipseTransitionPos(
  x,
  y,
  rotate = 0,
  transformX = 0,
  transformY = 0
) {
  let transitionX = x;
  let transitionY = y;
  if (rotate !== 0) {
    transitionX = x * Math.cos(rotate) + y * Math.sin(rotate) + transformX;
    transitionY = -x * Math.sin(rotate) + y * Math.cos(rotate) + transformY;
  }

  return { transitionX, transitionY };
}

const PeopleAnimation = () => {
  const content = useRef();
  const giftBoxRef = useRef();

  const giftBoxClick = () => {
    if (!isCoinsMoving) {
      shouldCoinsMoving = true;
      isCoinsMoving = true;
    }
  };

  useLayoutEffect(() => {
    let frameID;
    let toOX = a * 0.8;
    let toOY = getEllipseY(a, b, toOX);

    function loop() {
      if (content.current) {
        const transitionPos = getEllipseTransitionPos(
          toOX,
          toOY,
          rotate,
          transformX,
          transformY
        );
        const { transitionX, transitionY } = transitionPos;
        const nativeNode = ReactDOM.findDOMNode(content.current);
        if (content.current.offsetWidth < 350) {
          coinMaxTop = 500;
        } else if (content.current.offsetWidth < 400) {
          coinMaxTop = 550;
        }

        nativeNode.style.left = `${transitionX}px`;
        nativeNode.style.top = `${-transitionY}px`;

        let newSpeed = speed;
        if (toOX >= a) {
          if (direction === "CCW") {
            rotate = 0;
            transformX = 0;
            transformY = 0;
          } else {
            rotate = 120;
            transformX = 17;
            transformY = 49;
          }
          // 开始播放币掉落
          shouldCoinsMoving = true;
          isCoinsMoving = true;
        } else if (toOX <= -a) {
          if (direction === "CCW") {
            direction = "CW";
          } else {
            direction = "CCW";
          }
          // 开始播放币掉落
          shouldCoinsMoving = true;
          isCoinsMoving = true;
        }
        if (Math.abs(toOX) > a * 0.2) {
          newSpeed = speed * Math.pow(Math.cos(toOX / a), 2);
        }

        const nextData = getEllipseNextPos(
          a,
          b,
          direction,
          toOX,
          toOY,
          newSpeed
        );
        const { nextX, nextY } = nextData;
        toOX = nextX;
        toOY = nextY;

        // 移动币
        let giftBox;
        if (giftBoxRef && giftBoxRef.current) {
          giftBox = ReactDOM.findDOMNode(giftBoxRef.current);
        }
        let allMoveOver = true;
        if (giftBox) {
          Object.keys(iconData).forEach((key, index) => {
            const elm = giftBox.childNodes[index];
            if (elm) {
              const item = iconData[key];
              const { top, left, vx, vy, g, opacity, isMoving } = item;
              if (isMoving || shouldCoinsMoving) {
                const initPos = initIconPos[key];
                let nextTop = top + vy;
                let nextLeft = left + vx;
                let nextVx = vx;
                if (Math.abs(vx) > vXG) {
                  if (vx > 0) {
                    nextVx = vx - vXG;
                  } else {
                    nextVx = vx + vXG;
                  }
                } else {
                  nextVx = 0;
                }
                let hasMoveY = nextTop - initPos.top;
                const allMoveY = coinMaxTop - initPos.top;
                const shouldMoveY = (allMoveY / 2) * 0.45;
                let nextOpacity = opacity;
                if (hasMoveY / allMoveY > 0.55) {
                  hasMoveY = shouldMoveY - (nextTop - allMoveY * 0.55);
                }
                nextOpacity = (hasMoveY / shouldMoveY).toFixed(2);
                if (nextOpacity > 1) {
                  nextOpacity = 1;
                }

                let nextVy = vy + g;
                let nextIsMoving = isMoving;
                if (nextTop === 0) {
                  nextTop = initPos.top;
                  nextLeft = initPos.left;
                  nextVx = initPos.vx;
                  nextIsMoving = true;
                } else if (nextTop >= coinMaxTop) {
                  nextTop = 0;
                  nextLeft = 0;
                  nextOpacity = 0;
                  nextVx = 0;
                  nextVy = 0;
                  nextIsMoving = false;
                } else {
                  allMoveOver = false;
                  if (shouldCoinsMoving) {
                    nextIsMoving = true;
                  }
                }

                elm.style.top = `${nextTop}px`;
                elm.style.left = `${nextLeft}px`;
                elm.style.opacity = nextOpacity;
                Object.assign(item, {
                  top: nextTop,
                  left: nextLeft,
                  vx: nextVx,
                  vy: nextVy,
                  isMoving: nextIsMoving,
                });
              }
            }
          });
        }
        if (shouldCoinsMoving) {
          shouldCoinsMoving = false;
        }
        if (allMoveOver) {
          isCoinsMoving = false;
        }
      }

      frameID = requestAnimationFrame(loop);
    }
    frameID = requestAnimationFrame(loop);

    return () => {
      if (frameID) {
        cancelAnimationFrame(frameID);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content} ref={content}>
        <img src={people} alt="" className={styles.people} />
        <div className={styles.giftBox} ref={giftBoxRef} onClick={giftBoxClick}>
          <img src={coin1} alt="" className={styles.coin} />
          <img src={coin2} alt="" className={styles.coin} />
          <img src={coin3} alt="" className={styles.coin} />
          <img src={coin4} alt="" className={styles.coin} />
          <img src={coin5} alt="" className={styles.coin} />
          <img src={coin6} alt="" className={styles.coin} />
          <img src={coin7} alt="" className={styles.coin} />
          <img src={gift} alt="" className={styles.gift} />
        </div>
      </div>
    </div>
  );
};

export default PeopleAnimation;
