import styles from "./reminder.module.scss";

import {  Flex } from "antd";
import Title from "antd/es/typography/Title";
import { PlusOutlined } from "@ant-design/icons";

import ServerButton from "@/app/_components/button/ServerButton";

import { ReminderContainer } from "./_components/ReminderContainer";

const ReminderPage = async () => {
  return (
    <div className={styles.reminderPage}>
      <Flex gap={"middle"} align="center" justify="space-between">
        <Title type="secondary" level={4} className={styles.subTitle}>
          Reminders
        </Title>
        <ServerButton href="/reminder/create" icon={<PlusOutlined />}>
          Add
        </ServerButton>
      </Flex>

      <ReminderContainer />
      {/* <Flex gap="small" style={{ background: "blue" }}>
        <PlusOutlined />
        <Link href="/blood-pressure/create">Record</Link>
      </Flex> */}
    </div>
  );
};

export default ReminderPage;
