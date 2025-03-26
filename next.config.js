/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Set the body limit to 10MB
    },
    responseLimit: {
      sizeLimit: '10mb', // Set the response limit to 10MB
    },
  },
  experimental: {
    serverComponentsExternalPackages: ['child_process', 'fs'],
  },
}

module.exports = nextConfig 