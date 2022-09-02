import { sdk } from "./before-setup";

describe("Token", async () => {
  it("deploy token", async () => {
    const token = await sdk.deployer.createToken({
      name: "My Token",
      initialSupply: 100,
    });
    console.log(token);
  });
});
