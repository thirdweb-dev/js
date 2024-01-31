/**
 * if the `options.for` promise takes longer than the `options.moreThan` time, `options.do` callback function will be called
 *
 * this is useful to prevent showing the loading animation for a super short time that looks like flickering
 * @param options - Options for the ifWaiting function
 *
 * @internal
 */
export async function ifWaiting(options: {
  for: Promise<any>;
  moreThan: number;
  do: () => void;
}) {
  const id = setTimeout(options.do, options.moreThan);
  await options.for;
  clearTimeout(id);
}
