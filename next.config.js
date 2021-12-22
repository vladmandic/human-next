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
  images: {
    loader: 'custom',
  },
  basePath: '/human-next/out',
  assetPrefix: '/human-next/out/',
  exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return {
      '/': { page: '/' },
    }
  },
}
