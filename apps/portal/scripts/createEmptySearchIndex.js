"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
// This is required to load the searchIndex.json on vercel server
// searchIndex.json needs to exist in file system before we run `next build`
var file = "./searchIndex.json";
if (!(0, node_fs_1.existsSync)(file)) {
    (0, node_fs_1.writeFileSync)(file, "[]");
}
