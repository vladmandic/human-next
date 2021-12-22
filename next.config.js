/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: false,
  compress: false,
  poweredByHeader: false,
  generateEtags: true,
  distDir: '.next',
  httpAgentOptions: {
    keepAlive: true,
  },
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },
}
