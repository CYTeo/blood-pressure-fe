import styles from "./serverButton.module.scss";

import React from "react";
import Link from "next/link";

interface ServerButtonProps {
    icon: React.ReactNode;
    href: string;
    children: React.ReactNode;
    title?:string;
    className?: string;
}
const ServerButton = (props: ServerButtonProps) => {
  return (
    <div className={`${styles.serverButton} ${props.className || ""}`}>
      <Link className={styles.link} href={props.href} title={props.title}>
        {props.icon}
        {props.children}
      </Link>
    </div>
  );
};

export default ServerButton;    
