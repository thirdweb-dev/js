/// --- Thirdweb Brige ---
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ContractInterface, ethers } from "ethers";

const separator = "/";
const subSeparator = "#";

// big number transform
const bigNumberReplacer = (_key, value: any) => {
  // if we find a BigNumber then make it into a string (since that is safe)
  if (
    ethers.BigNumber.isBigNumber(value) ||
    (typeof value === "object" &&
      value !== null &&
      value.type === "BigNumber" &&
      "hex" in value)
  ) {
    return ethers.BigNumber.from(value).toString();
  }
  return value;
};

// add the bridge to the window object type
declare global {
  interface Window {
    // FIXME any
    bridge: any;
    // FIXME any
    ethereum: any;
    thirdweb: ThirdwebSDK;
  }
}

const w = window;
w.bridge = {};
w.bridge.initialize = (chain, options) => {
  console.debug("thirdwebSDK initialization:", chain, options);
  const sdkOptions = JSON.parse(options);
  let storage = new ThirdwebStorage();
  if (sdkOptions && sdkOptions.ipfsGatewayUrl) {
    storage = new ThirdwebStorage({
      gatewayUrls: {
        "ipfs://": [sdkOptions.ipfsGatewayUrl],
      },
    });
  }
  const sdk = new ThirdwebSDK(chain, sdkOptions, storage);
  w.thirdweb = sdk;
};

const updateSDKSigner = () => {
  if (w.thirdweb) {
    const provider = new ethers.providers.Web3Provider(w.ethereum);
    w.thirdweb.updateSignerOrProvider(provider.getSigner());
  }
};

w.bridge.connect = async () => {
  if (w.ethereum) {
    await w.ethereum.enable;
    const provider = new ethers.providers.Web3Provider(w.ethereum);
    await provider.send("eth_requestAccounts", []);
    if (w.thirdweb) {
      updateSDKSigner();
      w.ethereum.on("accountsChanged", async (accounts) => {
        console.debug("accountsChanged", accounts);
        updateSDKSigner();
      });
      w.ethereum.on("chainChanged", async (chain) => {
        console.debug("chainChanged", chain);
        updateSDKSigner();
      });
      return await w.thirdweb.wallet.getAddress();
    } else {
      throw "window.thirdweb is not defined";
    }
  } else {
    throw "Please install a wallet browser extension";
  }
};

w.bridge.switchNetwork = async (chainId) => {
  if (chainId) {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + chainId.toString(16) }],
    });
    updateSDKSigner();
  } else {
    throw "Error Switching Network";
  }
};

w.bridge.invoke = async (route, payload) => {
  const routeArgs = route.split(separator);
  const firstArg = routeArgs[0].split(subSeparator);
  const addrOrSDK = firstArg[0];

  const fnArgs = JSON.parse(payload).arguments;
  const parsedArgs = fnArgs.map((arg) => {
    try {
      return typeof arg === "string" &&
        (arg.startsWith("{") || arg.startsWith("["))
        ? JSON.parse(arg)
        : arg;
    } catch (e) {
      return arg;
    }
  });
  console.debug("thirdwebSDK call:", route, parsedArgs);

  // wallet call
  if (addrOrSDK.startsWith("sdk")) {
    let prop = undefined;
    if (firstArg.length > 1) {
      prop = firstArg[1];
    }
    if (prop && routeArgs.length === 2) {
      // FIXME any
      const result = await (w.thirdweb as any)[prop][routeArgs[1]](
        ...parsedArgs,
      );
      return JSON.stringify({ result: result }, bigNumberReplacer);
    } else if (routeArgs.length === 2) {
      const result = await w.thirdweb[routeArgs[1]](...parsedArgs);
      return JSON.stringify({ result: result }, bigNumberReplacer);
    } else {
      throw "Invalid Route";
    }
  }

  // contract call
  if (addrOrSDK.startsWith("0x")) {
    let typeOrAbi: string | ContractInterface | undefined;
    if (firstArg.length > 1) {
      try {
        typeOrAbi = JSON.parse(firstArg[1]); // try to parse ABI
      } catch (e) {
        typeOrAbi = firstArg[1];
      }
    }
    const contract = typeOrAbi
      ? await w.thirdweb.getContract(addrOrSDK, typeOrAbi)
      : await w.thirdweb.getContract(addrOrSDK);
    if (routeArgs.length === 2) {
      const result = await contract[routeArgs[1]](...parsedArgs);
      return JSON.stringify({ result: result }, bigNumberReplacer);
    } else if (routeArgs.length === 3) {
      const result = await contract[routeArgs[1]][routeArgs[2]](...parsedArgs);
      return JSON.stringify({ result: result }, bigNumberReplacer);
    } else if (routeArgs.length === 4) {
      const result = await contract[routeArgs[1]][routeArgs[2]][routeArgs[3]](
        ...parsedArgs,
      );
      return JSON.stringify({ result: result }, bigNumberReplacer);
    } else {
      throw "Invalid Route";
    }
  }
};
/// --- End Thirdweb Brige ---
