"use client";

import styles from "../profile.module.scss";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

import { logOut } from "@/services/api/auth";

const LogoutButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logOut();
      message.success("Logged out successfully");
      router.push("/login");
    } catch (err) {
      console.error(err);
      message.error("Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      danger
      size="large"
      onClick={handleLogout}
      loading={loading}
      className={styles.logoutButton}
      icon={<LogoutOutlined />}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
