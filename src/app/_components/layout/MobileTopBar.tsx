import styles from "./mobileTopBar.module.scss";

import React from "react";
import Image from "next/image";
import { Flex } from "antd";
import Title from "antd/es/typography/Title";

const MobileTopBar = () => {
  return (
    <div className={styles.mobileTopBar}>
      <Flex gap={8} align="center">
        <Image src="/logo/favicon.ico" alt="Logo" width={32} height={32} />
        <Title level={1} className={styles.title}>
          BP Tracker
        </Title>
      </Flex>
    </div>
  );
};

export default MobileTopBar;
