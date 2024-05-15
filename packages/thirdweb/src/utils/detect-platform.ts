export type OperatingSystem =
  | "iOS"
  | "Android OS"
  | "BlackBerry OS"
  | "Windows Mobile"
  | "Amazon OS"
  | "Windows 3.11"
  | "Windows 95"
  | "Windows 98"
  | "Windows 2000"
  | "Windows XP"
  | "Windows Server 2003"
  | "Windows Vista"
  | "Windows 7"
  | "Windows 8"
  | "Windows 8.1"
  | "Windows 10"
  | "Windows ME"
  | "Windows CE"
  | "Open BSD"
  | "Sun OS"
  | "Linux"
  | "Mac OS"
  | "QNX"
  | "BeOS"
  | "OS/2"
  | "Chrome OS";

type OperatingSystemRule = [OperatingSystem, RegExp];

const operatingSystemRules: OperatingSystemRule[] = [
  ["iOS", /iP(hone|od|ad)/],
  ["Android OS", /Android/],
  ["BlackBerry OS", /BlackBerry|BB10/],
  ["Windows Mobile", /IEMobile/],
  ["Amazon OS", /Kindle/],
  ["Windows 3.11", /Win16/],
  ["Windows 95", /(Windows 95)|(Win95)|(Windows_95)/],
  ["Windows 98", /(Windows 98)|(Win98)/],
  ["Windows 2000", /(Windows NT 5.0)|(Windows 2000)/],
  ["Windows XP", /(Windows NT 5.1)|(Windows XP)/],
  ["Windows Server 2003", /(Windows NT 5.2)/],
  ["Windows Vista", /(Windows NT 6.0)/],
  ["Windows 7", /(Windows NT 6.1)/],
  ["Windows 8", /(Windows NT 6.2)/],
  ["Windows 8.1", /(Windows NT 6.3)/],
  ["Windows 10", /(Windows NT 10.0)/],
  ["Windows ME", /Windows ME/],
  ["Windows CE", /Windows CE|WinCE|Microsoft Pocket Internet Explorer/],
  ["Open BSD", /OpenBSD/],
  ["Sun OS", /SunOS/],
  ["Chrome OS", /CrOS/],
  ["Linux", /(Linux)|(X11)/],
  ["Mac OS", /(Mac_PowerPC)|(Macintosh)/],
  ["QNX", /QNX/],
  ["BeOS", /BeOS/],
  ["OS/2", /OS\/2/],
];

export type Platform = "mobile" | "browser" | "node";

export function detectPlatform() {
  if (
    typeof document === "undefined" &&
    typeof navigator !== "undefined" &&
    navigator.product === "ReactNative"
  ) {
    // react-native
    return "mobile" as const;
  }
  if (typeof navigator !== "undefined") {
    return "browser" as const;
  }
  return "node" as const;
}

export function detectOS(ua: string): OperatingSystem | null {
  for (let ii = 0, count = operatingSystemRules.length; ii < count; ii++) {
    const [os, regex] = operatingSystemRules[ii] as OperatingSystemRule;
    const match = regex.exec(ua);
    if (match) {
      return os;
    }
  }

  return null;
}
