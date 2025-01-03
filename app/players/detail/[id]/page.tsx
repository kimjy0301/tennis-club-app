"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Player {
  id: number;
  name: string;
  profileImage?: string;
  isGuest: boolean;
}

export default function PlayerDetail() {
  const router = useRouter();
  const [player, setPlayer] = useState<Player | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isGuest, setIsGuest] = useState(false);

  const params = useParams();

  useEffect(() => {
    fetchPlayer();
  }, []);

  const fetchPlayer = async () => {
    try {
      const response = await fetch(`/api/players/detail/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch player");
      const data = await response.json();
      setPlayer(data);
      setName(data.name);
      setImagePreview(data.profileImage);
      setIsGuest(data.isGuest);
    } catch (error) {
      console.error("Error:", error);
      setError("선수 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("isGuest", String(isGuest));
      if (newImage) {
        formData.append("profileImage", newImage);
      }

      const response = await fetch(`/api/players/detail/${params.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update player");

      const updatedPlayer = await response.json();
      setPlayer(updatedPlayer);
      setIsEditing(false);
      setError("");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      setError("선수 정보 수정에 실패했습니다.");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!player) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">선수를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                선수명
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="tennis-input w-full"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isGuest"
                checked={isGuest}
                onChange={(e) => setIsGuest(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor="isGuest"
                className="ml-2 block text-sm text-gray-900"
              >
                게스트 선수
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                프로필 사진
              </label>
              <div className="flex flex-col items-center">
                {imagePreview && (
                  <div className="relative w-32 h-32 mb-4">
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      fill
                      sizes="100vw"
                      className="rounded-full object-cover"
                    />
                  </div>
                )}
                <label className="tennis-button cursor-pointer">
                  <span>사진 {imagePreview ? "변경" : "선택"}</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button type="submit" className="tennis-button">
                저장
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src={player.profileImage || "/default-profile.png"}
                alt={player.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {player.name}
            </h2>
            <p className="text-gray-600 mb-4">
              {player.isGuest ? "게스트 선수" : "정회원 선수"}
            </p>
            <div className="space-x-4">
              <button
                onClick={() => setIsEditing(true)}
                className="tennis-button"
              >
                정보 수정
              </button>
              <button
                onClick={() =>
                  router.push(`/players/achievements/${params.id}`)
                }
                className="tennis-button"
              >
                입상 등록
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
