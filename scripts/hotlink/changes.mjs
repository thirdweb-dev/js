// @ts-check
import fs from "fs";
import path from "path";

export const changes = [
  // react
  {
    path: "./packages/react/package.json",
    entry: {
      original: "dist/thirdweb-dev-react.cjs.js",
      hotlink: "./src/index.ts",
    },
    exports: {
      ".": {
        original: "./dist/thirdweb-dev-react.esm.js",
        hotlink: "./src/index.ts",
      },
      "./evm": {
        original: "./evm/dist/thirdweb-dev-react-evm.esm.js",
        hotlink: "./src/evm/index.ts",
      },
      "./solana": {
        original: "./solana/dist/thirdweb-dev-react-solana.esm.js",
        hotlink: "./src/solana/index.ts",
      },
      "./evm/connectors/magic": {
        original:
          "./evm/connectors/magic/dist/thirdweb-dev-react-evm-connectors-magic.esm.js",
        hotlink: "./src/evm/connectors/magic.ts",
      },
      "./evm/connectors/gnosis-safe": {
        original:
          "./evm/connectors/gnosis-safe/dist/thirdweb-dev-react-evm-connectors-gnosis-safe.esm.js",
        hotlink: "./src/evm/connectors/gnosis-safe.ts",
      },
    },
  },
  // react-core
  {
    path: "./packages/react-core/package.json",
    entry: {
      original: "dist/thirdweb-dev-react-core.cjs.js",
      hotlink: "./src/index.ts",
    },
    exports: {
      ".": {
        original: "./dist/thirdweb-dev-react-core.esm.js",
        hotlink: "./src/index.ts",
      },
      "./evm": {
        original: "./evm/dist/thirdweb-dev-react-core-evm.esm.js",
        hotlink: "./src/evm/index.ts",
      },
      "./solana": {
        original: "./solana/dist/thirdweb-dev-react-core-solana.esm.js",
        hotlink: "./src/solana/index.ts",
      },
    },
  },
  // wallets
  {
    path: "./packages/wallets/package.json",
    entry: {
      original: "dist/thirdweb-dev-wallets.cjs.js",
      hotlink: "./src/index.ts",
    },
    exports: {
      ".": {
        original: "./dist/thirdweb-dev-wallets.esm.js",
        hotlink: "./src/index.ts",
      },
      "./evm": {
        original: "./evm/dist/thirdweb-dev-wallets-evm.esm.js",
        hotlink: "./src/evm/index.ts",
      },
      "./solana": {
        original: "./solana/dist/thirdweb-dev-wallets-solana.esm.js",
        hotlink: "./src/solana/index.ts",
      },
      "./evm/wallets/base": {
        original:
          "./evm/wallets/base/dist/thirdweb-dev-wallets-evm-wallets-base.esm.js",
        hotlink: "./src/evm/wallets/base.ts",
      },
      "./evm/wallets/ethers": {
        original:
          "./evm/wallets/ethers/dist/thirdweb-dev-wallets-evm-wallets-ethers.esm.js",
        hotlink: "./src/evm/wallets/ethers.ts",
      },
      "./evm/wallets/aws-kms": {
        original:
          "./evm/wallets/aws-kms/dist/thirdweb-dev-wallets-evm-wallets-aws-kms.esm.js",
        hotlink: "./src/evm/wallets/awa-kms.ts",
      },
      "./solana/wallets/base": {
        original:
          "./solana/wallets/base/dist/thirdweb-dev-wallets-solana-wallets-base.esm.js",
        hotlink: "./src/solana/wallets/base.ts",
      },
      "./evm/wallets/abstract": {
        original:
          "./evm/wallets/abstract/dist/thirdweb-dev-wallets-evm-wallets-abstract.esm.js",
        hotlink: "./src/evm/wallets/abstract.ts",
      },
      "./evm/wallets/injected": {
        original:
          "./evm/wallets/injected/dist/thirdweb-dev-wallets-evm-wallets-injected.esm.js",
        hotlink: "./src/evm/wallets/injected.ts",
      },
      "./evm/wallets/metamask": {
        original:
          "./evm/wallets/metamask/dist/thirdweb-dev-wallets-evm-wallets-metamask.esm.js",
        hotlink: "./src/evm/wallets/metamask.ts",
      },
      "./solana/wallets/signer": {
        original:
          "./solana/wallets/signer/dist/thirdweb-dev-wallets-solana-wallets-signer.esm.js",
        hotlink: "./src/solana/wallets/signer.ts",
      },
      "./evm/wallets/magic-auth": {
        original:
          "./evm/wallets/magic-auth/dist/thirdweb-dev-wallets-evm-wallets-magic-auth.esm.js",
        hotlink: "./src/evm/wallets/magic-auth.ts",
      },
      "./solana/wallets/keypair": {
        original:
          "./solana/wallets/keypair/dist/thirdweb-dev-wallets-solana-wallets-keypair.esm.js",
        hotlink: "./src/solana/wallets/keypair.ts",
      },
      "./evm/wallets/private-key": {
        original:
          "./evm/wallets/private-key/dist/thirdweb-dev-wallets-evm-wallets-private-key.esm.js",
        hotlink: "./src/evm/wallets/private-key.ts",
      },
      "./evm/wallets/email-wallet": {
        original:
          "./evm/wallets/email-wallet/dist/thirdweb-dev-wallets-evm-wallets-email-wallet.esm.js",
        hotlink: "./src/evm/wallets/email-wallet.ts",
      },
      "./evm/wallets/device-wallet": {
        original:
          "./evm/wallets/device-wallet/dist/thirdweb-dev-wallets-evm-wallets-device-wallet.esm.js",
        hotlink: "./src/evm/wallets/device-wallet.ts",
      },
      "./evm/connectors/email": {
        original:
          "./evm/connectors/email/dist/thirdweb-dev-wallets-evm-connectors-email.esm.js",
        hotlink: "./src/evm/connectors/email/index.ts",
      },
      "./evm/connectors/magic": {
        original:
          "./evm/connectors/magic/dist/thirdweb-dev-wallets-evm-connectors-magic.esm.js",
        hotlink: "./src/evm/connectors/magic/index.ts",
      },
      "./evm/wallets/wallet-connect": {
        original:
          "./evm/wallets/wallet-connect/dist/thirdweb-dev-wallets-evm-wallets-wallet-connect.esm.js",
        hotlink: "./src/evm/connectors/wallet-connect/index.ts",
      },
      "./solana/wallets/private-key": {
        original:
          "./solana/wallets/private-key/dist/thirdweb-dev-wallets-solana-wallets-private-key.esm.js",
        hotlink: "./src/solana/wallets/private-key.ts",
      },
      "./evm/wallets/coinbase-wallet": {
        original:
          "./evm/wallets/coinbase-wallet/dist/thirdweb-dev-wallets-evm-wallets-coinbase-wallet.esm.js",
        hotlink: "./src/evm/wallets/coinbase-wallet.ts",
      },
      "./evm/connectors/injected": {
        original:
          "./evm/connectors/injected/dist/thirdweb-dev-wallets-evm-connectors-injected.esm.js",
        hotlink: "./src/evm/connectors/injected/index.ts",
      },
      "./evm/connectors/metamask": {
        original:
          "./evm/connectors/metamask/dist/thirdweb-dev-wallets-evm-connectors-metamask.esm.js",
        hotlink: "./src/evm/connectors/metamask/index.ts",
      },
      "./evm/wallets/aws-secrets-manager": {
        original:
          "./evm/wallets/aws-secrets-manager/dist/thirdweb-dev-wallets-evm-wallets-aws-secrets-manager.esm.js",
        hotlink: "./src/evm/wallets/aws-secrets-manager.ts",
      },
      "./evm/connectors/device-wallet": {
        original:
          "./evm/connectors/device-wallet/dist/thirdweb-dev-wallets-evm-connectors-device-wallet.esm.js",
        hotlink: "./src/evm/connectors/device-wallet/index.ts",
      },
      "./evm/connectors/wallet-connect": {
        original:
          "./evm/connectors/wallet-connect/dist/thirdweb-dev-wallets-evm-connectors-wallet-connect.esm.js",
        hotlink: "./src/evm/connectors/wallet-connect/index.ts",
      },
      "./evm/connectors/coinbase-wallet": {
        original:
          "./evm/connectors/coinbase-wallet/dist/thirdweb-dev-wallets-evm-connectors-coinbase-wallet.esm.js",
        hotlink: "./src/evm/connectors/coinbase-wallet/index.ts",
      },
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
    pkg.main = change.entry[changeKey];
    for (const key in change.exports) {
      pkg.exports[key].module = change.exports[key][changeKey];
    }

    // save file
    fs.writeFileSync(
      absPath(change.path),
      JSON.stringify(pkg, null, 2) + "\n",
      "utf8",
    );
  });
}
