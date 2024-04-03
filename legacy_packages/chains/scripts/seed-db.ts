import { readdir } from "fs/promises";
import { join } from "path";
import { Chain } from "../src/types";

// load up the data from the "data" directory

const dataDir = "./data";
const overridesDir = join(dataDir, "overrides");
const additionalDir = join(dataDir, "additional");

// for each file in the overrides directory load it
const overrides: Partial<Chain>[] = await Promise.all(
  (await readdir(overridesDir)).map(async (file) => {
    const chainId = file.split(".")[0];
    const chain = (await import(join("..", overridesDir, file))).default;
    return {
      ...chain,
      chainId,
    };
  }),
);
// for each override file write it to the DB as a public chain override
const BASE_URI = (process.env.BASE_URI as string) || "https://api.thirdweb.com";
await Promise.all(
  overrides.map(async (chain) => {
    const res = await fetch(
      `${BASE_URI}/v1/chains/${chain.chainId}?public=true`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-secret-key": process.env.SECRET_KEY as string,
        },
        body: JSON.stringify(chain),
      },
    );
    if (!res.ok) {
      console.error(res.statusText);
      console.log(chain);
    }
  }),
);

// for each file in the additional directory load it
const additional: Chain[] = await Promise.all(
  (await readdir(additionalDir)).map(async (file) => {
    const chainId = file.split(".")[0];
    const chain = (await import(join("..", additionalDir, file))).default;
    return {
      ...chain,
      chainId,
    };
  }),
);

// for each additional file write it to the DB as a public chain
await Promise.all(
  additional.map(async (chain) => {
    delete chain.networkId;
    const res = await fetch(`${BASE_URI}/v1/chains?public=true`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-secret-key": process.env.SECRET_KEY as string,
      },
      body: JSON.stringify(chain),
    });
    if (!res.ok) {
      console.error(res.statusText);
      console.log(chain);
    }
  }),
);
