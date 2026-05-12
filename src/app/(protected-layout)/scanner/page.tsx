"use client";

import { Button, Flex, Result } from "antd";
import Text from "antd/es/typography/Text";
import { SmileOutlined } from "@ant-design/icons";
import styles from "./scanner.module.scss";

// import React, { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button, Card, Flex, message, Space, Spin, Typography } from "antd";
// import Tesseract from "tesseract.js";
// import {
//   CameraOutlined,
//   CloseOutlined,
//   LoadingOutlined,
//   ScanOutlined,
// } from "@ant-design/icons";
// import Title from "antd/es/typography/Title";
// import styles from "./scanner.module.scss";

// const { Text } = Typography;

// const ScannerPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [isCameraOpen, setIsCameraOpen] = useState(false);
//   const [stream, setStream] = useState<MediaStream | null>(null);

//   const router = useRouter();
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     return () => stream?.getTracks().forEach((t) => t.stop());
//   }, [stream]);

//   useEffect(() => {
//     if (isCameraOpen && stream && videoRef.current) {
//       videoRef.current.srcObject = stream;
//     }
//   }, [isCameraOpen, stream]);

//   const startCamera = async () => {
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: "environment",
//           width: { ideal: 1920 },
//           height: { ideal: 1080 },
//         },
//         audio: false,
//       });
//       setStream(mediaStream);
//       setIsCameraOpen(true);
//     } catch (err: any) {
//       message.error(err?.response?.data?.message || "Camera access denied.");
//     }
//   };

//   const closeCamera = () => {
//     stream?.getTracks().forEach((t) => t.stop());
//     setStream(null);
//     setIsCameraOpen(false);
//   };

//   // Advanced Preprocessing for fixed-zone OCR
//   const getZoneData = (
//     ctx: CanvasRenderingContext2D,
//     x: number,
//     y: number,
//     w: number,
//     h: number,
//   ) => {
//     const imageData = ctx.getImageData(x, y, w, h);
//     const data = imageData.data;
//     // Binarization: Convert to pure Black/White for better digit segment recognition
//     for (let i = 0; i < data.length; i += 4) {
//       const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
//       const val = avg < 110 ? 0 : 255; // Threshold for LCD segments
//       data[i] = data[i + 1] = data[i + 2] = val;
//     }
//     // Create a temp canvas to return a DataURL for Tesseract
//     const tempCanvas = document.createElement("canvas");
//     tempCanvas.width = w;
//     tempCanvas.height = h;
//     tempCanvas.getContext("2d")!.putImageData(imageData, 0, 0);
//     return tempCanvas.toDataURL("image/png");
//   };

//   const captureAndProcess = async () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d")!;

//     // 1. Capture the frame at native resolution
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     ctx.drawImage(video, 0, 0);

//     closeCamera();
//     setLoading(true);
//     setProgress(5);

//     try {
//       const worker = await Tesseract.createWorker("eng", 1);
//       await worker.setParameters({ tessedit_char_whitelist: "0123456789" });

//       // 2. Define the Scanning Frame (The blue box area)
//       // Since the video is object-fit: cover, we assume the box is centered
//       const boxSize = Math.min(canvas.width, canvas.height) * 0.6;
//       const startX = (canvas.width - boxSize) / 2;
//       const startY = (canvas.height - boxSize) / 2;

//       // 3. Extract 3 Vertical Zones (SYS, DIA, PULSE)
//       const zoneHeight = boxSize / 3;

//       const zones = [
//         {
//           name: "systolic",
//           img: getZoneData(ctx, startX, startY, boxSize, zoneHeight),
//         },
//         {
//           name: "diastolic",
//           img: getZoneData(
//             ctx,
//             startX,
//             startY + zoneHeight,
//             boxSize,
//             zoneHeight,
//           ),
//         },
//         {
//           name: "pulse",
//           img: getZoneData(
//             ctx,
//             startX,
//             startY + zoneHeight * 2,
//             boxSize,
//             zoneHeight,
//           ),
//         },
//       ];

