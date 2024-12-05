const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const players = [
  "정재찬",
  "박용성",
  "장수환",
  "김기태",
  "백금선",
  "박태경",
  "김지용",
  "정재용",
  "임경묵",
  "임용택",
  "김종용",
  "송형준",
  "장재호",
  "강정호",
  "김석희",
  "김홍민",
  "김남균",
  "김영성",
  "김철민",
  "김학민",
  "노광섭",
  "백승찬",
  "손운도",
  "양승환",
  "이용만",
  "이광훈",
  "임재영",
  "용승식",
  "장성진",
  "장종현",
  "한철희",
  "정윤석",
  "김중완",
  "송권섭",
  "강종복",
  "이선혁",
  "정주원",
  "최준혁",
];

async function main() {
  await prisma.playerGame.deleteMany();
  await prisma.player.deleteMany();
  await prisma.game.deleteMany();

  // 먼저 선수들을 생성
  for (const playerName of players) {
    await prisma.player.create({
      data: {
        name: playerName,
      },
    });
  }

  // // 최근 30일간의 게임 데이터 생성
  // for (let i = 0; i < 180; i++) {
  //   const gamesPerDay = Math.floor(Math.random() * 12) + 1;

  //   for (let j = 0; j < gamesPerDay; j++) {
  //     const date = new Date();
  //     date.setDate(date.getDate() - i);

  //     // 승리팀은 6점, 패배팀은 0-5점
  //     const losingScore = Math.floor(Math.random() * 6);
  //     const isTeamAWinner = Math.random() < 0.5;
  //     const scoreTeamA = isTeamAWinner ? 6 : losingScore;
  //     const scoreTeamB = isTeamAWinner ? losingScore : 6;

  //     const game = await prisma.game.create({
  //       data: {
  //         date: date,
  //         scoreTeamA: scoreTeamA,
  //         scoreTeamB: scoreTeamB,
  //       },
  //     });

  //     // 데이터베이스에서 랜든 선수를 가져와서 랜덤하게 섞기
  //     const allPlayers = await prisma.player.findMany();
  //     const randomPlayers = allPlayers
  //       .sort(() => Math.random() - 0.5)
  //       .slice(0, 4);

  //     // 선수들을 게임에 할당 (수정된 부분)
  //     await prisma.playerGame.create({
  //       data: {
  //         playerId: randomPlayers[0].id,
  //         gameId: game.id,
  //         team: "A",
  //       },
  //     });
  //     await prisma.playerGame.create({
  //       data: {
  //         playerId: randomPlayers[1].id,
  //         gameId: game.id,
  //         team: "A",
  //       },
  //     });
  //     await prisma.playerGame.create({
  //       data: {
  //         playerId: randomPlayers[2].id,
  //         gameId: game.id,
  //         team: "B",
  //       },
  //     });
  //     await prisma.playerGame.create({
  //       data: {
  //         playerId: randomPlayers[3].id,
  //         gameId: game.id,
  //         team: "B",
  //       },
  //     });
  //   }
  // }

  console.log("더미 데이터 생성 완료!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
