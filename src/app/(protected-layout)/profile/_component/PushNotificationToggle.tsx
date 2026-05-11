"use client";

import React, { useEffect, useState } from "react";
import { Badge, Card,Flex, message, Switch, Typography } from "antd";

import { subscribeWebPush } from "@/services/api/webpush";

const { Text } = Typography;

const PushNotificationToggle = () => {
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    setPermission(Notification.permission);
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setEnabled(!!subscription);
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    }
    setLoading(false);
  };

  const handleToggle = async (checked: boolean) => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      message.error("Web Push is not supported in this browser");
      return;
    }

    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;

      if (checked) {
        // Subscribe
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        });

        await subscribeWebPush({ subscription });
        setEnabled(true);
        setPermission(Notification.permission);
        message.success("Notifications enabled successfully!");
      } else {
        // Unsubscribe
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          // We could notify the backend here if an unsubscribe endpoint exists
          setEnabled(false);
          message.success("Notifications disabled");
        }
      }
    } catch (error: any) {
      console.error("Push toggle failed:", error);
      if (error.name === "NotAllowedError") {
        message.error("Permission denied. Please reset notification permissions in your browser settings.");
        setPermission("denied");
      } else {
        message.error("Failed to update notification settings");
      }
      // Revert state if failed
      checkSubscription();
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (permission === "denied") return <Badge status="error" text="Blocked" />;
    if (enabled) return <Badge status="success" text="Active" />;
    return <Badge status="default" text="Inactive" />;
  };

  return (
    <Card size="small" style={{ borderRadius: 12, marginBottom: 16 }}>
      <Flex justify="space-between" align="center">
        <Flex vertical>
          <Text strong style={{ fontSize: "1rem" }}>Push Notifications</Text>
          <Text type="secondary" style={{ fontSize: "0.85rem" }}>
            {getStatusBadge()}
          </Text>
        </Flex>
        <Switch
          loading={loading}
          checked={enabled}
          onChange={handleToggle}
          disabled={permission === "denied"}
        />
      </Flex>
      {permission === "denied" && (
        <Text type="danger" style={{ fontSize: "0.75rem", marginTop: 8, display: "block" }}>
          Please enable notifications in your browser settings to use this feature.
        </Text>
      )}
    </Card>
  );
};

export default PushNotificationToggle;
