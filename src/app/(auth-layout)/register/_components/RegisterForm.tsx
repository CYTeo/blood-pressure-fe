"use client";
import styles from "./registerForm.module.scss";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Divider, Form, Input, message } from "antd";
import Text from "antd/es/typography/Text";
import { IdcardOutlined,LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";

import { signup } from "@/services/api/auth";
import useValidator from "@/utils/validator";

const RegisterForm = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const validator = useValidator();
  const [isLoading, setIsLoading] = React.useState(false);

  const onFinish = async (values: any) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...signupData } = values;
      await signup(signupData);
      message.success("Account created successfully. Please log in.");
      router.push("/login");
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.registerCard}>
        <div className={styles.logo}>
          <Image
            src={"/logo/icon-192.webp"}
            alt="Logo"
            width={80}
            height={80}
          />
        </div>
        <Divider titlePlacement="center">
          <Text type="secondary">Create Account</Text>
        </Divider>
        <Form
          name="register"
          form={form}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item name="name" rules={[validator.required]}>
            <Input
              prefix={<IdcardOutlined />}
              placeholder="Full Name"
              size="large"
            />
          </Form.Item>

          <Form.Item name="email" rules={[validator.required, validator.email]}>
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item name="username" rules={[validator.required]}>
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              autoComplete="off"
              size="large"
            />
          </Form.Item>

          <Form.Item name="password" rules={[validator.required, validator.password]}>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              autoComplete="new-password"
              size="large"
            />
          </Form.Item>

          <Form.Item 
            name="confirmPassword" 
            dependencies={['password']}
            rules={[
              validator.required,
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              disabled={isLoading}
              loading={isLoading}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
        <div className={styles.footer}>
          <Text type="secondary">Already have an account? </Text>
          <a href="/login">Log In</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
