"use client";

import React from "react";
import { Button, Card, Form, Input, message } from "antd";

import { updateProfile } from "@/services/api/user";

interface ProfileFormProps {
  profile: any;
}

const ProfileForm = ({ profile }: ProfileFormProps) => {
  const [loading, setLoading] = React.useState(false);

  const handleFinish = async (values: any) => {
    console.log("Values: ", values);
    setLoading(true);
    try {
      await updateProfile(values);
      message.success("Profile updated successfully");
    } catch (err: any) {
      message.error(err?.response?.data || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card size="small">
      <Form
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          username: profile?.username,
          name: profile?.name,
          email: profile?.email,
        }}
      >
        <Form.Item label="Username" name="username">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" block loading={loading}>
            Update
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProfileForm;
