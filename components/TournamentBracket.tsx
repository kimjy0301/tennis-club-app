import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from "./TournamentBracket.module.css";

export type Player = {
  id: number;
  name: string;
};

export type Team = {
  id: number;
  players: [Player, Player]; // 정확히 2명의 선수를 가지도록 튜플 타입 사용
  isBye?: boolean;
};

interface Match {
  id: number;
  team1: Team;
  team2: Team;
  round: number;
}

const TournamentBracket = () => {
  const matches: Match[] = [
    // Round 1 (32강)
    {
      id: 25,
      round: 1,
      team1: {
        id: 49,
        players: [
          { id: 1, name: "김민준" },
          { id: 2, name: "이서준" },
        ],
      },
      team2: {
        id: 50,
        players: [
          { id: 9, name: "한승우" },
          { id: 10, name: "송민서" },
        ],
      },
    },
    {
      id: 26,
      round: 1,
      team1: {
        id: 51,
        players: [
          { id: 17, name: "홍준호" },
          { id: 18, name: "유시우" },
        ],
      },
      team2: {
        id: 52,
        players: [
          { id: 25, name: "서지안" },
          { id: 26, name: "권도현" },
        ],
      },
    },
    {
      id: 27,
      round: 1,
      team1: {
        id: 53,
        players: [
          { id: 33, name: "설지원" },
          { id: 34, name: "마현우" },
        ],
      },
      team2: {
        id: 54,
        players: [
          { id: 41, name: "방현서" },
          { id: 42, name: "염은우" },
        ],
      },
    },
    {
      id: 28,
      round: 1,
      team1: {
        id: 55,
        players: [
          { id: 49, name: "선서준" },
          { id: 50, name: "어민서" },
        ],
      },
      team2: {
        id: 56,
        players: [
          { id: 57, name: "나민재" },
          { id: 58, name: "랑승우" },
        ],
      },
    },

    // Round 4 (4강)
    {
      id: 29,
      round: 2,
      team1: {
        id: 57,
        players: [
          { id: 1, name: "김민준" },
          { id: 2, name: "이서준" },
        ],
      },
      team2: {
        id: 58,
        players: [
          { id: 17, name: "홍준호" },
          { id: 18, name: "유시우" },
        ],
      },
    },
    {
      id: 30,
      round: 2,
      team1: {
        id: 59,
        players: [
          { id: 33, name: "설지원" },
          { id: 34, name: "마현우" },
        ],
      },
      team2: {
        id: 60,
        players: [
          { id: 49, name: "선서준" },
          { id: 50, name: "어민서" },
        ],
      },
    },

    // Round 5 (결승)
    {
      id: 31,
      round: 3,
      team1: {
        id: 61,
        players: [
          { id: 1, name: "김민준" },
          { id: 2, name: "이서준" },
        ],
      },
      team2: {
        id: 62,
        players: [
          { id: 33, name: "설지원" },
          { id: 34, name: "마현우" },
        ],
      },
    },
  ];

  // 최대 라운드 값 계산
  const maxRound = Math.max(...matches.map((match) => match.round));

  return (
    <div className={styles.wrapperContainer}>
      <TransformWrapper
        initialScale={0.3}
        minScale={0.3}
        maxScale={3}
        limitToBounds={true}
        smooth={true}
        wheel={{
          step: 0.05,
          smoothStep: 0.002,
        }}
        pinch={{ disabled: false, step: 0.05 }}
        panning={{
          disabled: false,
          velocityDisabled: false,
          lockAxisX: false,
          lockAxisY: false,
        }}
        disablePadding={true}
        centerOnInit={true}
        doubleClick={{ disabled: true }} // 더블클릭 비활성화
      >
        <TransformComponent
          wrapperStyle={{
            width: "100%",
            height: "100%",
          }}
        >
          <div className={styles.bracketContainer}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((round) => (
              <div key={round} className={styles.round}>
                {matches
                  .filter((match) => match.round === round)
                  .map((match, index) => (
                    <div key={match.id} className={styles.match}>
                      <div
                        className={`${styles.player} ${
                          match.team1.isBye ? styles.bye : ""
                        }`}
                      >
                        {!match.team1.isBye && (
                          <>
                            <span className={styles.playerName}>
                              {match.team1.players[0].name},{" "}
                              {match.team1.players[1].name}
                            </span>
                          </>
                        )}
                        {match.team1.isBye && "bye"}
                      </div>
                      <div
                        className={`${styles.player} ${
                          match.team2.isBye ? styles.bye : ""
                        }`}
                      >
                        {!match.team2.isBye && (
                          <>
                            <span className={styles.playerName}>
                              {match.team2.players[0].name},{" "}
                              {match.team2.players[1].name}
                            </span>
                          </>
                        )}
                        {match.team2.isBye && "bye"}
                      </div>
                      {round < maxRound && <div className={styles.connector} />}
                      {round < maxRound &&
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
