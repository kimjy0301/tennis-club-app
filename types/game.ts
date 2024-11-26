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