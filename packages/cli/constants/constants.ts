export const CREATE_MESSAGES = {
  typeOfProject: "What type of project do you want to create?",
  projectName: "What is your project named?",
  framework: "What framework do you want to use?",
  language: "What language do you want to use?",
  contract: "What type of contract do you want to start from?",
  extensions: "What extensions do you want to add to your contract?",
} as const;

export const ERROR_MESSAGES = {
  noConfiguration:
    "Failed to find a supported project configuration file in current directory",
};
