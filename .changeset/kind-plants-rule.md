---
"@thirdweb-dev/auth": major
---

Complete Auth redesign and update to add a number of major and quality of life improvements, including the following:

- Ability to use Auth APIs with both cookies and JWTs, allowing non browser clients to interact with Auth (mobile, gaming, scripts, etc.)
- Ability to store session data and other data on the Auth user
- Callbacks to run side-effects on login, logout, and requesting user data
- Ability to configure cookies for custom domains and backend setups
- Support for validation of the entire EIP4361/CAIP122 specification
- No more need for redirects or payload encoding on Auth requests
- and more...

See the new documentation to view the new changes and usage: [Auth Documentation](https://portal.thirdweb.com/auth).
