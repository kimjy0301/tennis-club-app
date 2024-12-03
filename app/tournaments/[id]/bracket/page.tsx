"use client";
import TournamentBracket from "@/components/TournamentBracket";

export default async function TournamentBracketPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8 text-center">토너먼트 대진표</h1>
      <TournamentBracket />
    </main>
  );
}
