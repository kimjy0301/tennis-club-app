'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PlayerRegister() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('비밀번호가 올바르지 않습니다.');
      }
    } catch  {
      setError('인증 과정에서 오류가 발생했습니다.');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !profileImage) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('profileImage', profileImage);

    try {
      const response = await fetch('/api/players/register', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        router.push('/players/list');
      } else {
        const data = await response.json();
        setError(data.error || '선수 등록에 실패했습니다.');
      }
    } catch  {
      setError('선수 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">관리자 인증</h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <button
            type="submit"
            className="tennis-button w-full"
          >
            인증하기
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">선수 등록</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            선수명
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="tennis-input mt-1 block w-full"
            placeholder="선수 이름을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            프로필 사진
          </label>
          <div className="mt-1 flex flex-col items-center">
            {imagePreview && (
              <div className="mb-4 relative w-32 h-32">
                <Image
                  src={imagePreview}
                  alt="Profile preview"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            )}
            <label className="tennis-button cursor-pointer">
              <span>{imagePreview ? '사진 변경' : '사진 선택'}</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          className="tennis-button w-full"
          disabled={loading}
        >
          {loading ? '등록 중...' : '선수 등록'}
        </button>
      </form>
    </div>
  );
} 