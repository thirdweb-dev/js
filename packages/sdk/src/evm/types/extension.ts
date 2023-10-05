import {
  ExtensionFunctionInput,
  ExtensionInput,
  ExtensionMetadataInput,
} from "../schema/contracts/common/extension";
import { z } from "zod";

/**
 * Input model to pass an extension's metadata -- name, metadataURI, implementation address
 * @public
 */
export type ExtensionMetadata = z.input<typeof ExtensionMetadataInput>;

/**
 * Input model to pass a list function-selectors
 * @public
 */
export type ExtensionFunction = z.input<typeof ExtensionFunctionInput>;

/**
 * Input model to pass a list of extension-addresses + function-selectors
 * @public
 */
export type Extension = z.input<typeof ExtensionInput>;

export type FunctionInput = {
  functionSelector?: string;
  functionSignature?: string;
};
