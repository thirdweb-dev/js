import {
  PluginFunctionInput,
  PluginInput,
  PluginMetadataInput,
} from "../schema/contracts/common/plugins";
import { z } from "zod";

/**
 * Input model to pass a plugin's metadata -- name, metadataURI, implementation address
 * @public
 */
export type PluginMetadata = z.input<typeof PluginMetadataInput>;

/**
 * Input model to pass a list function-selectors
 * @public
 */
export type PluginFunction = z.input<typeof PluginFunctionInput>;

/**
 * Input model to pass a list of extension-addresses + function-selectors
 * @public
 */
export type Plugin = z.input<typeof PluginInput>;
