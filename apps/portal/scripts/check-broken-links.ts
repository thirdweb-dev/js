#!/usr/bin/env tsx

import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { parse } from "node-html-parser";

interface BrokenLink {
  url: string;
  foundOn: string[];
  statusCode: number;
}

interface RedirectRule {
  source: string;
  destination: string;
  permanent: boolean;
}

const PORTAL_URL = "https://portal.thirdweb.com";
const BUILD_DIR = ".next";
const BROKEN_LINKS_FILE = "broken-links.json";
const NEW_REDIRECTS_FILE = "new-redirects.json";

class BrokenLinkChecker {
  private brokenLinks: Map<string, BrokenLink> = new Map();
  private checkedUrls: Set<string> = new Set();
  private internalUrls: Set<string> = new Set();

  async run() {
    console.log("🔍 Starting broken link checker...");

    try {
      // Step 1: Build the portal
      console.log("📦 Building portal...");
      await this.buildPortal();

      // Step 2: Extract all internal links from built pages
      console.log("🔗 Extracting internal links...");
      await this.extractLinksFromBuild();

      // Step 3: Check for broken links
      console.log("⚡ Checking for broken links...");
      await this.checkLinks();

      // Step 4: Generate redirect rules
      console.log("📝 Generating redirect rules...");
      await this.generateRedirectRules();

      // Step 5: Display results
      this.displayResults();

    } catch (error) {
      console.error("❌ Error:", error);
      process.exit(1);
    }
  }

