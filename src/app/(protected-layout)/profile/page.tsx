import styles from "./profile.module.scss";

import { Divider, Flex } from "antd";
import Title from "antd/es/typography/Title";

import { serverGetProfile } from "@/services/api/user.server";

import LogoutButton from "./_component/LogoutButton";
import ProfileForm from "./_component/ProfileForm";
import PushNotificationToggle from "./_component/PushNotificationToggle";

const ProfilePage = async () => {
  const profile = await serverGetProfile();

  return (
    <div className={styles.profilePage}>
      <Title className={styles.profileTitle} level={4} type="secondary">
        Profile
      </Title>
      <ProfileForm profile={profile} />
      <PushNotificationToggle />
      <Divider />
      <Flex justify="center" align="center">
        <LogoutButton />
      </Flex>

      {/* <Text>{profile?.name}</Text> */}
      {/* <Flex gap="small" style={{ background: "blue" }}>
        <PlusOutlined />
        <Link href="/blood-pressure/create">Record</Link>
      </Flex> */}
    </div>
  );
};

export default ProfilePage;
