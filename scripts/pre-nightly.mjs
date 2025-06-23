import fs from "node:fs";

// load the changesets config file
const changesetsConfig = JSON.parse(
  fs.readFileSync("./.changeset/config.json", "utf8"),
);
// add useCalculatedVersion: true to the config
const nightlyChangesetsConfig = {
  ...changesetsConfig,
  snapshot: { ...changesetsConfig.snapshot, useCalculatedVersion: true },
};

// write it back to the file
fs.writeFileSync(
  "./.changeset/config.json",
  JSON.stringify(nightlyChangesetsConfig, null, 2),
);
