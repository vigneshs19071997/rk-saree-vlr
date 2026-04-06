/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
    ],
  },
  // Keep Mongoose, bcryptjs, nodemailer on Node.js runtime (not Edge)
  serverExternalPackages: ['mongoose', 'bcryptjs', 'nodemailer'],
};

module.exports = nextConfig;
