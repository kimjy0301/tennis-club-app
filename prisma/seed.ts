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



  // 최근 30일간의 게임 데이터 생성
  for (let i = 0; i < 365; i++) {
    const gamesPerDay = Math.floor(Math.random() * 10) + 1; // 하루 10-13게임
    
    for (let j = 0; j < gamesPerDay; j++) {
      // 랜덤 날짜 생성 (최근 30일 이내)
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // 랜덤 점수 생성 (0-7)
      const scoreTeamA = Math.floor(Math.random() * 6);
      const scoreTeamB = Math.floor(Math.random() * 6);
      
      // 동점이 나오지 않도록 조정
      if (scoreTeamA === scoreTeamB) {
        scoreTeamB + 1;
      }

      // 게임 생성
      const game = await prisma.game.create({
        data: {
          date: date,
          scoreTeamA: scoreTeamA,
          scoreTeamB: scoreTeamB,
        },
      });

      // 선수 선택 및 생성
      const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
      const gamePlayers = shuffledPlayers.slice(0, 4); // 4명 선택

      // A팀 선수 2명
      await prisma.player.createMany({
        data: [
          {
            name: gamePlayers[0],
            team: 'A',
            gameId: game.id,
          },
          {
            name: gamePlayers[1],
            team: 'A',
            gameId: game.id,
          },
          // B팀 선수 2명
          {
            name: gamePlayers[2],
            team: 'B',
            gameId: game.id,
          },
          {
            name: gamePlayers[3],
            team: 'B',
            gameId: game.id,
          },
        ],
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