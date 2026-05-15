/* eslint-disable react-refresh/only-export-components */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type PWAPlatform = "android" | "desktop" | "ios" | "macos" | "unknown";

interface PWAContextType {
    isInstallable: boolean;
    installApp: () => Promise<void>;
    platform: PWAPlatform;
    isStandalone: boolean;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [platform, setPlatform] = useState<PWAPlatform>("unknown");
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Detect Platform
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(userAgent) ||
            (userAgent.includes('macintosh') && window.navigator.maxTouchPoints > 1);
        const isAndroid = /android/.test(userAgent);
        const isMacSafari = userAgent.includes('macintosh') &&
            userAgent.includes('safari') &&
            !userAgent.includes('chrome') &&
            window.navigator.maxTouchPoints <= 1;

        if (isIOS) setPlatform("ios");
        else if (isAndroid) setPlatform("android");
        else if (isMacSafari) setPlatform("macos");
        else setPlatform("desktop");

        // Check if PWA is already installed or if it's standalone
        const displayModes = ["standalone", "minimal-ui", "fullscreen"];
        const standalone = displayModes.some(
            (mode) => window.matchMedia(`(display-mode: ${mode})`).matches
        ) || (window.navigator as any).standalone === true;
        setIsStandalone(standalone);

        if (standalone) {
            setIsInstallable(false);
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setIsInstallable(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        window.addEventListener("appinstalled", () => {
            console.log("PWA was installed");
            setIsInstallable(false);
            setDeferredPrompt(null);
        });

        // Register Service Worker
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => {
                    console.log("Service Worker registered with scope:", registration.scope);
                })
                .catch((error) => {
                    console.error("Service Worker registration failed:", error);
                });
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const installApp = async () => {
        if (!deferredPrompt) return;
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    return (
        <PWAContext.Provider
            value={{
                isInstallable,
                installApp,
                platform,
                isStandalone,
            }}
        >
            {children}
        </PWAContext.Provider>
    );
};

export const usePWA = () => {
    const context = useContext(PWAContext);
    if (context === undefined) {
        throw new Error("usePWA must be used within a PWAProvider");
    }
    return context;
};
