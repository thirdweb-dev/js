// data.js

export const createSessionEndpointData = {
	title: "Create Session",
	method: "POST",
	description: "Creates a new session.",
	endpointUrl: "/session",
	parameters: [],
	headers: [
		{
			name: "x-secret-key",
			required: true,
			description: "Your thirdweb secret key for authentication.",
			type: "string",
		},
	],
	bodyParameters: [
		{
			name: "session_name",
			required: true,
			description: "The name for the new session.",
			type: "string",
		},
		{
			name: "metadata",
			required: false,
			description: "Optional metadata to associate with the session.",
			type: "object",
		},
	],
	codeExamples: [
		{
			language: "curl",
			code: `curl -X POST https://nebula-api.thirdweb.com/session \\
    -H "x-secret-key: YOUR_THIRDWEB_SECRET_KEY" \\
    -d '{"session_name": "my_new_session", "metadata": {"key": "value"}}'`,
		},
		{
			language: "JavaScript",
			code: `const axios = require('axios');
  
  const secretKey = 'YOUR_THIRDWEB_SECRET_KEY';
  
  axios.post('https://nebula-api.thirdweb.com/session', {
    session_name: 'my_new_session',
    metadata: { key: 'value' },
  }, {
    headers: {
      'x-secret-key': secretKey,
    },
  })
  .then(response => {
    console.log("Session created successfully.", response.data);
  })
  .catch(error => {
    console.error(error);
  });`,
		},
	],
	apiResponses: [
		{
			status: "201",
			description: "Session created successfully.",
			code: `{
    "session_id": "abc123",
    "session_name": "my_new_session",
    "metadata": {
      "key": "value"
    },
    "created_at": "2024-01-01T00:00:00Z"
  }`,
		},
		{
			status: "400",
			description: "Invalid input data.",
			code: `{
    "error": "Invalid session name provided."
  }`,
		},
	],
};
