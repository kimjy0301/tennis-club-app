const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const players = [
  '김성라', '이성라', '박성라', '최성라', '정성라',
  '강성라', '조성라', '윤성라', '장성라', '임성라', '문성라'
  , '관성라', '강성라', '우성라', '한성라', '최성라', '유성라'
];

async function main() {
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
  for (let i = 0; i < 30; i++) {
    const gamesPerDay = Math.floor(Math.random() * 10) + 1;
    
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

      // 데이터베이스에서 랜덤하게 4명의 선수 선택
      const randomPlayers = await prisma.player.findMany({
        take: 4,
        orderBy: {
          id: 'asc',
        },
        skip: Math.floor(Math.random() * (players.length - 3)), // 랜덤하게 선수 선택
      });

      // 선수들을 게임에 할당
      await prisma.player.update({
        where: { id: randomPlayers[0].id },
        data: { team: 'A', gameId: game.id },
      });
      await prisma.player.update({
        where: { id: randomPlayers[1].id },
        data: { team: 'A', gameId: game.id },
      });
      await prisma.player.update({
        where: { id: randomPlayers[2].id },
        data: { team: 'B', gameId: game.id },
      });
      await prisma.player.update({
        where: { id: randomPlayers[3].id },
        data: { team: 'B', gameId: game.id },
      });
    }
  }

  console.log('더미 데이터 생성 완료!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 