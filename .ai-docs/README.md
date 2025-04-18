The purpose of this directory is to compile documentation that can be used for AI to aid its accuracy in code generation, such that the code that it generates is up to date with the most recent version of the API of the Thirdweb SDK.

Note: The code and files in this folder are intended for AI consumption only. That means that the code generated in this directory should be optimized for AI and not for humans.

## RULES

- Minimize monolithic files. Try to break down things such that one file contains one very highly concise thing, whether it's a component or a hook or a function or a data type or a set of highly related and intertwined data types.
- Use highly descriptive file names so that future AIs have an easier time understanding what's in a file without having to necessarily look in the file.
- As much as possible, try to use the `tree` command in order to discover and understand what files are in this directory tree. ALWAYS exclude the `node_modules` folder from the `tree` command.
