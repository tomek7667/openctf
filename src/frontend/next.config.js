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
};

module.exports = nextConfig;
