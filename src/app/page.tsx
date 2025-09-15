"use client";
import React, { useState, useEffect } from "react";

const CARD_COUNT = 1; // 改為只顯示一個獎勵
const PRIZE_TYPES = ["再接再厲", "獎勵點數"];

function getRandomPrize(): string {
  if (Math.random() < 0.3) {
    // 30% 機率獲得點數獎勵
    const points = Math.floor(Math.random() * 451) + 50; // 50-500點
    return `${points}點`;
  } else {
    // 70% 機率是再接再厲
    return "再接再厲";
  }
}

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [prize, setPrize] = useState<string>("");
  const [showPrize, setShowPrize] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [selectedPack, setSelectedPack] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [startY, setStartY] = useState(0);
  const PACKS = ["彩虹盒子", "星星盒子", "愛心盒子", "花朵盒子", "蝴蝶盒子"];

  // 全局事件監聽器
  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaY = startY - clientY; // 往上拖為正值
      const newDragY = Math.max(0, deltaY);
      setDragY(newDragY); // 只允許往上拖
      console.log('Dragging:', newDragY, 'isDragging:', isDragging, 'selectedPack:', selectedPack); // 調試用
      console.log('Transform will be applied:', selectedPack === selectedPack && isDragging, 'dragY:', newDragY);
    };

    const handleGlobalEnd = () => {
      if (!isDragging) return;
      setIsDragging(false);
      
      // 如果拖拽超過 100px，觸發抽卡
      if (dragY > 100) {
        setOpened(true);
      } else {
        // 如果沒有觸發抽卡，取消選擇狀態，讓所有卡片重新開始轉動
        setSelectedPack(null);
      }
      
      setDragY(0);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMove);
      document.addEventListener('mouseup', handleGlobalEnd);
      document.addEventListener('touchmove', handleGlobalMove);
      document.addEventListener('touchend', handleGlobalEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMove);
      document.removeEventListener('mouseup', handleGlobalEnd);
      document.removeEventListener('touchmove', handleGlobalMove);
      document.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [isDragging, startY, dragY]);

  // 開始拖拽
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, idx: number) => {
    if (opened) return;
    e.preventDefault();
    setSelectedPack(idx); // 拖拽時自動選中
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartY(clientY);
    setDragY(0);
    console.log('Drag start:', idx, clientY, 'isDragging will be:', true); // 調試用
    
    // 阻止點擊事件
    e.stopPropagation();
  };

  // 點擊卡包選擇/取消選擇
  const handlePackClick = (idx: number) => {
    if (isDragging) return; // 如果正在拖拽，不處理點擊
    if (selectedPack === idx) {
      // 如果點擊已選中的卡包，取消選擇
      setSelectedPack(null);
    } else {
      // 選擇新卡包
      setSelectedPack(idx);
    }
  };

  // 動畫流程
  useEffect(() => {
    if (opened) {
      // 拆包爆光
      setTimeout(() => {
        setShowExplosion(true);
        // 獎品出現
        setTimeout(() => {
          setShowPrize(true);
          const result = getRandomPrize();
          setPrize(result);
          console.log('Prize set:', result); // 調試用
          // 獎品翻轉
          setTimeout(() => {
            setFlipped(true);
            console.log('Card flipped:', true); // 調試用
          }, 600);
        }, 600);
      }, 500);
    }
  }, [opened]);

  return (
    <main className="gacha-main">
      <div className="gacha-area">
        {/* 卡包選擇區域 */}
        {!opened && (
          <div className="pack-scroll">
            <div className={`orbit-container ${selectedPack !== null ? 'paused' : ''}`}>
              {PACKS.map((pack, idx) => (
                <div
                  key={pack}
                  className={`card-pack${selectedPack === idx ? " selected" : ""}${selectedPack === idx && isDragging ? " dragging" : ""}`}
                  onClick={() => handlePackClick(idx)}
                  onMouseDown={(e) => handleDragStart(e, idx)}
                  onTouchStart={(e) => handleDragStart(e, idx)}
                  style={{
                    animationDelay: `${idx * -1.6}s`,
                    animationPlayState: selectedPack !== null ? 'paused' : 'running',
                    '--drag-y': `${dragY}px`,
                    zIndex: selectedPack === idx && isDragging ? 10 : 2
                  } as React.CSSProperties}
                >
                  {pack}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* 爆光動畫 */}
        {showExplosion && <div className="explosion" />}
        {/* 獎品展示區 */}
        {showPrize && (
          <div className="prize-area">
            <h2 className="prize-title">🎉 恭喜獲得 🎉</h2>
            <div className="card-list">
              <div
                className={`card-item ${flipped ? "flipped" : ""} ${prize.includes("點") ? "rare" : ""}`}
              >
                <div className="card-inner">
                  <div className="card-face card-back">🎁</div>
                  <div className="card-face card-front">{prize}</div>
                </div>
              </div>
            </div>
            <div className="prize-message">
              {prize.includes("點") ? "🌟 太棒了！獲得珍貴獎勵！🌟" : "💪 再接再厲，下次一定更好！💪"}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
