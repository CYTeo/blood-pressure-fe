import styles from "./authLayout.module.scss";

import React from "react";

import IMAGES from "../assets/images";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div 
      className={styles.authLayout}
      style={{ backgroundImage: `url(${IMAGES.background})` }}
    >
      <div className={styles.overlay}>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
