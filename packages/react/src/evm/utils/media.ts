let video: HTMLVideoElement;

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

export function shouldRenderVideoTag(mimeType?: string) {
  return !!supportsVideoType(mimeType);
}

let audio: HTMLAudioElement;

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

export function shouldRenderAudioTag(mimeType?: string) {
  return !!supportsAudioType(mimeType);
}
