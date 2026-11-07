export function cssVarName(collectionName: string, varName: string): string {
  const kebab = varName.replaceAll('/', '-');
  if (collectionName === 'Primitives') return `--primitives-${kebab}`;
  return `--${kebab}`;
}
