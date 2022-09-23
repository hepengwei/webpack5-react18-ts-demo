// @ts-nocheck
import React, { useEffect } from "react";
import "particles.js";
import particlesParams from "./particlesParams";
import styles from "./index.module.less";

const AppBg = (props) => {
  useEffect(() => {
    particlesJS("particles-js", particlesParams);
  }, []);

  return (
    <div className={styles.container} id="particles-js">
      {props.children}
    </div>
  );
};

export default AppBg;
