import styles from "./mobileTopBar.module.scss";

import React from "react";
import Image from "next/image";
import { Flex } from "antd";
import Title from "antd/es/typography/Title";

import PWAPromptModal from "../pwa/PWAPromptModal";
import SettingsDropdown from "../pwa/SettingsDropdown";

const MobileTopBar: React.FC = () => {
  return (
    <div className={styles.mobileTopBar}>
      <Flex justify="space-between" align="center" style={{ width: "100%" }}>
        <Flex gap={8} align="center">
          <Image
            src="/logo/favicon.ico"
            alt="Logo"
            width={32}
            height={32}
            className={styles.logoImg}
          />
          <Title level={1} className={styles.title}>
            BP Tracker
          </Title>
        </Flex>
        <SettingsDropdown />
      </Flex>
      <PWAPromptModal />
    </div>
  );
};

export default MobileTopBar;
