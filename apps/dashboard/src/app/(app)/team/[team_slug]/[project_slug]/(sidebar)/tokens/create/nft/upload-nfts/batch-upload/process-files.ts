import Papa from "papaparse";
import { NATIVE_TOKEN_ADDRESS, getAddress, isAddress } from "thirdweb";
import type { NFTInput } from "thirdweb/utils";
import z from "zod";
import {
  csvMimeTypes,
  jsonMimeTypes,
} from "../../../../../../../../../../../utils/batch";

const transformHeader = (h: string) => {
  const headersToTransform = [
    "name",
    "description",
    "image",
    "animation_url",
    "external_url",
    "background_color",
    "price_amount",
    "price_currency",
    "supply",
  ];

  if (headersToTransform.includes(h.trim().toLowerCase())) {
    return h.trim().toLowerCase();
  }
  return h.trim();
};

const getAcceptedFiles = async (acceptedFiles: File[]) => {
  const organizedFiles: {
    csv: File | undefined;
    json: File | undefined;
    images: File[];
    otherAssets: File[];
  } = {
    csv: undefined,
    json: undefined,
    images: [],
    otherAssets: [],
  };

  for (const file of acceptedFiles) {
    if (jsonMimeTypes.includes(file.type) || file.name.endsWith(".json")) {
      organizedFiles.json = file;
    } else if (csvMimeTypes.includes(file.type) || file.name.endsWith(".csv")) {
      organizedFiles.csv = file;
    } else if (file.type.includes("image/")) {
      organizedFiles.images.push(file);
    } else {
      organizedFiles.otherAssets.push(file);
    }
  }

  return organizedFiles;
};

export type NFTMetadataWithPrice = {
  name?: string;
  description?: string;
  image?: File | string;
  animation_url?: File | string;
  external_url?: string;
  background_color?: string;
  price_amount: string;
  price_currency: string;
  supply: string;
  attributes?: Array<{ trait_type: string; value: string }>;
};

const handleCSV = (params: {
  csvData: CSVRowData[];
  imageFiles: File[];
  otherAssets: File[];
}): NFTMetadataWithPrice[] => {
  const { csvData, imageFiles, otherAssets } = params;
  const isImageMapped = csvData.some((row) =>
    imageFiles.find((x) => x.name === row.image),
  );

  const isAnimationUrlMapped = csvData.some((row) =>
    otherAssets.find((x) => x.name === row.animation_url),
  );

  return csvData.map((row, index) => {
    const {
      name,
      description,
      image,
      animation_url,
      external_url,
      background_color,
      price_amount,
      price_currency,
      supply,
      ...propertiesObj
    } = row;

    function getAttributes() {
      const attributes: NFTMetadataWithPrice["attributes"] = [];
      for (const key in propertiesObj) {
        if (propertiesObj[key] && typeof propertiesObj[key] === "string") {
          attributes.push({
            trait_type: key,
            value: propertiesObj[key],
          });
        }
      }
      return attributes;
    }

    const nft: NFTMetadataWithPrice = {
      name: name,
      description: description,
      external_url,
      background_color,
      attributes: getAttributes(),
      image:
        imageFiles.find((img) => img?.name === image) ||
        (!isImageMapped && imageFiles[index]) ||
        image ||
        undefined,
      animation_url:
        otherAssets.find((asset) => asset?.name === animation_url) ||
        (!isAnimationUrlMapped && otherAssets[index]) ||
        animation_url,
      price_amount: price_amount || "1",
      price_currency: price_currency || getAddress(NATIVE_TOKEN_ADDRESS),
      supply: supply || "1",
    };

    return nft;
  });
};

