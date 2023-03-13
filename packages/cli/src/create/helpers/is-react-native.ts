import got from "got/dist/source";

export const isReactNative = async (name: string) => {
  try {
    const data = (await got
      .get(
        `https://raw.githubusercontent.com/thirdweb-example/${name}/main/package.json`,
      )
      .json()) as any;

    return !!(data?.scripts?.android || data?.scripts?.ios);
  } catch (e) {
    return false;
  }
};
