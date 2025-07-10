# Portal-Only Engine to Transactions Migration Summary

## Overview
Renamed `/engine` slugs to `/transactions` in the **portal app only**, with comprehensive redirects for backward compatibility.

## Portal Changes Made

### 1. Directory Structure
- **Moved**: `/apps/portal/src/app/engine` → `/apps/portal/src/app/transactions`

### 2. Navigation & UI Updates
- **Header.tsx**: Updated main navigation `/engine` → `/transactions`
- **Sidebar files** (v2 & v3): All internal links updated to use `/transactions` paths
- **Layout files**: Updated to display "Transactions" instead of "Engine"
- **EngineVersionSelector component**: Updated to use transaction routes
- **Main page**: Updated article card link
- **DocSearch component**: Updated search handling

### 3. Comprehensive Redirect Configuration
Added `engineToTransactionsRedirects` in `redirects.mjs`:
```javascript
const engineToTransactionsRedirects = {
  "/engine": "/transactions/v3",           // Default to latest
  "/engine/v2": "/transactions/v2",
  "/engine/v3": "/transactions/v3", 
  "/engine/:path*": "/transactions/:path*" // Catch-all
};
```

### 4. Cross-Reference Updates (Portal Only)
- **Unreal Engine references**: Updated to use `/transactions`
- **Infrastructure redirects**: Updated to point to `/transactions`
- **Other redirects**: Updated various legacy redirects

## What Was NOT Changed
- **Dashboard app**: No changes made (still uses `/engine`)
- **Playground app**: No changes made (still uses `/engine`)
- **Packages/SDK**: No documentation link changes made
- **External links**: Only portal-internal links updated

## Result
- ✅ Portal now uses `/transactions` URLs consistently
- ✅ All old `/engine` URLs redirect to `/transactions` 
- ✅ Backward compatibility maintained
- ✅ Other apps remain unchanged as requested
- ✅ External playground/API links still work correctly
