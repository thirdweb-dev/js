import { utils } from "ethers";

export const HOOK_PROXY_DEPLOYMENT_SALT = "thirdweb_hook";

export const modularFactoryAbi = [
  {
    type: "function",
    name: "deployDeterministicERC1967",
    inputs: [
      { name: "_implementation", type: "address", internalType: "address" },
      { name: "_data", type: "bytes", internalType: "bytes" },
      { name: "_salt", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [
      { name: "deployedProxy", type: "address", internalType: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deployProxyByImplementation",
    inputs: [
      { name: "_implementation", type: "address", internalType: "address" },
      { name: "_data", type: "bytes", internalType: "bytes" },
      { name: "_salt", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [
      { name: "deployedProxy", type: "address", internalType: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "ProxyDeployed",
    inputs: [
      {
        name: "implementation",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "proxy",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "deployer",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "CloneFactoryFailedToInitialize", inputs: [] },
];
export const hookInitializerAbi = [
  {
    type: "function",
    name: "initialize",
    inputs: [
      { name: "_upgradeAdmin", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
];

export function computeHookProxyAddress(
  hookImplementation: string,
  modularFactory: string,
): string {
  const saltHash = utils.id(HOOK_PROXY_DEPLOYMENT_SALT);
  hookImplementation =
    hookImplementation.length === 42
      ? hookImplementation.slice(2)
      : hookImplementation;

  // See `initCodeHashERC1967` - LibClone {https://github.com/vectorized/solady/blob/main/src/utils/LibClone.sol}
  const initCodeHashERC1967 = utils.solidityKeccak256(
    ["bytes"],
    [
      `0x603d3d8160223d3973${hookImplementation}60095155f3363d3d373d3d363d7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc545af43d6000803e6038573d6000fd5b3d6000f3`,
    ],
  );

  const deployInfoPacked = utils.solidityPack(
    ["bytes1", "address", "bytes32", "bytes32"],
    ["0xff", modularFactory, saltHash, initCodeHashERC1967],
  );

  // hash the packed deploy info
  const hashedDeployInfo = utils.solidityKeccak256(
    ["bytes"],
    [deployInfoPacked],
  );

  // 4. return last 20 bytes (40 characters) of the hash -- this is the predicted address
  return `0x${hashedDeployInfo.slice(26)}`;
}
