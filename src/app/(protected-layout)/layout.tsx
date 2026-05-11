import styles from "./layout.module.scss";

import { headers } from "next/headers";

import { isHandheld } from "@/utils/userAgent";

import DesktopLayout from "../_components/layout/DesktopLayout";
import MobileBottomBar from "../_components/layout/MobileBottomBar";
import MobileTopBar from "../_components/layout/MobileTopBar";
import WebPushInitializer from "../_components/webpushInitializer/WebPushInitializer";

export type LayoutPropsType = {
  children: React.ReactNode;
};

const AppLayout = async (props: LayoutPropsType) => {
  const { children } = props;

  const headerList = await headers();
  const userAgent = headerList.get("user-agent") || "";
  const isMobileOrTablet = isHandheld(userAgent);

  return (
    <>
      <WebPushInitializer  />
      {isMobileOrTablet ? (
        <div className={styles.layout}>
          <MobileTopBar />
          <div className={styles.content}>{children}</div>
          <MobileBottomBar />
        </div>
      ) : (
        <DesktopLayout>{children}</DesktopLayout>
      )}
    </>
  );
};

export default AppLayout;
