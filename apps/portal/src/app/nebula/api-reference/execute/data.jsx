export const executeEndpointData = {
	title: "Execute Action",
	method: "POST",
	description: "Executes a specified action.",
	endpointUrl: "/execute",
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
			name: "action",
			required: true,
			description: "The action to execute.",
			type: "string",
		},
		{
			name: "parameters",
			required: false,
			description: "Optional parameters for the action.",
			type: "object",
		},
	],
	codeExamples: [
		{
			language: "curl",
			code: `curl -X POST https://nebula-api.thirdweb.com/execute \\
    -H "x-secret-key: YOUR_THIRDWEB_SECRET_KEY" \\
    -H "Content-Type: application/json" \\
    -d '{"action": "your_action", "parameters": {"key": "value"}}'`,
		},
		{
			language: "JavaScript",
			code: `const axios = require('axios');
  
  const secretKey = 'YOUR_THIRDWEB_SECRET_KEY';
  
  axios.post('https://nebula-api.thirdweb.com/execute', {
    action: 'your_action',
    parameters: { key: 'value' },
  }, {
    headers: {
      'x-secret-key': secretKey,
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    console.log("Action executed successfully.", response.data);
  })
  .catch(error => {
    console.error(error);
  });`,
		},
	],
	apiResponses: [
		{
			status: "200",
			description: "Action executed successfully.",
			code: `{
    "result": "Execution completed successfully."
  }`,
		},
		{
			status: "400",
			description: "Invalid input data.",
			code: `{
    "error": "Invalid action specified."
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
