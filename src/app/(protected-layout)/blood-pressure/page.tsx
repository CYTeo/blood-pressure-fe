import styles from "./bloodPressure.module.scss";

import { PlusOutlined } from "@ant-design/icons";

import ServerButton from "@/app/_components/button/ServerButton";
import { serverGetProfile } from "@/services/api/user.server";

import { BloodPressureContainer } from "./_components/BloodPressureContainer";

const BloodPressurePage = async () => {
  const profile = await serverGetProfile();

  return (
    <div className={styles.bloodPressurePage}>
      <div className={styles.welcomeMessage}>
        Hello, {profile?.name || "there"}!
      </div>

      <BloodPressureContainer />

      <div className={styles.floatingButton}>
        <ServerButton
          icon={<PlusOutlined />}
          href="/blood-pressure/create"
          children={""}
        />
      </div>
    </div>
  );
};

export default BloodPressurePage;
