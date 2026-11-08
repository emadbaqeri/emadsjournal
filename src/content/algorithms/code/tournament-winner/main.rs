//! Tournament Winner
//! competitions[i] = (home, away); results[i] = 1 if home won, 0 if away won.
//! A win is 3 points. Return the team with the most points (exactly one).

use std::collections::HashMap;

/// Time: O(n)  Space: O(n)
pub fn tournament_winner(competitions: &[(&str, &str)], results: &[u8]) -> String {
    let mut map: HashMap<String, u8> = HashMap::new();
    let mut best_team = String::from("");

    for idx in 0..competitions.len() {
        let (home, away) = competitions[idx];
        let winner = if results[idx] == 1 { home } else { away };
        let entry = map.entry(winner.into()).or_insert(0);
        *entry += 3;
        let new_pts = *entry;
        if new_pts > *map.get(&best_team).unwrap_or(&0) {
            best_team = winner.into();
        }
    }

    best_team.into()
}

fn main() {
    println!(
        "{}",
        tournament_winner(
            &[("Tigers", "Owls"), ("Owls", "Wolves"), ("Wolves", "Tigers")],
            &[0, 0, 1]
        )
    );
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn basic_three_matches() {
        assert_eq!(
            tournament_winner(
                &[("Tigers", "Owls"), ("Owls", "Wolves"), ("Wolves", "Tigers")],
                &[0, 0, 1]
            ),
            "Wolves"
        );
    }
    #[test]
    fn single_match_home_wins() {
        assert_eq!(tournament_winner(&[("Tigers", "Owls")], &[1]), "Tigers");
    }
    #[test]
    fn single_match_away_wins() {
        assert_eq!(tournament_winner(&[("Tigers", "Owls")], &[0]), "Owls");
    }
    #[test]
    fn winner_wins_home_and_away() {
        assert_eq!(
            tournament_winner(&[("Tigers", "Owls"), ("Owls", "Wolves")], &[0, 1]),
            "Owls"
        );
    }
}
