"use client";

import styles from "../create/_components/createBloodPressureForm.module.scss";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  message,
  Row,
  Spin,
  Typography,
} from "antd";

import {
  type WheelerOption,
  WheelerPicker,
} from "@/app/_components/wheeler/WheelerPicker";
import { getBP, updateBP } from "@/services/api/bp";

const SYSTOLIC: WheelerOption[] = Array.from({ length: 181 }, (_, i) => ({
  label: (i + 70).toString(),
  value: (i + 70).toString(),
}));

const DIASTOLIC: WheelerOption[] = Array.from({ length: 111 }, (_, i) => ({
  label: (i + 40).toString(),
  value: (i + 40).toString(),
}));

const PULSE: WheelerOption[] = Array.from({ length: 161 }, (_, i) => ({
  label: (i + 40).toString(),
  value: (i + 40).toString(),
}));

const { Title, Text } = Typography;

const BloodPressureDetailPage = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getBP(Number(id));
        if (res) {
          form.setFieldsValue(res);
        }
      } catch (error) {
        message.error("Failed to fetch blood pressure details");
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
      await updateBP(Number(id), values);
      messageApi.success("Blood pressure updated successfully");
      setTimeout(() => {
        router.push("/blood-pressure");
      }, 1000);
    } catch (error) {
      message.error("Failed to update blood pressure");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className={styles.header}>
        <Title level={3} className={styles.title}>
          Edit Record
        </Title>
      </div>
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="large"
          initialValues={{ systolic: 120, diastolic: 80, pulse: 80 }}
        >
          <div className={styles.centeredLabels}>
            <Row gutter={16} align="top" className={styles.wheelerRow}>
              <Col span={8}>
                <Flex
                  vertical
                  gap="small"
                  align="center"
                  className={styles.wheelerFlex}
                >
                  <Form.Item
                    name="systolic"
                    rules={[
                      {
                        required: true,
                        message: "Required",
                      },
                    ]}
                    className={styles.wheelerFormItem}
                    normalize={(val) => (val ? Number(val) : val)}
                  >
                    <WheelerPicker options={SYSTOLIC} />
                  </Form.Item>
                  <Title level={5} className={styles.wheelerTitle}>
                    SYSTOLIC
                  </Title>
                  <Text type="secondary" className={styles.wheelerUnit}>
                    mmHg
                  </Text>
                </Flex>
              </Col>
              <Col span={8}>
                <Flex
                  vertical
                  gap="small"
                  align="center"
                  className={styles.wheelerFlex}
                >
                  <Form.Item
                    name="diastolic"
                    rules={[
                      {
                        required: true,
                        message: "Required",
                      },
                    ]}
                    className={styles.wheelerFormItem}
                    normalize={(val) => (val ? Number(val) : val)}
                  >
                    <WheelerPicker options={DIASTOLIC} />
                  </Form.Item>
                  <Title level={5} className={styles.wheelerTitle}>
                    DIASTOLIC
                  </Title>
                  <Text type="secondary" className={styles.wheelerUnit}>
                    mmHg
                  </Text>
                </Flex>
              </Col>
              <Col span={8}>
                <Flex
                  vertical
                  gap="small"
                  align="center"
                  className={styles.wheelerFlex}
                >
                  <Form.Item
                    name="pulse"
                    className={styles.wheelerFormItem}
                    normalize={(val) => (val ? Number(val) : val)}
                  >
                    <WheelerPicker options={PULSE} />
                  </Form.Item>
                  <Title level={5} className={styles.wheelerTitle}>
                    PULSE
                  </Title>
                  <Text type="secondary" className={styles.wheelerUnit}>
                    bpm
                  </Text>
                </Flex>
              </Col>
            </Row>
          </div>

          <Form.Item label="Note (Optional)" name="note">
            <Input.TextArea placeholder="Any additional notes..." rows={4} />
          </Form.Item>

          <Form.Item className={styles.submitButtonItem}>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              block
              className={styles.submitButton}
            >
              Update
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
};

export default BloodPressureDetailPage;
