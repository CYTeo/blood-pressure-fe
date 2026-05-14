"use client";

import styles from "../create/_components/createReminderForm.module.scss";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Spin,
  Switch,
  Typography,
} from "antd";

import {
  WheelerOption,
  WheelerPicker,
} from "@/app/_components/wheeler/WheelerPicker";
import {
  deleteReminder,
  getReminder,
  updateReminder,
} from "@/services/api/reminder";

const { Title, Text } = Typography;

const hourOptions: WheelerOption[] = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString().padStart(2, "0"),
  label: i.toString().padStart(2, "0"),
}));

const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
  value: i.toString().padStart(2, "0"),
  label: i.toString().padStart(2, "0"),
}));

const ReminderDetailPage = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getReminder(Number(id));
        if (res) {
          const [hour, minute] = res.remindAt.split(":");
          form.setFieldsValue({
            ...res,
            hour,
            minute,
          });
        }
      } catch (error) {
        message.error("Failed to fetch reminder details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id, form]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const { hour, minute, ...rest } = values;
      const formattedHour = String(hour).padStart(2, "0");
      const formattedMinute = String(minute).padStart(2, "0");

      const payload = {
        ...rest,
        remindAt: `${formattedHour}:${formattedMinute}`,
      };

      await updateReminder(Number(id), payload);
      messageApi.success("Reminder updated successfully");
      setTimeout(() => {
        router.push("/reminder");
      }, 1000);
    } catch (error) {
      message.error("Failed to update reminder");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteReminder(Number(id));
      messageApi.success("Reminder deleted successfully");
      router.push("/reminder");
    } catch (error) {
      message.error("Failed to delete reminder");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ paddingBottom: "2rem" }}>
      {contextHolder}
      <div className={styles.header}>
        <Title level={3} className={styles.title}>
          Edit Reminder
        </Title>
      </div>

      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={onFinish} size="large">
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
            {/* <Flex gap="small" align="center"> */}
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
            <Flex vertical gap="small">
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                block
                className={styles.submitButton}
              >
                Update
              </Button>

              <Popconfirm
                title="Delete Reminder"
                description="Are you sure you want to delete this reminder?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true, loading: deleting }}
              >
                <Button block danger type="text">
                  Delete
                </Button>
              </Popconfirm>
            </Flex>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default ReminderDetailPage;
