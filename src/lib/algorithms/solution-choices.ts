export interface Marker {
  id: string;
  label: string;
  start: string;
}

export interface SolutionChoice {
  id: string;
  label: string;
  code: string;
}

export function sliceFromMarkers(
  source: string,
  markers: Marker[],
): { id: string; label: string; code: string }[] {
  const found = markers
    .map((marker) => {
      const at = source.indexOf(marker.start);
      if (at < 0) return null;
      const index = source.lastIndexOf('\n', at) + 1;
      return { ...marker, index };
    })
    .filter((marker): marker is Marker & { index: number } => marker !== null)
    .sort((a, b) => a.index - b.index);

  return found.map((marker, index) => ({
    id: marker.id,
    label: marker.label,
    code: source.slice(marker.index, found[index + 1]?.index ?? source.length).trim(),
  }));
}

export function pairChoices(
  approaches: { id: string; label: string; byLang: Record<string, string> }[],
  languages: { id: string; label: string }[],
): SolutionChoice[] {
  const choices: SolutionChoice[] = [];
  for (const approach of approaches) {
    for (const language of languages) {
      const code = approach.byLang[language.id];
      if (!code) continue;
      choices.push({
        id: `${approach.id}-${language.id}`,
        label: `${approach.label} · ${language.label}`,
        code,
      });
    }
  }
  return choices;
}
