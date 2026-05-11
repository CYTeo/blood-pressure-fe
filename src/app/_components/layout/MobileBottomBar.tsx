"use client"
import styles from "./mobileBottomBar.module.scss";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flex } from "antd";
import { FaRegUser } from "react-icons/fa";
import { IoMdQrScanner } from "react-icons/io";
import { MdOutlineBloodtype, MdOutlineNotifications } from "react-icons/md";

import { ROUTES } from "@/constants";

const MobileBottomBar = () => {
  const pathname = usePathname();

  const tabs = [
    {
      label: "Record",
      href: ROUTES.bloodPressure,
      icon: <MdOutlineBloodtype size={24} />,
    },
    {
      label: "Scan",
      href: ROUTES.scanner,
      icon: <IoMdQrScanner size={24} />,
    },
    {
      label: "Reminders",
      href: ROUTES.reminder,
      icon: <MdOutlineNotifications size={24} />,
    },
    {
      label: "Profile",
      href: ROUTES.profile,
      icon: <FaRegUser size={22} />,
    },
  ];

  return (
    <div className={styles.mobileBottomBar}>
      <Flex justify="space-evenly" align="center" style={{ height: "100%" }}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </Flex>
    </div>
  );
};

export default MobileBottomBar;
