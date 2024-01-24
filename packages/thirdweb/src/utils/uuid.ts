// TODO replace with more realiable uuid generator
export function fakeUuid() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
