/**
 * Downloads a text file with the given text and file name.
 * @internal
 */
export function downloadTextFile(text: string, fileName: string) {
  const blob = new Blob([text], {
    type: "text/plain",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.style.display = "none";
  a.click();
  URL.revokeObjectURL(a.href);
}
