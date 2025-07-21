#!/usr/bin/env tsx

import fs from "fs";

const PORTAL_URL = "https://portal.thirdweb.com";
const REDIRECTS_FILE = "redirects.mjs";

function addFinalCatchAll() {
  console.log("🔧 Adding final catch-all redirect for 404 errors...");

  const redirectsContent = fs.readFileSync(REDIRECTS_FILE, "utf-8");

  // Check if final catch-all already exists
  if (redirectsContent.includes("finalCatchAll") || redirectsContent.includes('"/:path*"')) {
    console.log("⚠️  Final catch-all redirect already exists");
    return;
  }

  // Create the catch-all redirect object
  const finalCatchAllCode = `
const finalCatchAll = {
  // Final catch-all for any unmatched routes (must be last)
  "/:path*": "${PORTAL_URL}",
};
`;

  // Find the export function and add the catch-all before the closing bracket
  const exportRegex = /(export const redirects = async \(\) => \{[\s\S]*?return \[[\s\S]*?\];)/;
  const match = redirectsContent.match(exportRegex);
  
  if (!match) {
    throw new Error("Could not find redirects export function");
  }

  const exportFunction = match[0];
  
  // Add the catch-all at the end of the redirects array
  const updatedExportFunction = exportFunction.replace(
    /(\.\.\.\s*createRedirects\s*\(\s*walletRefactorRedirects\s*\)\s*,?\s*)([\s\n]*\]\s*;\s*})/,
    `$1
    // Final catch-all redirect for 404 errors - MUST BE LAST
    ...createRedirects(finalCatchAll, false),
  $2`
  );

  // Replace the export function in the content
  const updatedContent = redirectsContent.replace(exportFunction, updatedExportFunction);
  
  // Add the catch-all definition before the export
  const finalContent = updatedContent.replace(
    "export const redirects",
    finalCatchAllCode + "\nexport const redirects"
  );

  // Create backup
  const backupPath = `${REDIRECTS_FILE}.backup.${Date.now()}`;
  fs.writeFileSync(backupPath, redirectsContent);
  console.log(`💾 Created backup: ${backupPath}`);

  // Write updated file
  fs.writeFileSync(REDIRECTS_FILE, finalContent);
  
  console.log(`✅ Updated ${REDIRECTS_FILE} with final catch-all redirect`);
  console.log(`🔗 All unmatched routes will now redirect to: ${PORTAL_URL}`);
}

try {
  addFinalCatchAll();
} catch (error) {
  console.error("❌ Error:", error);
  process.exit(1);
}