import styles from "./profile.module.scss";

import { headers } from "next/headers";
import Title from "antd/es/typography/Title";

import { serverGetProfile } from "@/services/api/user.server";
import { isHandheld } from "@/utils/userAgent";

import LogoutButton from "./_component/LogoutButton";
import ProfileForm from "./_component/ProfileForm";
import PushNotificationToggle from "./_component/PushNotificationToggle";

const ProfilePage = async () => {
  const profile = await serverGetProfile();

  const headerList = await headers();
  const userAgent = headerList.get("user-agent") || "";
  const isMobileOrTablet = isHandheld(userAgent);

  return (
    <div className={styles.profilePage}>
      <Title className={styles.profileTitle} level={4}>
        Profile
      </Title>
      <ProfileForm profile={profile} />
      <PushNotificationToggle />
      {isMobileOrTablet && <LogoutButton />}
    </div>
  );
};

export default ProfilePage;
