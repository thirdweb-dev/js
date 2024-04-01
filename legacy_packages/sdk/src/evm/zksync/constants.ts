export const SINGLETON_FACTORY = "0xa51baf6a9c0ef5Db8C1898d5aDD92Bf3227d6088";
export const KNOWN_CODES_STORAGE = "0x0000000000000000000000000000000000008004";
export const PUBLISHED_PRIVATE_KEY = "";
export const PUBLISHED_SIGNER = "0xf472c04EFF6F76eFe570723a55F730126281421a";

export const getMarkerAbi = [
  "function getMarker(bytes32) public view returns (uint256)",
];

export const singletonDeployAbi = [
  "function deploy(bytes32,bytes32,bytes) external payable",
];
