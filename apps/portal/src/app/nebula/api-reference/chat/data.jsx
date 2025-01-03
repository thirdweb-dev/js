// data.js

export const chatEndpointData = {
	title: "Initiate Chat",
	method: "POST",
	description: "Starts a new chat session with the specified parameters.",
	endpointUrl: "/chat",
	parameters: [],
	headers: [
		{
			name: "x-secret-key",
			required: true,
			description: "Your thirdweb secret key for authentication.",
			type: "string",
		},
		{
			name: "Content-Type",
			required: true,
			description: "Indicates the media type of the request body.",
			type: "string",
		},
	],
	bodyParameters: [
		{
			name: "user_id",
			required: true,
			description: "The unique identifier for the user starting the chat.",
			type: "string",
		},
		{
			name: "message",
			required: true,
			description: "The initial message to start the chat.",
			type: "string",
		},
		{
			name: "metadata",
			required: false,
			description: "Optional metadata associated with the chat session.",
			type: "object",
		},
	],
	codeExamples: [
		{
			language: "curl",
			code: `curl -X POST https://nebula-api.thirdweb.com/chat \\
    -H "x-secret-key: YOUR_THIRDWEB_SECRET_KEY" \\
    -H "Content-Type: application/json" \\
    -d '{"user_id": "user123", "message": "Hello!", "metadata": {"topic": "support"}}'`,
		},
		{
			language: "JavaScript",
			code: `const axios = require('axios');
  
  const secretKey = 'YOUR_THIRDWEB_SECRET_KEY';
  
  axios.post('https://nebula-api.thirdweb.com/chat', {
    user_id: 'user123',
    message: 'Hello!',
    metadata: { topic: 'support' },
  }, {
    headers: {
      'x-secret-key': secretKey,
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    console.log("Chat initiated successfully.", response.data);
  })
  .catch(error => {
    console.error(error);
  });`,
		},
	],
	apiResponses: [
		{
			status: "201",
			description: "Chat initiated successfully.",
			code: `{
    "chat_id": "chat123",
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z"
  }`,
		},
		{
			status: "400",
			description: "Invalid input data.",
			code: `{
    "error": "Missing user_id or message."
  }`,
		},
		{
			status: "403",
			description: "Unauthorized request.",
			code: `{
    "error": "Invalid secret key."
  }`,
		},
	],
};
