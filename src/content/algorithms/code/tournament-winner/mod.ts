// Tournament Winner
// competitions[i] = [home, away]; results[i] = 1 if home won, 0 if away won.
// A win is 3 points. Return the team with the most points (exactly one).

// Time: O(n)  Space: O(n)
export function tournamentWinner(competitions: [string, string][], results: number[]): string {
  const map: Map<string, number> = new Map();
  let bestTeam = "";

  for (let i = 0; i < competitions.length; i++) {
    const [home, away] = competitions[i];
    const w = results[i] === 1 ? home : away;
    const newPts = (map.get(w) ?? 0) + 3;
    map.set(w, newPts);
    if (newPts > (map.get(bestTeam) ?? 0)) {
      bestTeam = w;
    }
  }
  return bestTeam;
}
