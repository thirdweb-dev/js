export function replaceDeployerAddress(address: string) {
  return (
    address
      .replace("deployer.thirdweb.eth", "thirdweb.eth")
      // deployer.thirdweb.eth
      .replace("0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024", "thirdweb.eth")
  );
}
