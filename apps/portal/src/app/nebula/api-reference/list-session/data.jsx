// data.js

export const listSessionsEndpointData = {
	title: "List Sessions",
	method: "GET",
	description: "Fetches a list of all available sessions.",
	endpointUrl: "/session/list",
	parameters: [],
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
			code: `curl -X GET https://nebula-api.thirdweb.com/session/list \\
    -H "x-secret-key: YOUR_THIRDWEB_SECRET_KEY"`,
		},
		{
			language: "JavaScript",
			code: `const axios = require('axios');
  
  const secretKey = 'YOUR_THIRDWEB_SECRET_KEY';
  
  axios.get('https://nebula-api.thirdweb.com/session/list', {
    headers: {
      'x-secret-key': secretKey,
    },
  })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });`,
		},
	],
	apiResponses: [
		{
			status: "200",
			description: "List of sessions retrieved successfully.",
			code: `[
    {
      "session_id": "abc123",
      "session_name": "Session 1",
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "session_id": "def456",
      "session_name": "Session 2",
      "created_at": "2024-01-02T00:00:00Z"
    }
  ]`,
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
