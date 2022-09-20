import React from "react";
import banner from "images/banner.png";
import styles from "./index.module.less";

const Test = () => {
  return (
    <div className={styles.container}>
      <p className={styles.text}>测试页面地方個地方</p>
      <input />
      <img src={banner} alt="" />
    </div>
  );
};

export default Test;
