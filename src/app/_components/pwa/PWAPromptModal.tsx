"use client";

import React, { useEffect, useState } from "react";
import { Button,Modal } from "antd";
import { MdIosShare } from "react-icons/md";

import { usePWA } from "@/contexts/PWAContext";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";

const PWAPromptModal: React.FC = () => {
    const { isMobile, isVertical } = useDeviceDetection();
    const { platform, isStandalone, isInstallable, installApp } = usePWA();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Pop up only when user is using mobile phone 
        // to access horizontal view in browser that is not installed pwa.
        if (isMobile && !isVertical && !isStandalone) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [isMobile, isVertical, isStandalone]);

    if (!isOpen) return null;

    const renderDescription = () => {
        if (platform === "ios") {
            return (
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <p>
                        For the best experience on iOS, please install the application to your home screen.
                    </p>
                    <p>
                        Tap the share icon <MdIosShare style={{ fontSize: "20px", verticalAlign: "middle" }} /> and select <strong>"Add to Home Screen"</strong>.
                    </p>
                </div>
            );
        }
        if (platform === "android") {
            return (
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <p>
                        For the best experience on Android, please install the application to your home screen.
                    </p>
                    {isInstallable && (
                        <Button
                            type="primary"
                            onClick={installApp}
                            block
                            style={{ marginTop: "16px" }}
                        >
                            Install Now
                        </Button>
                    )}
                </div>
            );
        }
        return (
            <div style={{ textAlign: "center", padding: "20px" }}>
                 <p>For the best experience, please install the application to your home screen.</p>
                 <p>Open in Chrome or Safari to install.</p>
            </div>
        );
    };

    return (
        <Modal
            title="Install App"
            open={isOpen}
            footer={null}
            onCancel={() => setIsOpen(false)}
            centered
        >
            {renderDescription()}
        </Modal>
    );
};

export default PWAPromptModal;
