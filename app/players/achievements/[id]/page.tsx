"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";

interface Achievement {
  id: number;
  title: string;
  rank: string;
  points: number;
  date: string;
  description?: string;
  image?: string;
}

interface Player {
  id: number;
  name: string;
}

export default function PlayerAchievements() {
  const params = useParams();
  const [player, setPlayer] = useState<Player | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);

  // 새로운 업적 입력을 위한 상태
  const [newAchievement, setNewAchievement] = useState({
    title: "",
    rank: "",
    points: 0,
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchPlayerAndAchievements();
  }, []);

  const fetchPlayerAndAchievements = async () => {
    try {
      // 선수 정보 가져오기
      const playerResponse = await fetch(`/api/players/detail/${params.id}`);
      if (!playerResponse.ok) throw new Error("Failed to fetch player");
      const playerData = await playerResponse.json();
      setPlayer(playerData);

      // 업적 목록 가져오기
      const achievementsResponse = await fetch(
        `/api/players/achievements/${params.id}`
      );
      if (!achievementsResponse.ok)
        throw new Error("Failed to fetch achievements");
      const achievementsData = await achievementsResponse.json();
      setAchievements(achievementsData);
    } catch (error) {
      console.error("Error:", error);
      setError("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", newAchievement.title);
      formData.append("rank", newAchievement.rank);
      formData.append("points", newAchievement.points.toString());
      formData.append("date", newAchievement.date);
      if (newAchievement.description) {
        formData.append("description", newAchievement.description);
      }
      if (newImage) {
        formData.append("image", newImage);
      }

      const response = await fetch(`/api/players/achievements/${params.id}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to add achievement");

      const addedAchievement = await response.json();
      setAchievements([...achievements, addedAchievement]);
      setIsAddingNew(false);
      setNewAchievement({
        title: "",
        rank: "",
        points: 0,
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
      setNewImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error:", error);
      setError("입상 기록 추가에 실패했습니다.");
    }
  };

  const handleDelete = async (achievementId: number) => {
    if (!confirm("정말로 이 입상 기록을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(
        `/api/players/achievements/${params.id}?achievementId=${achievementId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete achievement");

      setAchievements(achievements.filter((a) => a.id !== achievementId));
    } catch (error) {
      console.error("Error:", error);
      setError("입상 기록 삭제에 실패했습니다.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{player?.name}님의 입상 기록</h1>
        <button onClick={() => setIsAddingNew(true)} className="tennis-button">
          새 입상 기록 추가
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {isAddingNew && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대회명
              </label>
              <input
                type="text"
                value={newAchievement.title}
                onChange={(e) =>
                  setNewAchievement({
                    ...newAchievement,
                    title: e.target.value,
                  })
                }
                className="tennis-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                순위
              </label>
              <input
                type="text"
                value={newAchievement.rank}
                onChange={(e) =>
                  setNewAchievement({ ...newAchievement, rank: e.target.value })
                }
                className="tennis-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                획득 포인트
              </label>
              <input
                type="number"
                value={newAchievement.points}
                onChange={(e) =>
                  setNewAchievement({
                    ...newAchievement,
                    points: parseInt(e.target.value),
                  })
                }
                className="tennis-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                날짜
              </label>
              <input
                type="date"
                value={newAchievement.date}
                onChange={(e) =>
                  setNewAchievement({ ...newAchievement, date: e.target.value })
                }
                className="tennis-input w-full"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명
              </label>
              <textarea
                value={newAchievement.description}
                onChange={(e) =>
                  setNewAchievement({
                    ...newAchievement,
                    description: e.target.value,
                  })
                }
                className="tennis-input w-full"
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지
              </label>
              <div className="flex flex-col items-center">
                {imagePreview && (
                  <div className="mb-4 relative w-full h-48">
                    <Image
                      src={imagePreview}
                      alt="Achievement preview"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
                <label className="tennis-button cursor-pointer">
                  <span>{imagePreview ? "이미지 변경" : "이미지 선택"}</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button type="submit" className="tennis-button">
              저장
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-md p-6">
        {achievements.length === 0 ? (
          <p className="text-center text-gray-500">
            아직 등록된 입상 기록이 없습니다.
          </p>
        ) : (
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">
                      순위: {achievement.rank} | 포인트: {achievement.points}
                    </p>
                    <p className="text-sm text-gray-600">
                      날짜: {new Date(achievement.date).toLocaleDateString()}
                    </p>
                    {achievement.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {achievement.description}
                      </p>
                    )}
                  </div>
                  {achievement.image && (
                    <div className="ml-4 relative w-24 h-24">
                      <Image
                        src={achievement.image}
                        alt={achievement.title}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                  <button
                    onClick={() => handleDelete(achievement.id)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
