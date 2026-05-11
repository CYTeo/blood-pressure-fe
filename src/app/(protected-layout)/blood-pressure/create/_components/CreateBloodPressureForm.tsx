"use client";

import styles from "./createBloodPressureForm.module.scss";

import React, { useEffect,useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Typography,
} from "antd";

import { createBP } from "@/services/api/bp";

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
      {/* <Card className={styles.formCard}> */}
        <div className={styles.header}>
          <Title level={3} className={styles.title}>
            Record Blood Pressure
          </Title>
          <Text type="secondary">
            Keep track of your health by recording your daily metrics.
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="large"
          initialValues={{
            systolic: 120,
            diastolic: 80,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Systolic"
                name="systolic"
                rules={[
                  {
                    required: true,
                    message: "Please input systolic pressure!",
                  },
                ]}
              >
                <InputNumber
                  className={styles.fullWidthInput}
                  placeholder="mmHg"
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Diastolic"
                name="diastolic"
                rules={[
                  {
                    required: true,
                    message: "Please input diastolic pressure!",
                  },
                ]}
              >
                <InputNumber
                  className={styles.fullWidthInput}
                  placeholder="mmHg"
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Pulse (Optional)" name="pulse">
            <InputNumber
              className={styles.fullWidthInput}
              placeholder="bpm"
              min={0}
            />
          </Form.Item>

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
      {/* </Card> */}
    </>
  );
};

export default CreateBloodPressureForm;
