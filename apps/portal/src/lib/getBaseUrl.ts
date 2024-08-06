export const getBaseUrl = () => {
	const vercelUrl =
		process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;

	// if on vercel, use the vercel url
	if (vercelUrl) {
		return `https://${vercelUrl}`;
	}

	return `http://localhost:3000`;
};
