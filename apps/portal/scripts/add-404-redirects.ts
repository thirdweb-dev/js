#!/usr/bin/env tsx

import fs from "fs";
import path from "path";

const PORTAL_URL = "https://portal.thirdweb.com";
const REDIRECTS_FILE = "redirects.mjs";

class RedirectManager {
  async run() {
    console.log("🔧 Adding 404 catch-all redirects...");

    try {
      await this.addCatchAllRedirects();
      console.log("✅ Successfully added catch-all redirects!");
      console.log(`🔗 All 404 errors will now redirect to: ${PORTAL_URL}`);
    } catch (error) {
      console.error("❌ Error:", error);
      process.exit(1);
    }
  }

  private async addCatchAllRedirects(): Promise<void> {
    if (!fs.existsSync(REDIRECTS_FILE)) {
      throw new Error(`Redirects file not found: ${REDIRECTS_FILE}`);
    }

    const redirectsContent = fs.readFileSync(REDIRECTS_FILE, "utf-8");

    // Check if catch-all redirect already exists
    if (redirectsContent.includes("catch404Redirects") || redirectsContent.includes("/:path*")) {
      console.log("⚠️  Catch-all redirects already exist in redirects.mjs");
      return;
    }

    // Create catch-all redirects object
    const catch404Redirects = {
      // Catch any path that doesn't match existing routes
      "/:path*": PORTAL_URL,
    };

    // Add the new redirects to the file
    const newRedirectsCode = `
const catch404Redirects = ${JSON.stringify(catch404Redirects, null, 2)};
`;

    // Insert before the export
    const exportIndex = redirectsContent.lastIndexOf("export const redirects");
    if (exportIndex === -1) {
      throw new Error("Could not find export statement in redirects.mjs");
    }

    const beforeExport = redirectsContent.substring(0, exportIndex);
    const afterExport = redirectsContent.substring(exportIndex);

    // Update the redirects array to include catch-all redirects at the end
    const updatedAfterExport = afterExport.replace(
      "...createRedirects(walletRefactorRedirects),",
      `...createRedirects(walletRefactorRedirects),
    // Catch-all redirect for any unmatched routes (404s) - MUST BE LAST
    ...createRedirects(catch404Redirects, false),`
    );

    const updatedContent = beforeExport + newRedirectsCode + updatedAfterExport;

    // Create backup
    const backupPath = `${REDIRECTS_FILE}.backup.${Date.now()}`;
    fs.writeFileSync(backupPath, redirectsContent);
    console.log(`💾 Created backup: ${backupPath}`);

    // Write updated file
    fs.writeFileSync(REDIRECTS_FILE, updatedContent);
    
    console.log(`✅ Updated ${REDIRECTS_FILE} with catch-all redirect rules`);
    console.log(`📝 Added ${Object.keys(catch404Redirects).length} catch-all redirect(s)`);
  }
}

// Run the script
if (require.main === module) {
  const manager = new RedirectManager();
  manager.run().catch((error) => {
    console.error("💥 Script failed:", error);
    process.exit(1);
  });
}