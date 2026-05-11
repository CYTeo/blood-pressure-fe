import styles from "./register.module.scss";

import React from "react";

import RegisterForm from "./_components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className={styles.register}>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
