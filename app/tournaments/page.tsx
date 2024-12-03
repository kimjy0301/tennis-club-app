import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function TournamentsPage() {
  const tournaments = await prisma.tournament.findMany({
    orderBy: { startDate: "desc" },
    select: {
      id: true,
      name: true,
      startDate: true,
      status: true,
    },
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">월례 대회</h1>
        <Link
          href="/tournaments/new"
          className="tennis-button text-white px-4 py-2 rounded hover:bg-green-600"
        >
          대회 등록
        </Link>
      </div>

      {tournaments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">등록된 대회가 없습니다.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold">{tournament.name}</h2>
              <p>시작일: {tournament.startDate.toLocaleDateString()}</p>
              <p>상태: {tournament.status}</p>
              <Link
                href={`/tournaments/${tournament.id}`}
                className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded"
              >
                자세히 보기
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
