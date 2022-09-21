import React from "react";
import banner from "images/banner.png";
import styles from "./index.module.less";
import TiltButton from "@/components/TiltButton";

const Test = () => {
  return (
    <div className={styles.container}>
      <p className={styles.text}>测试页面</p>
      <input />
      <img src={banner} alt="" />
      <TiltButton
        style={{ marginTop: "50px" }}
      >
        按 钮
      </TiltButton>
    </div>
  );
};

export default Test;