//       const results: any = {};

//       for (let i = 0; i < zones.length; i++) {
//         setProgress(20 + i * 25);
//         const {
//           data: { text },
//         } = await worker.recognize(zones[i].img);
//         const num = text.replace(/\D/g, ""); // Clean up any non-digits
//         results[zones[i].name] = num;
//       }

//       await worker.terminate();

//       console.log("Zone Results:", results);

//       if (results.systolic && results.diastolic) {
//         message.success("Scanning complete!");
//         router.push(
//           `/blood-pressure/create?systolic=${results.systolic}&diastolic=${results.diastolic}&pulse=${results.pulse || ""}`,
//         );
//       } else {
//         message.warning(
//           "Could not clearly identify numbers. Please check manual entry.",
//         );
//         router.push(`/blood-pressure/create`);
//       }
//     } catch (err) {
//       console.error(err);
//       message.error("Scanning failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     // <Flex
//     //   style={{ minHeight: "calc(100dvh - 200px)" }}
//     //   justify="center"
//     //   align="center"
//     // >
//     //   <Result
//     //     icon={<SmileOutlined />}
//     //     title={<Text>Scanner is currently under development.</Text>}
//     //     subTitle="Please check back later."
//     //   />
//     // </Flex>
//     <Flex
//       vertical
//       align="center"
//       justify="center"
//       className={styles.scannerContainer}
//     >
//       {!isCameraOpen && !loading && (
//         <Card className={styles.scannerCard}>
//           <Space vertical size="large">
//             <ScanOutlined style={{ fontSize: 48, color: "#1890ff" }} />
//             <Title level={3}>Precision Omron Scan</Title>
//             <Text type="secondary">
//               Center the monitor screen inside the box.
//             </Text>
//             <Button
//               type="primary"
//               size="large"
//               icon={<CameraOutlined />}
//               onClick={startCamera}
//               block
//               className={styles.cameraButton}
//             >
//               Start Scanner
//             </Button>
//           </Space>
//         </Card>
//       )}

//       {isCameraOpen && (
//         <div className={styles.fullScreenCamera}>
//           <div className={styles.cameraHeader}>
//             <Text style={{ color: "#fff" }}>Position screen inside the box</Text>
//             <Button
//               type="text"
//               icon={<CloseOutlined style={{ color: "#fff" }} />}
//               onClick={closeCamera}
//             />
//           </div>
//           <div className={styles.videoWrapper}>
//             <video
//               ref={videoRef}
//               autoPlay
//               playsInline
//               className={styles.videoElement}
//             />
//             <div className={styles.scanFrame} />
//           </div>
//           <div className={styles.cameraFooter}>
//             <Button
//               type="primary"
//               shape="circle"
//               icon={<ScanOutlined />}
//               onClick={captureAndProcess}
//               className={styles.captureButton}
//             />
//           </div>
//         </div>
//       )}

//       {loading && (
//         <Card className={styles.scannerCard}>
//           <Space vertical size="large" style={{ width: "100%" }}>
//             <Spin size="large" indicator={<LoadingOutlined spin />} />
//             <Title level={4}>Precision Parsing...</Title>
//             <div className={styles.progressWrapper}>
//               <div
//                 className={styles.progressBar}
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//             <Text strong>{progress}% Done</Text>
//           </Space>
//         </Card>
//       )}
//       <canvas ref={canvasRef} style={{ display: "none" }} />
//     </Flex>
//   );
// };

// export default ScannerPage;

const ScannerPage = () => {
  return (
    <Flex vertical align="center" justify="center">
      <Result
        icon={<SmileOutlined className={styles.icon} />}
        title={
          <Text type="secondary">Scanner is currently under development.</Text>
        }
        subTitle="Please check back later."
      />
      <Button type="primary">Back to home</Button>
    </Flex>
  );
};

export default ScannerPage;
