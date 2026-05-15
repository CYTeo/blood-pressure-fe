// src/app/providers.tsx
"use client";

import { ReactNode } from "react";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { StyleProvider } from "@ant-design/cssinjs";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import { store } from "@/redux/store";

interface Props {
  children: ReactNode;
}
const DEFAULT_THEME_VALUES = {
  token: {
    colorPrimary: "#081e32",
  },
  components: {
    Menu: {
      itemBg: "#f0f2f5",
    },
    Layout: {
      siderBg: "#081e32",
      headerBg: "#081e32",
    },
  },
};

export default function Providers({ children }: Props) {
  return (
    <StyleProvider hashPriority="low">
      <AntdRegistry>
        <ConfigProvider theme={DEFAULT_THEME_VALUES}>
          <Provider store={store}>{children}</Provider>
        </ConfigProvider>
      </AntdRegistry>
    </StyleProvider>
  );
}