function handleJson(params: {
  jsonData: NFTInput[];
  imageFiles: File[];
  otherAssets: File[];
}): NFTMetadataWithPrice[] {
  const { jsonData, imageFiles, otherAssets } = params;

  const isImageMapped = jsonData.some((row) =>
    imageFiles.find((img) => img?.name === row.image),
  );
  const isAnimationUrlMapped = jsonData.some((row) =>
    otherAssets.find((x) => x.name === row.animation_url),
  );

  return jsonData.map((_nft: unknown, index: number) => {
    const nft = nftWithPriceInputJsonSchema.parse(_nft);

    const nftWithPrice = {
      ...nft,
      image:
        imageFiles.find((img) => img?.name === nft?.image) ||
        (!isImageMapped && imageFiles[index]) ||
        nft.image ||
        undefined,
      animation_url:
        otherAssets.find((x) => x.name === nft?.animation_url) ||
        (!isAnimationUrlMapped && otherAssets[index]) ||
        nft.animation_url ||
        undefined,
      price_amount: nft.price_amount || "1",
      price_currency: nft.price_currency || getAddress(NATIVE_TOKEN_ADDRESS),
      supply: nft.supply || "1",
    };

    return nftWithPrice;
  });
}

export type ProcessBatchUploadFilesResult =
  | {
      type: "data";
      data: NFTMetadataWithPrice[];
    }
  | {
      type: "error";
      error: string;
    };

const priceAmountSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val.trim() === "") {
        return true;
      }
      const num = Number(val);
      if (Number.isNaN(num)) {
        return false;
      }

      return num >= 0;
    },
    {
      message: "Price amount must be a number greater than or equal to 0",
    },
  );

const supplySchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val.trim() === "") {
        return true;
      }
      const num = Number(val);
      if (Number.isNaN(num)) {
        return false;
      }
      return num > 0;
    },
    {
      message: "Supply must be a number greater than 0",
    },
  );

const nftWithPriceInputJsonSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  image: z.string().or(z.instanceof(File)).optional(),
  animation_url: z.string().or(z.instanceof(File)).optional(),
  external_url: z.string().optional(),
  background_color: z.string().optional(),
  price_amount: priceAmountSchema,
  price_currency: z
    .string()
    .refine((value) => {
      if (!value) {
        return true;
      }
      return isAddress(value);
    })
    .optional(),
  supply: supplySchema,
  attributes: z
    .array(z.object({ trait_type: z.string(), value: z.string() }))
    .optional(),
});

const nftWithPriceInputCsvSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  image: z.string().or(z.instanceof(File)).optional(),
  animation_url: z.string().or(z.instanceof(File)).optional(),
  external_url: z.string().optional(),
  background_color: z.string().optional(),
  price_amount: priceAmountSchema,
  price_currency: z.string().optional(),
  supply: supplySchema,
});

type CSVRowData = z.infer<typeof nftWithPriceInputCsvSchema> &
  Record<string, unknown>;

export async function processBatchUploadFiles(
  files: File[],
): Promise<ProcessBatchUploadFilesResult> {
  const { csv, json, images, otherAssets } = await getAcceptedFiles(files);

  if (json) {
    const jsonData = JSON.parse(await json.text());
    if (Array.isArray(jsonData)) {
      return {
        type: "data",
        data: handleJson({ jsonData, imageFiles: images, otherAssets }),
      };
    } else {
      return {
        type: "error",
        error: "Invalid JSON format",
      };
    }
  } else if (csv) {
    return new Promise<ProcessBatchUploadFilesResult>((res, rej) => {
      Papa.parse(csv, {
        header: true,
        transformHeader,
        complete: (results) => {
          try {
            const validRows: CSVRowData[] = [];

            for (let i = 0; i < results.data.length; i++) {
              if (!results.errors.find((e) => e.row === i)) {
                const result = results.data[i];
                const parsed = nftWithPriceInputCsvSchema
                  .passthrough()
                  .parse(result);

                if (parsed) {
                  validRows.push(parsed);
                }
              }
            }

            if (validRows.length > 0) {
              res({
                type: "data",
                data: handleCSV({
                  csvData: validRows,
                  imageFiles: images,
                  otherAssets,
                }),
              });
            } else {
              res({
                type: "error",
                error: "No valid CSV data found",
              });
            }
          } catch (e) {
            rej(e);
          }
        },
      });
    });
  } else {
    return {
      type: "error",
      error: "No valid files found. Please upload a '.csv' or '.json' file.",
    };
  }
}
