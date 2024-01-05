/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'firebasestorage.googleapis.com', 'variety.com'],
  },
  distDir: 'build',
};

module.exports = nextConfig;
