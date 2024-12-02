const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const players = [
  "김민준",
  "이서준",
  "박지훈",
  "최현우",
  "정도현",
  "강민서",
  "윤준호",
  "임지원",
  "송현준",
  "황동현",
  "김태윤",
  "박성민",
  "이준영",
  "정우진",
  "조민재",
  "강동욱",
  "한지호",
  "배현수",
  "유승민",
  "신동훈",
  "김서진",
  "이민호",
  "박준서",
  "최우진",
  "정태호",
  "강민규",
  "오승준",
  "남기현",
  "장현우",
  "구본우",
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

  // 최근 30일간의 게임 데이터 생성
  for (let i = 0; i < 180; i++) {
    const gamesPerDay = Math.floor(Math.random() * 12) + 1;

    for (let j = 0; j < gamesPerDay; j++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // 승리팀은 6점, 패배팀은 0-5점
      const losingScore = Math.floor(Math.random() * 6);
      const isTeamAWinner = Math.random() < 0.5;
      const scoreTeamA = isTeamAWinner ? 6 : losingScore;
      const scoreTeamB = isTeamAWinner ? losingScore : 6;

      const game = await prisma.game.create({
        data: {
          date: date,
          scoreTeamA: scoreTeamA,
          scoreTeamB: scoreTeamB,
        },
      });

      // 데이터베이스에서 랜든 선수를 가져와서 랜덤하게 섞기
      const allPlayers = await prisma.player.findMany();
      const randomPlayers = allPlayers
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

      // 선수들을 게임에 할당 (수정된 부분)
      await prisma.playerGame.create({
        data: {
          playerId: randomPlayers[0].id,
          gameId: game.id,
          team: "A",
        },
      });
      await prisma.playerGame.create({
        data: {
          playerId: randomPlayers[1].id,
          gameId: game.id,
          team: "A",
        },
      });
      await prisma.playerGame.create({
        data: {
          playerId: randomPlayers[2].id,
          gameId: game.id,
          team: "B",
        },
      });
      await prisma.playerGame.create({
        data: {
          playerId: randomPlayers[3].id,
          gameId: game.id,
          team: "B",
        },
      });
    }
  }

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
