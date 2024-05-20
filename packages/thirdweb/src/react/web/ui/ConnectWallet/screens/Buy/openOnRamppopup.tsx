export function openOnrampPopup(link: string, theme: string) {
  const height = 750;
  const width = 500;
  const top = (window.innerHeight - height) / 2;
  const left = (window.innerWidth - width) / 2;

  return window.open(
    `${link}&theme=${theme}`,
    "thirdweb Pay",
    `width=${width}, height=${height}, top=${top}, left=${left}`,
  );
}
