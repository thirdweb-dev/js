// const chain = arbitrumSepolia;

import { arbitrumSepolia } from "thirdweb/chains";
import { getDefaultToken } from "thirdweb/react";

export const chain = arbitrumSepolia;
export const token = getDefaultToken(chain, "USDC")!;
// export const chain = base;
// export const token = {
//   address: "0x0578d8A44db98B23BF096A382e016e29a5Ce0ffe",
//   decimals: 18,
//   name: "Higher",
//   symbol: "HIGHER",
//   version: "1",
// };
// export const token = {
//     address: "0xfdcC3dd6671eaB0709A4C0f3F53De9a333d80798",
//     decimals: 18,
//     name: "Stable Coin",
//     symbol: "SBC",
//     version: "1",
//     // primaryType: "Permit",
//   }
// export const chain = defineChain(3338);
// export const token = {
//   address: "0xbbA60da06c2c5424f03f7434542280FCAd453d10",
//   decimals: 6,
//   name: "USDC",
//   symbol: "USDC",
//   version: "2",
// }
