/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: `${process.env.API_URL || "http://127.0.0.1:30001"}/api/:path*`,
			},
		];
	},
	output: "standalone",
	images: {
		remotePatterns: [
			{
				hostname: "avatars.githubusercontent.com",
				protocol: "https",
			},
			{
				hostname: "flagcdn.com",
				protocol: "https",
			},
		],
	},
};

module.exports = nextConfig;
