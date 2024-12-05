"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Player {
  id: number;
  name: string;
  profileImage: string;
  isGuest: boolean;
}

export default function PlayerList() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("isAuthenticated") === "true";
    }
    return false;
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch("/api/players");
      const data = await response.json();
      setPlayers(data);
    } catch {
      setError("Error fetching players:");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        setError("");
      } else {
        setError("비밀번호가 올바르지 않습니다.");
      }
    } catch {
      setError("인증 과정에서 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (playerId: number, playerName: string) => {
    if (!window.confirm(`정말로 ${playerName} 선수를 삭제하시겠습니까?`)) {
      return;
    }

    setDeletingId(playerId);
    try {
      const response = await fetch("/api/players", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerId }),
      });

      if (response.ok) {
        setPlayers(players.filter((player) => player.id !== playerId));
      } else {
        setError("선수 삭제 중 오류가 발생했습니다.");
      }
    } catch {
      setError("선수 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">관리자 인증</h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="tennis-input mt-1 block w-full"
              placeholder="관리자 비밀번호를 입력하세요"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="tennis-button w-full">
            인증하기
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">선수 목록</h1>
        <Link href="/players/register" className="tennis-button">
          선수 등록
        </Link>
      </div>

      {/* 정식회원 목록 */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">정식회원</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {players
          .filter((player) => !player.isGuest)
          .map((player) => (
            <div key={player.id} className="relative">
              <Link
                href={`/players/detail/${player.id}`}
                className="sport-card p-6 hover:scale-105 transition-all duration-200 block"
              >
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <Image
                      src={player.profileImage || "/default-profile.png"}
                      alt={player.name}
                      fill
                      className="rounded-full object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality={75}
                      priority={false}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4dHRsdHR4dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR4SEhwYHDIYGDIdHRkyLR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {player.name}
                  </h2>
                </div>
              </Link>
              {isAuthenticated && (
                <button
                  onClick={() => handleDelete(player.id, player.name)}
                  disabled={deletingId === player.id}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
                  title="선수 삭제"
                >
                  {deletingId === player.id ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          ))}
      </div>
      {players.filter((player) => !player.isGuest).length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500 mb-8">
          등록된 정규 선수가 없습니다.
        </div>
      )}

      {/* 게스트 선수 목록 */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">게스트</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {players
          .filter((player) => player.isGuest)
          .map((player) => (
            <div key={player.id} className="relative">
              <Link
                href={`/players/detail/${player.id}`}
                className="sport-card p-6 hover:scale-105 transition-all duration-200 block"
              >
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <Image
                      src={player.profileImage || "/default-profile.png"}
                      alt={player.name}
                      fill
                      className="rounded-full object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality={75}
                      priority={false}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4dHRsdHR4dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR4SEhwYHDIYGDIdHRkyLR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {player.name}
                  </h2>
                </div>
              </Link>
              {isAuthenticated && (
                <button
                  onClick={() => handleDelete(player.id, player.name)}
                  disabled={deletingId === player.id}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
                  title="선수 삭제"
                >
                  {deletingId === player.id ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          ))}
      </div>
      {players.filter((player) => player.isGuest).length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          등록된 게스트 선수가 없습니다.
        </div>
      )}
    </div>
  );
}
