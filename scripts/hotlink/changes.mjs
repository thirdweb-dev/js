// @ts-check
import fs from "fs";
import path from "path";

export const changes = [
  // react
  {
    path: "./packages/react/package.json",
    entry: "./src/index.ts",
    exports: {
      ".": "./src/index.ts",
      "./evm": "./src/evm/index.ts",
    },
  },
  // react-core
  {
    path: "./packages/react-core/package.json",
    entry: "./src/index.ts",
    exports: {
      ".": "./src/index.ts",
      "./evm": "./src/evm/index.ts",
    },
  },
  // wallets
  {
    path: "./packages/wallets/package.json",
    entry: "./src/index.ts",
    exports: {
      ".": "./src/index.ts",
      "./evm": "./src/evm/index.ts",
      "./evm/wallets/base": "./src/evm/wallets/base.ts",
      "./evm/wallets/ethers": "./src/evm/wallets/ethers.ts",
      "./evm/wallets/aws-kms": "./src/evm/wallets/awa-kms.ts",
      "./evm/wallets/abstract": "./src/evm/wallets/abstract.ts",
      "./evm/wallets/injected": "./src/evm/wallets/injected.ts",
      "./evm/wallets/metamask": "./src/evm/wallets/metamask.ts",
      "./evm/wallets/private-key": "./src/evm/wallets/private-key.ts",
      "./evm/wallets/local-wallet": "./src/evm/wallets/local-wallet.ts",
      "./evm/wallets/wallet-connect":
        "./src/evm/connectors/wallet-connect/index.ts",
      "./evm/wallets/coinbase-wallet": "./src/evm/wallets/coinbase-wallet.ts",
      "./evm/connectors/injected": "./src/evm/connectors/injected/index.ts",
      "./evm/connectors/metamask": "./src/evm/connectors/metamask/index.ts",
      "./evm/wallets/aws-secrets-manager":
        "./src/evm/wallets/aws-secrets-manager.ts",
      "./evm/connectors/local-wallet":
        "./src/evm/connectors/local-wallet/index.ts",
      "./evm/connectors/wallet-connect":
        "./src/evm/connectors/wallet-connect/index.ts",
      "./evm/connectors/coinbase-wallet":
        "./src/evm/connectors/coinbase-wallet/index.ts",
      "./evm/wallets/paper-wallet": "./src/evm/wallets/paper-wallet.ts",
      "./evm/connectors/wallet-connect-v1":
        "./src/evm/connectors/wallet-connect-v1/index.ts",
      "./evm/connectors/paper": "./src/evm/connectors/paper/index.ts",
      "./evm/wallets/wallet-connect-v1":
        "./src/evm/wallets/wallet-connect-v1.ts",
      "./evm/wallets/smart-wallet": "./src/evm/wallets/smart-wallet.ts",
    },
  },
  // thirdweb v5 sdk
  {
    path: "./packages/thirdweb/package.json",
    entry: "./src/index.ts",
    exports: {
      ".": "./src/exports/thirdweb.ts",
      "./adapters": "./src/exports/adapters.ts",
      "./chains": "./src/exports/chains.ts",
      "./contract": "./src/exports/contract.ts",
      "./event": "./src/exports/event.ts",
      "./pay": "./src/exports/pay.ts",
      "./react": "./src/exports/react.ts",
      "./storage": "./src/exports/storage.ts",
      "./utils": "./src/exports/utils.ts",
      "./rpc": "./src/exports/rpc.ts",
      "./transaction": "./src/exports/transaction.ts",
      "./wallets": "./src/exports/wallets.ts",
      // "./wallets/*": - TODO figure out
      // "extensions/*" - TODO figure out
    },
  },
];

/**
 * get absolute path from relative path
 * @param {string} relativePath
 * @returns {string}
 */
const absPath = (relativePath) => path.join(process.cwd(), relativePath);

/**
 *
 * @param {"original" | 'hotlink'} changeKey
 */
export function updatePackages(changeKey) {
  changes.forEach((change) => {
    // read the package json file
    const pkg = JSON.parse(fs.readFileSync(absPath(change.path), "utf8"));

    // apply changes
    if (changeKey === "hotlink") {
      pkg._main = pkg.main;
      pkg.main = change.entry;

      pkg._module = pkg.module;
      pkg.module = change.entry;
    } else {
      pkg.main = pkg._main;
      delete pkg._main;
      pkg.module = pkg._module;
      delete pkg._module;
    }

    if (changeKey === "hotlink") {
      // save entire pkg.exports deep copy
      pkg._exports = JSON.parse(JSON.stringify(pkg.exports));

      for (const key in change.exports) {
        try {
          pkg.exports[key] = {};
          pkg.exports[key].module = change.exports[key];
          delete pkg.exports[key].default;
        } catch (e) {
          console.log("key :", key);
          throw e;
        }
      }
    } else {
      // revert pkg.exports
      pkg.exports = pkg._exports;
      delete pkg._exports;
    }

    if (changeKey === "hotlink") {
      pkg._types = pkg.types;
      pkg.types = "";
      if (pkg.typings) {
        pkg._typings = pkg.typings;
        pkg.typings = "";
      }
    } else {
      pkg.types = pkg._types;
      delete pkg._types;

      if (pkg._typings) {
        pkg.typings = pkg._typings;
        delete pkg._typings;
      }
    }

    // save file
    fs.writeFileSync(
      absPath(change.path),
      JSON.stringify(pkg, null, 2) + "\n",
      "utf8",
    );
  });
}
