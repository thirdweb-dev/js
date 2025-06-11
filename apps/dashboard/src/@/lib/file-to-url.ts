export function fileToBlobUrl(file: File) {
  const blob = new Blob([file], { type: file.type });
  return URL.createObjectURL(blob);
}
