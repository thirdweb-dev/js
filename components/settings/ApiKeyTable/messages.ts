import { UseToastOptions } from "@chakra-ui/react";

export const toastMessages = {
  updateServices: {
    title: "Service not selected",
    description: "Choose at least one service for your API Key access.",
    position: "bottom",
    variant: "solid",
    status: "error",
    duration: 9000,
    isClosable: true,
  } as UseToastOptions,
};
