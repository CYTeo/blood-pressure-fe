"use client";

import styles from "../profile.module.scss";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

import { logOut } from "@/services/api/auth";

interface LogoutButtonProps {
  className?: string;
  type?: "primary" | "default" | "dashed" | "link" | "text";
  danger?: boolean;
}

const LogoutButton = ({
  className,
  type = "default",
  danger,
}: LogoutButtonProps) => {
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
      type={type}
      danger={danger}
      variant="filled"
      size="large"
      onClick={handleLogout}
      loading={loading}
      className={className || styles.logoutButton}
      icon={<LogoutOutlined />}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
