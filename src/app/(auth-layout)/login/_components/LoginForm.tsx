"use client";
import styles from "./loginForm.module.scss";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Divider, Form, Input, message } from "antd";
import Text from "antd/es/typography/Text";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

import { logIn } from "@/services/api/auth";
import useValidator from "@/utils/validator";

const LoginForm = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const validator = useValidator();
  const [isLoading, setIsLoading] = React.useState(false);

  const onFinish = async (values: any) => {
    setIsLoading(true);
    try {
      await logIn(values);

      router.replace("/blood-pressure");
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <Image
            src={"/logo/icon-192.webp"}
            alt="Logo"
            width={80}
            height={80}
          />
        </div>
        <Divider titlePlacement="center">
          <Text type="secondary">Sign In</Text>
        </Divider>
        <Form
          name="login"
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item name="username" rules={[validator.required]}>
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              className="login__input"
              autoComplete="off"
              size="large"
            />
          </Form.Item>

          <Form.Item name="password" rules={[validator.required]}>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              className="login__input"
              autoComplete="password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              disabled={isLoading}
              className="login__button"
            >
              Log In
            </Button>
          </Form.Item>
        </Form>
        <div className={styles.footer}>
          <Text type="secondary">Don't have an account? </Text>
          <a href="/register">Register</a>
        </div>

        {/* <div className="login__forgot">
          <a href="/forgot-password">Forgot Password?</a>
        </div> */}
      </div>
    </div>
  );
};

export default LoginForm;
