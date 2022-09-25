// @ts-nocheck
import React, { useLayoutEffect, useRef } from "react";
import ReactDOM from "react-dom";
// import gsap from "gsap";
// import { Tween } from "react-gsap";
import people from "images/people.png";
import gift from "images/gift.png";
import styles from "./index.module.less";

const a = 100; // 椭圆轨迹的长半径
const b = 50; // 椭圆轨迹的短半径
const direction = "CCW"; // 逆时针
const speed = 2; // 运动速度
const rotate = 45; // 椭圆轨迹的旋转角度

// 根据当前坐标获取椭圆下一个点的坐标数据
function getEllipseNextData(
  a,
  b,
  direction,
  x,
  y,
  xDirection,
  yDirection,
  speed = 1
) {
  let nextX = x;
  let nextY = y;
  let nextXDirection = xDirection;
  let nextYDirection = yDirection;
  if (x >= a) {
    nextX = x - speed;
    nextXDirection = -1;
  } else if (x <= -a) {
    nextX = x + speed;
    nextXDirection = 1;
  } else {
    if (xDirection > 0) {
      nextX = x + speed;
    } else {
      nextX = x - speed;
    }
  }
  if (y >= b) {
    nextYDirection = -1;
  } else if (y <= -b) {
    nextYDirection = 1;
  }
  nextY = getEllipseY(a, b, direction, nextX, nextXDirection);
  return { nextX, nextY, nextXDirection, nextYDirection };
}

// 根据x坐标获取椭圆对应y的坐标
function getEllipseY(a, b, direction, x, xDirection) {
  let y = Math.sqrt((1 - Math.pow(x, 2) / Math.pow(a, 2)) * Math.pow(b, 2));
  if (direction === "CCW") {
    if (xDirection < 0) {
      y = -y;
    }
  } else {
    if (xDirection > 0) {
      y = -y;
    }
  }
  return y;
}

// 获取椭圆旋转后的坐标位置
function getEllipseRotateData(x, y, rotate) {
  let rotateX = x;
  let rotateY = y;
  if (rotate !== 0) {
    rotateX = x * Math.cos(rotate) - y * Math.sin(rotate);
    rotateY = x * Math.sin(rotate) + y * Math.cos(rotate);
  }
  return { rotateX, rotateY };
}

const PeopleAnimation = () => {
  const content = useRef();

  useLayoutEffect(() => {
    let frameID;
    let toOX = a;
    let toOY = 0;
    let xDirectionNow = 1;
    let yDirectionNow = 1;
    if (direction === "CCW") {
      yDirectionNow = -1;
    }
    function loop() {
      if (content.current) {
        const rotateData = getEllipseRotateData(toOX, toOY, rotate);
        const { rotateX, rotateY } = rotateData;
        const nativeNode = ReactDOM.findDOMNode(content.current);
        nativeNode.style.left = `${rotateX}px`;
        nativeNode.style.top = `${rotateY}px`;

        let newSpeed = speed;
        if (Math.abs(toOX) > a * 0.8) {
          newSpeed = speed * Math.pow(Math.cos(toOX / a), 2);
        }
        console.log(4444, newSpeed);

        const nextData = getEllipseNextData(
          a,
          b,
          direction,
          toOX,
          toOY,
          xDirectionNow,
          yDirectionNow,
          newSpeed
        );
        const { nextX, nextY, nextXDirection, nextYDirection } = nextData;
        toOX = nextX;
        toOY = nextY;
        xDirectionNow = nextXDirection;
        yDirectionNow = nextYDirection;
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
      <div className={styles.content} id="peopleAni" ref={content}>
        <img src={people} alt="" className={styles.people} />
        <img src={gift} alt="" className={styles.gift} />
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
