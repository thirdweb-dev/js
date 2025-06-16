import type { Preview } from "@storybook/react-vite";
import { ThirdwebProvider } from "../src/exports/react";
import "./global.css";

// biome-ignore lint/correctness/noUnusedImports: needed for typescript to not complain
import * as React from "react";

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
