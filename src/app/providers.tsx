// src/app/providers.tsx
"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { StyleProvider } from "@ant-design/cssinjs";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import { store } from "@/redux/store";

interface Props {
  children: ReactNode;
}
// const DEFAULT_THEME_VALUES = {
//   components: {
//     Menu: {
//       itemBg: "#f0f2f5",
//     },
//     Layout: {
//       siderBg: "#f0f2f5",
//       headerBg: "#16425b",
//       bodyBg: "#fff",
//       triggerBg: "#16425b",
//     },
//   },
// };

export default function Providers({ children }: Props) {
  return (
    <StyleProvider hashPriority="low">
      <AntdRegistry>
        {/* <ConfigProvider theme={DEFAULT_THEME_VALUES}> */}
        <Provider store={store}>{children}</Provider>
        {/* </ConfigProvider> */}
      </AntdRegistry>
    </StyleProvider>
  );
}
