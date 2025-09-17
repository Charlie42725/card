# 抽獎盒子組件

這是一個可重用的抽獎盒子組件，使用 Tailwind CSS 和 React + TypeScript 構建。

## 功能特點

- 🎁 **可愛的 3D 旋轉盒子**：5個不同主題的盒子在軌道上旋轉
- 🎯 **拖拽交互**：往上拖拽超過閾值觸發抽獎
- ✨ **爆炸動畫**：開獎時的視覺特效
- 🎪 **獎品翻牌**：3D 翻轉顯示獎品
- 📱 **響應式設計**：支持觸摸和鼠標操作

## 使用方式

```tsx
import { LotteryBox } from '@/components/lottery';

function App() {
  const handlePrizeWon = (prize: string) => {
    console.log('獲得獎品:', prize);
    // 處理獎品邏輯
  };

  return (
    <LotteryBox 
      onPrizeWon={handlePrizeWon}
      dragThreshold={100}
      packs={["自定義盒子1", "自定義盒子2", "自定義盒子3"]}
    />
  );
}
```

## 組件架構

```
components/lottery/
├── LotteryBox.tsx          # 主組件
├── OrbitContainer.tsx      # 3D 軌道容器
├── PrizeCard.tsx          # 獎品卡片
├── ExplosionEffect.tsx    # 爆炸特效
├── utils.ts               # 工具函數
└── index.ts               # 導出文件
```

## Props

### LotteryBoxProps

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `packs` | `string[]` | `["彩虹盒子", "星星盒子", ...]` | 盒子名稱陣列 |
| `dragThreshold` | `number` | `100` | 觸發抽獎的拖拽距離 |
| `onPrizeWon` | `(prize: string) => void` | - | 獲得獎品時的回調 |

## 自定義樣式

組件使用 Tailwind CSS，可以通過以下方式自定義：

1. **修改主題顏色**：在 `tailwind.config.js` 中調整色彩
2. **調整動畫**：修改各組件中的 Tailwind 動畫類
3. **自定義獎品邏輯**：修改 `utils.ts` 中的 `getRandomPrize` 函數

## 技術棧

- ⚛️ React 18 + TypeScript
- 🎨 Tailwind CSS
- 🎯 Next.js 15
- 📱 Touch/Mouse 事件處理
- 🎪 CSS 3D 變換動畫
