import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from "./TournamentBracket.module.css";

interface Player {
  name: string;
  team?: string;
  isBye?: boolean;
}

interface Match {
  id: number;
  player1: Player;
  player2: Player;
  round: number;
}

const TournamentBracket = () => {
  const matches: Match[] = [
    // Round 1 (32강)
    {
      id: 1,
      round: 1,
      player1: { name: "Player 1", team: "Team A" },
      player2: { name: "Player 2", team: "Team B" },
    },
    {
      id: 2,
      round: 1,
      player1: { name: "Player 3", team: "Team C" },
      player2: { name: "Player 4", team: "Team D" },
    },
    {
      id: 3,
      round: 1,
      player1: { name: "Player 5", team: "Team E" },
      player2: { name: "Player 6", team: "Team F" },
    },
    {
      id: 4,
      round: 1,
      player1: { name: "Player 7", team: "Team G" },
      player2: { name: "Player 8", team: "Team H" },
    },
    {
      id: 5,
      round: 1,
      player1: { name: "Player 9", team: "Team I" },
      player2: { name: "Player 10", team: "Team J" },
    },
    {
      id: 6,
      round: 1,
      player1: { name: "Player 11", team: "Team K" },
      player2: { name: "Player 12", team: "Team L" },
    },
    {
      id: 7,
      round: 1,
      player1: { name: "Player 13", team: "Team M" },
      player2: { name: "Player 14", team: "Team N" },
    },
    {
      id: 8,
      round: 1,
      player1: { name: "Player 15", team: "Team O" },
      player2: { name: "Player 16", team: "Team P" },
    },
    {
      id: 9,
      round: 1,
      player1: { name: "Player 17", team: "Team Q" },
      player2: { name: "Player 18", team: "Team R" },
    },
    {
      id: 10,
      round: 1,
      player1: { name: "Player 19", team: "Team S" },
      player2: { name: "Player 20", team: "Team T" },
    },
    {
      id: 11,
      round: 1,
      player1: { name: "Player 21", team: "Team U" },
      player2: { name: "Player 22", team: "Team V" },
    },
    {
      id: 12,
      round: 1,
      player1: { name: "Player 23", team: "Team W" },
      player2: { name: "Player 24", team: "Team X" },
    },
    {
      id: 13,
      round: 1,
      player1: { name: "Player 25", team: "Team Y" },
      player2: { name: "Player 26", team: "Team Z" },
    },
    {
      id: 14,
      round: 1,
      player1: { name: "Player 27", team: "Team AA" },
      player2: { name: "Player 28", team: "Team BB" },
    },
    {
      id: 15,
      round: 1,
      player1: { name: "Player 29", team: "Team CC" },
      player2: { name: "Player 30", team: "Team DD" },
    },
    {
      id: 16,
      round: 1,
      player1: { name: "Player 31", team: "Team EE" },
      player2: { name: "Player 32", team: "Team FF" },
    },
    // Round 2 (16강)
    {
      id: 17,
      round: 2,
      player1: { name: "Winner 1", team: "TBD" },
      player2: { name: "Winner 2", team: "TBD" },
    },
    {
      id: 18,
      round: 2,
      player1: { name: "Winner 3", team: "TBD" },
      player2: { name: "Winner 4", team: "TBD" },
    },
    {
      id: 19,
      round: 2,
      player1: { name: "Winner 5", team: "TBD" },
      player2: { name: "Winner 6", team: "TBD" },
    },
    {
      id: 20,
      round: 2,
      player1: { name: "Winner 7", team: "TBD" },
      player2: { name: "Winner 8", team: "TBD" },
    },
    {
      id: 21,
      round: 2,
      player1: { name: "Winner 9", team: "TBD" },
      player2: { name: "Winner 10", team: "TBD" },
    },
    {
      id: 22,
      round: 2,
      player1: { name: "Winner 11", team: "TBD" },
      player2: { name: "Winner 12", team: "TBD" },
    },
    {
      id: 23,
      round: 2,
      player1: { name: "Winner 13", team: "TBD" },
      player2: { name: "Winner 14", team: "TBD" },
    },
    {
      id: 24,
      round: 2,
      player1: { name: "Winner 15", team: "TBD" },
      player2: { name: "Winner 16", team: "TBD" },
    },
    // Round 3 (8강)
    {
      id: 25,
      round: 3,
      player1: { name: "Winner R2-1", team: "TBD" },
      player2: { name: "Winner R2-2", team: "TBD" },
    },
    {
      id: 26,
      round: 3,
      player1: { name: "Winner R2-3", team: "TBD" },
      player2: { name: "Winner R2-4", team: "TBD" },
    },
    {
      id: 27,
      round: 3,
      player1: { name: "Winner R2-5", team: "TBD" },
      player2: { name: "Winner R2-6", team: "TBD" },
    },
    {
      id: 28,
      round: 3,
      player1: { name: "Winner R2-7", team: "TBD" },
      player2: { name: "Winner R2-8", team: "TBD" },
    },
    // Round 4 (4강)
    {
      id: 29,
      round: 4,
      player1: { name: "Winner R3-1", team: "TBD" },
      player2: { name: "Winner R3-2", team: "TBD" },
    },
    {
      id: 30,
      round: 4,
      player1: { name: "Winner R3-3", team: "TBD" },
      player2: { name: "Winner R3-4", team: "TBD" },
    },
    // Round 5 (결승)
    {
      id: 31,
      round: 5,
      player1: { name: "Winner R4-1", team: "TBD" },
      player2: { name: "Winner R4-2", team: "TBD" },
    },
  ];

  return (
    <div className={styles.wrapperContainer}>
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={2}
        limitToBounds={true}
        smooth={false}
        initialPositionX={0}
        initialPositionY={0}
        wheel={{
          step: 0.05,
          smoothStep: 0.002,
        }}
        panning={{
          disabled: false,
          velocityDisabled: false,
          lockAxisX: false,
          lockAxisY: false,
        }}
      >
        <TransformComponent
          wrapperStyle={{
            width: "100%",
            height: "100%",
          }}
        >
          <div className={styles.bracketContainer}>
            {[1, 2, 3, 4, 5].map((round) => (
              <div key={round} className={styles.round}>
                {matches
                  .filter((match) => match.round === round)
                  .map((match, index) => (
                    <div key={match.id} className={styles.match}>
                      <div
                        className={`${styles.player} ${
                          match.player1.isBye ? styles.bye : ""
                        }`}
                      >
                        {!match.player1.isBye && (
                          <>
                            <span className={styles.playerName}>
                              {match.player1.name}
                            </span>
                            {match.player1.team && (
                              <span className={styles.playerTeam}>
                                ({match.player1.team})
                              </span>
                            )}
                          </>
                        )}
                        {match.player1.isBye && "bye"}
                      </div>
                      <div
                        className={`${styles.player} ${
                          match.player2.isBye ? styles.bye : ""
                        }`}
                      >
                        {!match.player2.isBye && (
                          <>
                            <span className={styles.playerName}>
                              {match.player2.name}
                            </span>
                            {match.player2.team && (
                              <span className={styles.playerTeam}>
                                ({match.player2.team})
                              </span>
                            )}
                          </>
                        )}
                        {match.player2.isBye && "bye"}
                      </div>
                      {round < 5 && <div className={styles.connector} />}
                      {round < 5 &&
                        (index % 2 === 0 ? (
                          <div
                            className={`${styles.verticalLine} ${styles.verticalLineDown}`}
                          />
                        ) : (
                          <div
                            className={`${styles.verticalLine} ${styles.verticalLineUp}`}
                          />
                        ))}
                      {round > 1 && (
                        <div className={styles.connectorToPrevious} />
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default TournamentBracket;
