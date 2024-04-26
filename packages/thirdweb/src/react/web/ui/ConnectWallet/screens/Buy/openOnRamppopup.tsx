export function openOnrampPopup(link: string, theme: string) {
  const height = 700;
  const width = 600;
  const top = (window.innerHeight - height) / 2;
  const left = (window.innerWidth - width) / 2;

  return window.open(
    `${link}@theme=${theme}`,
    "Buy",
    `width=${width}, height=${height}, top=${top}, left=${left}`,
  );
}
