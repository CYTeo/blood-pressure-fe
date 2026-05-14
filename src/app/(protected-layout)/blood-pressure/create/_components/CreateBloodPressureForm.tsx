"use client";

import styles from "./createBloodPressureForm.module.scss";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Col, Flex, Form, Input, message, Row, Typography } from "antd";

import {
  type WheelerOption,
  WheelerPicker,
} from "@/app/_components/wheeler/WheelerPicker";
import { createBP } from "@/services/api/bp";

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

const CreateBloodPressureForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const systolic = searchParams.get("systolic");
    const diastolic = searchParams.get("diastolic");
    const pulse = searchParams.get("pulse");
    const rawText = searchParams.get("rawText");

    if (systolic || diastolic || pulse || rawText) {
      form.setFieldsValue({
        systolic: systolic ? Number(systolic) : undefined,
        diastolic: diastolic ? Number(diastolic) : undefined,
        pulse: pulse ? Number(pulse) : undefined,
        note: rawText ? `OCR Scanned Text: ${rawText}` : undefined,
      });

      if (systolic && diastolic) {
        messageApi.info("Values pre-filled from scanner");
      }
    }
  }, [searchParams, form, messageApi]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await createBP(values);
      messageApi.success("Blood pressure recorded successfully");
      router.push("/blood-pressure");
    } catch (error) {
      message.error("Failed to record blood pressure");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className={styles.header}>
        <Title level={3} className={styles.title}>
          New Record
        </Title>
        {/* <Text type="secondary">
            Keep track of your health by recording your daily metrics.
          </Text> */}
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        size="large"
        initialValues={{
          systolic: 120,
          diastolic: 80,
          pulse: 80,
        }}
      >
        <div className={styles.centeredLabels}>
          <Row gutter={16} align="bottom" className={styles.wheelerRow}>
            <Col span={8}>
              <Flex vertical gap="small" align="center" className={styles.wheelerFlex}>
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
              <Flex vertical gap="small" align="center" className={styles.wheelerFlex}>
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
              <Flex vertical gap="small" align="center" className={styles.wheelerFlex}>
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
            loading={loading}
            block
            className={styles.submitButton}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateBloodPressureForm;
