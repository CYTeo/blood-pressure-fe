"use client";

import styles from "./createReminderForm.module.scss";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  message,
  Select,
  Switch,
  Typography,
} from "antd";
import dayjs from "dayjs";

import { createReminder } from "@/services/api/reminder";

const { Title, Text } = Typography;

const hourOptions = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString().padStart(2, "0"),
  label: i.toString().padStart(2, "0"),
}));

const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
  value: i.toString().padStart(2, "0"),
  label: i.toString().padStart(2, "0"),
}));

const CreateReminderForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { hour, minute, ...rest } = values;
      // const remindAt = dayjs()
      //   .hour(parseInt(hour))
      //   .minute(parseInt(minute))
      //   .second(0)
      //   .toISOString();

      const payload = {
        ...rest,
        remindAt: `${hour}:${minute}`,
      };
      await createReminder(payload);
      message.success("Reminder created successfully");
      router.push("/reminder");
    } catch (error) {
      message.error("Failed to create reminder");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={styles.formCard}>
      <div className={styles.header}>
        <Title level={3} className={styles.title}>
          Set a Reminder
        </Title>
        <Text type="secondary">
          Never miss a check-up or medication. Set your reminder below.
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        size="large"
        initialValues={{
          hour: dayjs().add(1, 'hour').format("HH"),
          minute: dayjs().add(1, 'hour').format("mm"),
          isActive: true,
        }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input a title!" }]}
        >
          <Input placeholder="e.g., Evening BP Check" />
        </Form.Item>

        <Form.Item
          label="Remind At"
          required
          help="Select hour and minute (24-hour format)"
        >
          <Flex gap="small" align="center">
            <Form.Item
              name="hour"
              noStyle
              rules={[{ required: true, message: "Hour is required" }]}
            >
              <Select
                options={hourOptions}
                placeholder="HH"
                className={styles.timeSelect}
                suffixIcon={null}
                virtual
              />
            </Form.Item>
            <Text strong className={styles.timeSeparator}>:</Text>
            <Form.Item
              name="minute"
              noStyle
              rules={[{ required: true, message: "Minute is required" }]}
            >
              <Select
                options={minuteOptions}
                placeholder="mm"
                className={styles.timeSelect}
                suffixIcon={null}
                virtual
              />
            </Form.Item>
          </Flex>
        </Form.Item>

        <Form.Item label="Message (Optional)" name="message">
          <Input.TextArea placeholder="Any details or instructions..." rows={3} />
        </Form.Item>

        <Form.Item>
          <Flex align="center" gap="small">
            <Form.Item name="isActive" valuePropName="checked" noStyle>
              <Switch />
            </Form.Item>
            <Text>Enable Reminder</Text>
          </Flex>
        </Form.Item>

        <Form.Item className={styles.submitButtonItem}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className={styles.submitButton}
          >
            Create Reminder
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateReminderForm;
