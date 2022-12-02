export const CREATE_MESSAGES = {
  typeOfProject: "What type of project do you want to create?",
  projectName: "What is your project named?",
  contractName: "What will be the name of your new smart contract?",
  chain: "Which blockchain do you want to use?",
  framework: "What framework do you want to use?",
  language: "What language do you want to use?",
  contract: "What type of contract do you want to start from?",
  extensions: "What extensions do you want to add to your contract?",
} as const;

export const ERROR_MESSAGES = {
  noConfiguration:
    "No contract project configuration file found in current directory",
};
