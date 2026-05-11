import styles from "./login.module.scss";

import React from "react";

import LoginForm from "./_components/LoginForm";

const Login = () => {
  return (
    <div className={styles.login}>
      <LoginForm />
      {/* <button
        onClick={() => {
          onSubmitLogin();
        }}
      >
        Login
      </button> */}
    </div>
  );
};

export default Login;
