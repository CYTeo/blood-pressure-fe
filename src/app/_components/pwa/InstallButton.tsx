"use client";

import React from "react";
import { Button } from "antd";
import { MdGetApp } from "react-icons/md";

import { usePWA } from "@/contexts/PWAContext";

const InstallButton: React.FC = () => {
    const { isInstallable, installApp, isStandalone } = usePWA();

    if (isStandalone || !isInstallable) return null;

    return (
        <Button 
            icon={<MdGetApp />} 
            onClick={installApp}
            type="primary"
            block
        >
            Install App
        </Button>
    );
};

export default InstallButton;
