/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Disable font optimization to avoid network issues during build
  optimizeFonts: false,
};

export default nextConfig;
