"use client";

import styles from "./desktopLayout.module.scss";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaRegUser } from "react-icons/fa";
import { IoMdQrScanner } from "react-icons/io";
import { MdOutlineBloodtype, MdOutlineNotifications } from "react-icons/md";

import { ROUTES } from "@/constants";

import LogoutButton from "../../(protected-layout)/profile/_component/LogoutButton";

const DesktopLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Record",
      icon: <MdOutlineBloodtype size={20} />,
      href: ROUTES.bloodPressure,
    },
    { label: "Scan", icon: <IoMdQrScanner size={20} />, href: ROUTES.scanner },
    {
      label: "Reminders",
      icon: <MdOutlineNotifications size={20} />,
      href: ROUTES.reminder,
    },
    { label: "Profile", icon: <FaRegUser size={20} />, href: ROUTES.profile },
  ];

  return (
    <div className={styles.desktopLayout}>
      <div className={styles.sideBar}>
        <div className={styles.logo}>
          <Image
            src={"/logo/favicon.ico"}
            width={30}
            height={30}
            alt="Logo"
            className={styles.logoImg}
          />
          <h2>BP Tracker</h2>
        </div>
        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ""}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <LogoutButton className={styles.logoutBtn} />
        </div>
      </div>
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            {menuItems.find((item) => item.href === pathname)?.label || ""}
          </div>
          <div className={styles.headerActions}>
            {/* Placeholder for user info or settings */}
          </div>
        </header>
        <div className={styles.contentBody}>{children}</div>
      </div>
    </div>
  );
};

export default DesktopLayout;
