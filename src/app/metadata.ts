const metadata = {
  title: "Blood Pressure Tracker",
  description:
    "Recording and tracking of blood pressure readings, with data visualization.",
  icons: {
    icon: "/logo/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Blood Pressure Tracker",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#1a1a1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default metadata;
