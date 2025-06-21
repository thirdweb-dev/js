import Papa from "papaparse";
import type { NFTInput } from "thirdweb/utils";
import { removeEmptyValues } from "./parseAttributes";

interface CSVData extends Record<string, string | undefined> {
  name: string;
  description?: string;
  external_url?: string;
  background_color?: string;
  youtube_url?: string;
}

export const csvMimeTypes = [
  "text/csv",
  "text/plain",
  "text/x-csv",
  "application/vnd.ms-excel",
  "application/csv",
  "application/x-csv",
  "text/comma-separated-values",
  "text/x-comma-separated-values",
  "text/tab-separated-values",
];

export const jsonMimeTypes = [
  "application/json",
  "application/x-json",
  "application/ld+json",
  "application/json-ld",
  "application/x-json-ld",
];

const transformHeader = (h: string) => {
  const headersToTransform = [
    "name",
    "description",
    "image",
    "animation_url",
    "external_url",
    "background_color",
    "youtube_url",
  ];

  if (headersToTransform.includes(h.trim().toLowerCase())) {
    return h.trim().toLowerCase();
  }
  return h.trim();
};

function removeSpecialCharacters(str: string) {
  return str.replace(/[^a-zA-Z0-9 ]/g, "");
}

function sortAscending(a: File, b: File) {
  return (
    Number.parseInt(removeSpecialCharacters(a.name)) -
    Number.parseInt(removeSpecialCharacters(b.name))
  );
}

const getAcceptedFiles = async (acceptedFiles: File[]) => {
  const jsonFiles = acceptedFiles
    .filter((f) => jsonMimeTypes.includes(f.type) || f.name.endsWith(".json"))
    .sort(sortAscending);

  let json: unknown[] = [];

  for (const f of jsonFiles) {
    const text = await f.text();
    // can be either a single json object or an array of json objects
    let parsed: unknown | unknown[] = [];
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error(e);
    }
    // just concat it always (even if it's a single object
    // this will add the object to the end of the array or append the array to the end of the array)
    json = json.concat(parsed);
  }

  const csv = acceptedFiles.find(
    (f) => csvMimeTypes.includes(f.type) || f.name.endsWith(".csv"),
  );
  const images = acceptedFiles
    .filter((f) => f.type.includes("image/"))
    .sort(sortAscending);
  const videos = acceptedFiles
    .filter(
      (f) =>
        f.type.includes("video/") ||
        f.type.includes("audio") ||
        f.type.includes("model") ||
        f.type.includes("pdf") ||
        f.type.includes("text") ||
        f.name.endsWith(".glb") ||
        f.name.endsWith(".usdz"),
    )
    .filter((f) => f.name !== csv?.name)
    .sort(sortAscending);

  return { csv, images, json, videos };
};

function removeEmptyKeysFromObject<T extends Record<string, unknown>>(
  obj: T,
): T {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === "" || obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
}

const convertToOsStandard = (obj: NFTInput["attributes"]) => {
  const attributes = Object.entries(obj || {}).map(([trait_type, value]) => ({
    trait_type,
    value,
  }));

  return removeEmptyValues(attributes);
};

const getMergedData = (
  csvData: Papa.ParseResult<CSVData> | undefined,
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  jsonData: any,
  imageFiles: File[],
  videoFiles: File[],
): NFTInput[] => {
  if (csvData?.data) {
    const isImageMapped = csvData.data.some((row) =>
      imageFiles.find((img) => img?.name === row.image),
    );
    const isAnimationUrlMapped = csvData.data.some((row) =>
      videoFiles.find((video) => video?.name === row.animation_url),
    );

    return csvData.data.map((row, index) => {
      const {
        name,
        description,
        image,
        animation_url,
        external_url,
        background_color,
        youtube_url,
        ...properties
      } = row;

      return removeEmptyKeysFromObject({
        animation_url:
          videoFiles.find((video) => video?.name === animation_url) ||
          (!isAnimationUrlMapped && videoFiles[index]) ||
          animation_url ||
          undefined,
        attributes: convertToOsStandard(removeEmptyKeysFromObject(properties)),
        background_color,
        description: description?.toString(),
        external_url,
        image:
          imageFiles.find((img) => img?.name === image) ||
          (!isImageMapped && imageFiles[index]) ||
          image ||
          undefined,
        name: name.toString(),
        youtube_url,
      });
    });
  }
  if (Array.isArray(jsonData)) {
    const isImageMapped = jsonData.some((row) =>
      imageFiles.find((img) => img?.name === row.image),
    );
    const isAnimationUrlMapped = jsonData.some((row) =>
      videoFiles.find((video) => video?.name === row.animation_url),
    );

    // biome-ignore lint/suspicious/noExplicitAny: FIXME
    return jsonData.map((nft: any, index: number) => ({
      ...nft,
      animation_url:
        videoFiles.find((video) => video?.name === nft?.animation_url) ||
        (!isAnimationUrlMapped && videoFiles[index]) ||
        nft.animation_url ||
        undefined,
      image:
        imageFiles.find((img) => img?.name === nft?.image) ||
        (!isImageMapped && imageFiles[index]) ||
        nft.image ||
        nft.file_url ||
        undefined,
    }));
  }
  return [];
};

export async function processInputData(
  files: File[],
  setData: (data: NFTInput[]) => void,
) {
  const { csv, json, images, videos } = await getAcceptedFiles(files);
  if (json.length > 0) {
    setData(getMergedData(undefined, json, images, videos));
  } else if (csv) {
    Papa.parse<CSVData>(csv, {
      complete: (results) => {
        const validResults: Papa.ParseResult<CSVData> = {
          ...results,
          data: [],
        };
        for (let i = 0; i < results.data.length; i++) {
          if (!results.errors.find((e) => e.row === i)) {
            const result = results.data[i];
            if (result?.name) {
              validResults.data.push(result);
            }
          }
        }
        setData(getMergedData(validResults, undefined, images, videos));
      },
      header: true,
      transformHeader,
    });
  } else {
    throw new Error(
      'No valid files found. Please upload a ".csv" or ".json" file.',
    );
  }
}

export const shuffleData = (array: NFTInput[]) =>
  array
    .map((value) => ({ sort: Math.random(), value }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
