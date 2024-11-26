const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const players = [
  '김지용', '홍원준', '송인숙', '장경철', '윤진아', '최윤아', '임기호', '박정환', '강미경', '풍주윤', '정병현', '설형남', '윤윤주', '남궁규영', '추재근', '한신영', '성영연', '홍석연', '고시환', '임보아', '남종훈', '남궁원빈', '배경수', '안현아', '안혜은', '양영빈', '장은혁', '심성준', '정승기', '전영재', '한석호'  

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

      // 선수들을 게임에 할당 (수정된 부분)
      await prisma.playerGame.create({
        data: {
          playerId: randomPlayers[0].id,
          gameId: game.id,
          team: 'A'
        }
      });
      await prisma.playerGame.create({
        data: {
          playerId: randomPlayers[1].id,
          gameId: game.id,
          team: 'A'
        }
      });
      await prisma.playerGame.create({
        data: {
          playerId: randomPlayers[2].id,
          gameId: game.id,
          team: 'B'
        }
      });
      await prisma.playerGame.create({
        data: {
          playerId: randomPlayers[3].id,
          gameId: game.id,
          team: 'B'
        }
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