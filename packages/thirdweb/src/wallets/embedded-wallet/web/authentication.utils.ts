export const openPopUp = (
  url: string,
  features: string = "width=350,height=500",
) => {
  return window.open(url, "popup", features);
};
