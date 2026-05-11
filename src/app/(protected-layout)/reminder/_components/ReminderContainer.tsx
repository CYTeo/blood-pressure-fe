"use client";

import styles from "./reminderContainer.module.scss";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Flex,
  message,
  Skeleton,
  Switch,
  Typography,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

import ServerButton from "@/app/_components/button/ServerButton";
import { listReminder, updateReminder } from "@/services/api/reminder";

const { Text } = Typography;

export const ReminderContainer = () => {
  const router = useRouter();
  const [reminders, setReminders] = useState<any>({
    loading: true,
    data: [],
  });

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
    if (reminders.data.length === 0 && !reminders.loading) {
      return (
        <div className={styles.addButtonContainer}>
          <Text type="secondary">
            You have not set any reminders. Add one now!
          </Text>
          <ServerButton
            icon={<PlusOutlined />}
            href="/reminder/create"
            children={"Add"}
            className={styles.addButton}
          />
        </div>
      );
    }

    if (reminders.loading) {
      return Array.from({ length: 5 }).map((_, index) => (
        <Skeleton.Node key={index} className={styles.skeletonNode} active />
      ));
    }
    return reminders.data.map((item: any) => (
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
    ));
  }, [reminders, router]);

  return (
    <div className={styles.container}>
      <Flex vertical gap="middle">
        {ReminderList}
      </Flex>
    </div>
  );
};
