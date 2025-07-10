# Summary of Changes Made

## Directory Structure Changes
1. Moved /apps/portal/src/app/engine → /apps/portal/src/app/transactions
2. Moved /apps/playground-web/src/app/engine → /apps/playground-web/src/app/transactions

## Portal Changes
1. Updated navigation in Header.tsx: /engine → /transactions
2. Updated sidebar files (v2 and v3) to use /transactions paths
3. Updated layout files to show 'Transactions' instead of 'Engine'
4. Updated EngineVersionSelector component to use transaction links
5. Updated main page and DocSearch component references
6. Updated Unreal Engine references to use /transactions

## Redirect Configuration
1. Added engineToTransactionsRedirects section with comprehensive redirects
2. Updated infrastructureRedirects to use /transactions paths
3. Updated otherRedirects to use /transactions paths
4. Added redirect rules at highest priority for proper URL handling

## SDK Documentation Updates
1. Updated documentation links in TypeScript SDK files
2. Updated React hook documentation links
3. Updated playground links in portal sidebars

## Files Modified:
- Portal: Header.tsx, sidebars, layouts, page.tsx, DocSearch.tsx, redirects.mjs
- Playground: navLinks.ts, page components, webhooks documentation link
- SDK: transaction action files, React hooks
- Unreal Engine: sidebar and page updates

All /engine routes now redirect to /transactions equivalents while maintaining backward compatibility.
