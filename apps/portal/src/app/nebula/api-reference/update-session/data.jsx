export const sessionEndpointData = {
	title: "Update Session",
	method: "GET",
	description: "Fetches details of a specific session using the session ID.",
	endpointUrl: "/session/{session_id}",
	parameters: [
		{
			name: "session_id",
			required: true,
			description: "The unique identifier of the session to retrieve.",
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
			code: `curl -X GET https://nebula-api.thirdweb.com/session/{session_id} \\
  -H "x-secret-key: YOUR_THIRDWEB_SECRET_KEY"`,
		},
		{
			language: "JavaScript",
			code: "test",
		},
	],
	apiResponses: [
		{
			status: "200",
			description: "Session details retrieved successfully.",
			code: `{
  "session_id": "abc123",
  "created_at": "2024-01-01T00:00:00Z",
  "last_active": "2024-01-02T12:34:56Z",
  "messages": [
      "message_id": "msg1",
      "content": "Hello, how can I assist you?",
      "timestamp": "2024-01-01T01:23:45Z"
    // Additional messages...
  ]
}`,
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
