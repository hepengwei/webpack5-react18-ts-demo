import React from "react";
import banner from "images/banner.png";
import Twitter from "images/Twitter.svg";
import TiltButton from "components/TiltButton";
import PeopleAnimation from "components/PeopleAnimation";
import styles from "./index.module.less";

const Test = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
      <TiltButton style={{ margin: "30px 0" }}>
        <Twitter style={{ marginRight: "10px" }} />按 钮
      </TiltButton>
      <p className={styles.text}>测试页面</p>
      <input />
      <img src={banner} alt="" />
      </div>
      
      <div className={styles.peopleAnimation}>
        <PeopleAnimation />
      </div>
    </div>
  );
};

export default Test;
