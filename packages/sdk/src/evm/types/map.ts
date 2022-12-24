import { PluginMapInput } from "../schema/contracts/common/map";
import { z } from "zod";

/**
 * Input model to pass a list of extension-addresses + function-selectors
 * @public
 */
export type PluginMap = z.input<typeof PluginMapInput>;
