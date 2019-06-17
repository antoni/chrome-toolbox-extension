export const filenameFromPath = (path: string): string =>
  path.split('/')!.pop()!.slice(0, -3)
