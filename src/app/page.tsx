"use client";
import React, { useState, useEffect } from "react";

const CARD_COUNT = 5;
const CARD_TYPES = ["普通卡", "稀有卡"];

function getRandomCards(count: number): string[] {
  // 至少一張稀有卡
  const cards = Array(count).fill("普通卡");
  const rareIndex = Math.floor(Math.random() * count);
  cards[rareIndex] = "稀有卡";
  // 其餘隨機
  for (let i = 0; i < count; i++) {
    if (i !== rareIndex) {
      cards[i] = Math.random() < 0.2 ? "稀有卡" : "普通卡";
    }
  }
  return cards;
}

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [cards, setCards] = useState<string[]>([]);
  const [showCards, setShowCards] = useState(false);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [selectedPack, setSelectedPack] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [startY, setStartY] = useState(0);
  const PACKS = ["代數卡包", "幾何卡包", "機率卡包", "微積分卡包", "數論卡包"];

  // 開始拖拽
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (selectedPack === null || opened) return;
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartY(clientY);
    setDragY(0);
  };

  // 拖拽中
  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = startY - clientY; // 往上拖為正值
    setDragY(Math.max(0, deltaY)); // 只允許往上拖
  };

  // 結束拖拽
  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // 如果拖拽超過 100px，觸發抽卡
    if (dragY > 100) {
      setOpened(true);
    }
    
    setDragY(0);
  };

  // 點擊卡包選擇/取消選擇
  const handlePackClick = (idx: number) => {
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
        // 卡片出現
        setTimeout(() => {
          setShowCards(true);
          const result = getRandomCards(CARD_COUNT);
          setCards(result);
          // 卡片依序翻轉
          result.forEach((_, i) => {
            setTimeout(() => {
              setFlipped((prev) => [...prev, i]);
            }, 600 + i * 400);
          });
        }, 600);
      }, 500);
    }
  }, [opened]);

  return (
    <main className="gacha-main">
      <h1 className="title">數學抽卡動畫</h1>
      <div className="instruction">
        {selectedPack === null ? "點擊選擇數學卡包" : "往上拖拽卡包來抽卡！"}
      </div>
      <div className="gacha-area"
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {/* 卡包選擇區域 */}
        {!opened && (
          <div className="pack-scroll">
            <div className={`orbit-container ${selectedPack !== null ? 'paused' : ''}`}>
              {PACKS.map((pack, idx) => (
                <div
                  key={pack}
                  className={`card-pack${selectedPack === idx ? " selected" : ""}`}
                  onClick={() => handlePackClick(idx)}
                  onMouseDown={handleDragStart}
                  onTouchStart={handleDragStart}
                  style={{
                    animationDelay: `${idx * -1.6}s`,
                    transform: selectedPack === idx && isDragging ? 
                      `translateY(-${dragY}px) scale(${1 + dragY * 0.002})` : 
                      undefined,
                    transition: isDragging ? 'none' : 'transform 0.3s ease'
                  }}
                >
                  {pack}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* 爆光動畫 */}
        {showExplosion && <div className="explosion" />}
        {/* 卡片展示區 */}
        {showCards && (
          <div className="card-list">
            {cards.map((type, idx) => (
              <div
                key={idx}
                className={`card-item ${flipped.includes(idx) ? "flipped" : ""} ${type === "稀有卡" ? "rare" : ""}`}
              >
                <div className="card-face card-back">背面</div>
                <div className="card-face card-front">{type}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
