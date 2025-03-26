/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The 'api' configuration is not recognized in Next.js 15.2.3
  // If you need to set body and response limits, you can do so in your server or middleware
  // api: {
  //   bodyParser: {
  //     sizeLimit: '10mb', // Set the body limit to 10MB
  //   },
  //   responseLimit: {
  //     sizeLimit: '10mb', // Set the response limit to 10MB
  //   },
  // },
  // The 'experimental.serverComponentsExternalPackages' has been moved to 'serverExternalPackages'
  serverExternalPackages: ['child_process', 'fs'],
}

module.exports = nextConfig;