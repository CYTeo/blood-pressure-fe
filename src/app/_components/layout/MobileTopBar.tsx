import styles from "./mobileTopBar.module.scss";

import React from "react";
import Title from "antd/es/typography/Title";

const MobileTopBar = () => {
  return (
    <div className={styles.mobileTopBar}>
      <Title level={1} className={styles.title}>
        BP Tracker
      </Title>
    </div>
  );
};

export default MobileTopBar;
