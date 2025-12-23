/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. 스포티파이 이미지 허용
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
    ],
  },

  // 2. API 프록시 설정 (백엔드 8080으로 연결)
  async rewrites() {
    return [
      {
        source: "/api/:path*", // 프론트에서 /api/... 로 요청하면
        destination: "http://localhost:8080/api/:path*", // 백엔드 8080으로 전달
      },
    ];
  },
};

export default nextConfig;
