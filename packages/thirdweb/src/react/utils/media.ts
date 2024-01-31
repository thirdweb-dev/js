let video: HTMLVideoElement;

/**
 * @internal
 */
function supportsVideoType(mimeType?: string) {
  if (
    typeof window === "undefined" ||
    !mimeType ||
    !mimeType.startsWith("video/")
  ) {
    return "";
  }

  if (!video) {
    video = document.createElement("video");
  }

  return video.canPlayType(mimeType);
}

/**
 * @internal
 */
export function shouldRenderVideoTag(mimeType?: string) {
  return !!supportsVideoType(mimeType);
}

let audio: HTMLAudioElement;

/**
 * @internal
 */
function supportsAudioType(mimeType?: string) {
  if (
    typeof window === "undefined" ||
    !mimeType ||
    !mimeType.startsWith("audio/")
  ) {
    return "";
  }

  if (!audio) {
    audio = document.createElement("audio");
  }

  return audio.canPlayType(mimeType);
}

/**
 * @internal
 */
export function shouldRenderAudioTag(mimeType?: string) {
  return !!supportsAudioType(mimeType);
}
