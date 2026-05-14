"use client";

import styles from "./createReminderForm.module.scss";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  message,
  Row,
  Switch,
  Typography,
} from "antd";
import dayjs from "dayjs";

import {
  type WheelerOption,
  WheelerPicker,
} from "@/app/_components/wheeler/WheelerPicker";
import { createReminder } from "@/services/api/reminder";

const { Title, Text } = Typography;

const hourOptions: WheelerOption[] = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString().padStart(2, "0"),
  label: i.toString().padStart(2, "0"),
}));

const minuteOptions: WheelerOption[] = Array.from({ length: 60 }, (_, i) => ({
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
      const formattedHour = String(hour).padStart(2, "0");
      const formattedMinute = String(minute).padStart(2, "0");

      const payload = {
        ...rest,
        remindAt: `${formattedHour}:${formattedMinute}`,
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
    <div>
      <div className={styles.header}>
        <Title level={3} className={styles.title}>
          Set a Reminder
        </Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        size="large"
        initialValues={{
          hour: dayjs().add(1, "hour").format("HH"),
          minute: dayjs().add(1, "hour").format("mm"),
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
          <div className={styles.centeredLabels}>
            <Row
              gutter={16}
              align="bottom"
              justify={"center"}
              className={styles.wheelerRow}
            >
              <Col span={8}>
                <Form.Item
                  name="hour"
                  noStyle
                  rules={[{ required: true, message: "Hour is required" }]}
                >
                  <WheelerPicker options={hourOptions} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="minute"
                  noStyle
                  rules={[{ required: true, message: "Minute is required" }]}
                >
                  <WheelerPicker options={minuteOptions} />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form.Item>

        <Form.Item label="Message (Optional)" name="message">
          <Input.TextArea
            placeholder="Any details or instructions..."
            rows={3}
          />
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
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateReminderForm;
