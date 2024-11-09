/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /dc\.css$/,
      use: ['null-loader'],
      include: /node_modules\/dc/,
    });
    
    return config;
  },
};

module.exports = nextConfig;




