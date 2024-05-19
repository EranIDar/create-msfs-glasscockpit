export function isValidGlasscockpitID(value: string): boolean {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-zA-Z\d\-~][a-zA-Z\d\-._~]*$/.test(
    value
  );
}

export function toValidGlasscockpitID(value: string): string {
  return value.trim();
}
