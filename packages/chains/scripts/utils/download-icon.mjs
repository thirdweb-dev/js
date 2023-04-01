// @ts-check
import fetch from "cross-fetch";

const iconRoute =
  "https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/icons";

const iconMetaMap = new Map();

/**
 * @param {string} icon
 */
export function downloadIcon(icon) {
  if (iconMetaMap.has(icon)) {
    return iconMetaMap.get(icon);
  }

  const result = fetch(`${iconRoute}/${icon}.json`)
    .then((res) => res.json())
    .then((json) => {
      return json[0];
    })
    .catch(() => {
      return null;
    });
  // set the promise as the value of the map so we don't have to fetch it again
  iconMetaMap.set(icon, result);
  return result;
}
