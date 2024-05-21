const path = require("node:path");

const { getDefaultConfig } = require("expo/metro-config");

const workspaceRoot = path.resolve(__dirname, "../..");
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

config.resolver.disableHierarchicalLookup = true;
config.resolver.sourceExts.push("cjs");

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    platform === "android" &&
    // replace `packages/app` with the path to your app directory in monorepo
    context.originModulePath.endsWith("packages/app/.") &&
    // some weird edge cases, there might be a better way to do this
    !moduleName.startsWith("/") &&
    !moduleName.startsWith("../../") &&
    !moduleName.startsWith("./../../")
  ) {
    // just tell metro to look in the root of the monorepo where pnpm stores all node_modules
    // biome-ignore lint/style/noParameterAssign: this is a hack to make metro work
    moduleName = `../../${moduleName}`;
  }

  // use default
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
