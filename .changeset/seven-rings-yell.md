---
"thirdweb": minor
---

Introducing API secret key restrictions for certain commands. Get your API secret key from [here](https://thirdweb.com/dashboard/settings/api-keys).

The following commands will require you to have logged in with your API secret key:

- `thirdweb deploy`
- `thirdweb release`
- `thirdweb publish`
- `thirdweb upload`

Implemented 2 new commands for managing your session with the CLI:

- thirdweb login
- thirdweb logout

Note: If you try to call a command that requires you to be logged in, you will be prompted to login.

Updated chains.
