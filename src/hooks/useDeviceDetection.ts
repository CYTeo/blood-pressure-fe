"use client";

import { useEffect, useState } from "react";

export const useDeviceDetection = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isVertical, setIsVertical] = useState(true);

    useEffect(() => {
        const checkDevice = () => {
            const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
            const mobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
            setIsMobile(mobile);
            setIsVertical(window.innerHeight > window.innerWidth);
        };

        checkDevice();
        window.addEventListener("resize", checkDevice);
        window.addEventListener("orientationchange", checkDevice);

        return () => {
            window.removeEventListener("resize", checkDevice);
            window.removeEventListener("orientationchange", checkDevice);
        };
    }, []);

    return { isMobile, isVertical };
};
