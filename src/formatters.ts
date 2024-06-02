export function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, "");
}

// export function camelToKebab(str: string): string {
//   return str
//     .replace(/([a-z])([A-Z])/g, "$1-$2") // convert camelCase to kebab-case
//     .replace(/\s+/g, "-") // replace spaces with hyphens
//     .toLowerCase(); // convert to lowercase
// }

// export function kebabToCamel(str: string): string {
//   return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
// }
