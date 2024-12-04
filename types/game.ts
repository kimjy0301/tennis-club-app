export interface Game {
  id: number;
  date: string;
  scoreTeamA: number;
  scoreTeamB: number;
  playerGames: {
    player: {
      id: number;
      name: string;
      profileImage?: string;
    };
    team: string;
  }[];
}

export interface Achievement {
  id: number;
  title: string;
  rank: string;
  points: number;
  date: string;
  description?: string | null;
  image?: string | null;
}
