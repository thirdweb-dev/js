import Papa from "papaparse";
import { getAddress, isAddress, NATIVE_TOKEN_ADDRESS } from "thirdweb";
import type { NFTInput } from "thirdweb/utils";
import z from "zod";
import { csvMimeTypes, jsonMimeTypes } from "@/utils/batch";

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
    images: [],
    json: undefined,
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
      animation_url:
        otherAssets.find((asset) => asset?.name === animation_url) ||
        (!isAnimationUrlMapped && otherAssets[index]) ||
        animation_url,
      attributes: getAttributes(),
      background_color,
      description: description,
      external_url,
      image:
        imageFiles.find((img) => img?.name === image) ||
        (!isImageMapped && imageFiles[index]) ||
        image ||
        undefined,
      name: name,
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
      animation_url:
        otherAssets.find((x) => x.name === nft?.animation_url) ||
        (!isAnimationUrlMapped && otherAssets[index]) ||
        nft.animation_url ||
        undefined,
      image:
        imageFiles.find((img) => img?.name === nft?.image) ||
        (!isImageMapped && imageFiles[index]) ||
        nft.image ||
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
  animation_url: z.string().or(z.instanceof(File)).optional(),
  attributes: z
    .array(z.object({ trait_type: z.string(), value: z.string() }))
    .optional(),
  background_color: z.string().optional(),
  description: z.string().optional(),
  external_url: z.string().optional(),
  image: z.string().or(z.instanceof(File)).optional(),
  name: z.string(),
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
});

const nftWithPriceInputCsvSchema = z.object({
  animation_url: z.string().or(z.instanceof(File)).optional(),
  background_color: z.string().optional(),
  description: z.string().optional(),
  external_url: z.string().optional(),
  image: z.string().or(z.instanceof(File)).optional(),
  name: z.string(),
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
        data: handleJson({ imageFiles: images, jsonData, otherAssets }),
        type: "data",
      };
    } else {
      return {
        error: "Invalid JSON format",
        type: "error",
      };
    }
  } else if (csv) {
    return new Promise<ProcessBatchUploadFilesResult>((res, rej) => {
      Papa.parse(csv, {
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
                data: handleCSV({
                  csvData: validRows,
                  imageFiles: images,
                  otherAssets,
                }),
                type: "data",
              });
            } else {
              res({
                error: "No valid CSV data found",
                type: "error",
              });
            }
          } catch (e) {
            rej(e);
          }
        },
        header: true,
        transformHeader,
      });
    });
  } else {
    return {
      error: "No valid files found. Please upload a '.csv' or '.json' file.",
      type: "error",
    };
  }
}
