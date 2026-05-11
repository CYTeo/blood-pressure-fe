"use client";

import styles from "../create/_components/createBloodPressureForm.module.scss";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Spin,
  Typography,
} from "antd";

import { getBP, updateBP } from "@/services/api/bp";

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
      {/* <Card className={styles.formCard}> */}
        <div className={styles.header}>
          <Title level={3} className={styles.title}>
            Edit Blood Pressure Record
          </Title>
          <Text type="secondary">
            Update your health metrics for this record.
          </Text>
        </div>

        <Spin spinning={loading}>
          <Form form={form} layout="vertical" onFinish={onFinish} size="large">
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
                loading={submitting}
                block
                className={styles.submitButton}
              >
                Update
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      {/* </Card> */}
    </>
  );
};

export default BloodPressureDetailPage;
