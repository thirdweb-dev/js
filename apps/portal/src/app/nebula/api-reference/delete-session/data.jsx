export const deleteSessionEndpointData = {
	title: "Delete Session",
	method: "DELETE",
	description: "Deletes a specific session using the session ID.",
	endpointUrl: "/session/{session_id}",
	parameters: [
		{
			name: "session_id",
			required: true,
			description: "The unique identifier of the session to delete.",
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
			code: `curl -X DELETE https://nebula-api.thirdweb.com/session/{session_id} \\
    -H "x-secret-key: YOUR_THIRDWEB_SECRET_KEY"`,
		},
	],
	apiResponses: [
		{
			status: "204",
			description: "Session deleted successfully.",
			code: "(No Content)",
		},
		{
			status: "404",
			description: "Session not found.",
			code: `{
    "error": "Session with ID 'abc123' not found."
  }`,
		},
	],
};
