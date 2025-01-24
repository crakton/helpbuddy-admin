/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT,
		APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
		APPWRITE_API_KEY: process.env.APPWRITE_API_KEY,
		APPWRITE_DB_ID: process.env.APPWRITE_DB_ID,
	},

	images: {
		domains: [],
	},
};

module.exports = nextConfig;
