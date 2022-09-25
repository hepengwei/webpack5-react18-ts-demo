// @ts-nocheck
import React, { useLayoutEffect, useRef } from "react";
import ReactDOM from "react-dom";
// import gsap from "gsap";
// import { Tween } from "react-gsap";
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

const a = 80; // 椭圆轨迹的长半径
const b = 40; // 椭圆轨迹的短半径
let direction = "CCW"; // 逆时针
const speed = 1.5; // 运动速度
let rotate = 0; // 椭圆轨迹的旋转角度
let transformX = 0;
let transformY = 0;

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
    // transitionX = x * Math.cos(rotate) - y * Math.sin(rotate);
    // transitionY = x * Math.sin(rotate) + y * Math.cos(rotate);
    // if (transformX !== 0) {
    //   transitionX += transformX;
    // }
    // if (transformY !== 0) {
    //   transitionY += transformY;
    // }
    transitionX = x * Math.cos(rotate) + y * Math.sin(rotate) + transformX;
    transitionY = -x * Math.sin(rotate) + y * Math.cos(rotate) + transformY;
    // transitionX =
    //   (x - transformX) * Math.cos(rotate) + (y - transformY) * Math.sin(rotate);
    // transitionY =
    //   (transformX - x) * Math.sin(rotate) + (y - transformY) * Math.cos(rotate);
  }

  return { transitionX, transitionY };
}

const PeopleAnimation = () => {
  const content = useRef();

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
        nativeNode.style.left = `${transitionX}px`;
        nativeNode.style.top = `${-transitionY}px`;
        // console.log(6666, transitionX, transitionY);

        let newSpeed = speed;
        if (toOX >= a) {
          if (direction === "CCW") {
            rotate = 0;
            transformX = 0;
            transformY = 0;
          } else {
            // rotate = 2 * ((Math.atan(b / a) * 180) / Math.PI);
            // const m = Math.cos(rotate) * a;
            // transformX = -(a - m) + 100;
            // transformX = a - m;
            // transformY = Math.sqrt(Math.pow(a, 2) - Math.pow(m, 2));
            // rotate = 180 - rotate;
            rotate = 120;
            transformX = 17;
            transformY = 49;
          }
        } else if (toOX <= -a) {
          if (direction === "CCW") {
            direction = "CW";
          } else {
            direction = "CCW";
          }
        }
        if (Math.abs(toOX) > a * 0.2) {
          newSpeed = speed * Math.pow(Math.cos(toOX / a), 2);
        }
        // console.log(4444, newSpeed);

        const nextData = getEllipseNextPos(
          a,
          b,
          direction,
          toOX,
          toOY,
          newSpeed
        );
        const { nextX, nextY } = nextData;
        // if (toOX >= a) {
        //   console.log(6666, toOX, toOY, nextX, nextY);
        // }
        toOX = nextX;
        toOY = nextY;
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
        <div className={styles.giftBox}>
          <img src={coin1} alt="" className={styles.coin1} />
          <img src={coin2} alt="" className={styles.coin2} />
          <img src={coin3} alt="" className={styles.coin3} />
          <img src={coin4} alt="" className={styles.coin4} />
          <img src={coin5} alt="" className={styles.coin5} />
          <img src={coin6} alt="" className={styles.coin6} />
          <img src={coin7} alt="" className={styles.coin7} />
          <img src={gift} alt="" className={styles.gift} />
        </div>
      </div>
      {/* <Tween to={{ y: "60px", duration: 3, ease: "elastic" }}>
        <div className={styles.content} id="#peopleAni">
          <img src={people} alt="" className={styles.people} />
          <img src={gift} alt="" className={styles.gift} />
        </div>
      </Tween> */}
    </div>
  );
};

export default PeopleAnimation;
