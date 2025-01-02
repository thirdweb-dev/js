import type { Preview } from "@storybook/react";
import React from "react";
import { ThirdwebProvider } from "../src/exports/react";
import "./global.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <ThirdwebProvider>
          <Story />
        </ThirdwebProvider>
      );
    },
  ],
};

export default preview;
