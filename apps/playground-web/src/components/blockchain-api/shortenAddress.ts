// Remove this one we can import `shortenAddress` from "thirdweb/utils"
export const shortenAddress = (address: string, length = 2) => {
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
};
