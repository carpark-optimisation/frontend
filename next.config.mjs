/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    experimental: {
        optimizePackageImports: ["@chakra-ui/react"],
    },
}


export default nextConfig;
