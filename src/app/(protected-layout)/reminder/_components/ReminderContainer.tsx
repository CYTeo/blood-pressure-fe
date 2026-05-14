"use client";

import styles from "./reminderContainer.module.scss";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Flex,
  message,
  Modal,
  Skeleton,
  Switch,
  Typography,
} from "antd";
import Title from "antd/es/typography/Title";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

import { listReminder, updateReminder } from "@/services/api/reminder";

import PushNotificationToggle from "../../profile/_component/PushNotificationToggle";

const { Text } = Typography;

export const ReminderContainer = () => {
  const router = useRouter();
  const [reminders, setReminders] = useState<any>({
    loading: true,
    data: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const checkNotificationAndProceed = async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      router.push("/reminder/create");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      const hasPermission = Notification.permission === "granted";

      if (!hasPermission || !subscription) {
        setIsModalOpen(true);
      } else {
        router.push("/reminder/create");
      }
    } catch (error) {
      console.error("Error checking notification status:", error);
      router.push("/reminder/create");
    }
  };

  const fetchReminders = async () => {
    try {
      const res = await listReminder({ page: 1, take: 50 });
      setReminders({ loading: false, data: res });
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || "Failed to fetch reminders",
      );
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      await updateReminder(id, { isActive });
      setReminders((prev: any) => ({
        ...prev,
        data: prev.data.map((r: any) => (r.id === id ? { ...r, isActive } : r)),
      }));
      message.success(`Reminder ${isActive ? "enabled" : "disabled"}`);
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || "Failed to update reminder status",
      );
    }
  };

  const ReminderList = useMemo(() => {
    if (reminders.loading) {
      return (
        <div style={{ marginTop: "1rem" }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton.Node key={index} className={styles.skeletonNode} active />
          ))}
        </div>
      );
    }

    if (reminders.data.length === 0) {
      return (
        <div className={styles.addButtonContainer}>
          <Text type="secondary">
            You have not set any reminders. Add one now!
          </Text>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={checkNotificationAndProceed}
            className={styles.addButton}
          >
            Add
          </Button>
        </div>
      );
    }

    return (
      <div style={{ marginTop: "1rem" }}>
        {reminders.data.map((item: any) => (
          <Card key={item.id} size="small" className={styles.reminderCard}>
            <Flex justify="space-between" align="center">
              <div style={{ flex: 1 }}>
                <Flex align="center" gap="small">
                  <Text strong style={{ fontSize: "1.1rem" }}>
                    {item.title}
                  </Text>
                  <Switch
                    size="small"
                    checked={item.isActive}
                    onChange={(checked) => handleToggleActive(item.id, checked)}
                  />
                </Flex>
                <div className={styles.timeLabel}>{item.remindAt}</div>
                {item.message && (
                  <Text type="secondary" style={{ fontSize: "0.9rem" }}>
                    {item.message}
                  </Text>
                )}
              </div>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => router.push(`/reminder/${item.id}`)}
              />
            </Flex>
          </Card>
        ))}
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reminders, router]);

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <Flex
        gap={"middle"}
        align="center"
        justify="space-between"
        className={styles.flexContainer}
      >
        <Title level={4} className={styles.title}>
          Reminders
        </Title>
        {!reminders.loading && reminders.data.length > 0 && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={checkNotificationAndProceed}
            className={styles.headerAddButton}
          >
            Add
          </Button>
        )}
      </Flex>
      {ReminderList}

      <Modal
        title="Enable Notifications"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>,
          <Button
            key="proceed"
            type="link"
            onClick={() => router.push("/reminder/create")}
          >
            Proceed anyway
          </Button>,
        ]}
      >
        <div style={{ padding: "10px 0" }}>
          <Text type="secondary" style={{ display: "block", marginBottom: 15 }}>
            To receive reminders on this device, please enable push
            notifications.
          </Text>
          <PushNotificationToggle />
        </div>
      </Modal>
    </div>
  );
};
