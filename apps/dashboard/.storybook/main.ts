import { dirname, join } from "node:path";
import type { StorybookConfig } from "@storybook/nextjs";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, "package.json")));
}
const config: StorybookConfig = {
  addons: [
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-docs"),
  ],
  features: {
    experimentalRSC: true,
  },
  framework: {
    name: getAbsolutePath("@storybook/nextjs"),
    options: {},
  },
  refs: {
    "@chakra-ui/react": {
      disable: true,
    },
  },
  staticDirs: ["../public"],
  stories: ["../src/**/*.stories.tsx"],
};
export default config;
