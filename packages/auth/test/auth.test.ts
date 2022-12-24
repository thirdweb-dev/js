import { GenericSignerWallet } from "@thirdweb-dev/wallets";
import { PrivateKeyWallet } from "@thirdweb-dev/wallets/evm";
import { expect } from "chai";

describe("random", () => {
  it("random", () => {
    let sdk: GenericSignerWallet = new PrivateKeyWallet(
      "0x7501d8e4bf638209d330c6f9b1fbd09720484634a337fdc7e3d719dfc388f943",
    );
    console.log(sdk);
    expect(1).to.equal(1);
  });
});
