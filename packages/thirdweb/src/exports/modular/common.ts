// custom extensions
export { grantMinterRole } from "../../extensions/modular/write/grantMinterRole.js";

// reads
export { hasAnyRole } from "../../extensions/modular/__generated__/ModularCore/read/hasAnyRole.js";
export { hasAllRoles } from "../../extensions/modular/__generated__/ModularCore/read/hasAllRoles.js";
export { owner } from "../../extensions/modular/__generated__/ModularCore/read/owner.js";
export { rolesOf } from "../../extensions/modular/__generated__/ModularCore/read/rolesOf.js";

// writes
export { grantRoles } from "../../extensions/modular/__generated__/ModularCore/write/grantRoles.js";
export { renounceRoles } from "../../extensions/modular/__generated__/ModularCore/write/renounceRoles.js";
export { revokeRoles } from "../../extensions/modular/__generated__/ModularCore/write/revokeRoles.js";
export { transferOwnership } from "../../extensions/modular/__generated__/ModularCore/write/transferOwnership.js";
export { renounceOwnership } from "../../extensions/modular/__generated__/ModularCore/write/renounceOwnership.js";
