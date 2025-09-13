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
  const PACKS = ["紅色卡包", "藍色卡包", "綠色卡包", "紫色卡包", "金色卡包"];

  // 點擊抽卡
  const handleOpen = () => {
    if (opened || selectedPack === null) return;
    setOpened(true);
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
      <h1 className="title">抽卡動畫示例</h1>
      <button
        className="gacha-btn"
        onClick={handleOpen}
        disabled={opened || selectedPack === null}
      >
        {opened ? "已開啟" : "抽卡"}
      </button>
      <div className="gacha-area">
        {/* 卡包選擇區域 */}
        {!opened && (
          <div className="pack-scroll">
            <div className="orbit-container">
              {PACKS.map((pack, idx) => (
                <div
                  key={pack}
                  className={`card-pack${selectedPack === idx ? " selected" : ""}`}
                  onClick={() => setSelectedPack(idx)}
                  style={{
                    animationDelay: `${idx * -1.6}s`
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
