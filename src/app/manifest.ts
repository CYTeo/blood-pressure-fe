import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Blood Pressure Tracker",
        short_name: "BP Tracker",
        description:
            "A professional Blood Pressure Tracker to record and analyze blood pressure.",

        // ✅ App identity & routing
        id: "/",
        start_url: "/",
        scope: "/",

        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",

        // screenshots: [
        //     {
        //         src: "/public/screenshots/desktop.webp",
        //         sizes: "1280x660",
        //         type: "image/webp",
        //         form_factor: "wide",
        //     },
        //     {
        //         src: "/screenshots/mobile.png",
        //         sizes: "390x844",
        //         type: "image/png",
        //     },
        // ],

        icons: [
            {
                src: "/logo/icon-192.webp",
                sizes: "192x192",
                type: "image/webp",
            },
            {
                src: "/logo/icon-512.webp",
                sizes: "512x512",
                type: "image/webp",
            },
        ],
    };
}