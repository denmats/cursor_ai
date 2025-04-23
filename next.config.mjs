/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '', // Usually empty for https
        pathname: '/u/**', // Allows any path starting with /u/
      },
    ],
  },
};

export default nextConfig;
