import { keccak256 } from "../utils/hashing/keccak256.js";

export function getInitCodeHashERC1967(implementation: string) {
  // See `initCodeHashERC1967` - LibClone {https://github.com/vectorized/solady/blob/main/src/utils/LibClone.sol}
  return keccak256(
    `0x603d3d8160223d3973${implementation.toLowerCase().replace(/^0x/, "")}60095155f3363d3d373d3d363d7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc545af43d6000803e6038573d6000fd5b3d6000f3`,
  );
}
