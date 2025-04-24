# Key Prompts for AI Documentation Generation Plan

This file collects the most important prompts used to guide the creation of the AI Documentation Generation Plan for the Thirdweb JS SDK. Use these as inspiration or direct input for future AI agent coding sessions.

---

## 1. Initial Planning & Setup

```
Your responsibility is to explore this code base and write documentation in the form of files and markdown content that includes clear instructions on what a particular component or hook or class or data type is, and an example of it being used that can be used for future AIs to be able to perform code generation using the most up-to-date version of the API schema as defined in this repository. All documentation that you write should go in the `.ai-docs/sdk/ai-docs` folder.

Please make a plan first, and then write the plan into the @README.md file so that you can "resume" later in the event that you need to stop before actually finishing all of the documentation generation. The plan should include checkboxes so that you can report your progress along the way.
```

---

## 2. Checklist and Progress Tracking

```
Please perform a git commit and then proceed.
```

```
Continue, and be sure to keep generating documentation. Make sure to complete all steps and generate code here in this project.
```

---

## 3. Task Expansion & Specifics

```
Please remove under phase 3 supporting modules item number 13 Merkle Tree and Snapshot Helpers.
```

```
I want you to add to the phase 2 core building blocks section the thirdweb Pay component `PayEmbed`
```

```
Analyze @ai-docs and mark off the tasks you have already completed from phase 2
```

```
Continue with the next task for Extensions
```

```
I think its important that the types like `Wallet` and `Chain` are documented.
```

---

## 4. Summarization & Output

```
Summarize this whole chat into a single markdown code block file and save it in @ai-docs directory. I want to use this file to create plans for AI agent coders
```

```
Can you also create a markdown file called "prompts" that take the key prompts I used in this chat to create that AI Documentation Generation Plan
```

---

## 5. Reference: ai-docs/README.md

```md
The purpose of this directory is to compile documentation that can be used for AI to aid its accuracy in code generation, such that the code that it generates is up to date with the most recent version of the API of the Thirdweb SDK.

Note: The code and files in this folder are intended for AI consumption only. That means that the code generated in this directory should be optimized for AI and not for humans.

## RULES

- Minimize monolithic files. Try to break down things such that one file contains one very highly concise thing, whether it's a component or a hook or a function or a data type or a set of highly related and intertwined data types.
- Use highly descriptive file names so that future AIs have an easier time understanding what's in a file without having to necessarily look in the file.
- As much as possible, try to use the `tree` command in order to discover and understand what files are in this directory tree. ALWAYS exclude the `node_modules` folder from the `tree` command.
- The file structure will always include a folder at this current layer of the file system. For example, the `sdk` folder should be docs related to the sdk. Inside the `sdk` folder, there is a `ai-docs` folder. The `sdk/ai-docs` folder should contain markdown files that are going to be fed into AI for context enrichment during code generation.
- Utilize Git commits with highly descriptive messages to be able to create checkpoints on your work that are easy to follow.
- Anytime you reference a type in one of the docs that is not documented itself, document the type. For example, `Wallet` and `Chain`.

`ai-docs` directory structure:
```

.
├── README.md
└── sdk
├── README.md
└── ai-docs

3 directories, 2 files

```

```

_This file is a living record of the prompt-driven workflow for AI documentation generation._
