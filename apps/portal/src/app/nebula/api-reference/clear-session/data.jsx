// data.js

export const clearSessionEndpointData = {
	title: "Clear Session",
	method: "POST",
	description:
		"Clears all messages for a specific session using the session ID.",
	endpointUrl: "/session/{session_id}/clear",
	parameters: [
		{
			name: "session_id",
			required: true,
			description: "The unique identifier of the session to clear.",
			type: "string",
		},
	],
	headers: [
		{
			name: "x-secret-key",
			required: true,
			description: "Your thirdweb secret key for authentication.",
			type: "string",
		},
	],
	bodyParameters: [],
	codeExamples: [
		{
			language: "curl",
			code: `curl -X POST https://nebula-api.thirdweb.com/session/{session_id}/clear \\
    -H "x-secret-key: YOUR_THIRDWEB_SECRET_KEY"`,
		},
	],
	apiResponses: [
		{
			status: "200",
			description: "Session messages cleared successfully.",
			code: `{
    "message": "All session messages have been cleared."
  }`,
		},
		{
			status: "404",
			description: "Session not found.",
			code: `{
    "error": "Session with ID 'abc123' not found." }`,
		},
	],
};
