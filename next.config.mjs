/** @type {import('next').NextConfig} */

import withBundleAnalyzer from '@next/bundle-analyzer';
const isAnalyze = process.env.ANALYZE === 'true';
const nextConfig = {
  // SWC 기반 압축 활성화
  swcMinify: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'palgoosam-bucket.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.toss.im',
        port: '',
        pathname: '/**',
      },
    ],
  },
};


export default withBundleAnalyzer({
  enabled: isAnalyze,
})(nextConfig);