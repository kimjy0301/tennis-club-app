const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const players = [
  "김종용",
  "강동우",
  "강병규",
  "김재경",
  "윤기현",
  "강석현",
  "고용민",
  "고준성",
  "권형두",
  "김가람",
  "김경용",
  "김경훈",
  "김대현",
  "김동주",
  "김민수",
  "김복만",
  "김석진",
  "김원국",
  "김일웅",
  "김재후",
  "김주원",
  "김중환",
  "김중호",
  "김진수",
  "김현우",
  "김현진",
  "문정석",
  "박사은",
  "박선민",
  "방정일",
  "배재인",
  "변찬",
  "손가람",
  "손이수",
  "손지훈",
  "신홍섭",
  "안병종",
  "안해철",
  "연경모",
  "연제강",
  "오헌석",
  "용선종",
  "우석태",
  "유석준",
  "이강수",
  "이광준",
  "이백권",
  "이선혁",
  "이순규",
  "이영조",
  "이영철",
  "이재승",
  "이재완",
  "이정현",
  "이종서",
  "장병욱",
  "장순길",
  "장영식",
  "장재혁",
  "정남철",
  "조대환",
  "조인득",
  "차권영",
  "채승하",
  "최승신",
  "최이갑",
  "피현우",
  "한명회",
  "허인",
  "홍순경",
  "황진하",
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
