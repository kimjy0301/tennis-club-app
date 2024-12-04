import Modal from "@/components/Modal";
import { Game, Achievement } from "@/types/game";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useState } from "react";
import Image from "next/image";

interface GameHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  games: Game[] | { games: Game[] };
  achievements: Achievement[] | { achievements: Achievement[] };
  loading: boolean;
}

export default function GameHistoryModal({
  isOpen,
  onClose,
  playerName,
  games: gamesData,
  achievements: achievementsData,
  loading,
}: GameHistoryModalProps) {
  const [activeTab, setActiveTab] = useState<"games" | "achievements">("games");
  const games = Array.isArray(gamesData) ? gamesData : gamesData?.games || [];
  const achievements = Array.isArray(achievementsData)
    ? achievementsData
    : achievementsData?.achievements || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${playerName} 선수의 기록`}
    >
      <div className="flex flex-col h-[60vh]">
        <div className="flex space-x-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("games")}
            className={`px-6 py-3 text-base font-medium rounded-t-lg ${
              activeTab === "games"
                ? "bg-white text-green-600 border-b-2 border-green-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            경기기록
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`px-6 py-3 text-base font-medium rounded-t-lg ${
              activeTab === "achievements"
                ? "bg-white text-green-600 border-b-2 border-green-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            입상기록
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4">
            <div className="space-y-6">
              {activeTab === "games" ? (
                games.length > 0 ? (
                  games.map((game) => (
                    <div
                      key={game.id}
                      className="bg-white rounded-xl border-2 border-gray-300 p-4 sm:p-6 hover:border-green-200 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="px-3 py-1 bg-gray-50 rounded-full text-sm text-gray-600 font-medium">
                          {formatDate(game.date)}
                        </div>
                        {playerName && (
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              game.scoreTeamA === game.scoreTeamB
                                ? "bg-gray-100 text-gray-700"
                                : (game.playerGames.some(
                                    (pg) =>
                                      pg.player.name === playerName &&
                                      pg.team === "A"
                                  ) &&
                                    game.scoreTeamA > game.scoreTeamB) ||
                                  (game.playerGames.some(
                                    (pg) =>
                                      pg.player.name === playerName &&
                                      pg.team === "B"
                                  ) &&
                                    game.scoreTeamB > game.scoreTeamA)
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {game.scoreTeamA === game.scoreTeamB
                              ? "무"
                              : (game.playerGames.some(
                                  (pg) =>
                                    pg.player.name === playerName &&
                                    pg.team === "A"
                                ) &&
                                  game.scoreTeamA > game.scoreTeamB) ||
                                (game.playerGames.some(
                                  (pg) =>
                                    pg.player.name === playerName &&
                                    pg.team === "B"
                                ) &&
                                  game.scoreTeamB > game.scoreTeamA)
                              ? "승"
                              : "패"}
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 text-center">
                            <div className="text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                              A팀
                            </div>
                            <div
                              className={`text-2xl sm:text-3xl font-bold ${
                                playerName &&
                                game.playerGames.some(
                                  (pg) =>
                                    pg.player.name === playerName &&
                                    pg.team === "A"
                                )
                                  ? "text-green-600"
                                  : "text-gray-700"
                              }`}
                            >
                              {game.scoreTeamA}
                            </div>
                          </div>

                          <div className="px-2 sm:px-4">
                            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                              <span className="text-gray-400 font-medium text-sm sm:text-base">
                                VS
                              </span>
                            </div>
                          </div>

                          <div className="flex-1 text-center">
                            <div className="text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                              B팀
                            </div>
                            <div
                              className={`text-2xl sm:text-3xl font-bold ${
                                playerName &&
                                game.playerGames.some(
                                  (pg) =>
                                    pg.player.name === playerName &&
                                    pg.team === "B"
                                )
                                  ? "text-green-600"
                                  : "text-gray-700"
                              }`}
                            >
                              {game.scoreTeamB}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                          <div className="text-sm font-medium text-gray-500 mb-2 pb-2 border-b border-gray-200">
                            A팀 선수
                          </div>
                          <div className="space-y-2">
                            {game.playerGames
                              .filter((pg) => pg.team === "A")
                              .map((pg) => (
                                <div
                                  key={pg.player.name}
                                  className={`px-3 py-1 rounded-full text-sm ${
                                    pg.player.name === playerName
                                      ? "bg-green-100 text-green-700 font-medium"
                                      : "bg-white text-gray-600"
                                  }`}
                                >
                                  {pg.player.name}
                                </div>
                              ))}
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                          <div className="text-sm font-medium text-gray-500 mb-2 pb-2 border-b border-gray-200">
                            B팀 선수
                          </div>
                          <div className="space-y-2">
                            {game.playerGames
                              .filter((pg) => pg.team === "B")
                              .map((pg) => (
                                <div
                                  key={pg.player.name}
                                  className={`px-3 py-1 rounded-full text-sm ${
                                    pg.player.name === playerName
                                      ? "bg-green-100 text-green-700 font-medium"
                                      : "bg-white text-gray-600"
                                  }`}
                                >
                                  {pg.player.name}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    등록된 경기가 없습니다.
                  </div>
                )
              ) : achievements.length > 0 ? (
                achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="bg-white rounded-xl border-2 border-gray-300 p-4 sm:p-6 hover:border-green-200 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
                          <div className="px-3 py-1 bg-gray-50 rounded-full text-sm text-gray-600 font-semibold">
                            {formatDate(achievement.date)}
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium text-center">
                              {achievement.rank}
                            </div>
                            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium text-center">
                              +{achievement.points}점
                            </div>
                          </div>
                        </div>
                        <div className="text-lg font-medium text-gray-800 mb-2">
                          {achievement.title}
                        </div>
                        {achievement.description && (
                          <div className="text-gray-600 text-sm">
                            {achievement.description}
                          </div>
                        )}
                      </div>
                      {achievement.image && (
                        <div className="sm:w-1/3 flex-shrink-0">
                          <a
                            href={achievement.image}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              src={achievement.image}
                              alt={achievement.title}
                              width={100}
                              height={100}
                              className="rounded-lg w-full h-40 sm:h-full object-cover"
                              quality={100}
                            />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-gray-500 flex items-center justify-center">
                  등록된 입상기록이 없습니다.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
