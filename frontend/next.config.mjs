/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uccdphoto.aryaravathird.workers.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;