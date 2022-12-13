import { ThirdwebAuth } from "../../src/evm/core";
import { MinimalWallet } from "@thirdweb-dev/wallets";
import { expect } from "chai";
import { Wallet } from "ethers";

interface MinimalWalletWithAddress extends MinimalWallet {
  address: string;
}

describe("Wallet Authentication", async () => {
  let adminWallet: MinimalWalletWithAddress,
    signerWallet: MinimalWalletWithAddress,
    attackerWallet: MinimalWalletWithAddress;
  let auth: ThirdwebAuth;

  before(async () => {
    const [adminSigner, signerSigner, attackerSigner] = [
      Wallet.createRandom(),
      Wallet.createRandom(),
      Wallet.createRandom(),
    ];

    adminWallet = {
      getSigner: async () => adminSigner,
      address: adminSigner.address,
    };
    signerWallet = {
      getSigner: async () => signerSigner,
      address: signerSigner.address,
    };
    attackerWallet = {
      getSigner: async () => attackerSigner,
      address: attackerSigner.address,
    };

    auth = new ThirdwebAuth(signerWallet, "thirdweb.com");
  });

  beforeEach(async () => {
    auth.updateWallet(signerWallet);
  });

  it("Should verify logged in wallet", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    const address = auth.verify(payload);

    expect(address).to.equal(signerWallet.address);
  });

  it("Should verify logged in wallet with chain ID and expiration", async () => {
    const payload = await auth.login({
      expirationTime: new Date(Date.now() + 1000 * 60 * 5),
      chainId: 137,
    });

    auth.updateWallet(adminWallet);
    const address = auth.verify(payload, {
      chainId: 137,
    });

    expect(address).to.equal(signerWallet.address);
  });

  it("Should reject invalid nonce", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    try {
      auth.verify(payload, {
        validateNonce: (nonce: string) => {
          if (nonce === payload.payload.nonce) {
            throw new Error();
          }
        },
      });
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.equal("Login request nonce is invalid");
    }
  });

  it("Should accept valid nonce", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    const address = auth.verify(payload, {
      validateNonce: (nonce: string) => {
        if (nonce !== payload.payload.nonce) {
          throw new Error();
        }
      },
    });

    expect(address).to.equal(signerWallet.address);
  });

  it("Should reject payload with incorrect domain", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    try {
      auth.verify(payload, { domain: "test.thirdweb.com" });
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.equal(
        "Expected domain 'test.thirdweb.com' does not match domain on payload 'thirdweb.com'",
      );
    }
  });

  it("Should reject expired login payload", async () => {
    const payload = await auth.login({
      expirationTime: new Date(Date.now() - 1000 * 60 * 5),
    });

    auth.updateWallet(adminWallet);
    try {
      auth.verify(payload);
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.equal("Login request has expired");
    }
  });

  it("Should reject payload with incorrect chain ID", async () => {
    const payload = await auth.login({
      chainId: 1,
    });

    auth.updateWallet(adminWallet);
    try {
      auth.verify(payload, {
        chainId: 137,
      });
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.equal(
        "Chain ID '137' does not match payload chain ID '1'",
      );
    }
  });

  it("Should reject payload with incorrect signer", async () => {
    const payload = await auth.login();
    payload.payload.address = attackerWallet.address;

    auth.updateWallet(adminWallet);
    try {
      auth.verify(payload);
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.contain("does not match payload address");
    }
  });

  it("Should generate valid authentication token", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    const token = await auth.generate(payload);
    const user = await auth.authenticate(token);

    expect(user.address).to.equal(signerWallet.address);
  });

  it("Should reject token with incorrect domain", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    const token = await auth.generate(payload);

    try {
      await auth.authenticate(token, { domain: "test.thirdweb.com" });
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.contain(
        "Expected token to be for the domain 'test.thirdweb.com', but found token with domain 'thirdweb.com'",
      );
    }
  });

  it("Should reject token before invalid before", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    const token = await auth.generate(payload, {
      invalidBefore: new Date(Date.now() + 1000 * 60 * 5),
    });

    try {
      await auth.authenticate(token);
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.contain("This token is invalid before");
    }
  });

  it("Should reject expired authentication token", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    const token = await auth.generate(payload, {
      expirationTime: new Date(Date.now() - 1000 * 60 * 5),
    });

    try {
      await auth.authenticate(token);
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.contain("This token expired");
    }
  });

  it("Should reject if admin address is not connected wallet address", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    const token = await auth.generate(payload);

    auth.updateWallet(signerWallet);
    try {
      await auth.authenticate(token);
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.contain(
        `Expected the connected wallet address '${signerWallet.address}' to match the token issuer address '${adminWallet.address}'`,
      );
    }
  });

  it("Should propagate context on token", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    const token = await auth.generate(payload, {
      context: { role: "admin" },
    });

    const user = await auth.authenticate(token);

    expect(user.address).to.equal(signerWallet.address);
    expect(user.context).to.deep.equal({ role: "admin" });
  });
});
