export function isTwUrl(url: string): boolean {
    return new URL(url).hostname.endsWith('.thirdweb.com');
}