  private async buildPortal(): Promise<void> {
    return new Promise((resolve, reject) => {
      const buildProcess = spawn("pnpm", ["build"], {
        stdio: "inherit",
        shell: true,
      });

      buildProcess.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Build failed with code ${code}`));
        }
      });

      buildProcess.on("error", (error) => {
        reject(error);
      });
    });
  }

  private async extractLinksFromBuild(): Promise<void> {
    const serverBuildDir = path.join(BUILD_DIR, "server", "app");
    
    if (!fs.existsSync(serverBuildDir)) {
      console.warn("⚠️  Server build directory not found, checking static exports...");
      // Fallback to checking routes from source code
      await this.extractLinksFromSource();
      return;
    }

    const htmlFiles = this.findHtmlFiles(serverBuildDir);
    
    for (const htmlFile of htmlFiles) {
      const content = fs.readFileSync(htmlFile, "utf-8");
      const root = parse(content);
      const links = root.querySelectorAll("a[href]");
      
      for (const link of links) {
        const href = link.getAttribute("href");
        if (href && this.isInternalLink(href)) {
          this.internalUrls.add(this.normalizeUrl(href));
        }
      }
    }

    console.log(`📊 Found ${this.internalUrls.size} unique internal URLs`);
  }

  private async extractLinksFromSource(): Promise<void> {
    // Extract common route patterns from sidebars and source files
    const sidebarPaths = [
      "src/app/wallets/sidebar.tsx",
      "src/app/payments/sidebar.tsx", 
      "src/app/transactions/sidebar.tsx",
      "src/app/contracts/sidebar.tsx",
      "src/app/react/v5/sidebar.tsx",
      "src/app/typescript/v5/sidebar.tsx",
      "src/app/unity/v5/sidebar.tsx",
      "src/app/dotnet/sidebar.tsx",
      "src/app/engine/v2/sidebar.tsx",
      "src/app/engine/v3/sidebar.tsx",
      "src/app/vault/sidebar.tsx",
      "src/app/insight/sidebar.tsx",
      "src/app/nebula/sidebar.tsx",
      "src/app/account/sidebar.tsx",
    ];

    const urlPatterns = new Set<string>();

    // Add base routes
    urlPatterns.add("/");
    urlPatterns.add("/wallets");
    urlPatterns.add("/payments");
    urlPatterns.add("/transactions");
    urlPatterns.add("/contracts");
    urlPatterns.add("/insight");
    urlPatterns.add("/vault");
    urlPatterns.add("/account");
    urlPatterns.add("/engine");
    urlPatterns.add("/nebula");

    // Add versioned SDK routes
    ["react", "typescript", "unity", "dotnet"].forEach(sdk => {
      ["v4", "v5"].forEach(version => {
        urlPatterns.add(`/${sdk}/${version}`);
        urlPatterns.add(`/${sdk}/${version}/getting-started`);
        urlPatterns.add(`/${sdk}/${version}/components`);
        urlPatterns.add(`/${sdk}/${version}/wallets`);
      });
    });

    // Extract links from sidebar files
    for (const sidebarPath of sidebarPaths) {
      if (fs.existsSync(sidebarPath)) {
        const content = fs.readFileSync(sidebarPath, "utf-8");
        const hrefMatches = content.match(/href:\s*["'`]([^"'`]+)["'`]/g);
        
        if (hrefMatches) {
          for (const match of hrefMatches) {
            const href = match.match(/href:\s*["'`]([^"'`]+)["'`]/)?.[1];
            if (href && this.isInternalLink(href)) {
              urlPatterns.add(this.normalizeUrl(href));
            }
          }
        }
      }
    }

    // Add some common reference paths
    const refPatterns = [
      "/references/react/v4",
      "/references/react/v5", 
      "/references/typescript/v4",
      "/references/typescript/v5",
      "/references/dotnet",
      "/cli",
      "/account/api-keys",
      "/account/create-account",
    ];

    refPatterns.forEach(pattern => urlPatterns.add(pattern));

    this.internalUrls = urlPatterns;
    console.log(`📊 Found ${this.internalUrls.size} URL patterns to check`);
  }

  private findHtmlFiles(dir: string): string[] {
    const files: string[] = [];
    
    function walkDir(currentDir: string) {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else if (item.endsWith(".html")) {
          files.push(fullPath);
        }
      }
    }
    
    walkDir(dir);
    return files;
  }

  private isInternalLink(href: string): boolean {
    return (
      href.startsWith("/") &&
      !href.startsWith("//") &&
      !href.startsWith("mailto:") &&
      !href.startsWith("tel:") &&
      !href.includes("thirdweb.com") &&
      !href.includes("external")
    );
  }

  private normalizeUrl(url: string): string {
    // Remove hash fragments and query parameters for checking
    return url.split("#")[0].split("?")[0];
  }

  private async checkLinks(): Promise<void> {
    console.log(`⏳ Checking ${this.internalUrls.size} URLs...`);
    
    // Start development server to test links
    const devServer = spawn("pnpm", ["dev"], {
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
    });

    // Wait for server to start
    await new Promise<void>((resolve) => {
      devServer.stdout?.on("data", (data) => {
        if (data.toString().includes("Ready in") || data.toString().includes("Local:")) {
          setTimeout(resolve, 2000); // Give server extra time to be ready
        }
      });
    });

    try {
      const baseUrl = "http://localhost:3000";
      const batchSize = 5;
      const urls = Array.from(this.internalUrls);

      for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        await Promise.all(
          batch.map(url => this.checkSingleUrl(baseUrl + url, url))
        );
        
        // Progress indicator
        const progress = Math.round(((i + batch.length) / urls.length) * 100);
        process.stdout.write(`\r⏳ Progress: ${progress}% (${i + batch.length}/${urls.length})`);
      }
      
      console.log("\n"); // New line after progress
    } finally {
      // Kill development server
      devServer.kill();
    }
  }

  private async checkSingleUrl(fullUrl: string, path: string): Promise<void> {
    if (this.checkedUrls.has(path)) {
      return;
    }

    this.checkedUrls.add(path);

    try {
      const response = await fetch(fullUrl, {
        method: "HEAD",
        redirect: "manual", // Don't follow redirects
      });

      if (response.status === 404) {
        this.brokenLinks.set(path, {
          url: path,
          foundOn: [], // We'll populate this if needed
          statusCode: 404,
        });
      }
    } catch (error) {
      // Treat fetch errors as broken links
      this.brokenLinks.set(path, {
        url: path,
        foundOn: [],
        statusCode: 0, // Indicates fetch error
      });
    }
  }

  private async generateRedirectRules(): Promise<void> {
    const newRedirects: RedirectRule[] = [];

    for (const [url, brokenLink] of this.brokenLinks) {
      // Create redirect rule for broken link
      newRedirects.push({
        source: url,
        destination: PORTAL_URL,
        permanent: false, // Use temporary redirect initially
      });

      // Also create catch-all patterns for common broken path patterns
      if (url.includes("/v4/")) {
        const v5Pattern = url.replace("/v4/", "/v5/");
        newRedirects.push({
          source: v5Pattern,
          destination: PORTAL_URL,
          permanent: false,
        });
      }
    }

    // Add some common broken path patterns as catch-all redirects
    const catchAllPatterns = [
      "/:path*",
    ];

    for (const pattern of catchAllPatterns) {
      newRedirects.push({
        source: pattern,
        destination: PORTAL_URL,
        permanent: false,
      });
    }

    // Save broken links report
    fs.writeFileSync(
      BROKEN_LINKS_FILE,
      JSON.stringify(Array.from(this.brokenLinks.values()), null, 2)
    );

    // Save new redirects
    fs.writeFileSync(
      NEW_REDIRECTS_FILE,
      JSON.stringify(newRedirects, null, 2)
    );

    // Update redirects.mjs file
    await this.updateRedirectsFile(newRedirects);
  }

  private async updateRedirectsFile(newRedirects: RedirectRule[]): Promise<void> {
    const redirectsPath = "redirects.mjs";
    const redirectsContent = fs.readFileSync(redirectsPath, "utf-8");

    // Create new redirect object for broken links
    const brokenLinkRedirects: Record<string, string> = {};
    
    for (const redirect of newRedirects) {
      brokenLinkRedirects[redirect.source] = redirect.destination;
    }

    // Add the new redirects to the file
    const newRedirectsCode = `
const brokenLinkRedirects = ${JSON.stringify(brokenLinkRedirects, null, 2)};
`;

    // Insert before the export
    const exportIndex = redirectsContent.lastIndexOf("export const redirects");
    const beforeExport = redirectsContent.substring(0, exportIndex);
    const afterExport = redirectsContent.substring(exportIndex);

    // Update the redirects array to include broken link redirects
    const updatedAfterExport = afterExport.replace(
      "...createRedirects(walletRefactorRedirects),",
      `...createRedirects(walletRefactorRedirects),
    ...createRedirects(brokenLinkRedirects),`
    );

    const updatedContent = beforeExport + newRedirectsCode + updatedAfterExport;

    // Write updated file
    fs.writeFileSync(redirectsPath, updatedContent);
    
    console.log(`✅ Updated ${redirectsPath} with ${Object.keys(brokenLinkRedirects).length} new redirect rules`);
  }

  private displayResults(): void {
    console.log("\n" + "=".repeat(60));
    console.log("📊 BROKEN LINK CHECKER RESULTS");
    console.log("=".repeat(60));

    if (this.brokenLinks.size === 0) {
      console.log("✅ No broken links found!");
    } else {
      console.log(`❌ Found ${this.brokenLinks.size} broken links:`);
      console.log("");
      
      for (const [url, link] of this.brokenLinks) {
        console.log(`  ❌ ${url} (Status: ${link.statusCode})`);
      }
      
      console.log("");
      console.log(`📝 Generated redirect rules saved to: ${NEW_REDIRECTS_FILE}`);
      console.log(`📄 Detailed report saved to: ${BROKEN_LINKS_FILE}`);
      console.log(`🔧 Updated redirects.mjs with new redirect rules`);
    }

    console.log("");
    console.log(`🔗 All broken links will now redirect to: ${PORTAL_URL}`);
    console.log("=".repeat(60));
  }
}

// Run the script
if (require.main === module) {
  const checker = new BrokenLinkChecker();
  checker.run().catch((error) => {
    console.error("💥 Script failed:", error);
    process.exit(1);
  });
}