"use client";

import React from "react";
import Link from "next/link";
import { Button, Dropdown, MenuProps, Typography } from "antd";
import { BiUserCircle } from "react-icons/bi";
import { MdGetApp, MdIosShare } from "react-icons/md";

import { usePWA } from "@/contexts/PWAContext";

const { Text } = Typography;

const SettingsDropdown: React.FC = () => {
  const { platform, isStandalone, isInstallable, installApp } = usePWA();

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <Link
          href="/profile"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <BiUserCircle size={20} />
          <span>Profile</span>
        </Link>
      ),
    },
    {
      type: "divider",
    },
    isInstallable && !isStandalone
      ? {
          key: "install",
          icon: <MdGetApp size={20} />,
          label: "Install",
          onClick: installApp,
        }
      : {
          key: "install-info",
          label: (
            <div style={{ padding: "4px 0" }}>
              {!isStandalone ? (
                <div>
                  {platform === "ios" ? (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        maxWidth: "200px",
                        whiteSpace: "normal",
                      }}
                    >
                      To install, tap{" "}
                      <MdIosShare style={{ fontSize: "16px" }} /> and select{" "}
                      <strong>"Add to Home Screen"</strong>
                    </div>
                  ) : platform === "macos" ? (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        maxWidth: "200px",
                        whiteSpace: "normal",
                      }}
                    >
                      To install, tap{" "}
                      <MdIosShare style={{ fontSize: "16px" }} /> and select{" "}
                      <strong>"Add to Dock"</strong>
                    </div>
                  ) : (
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      Open in Chrome or Safari to install
                    </div>
                  )}
                </div>
              ) : (
                <Text type="success" style={{ fontSize: "12px" }}>
                  Application is installed
                </Text>
              )}
            </div>
          ),
          disabled: true,
        },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <Button
        type="text"
        icon={<BiUserCircle size={24} style={{ color: "white" }} />}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    </Dropdown>
  );
};

export default SettingsDropdown;
