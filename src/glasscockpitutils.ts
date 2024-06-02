import { pascalCase } from "change-case";

export function isValidGlasscockpitID(value: string): boolean {
  return /(?<![^\s])([A-Za-z_$][A-Za-z0-9_$]*)(?![^\s])/.test(value);
}

export function toValidGlasscockpitID(value: string): string {
  return pascalCase(value);
}
