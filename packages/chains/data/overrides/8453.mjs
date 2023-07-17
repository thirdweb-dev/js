// @ts-check
/** @typedef { import("../../src/types").Chain } Chain */

/** @type {Partial<Chain>} */
export default {
  chainId: 8453,
  icon: {
    url: "ipfs://QmW5Vn15HeRkScMfPcW12ZdZcC2yUASpu6eCsECRdEmjjj/base-512.png",
    height: 512,
    width: 512,
    format: "png",
  },
  rpc: ["https://base.rpc.thirdweb.com/${THIRDWEB_API_KEY}"],
  status: "active",
};
