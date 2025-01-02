import correctLicense from "spdx-correct";

export function correctAndUniqueLicenses(licenses?: string[]): string[] {
  return licenses
    ? Array.from(
        new Set(
          licenses.map(
            (originalLicense) =>
              correctLicense(originalLicense) || originalLicense,
          ),
        ),
      )
    : ["Unlicensed"];
}
