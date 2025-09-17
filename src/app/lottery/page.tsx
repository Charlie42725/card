"use client";
import React from "react";
import Link from "next/link";
import LotteryBox from "../../components/lottery/LotteryBox";

export default function LotteryPage() {
  const handlePrizeWon = (prize: string) => {
    console.log("Prize won:", prize);
    // 這裡可以添加其他邏輯，比如更新用戶積分、顯示通知等
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative">
      {/* 返回首頁按鈕 */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105"
        >
          ← 返回首頁
        </Link>
      </div>

      {/* 頁面標題 */}
      <div className="fixed top-4 right-4 z-50">
        <h1 className="text-2xl font-bold text-white drop-shadow-lg">
          🎰 抽卡系統
        </h1>
      </div>

      {/* 抽獎組件 */}
      <LotteryBox onPrizeWon={handlePrizeWon} />
    </div>
  );
}
