const path = require("path");
const MOCK_STORAGE_ID = "thirdweb-sdk";

function localDeployPath(programName) {
  return path.join(__dirname, "test/solana/data", `${programName}.so`);
}

module.exports = {
  validator: {
    accountsCluster: "https://api.metaplex.solana.com",
    accounts: [
      {
        label: "Candy Machine Program",
        accountId: "cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ",
        executable: true,
      },
      {
        label: "Token Metadata Program",
        accountId: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
        // marking executable as true will cause Amman to pull the executable data account as well automatically
        executable: true,
      },
      {
        label: "Token Program",
        accountId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        executable: true,
      },
    ],
    programs: [
      {
        label: "Counter Program",
        programId: "89RsF5yJgRXhae6LKuCcMRgXkqxCJm3AeaYwcJN4XopA",
        deployPath: localDeployPath("counter"),
      },
    ],
  },
  storage: {
    storageId: MOCK_STORAGE_ID,
    clearOnStart: true,
  },
};
