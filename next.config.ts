import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    scrollRestoration: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'styles')],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/blood-pressure',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
