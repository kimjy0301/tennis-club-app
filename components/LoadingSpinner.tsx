"use client";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[50vh] gap-3">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 border-solid rounded-full animate-spin border-t-green-600"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>
      </div>
      <p className="text-gray-500 animate-pulse">로딩중...</p>
    </div>
  );
}
