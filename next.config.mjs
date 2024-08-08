/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        pathname: "**/**",
        hostname: "media.crafto.app",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
