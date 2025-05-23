export type ExamplePrompt = {
  title: string;
  message: string;
  interceptedReply?: string;
};

export const examplePrompts: ExamplePrompt[] = [
  {
    title:
      "How do I add in-app wallet with sign in with google to my react app?",
    message:
      "How do I add in-app wallet with sign in with google to my react app?",
  },
  {
    title: "How do I send a transaction in Unity?",
    message: "How do I send a transaction in Unity?",
  },
  {
    title: "What does this contract revert error mean?",
    message: "What does this contract revert error mean?",
  },
  {
    title: "I see thirdweb support id in my console log, can you help me?",
    message: "I see thirdweb support id in my console log, can you help me?",
  },
  {
    title: "Here is my code, can you tell me why I'm seeing this error?",
    message: "Here is my code, can you tell me why I'm seeing this error?",
  },
];
