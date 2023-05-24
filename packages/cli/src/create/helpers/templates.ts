/* eslint-disable import/no-extraneous-dependencies */
import got from "got";
import { Stream } from "stream";
import tar from "tar";
import { promisify } from "util";

const pipeline = promisify(Stream.pipeline);

type RepoInfo = {
  name: string;
  filePath: string;
};

export async function isUrlOk(url: string): Promise<boolean> {
  const res = await got.head(url).catch((e) => e);
  return res.statusCode === 200;
}

export function hasTemplate(name: string): Promise<boolean> {
  return isUrlOk(
    `https://api.github.com/repos/thirdweb-example/${encodeURIComponent(name)}`,
  );
}

export function downloadAndExtractRepo(
  root: string,
  { name, filePath }: RepoInfo,
): Promise<void> {
  return pipeline(
    got.stream(
      `https://codeload.github.com/thirdweb-example/${name}/tar.gz/main`,
    ),
    tar.extract(
      { cwd: root, strip: filePath ? filePath.split("/").length + 1 : 1 },
      [`${name}-main${filePath ? `/${filePath}` : ""}`],
    ),
  );
}
