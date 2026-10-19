export interface FlatRecord {
  estate: string;
  block: string;
  floor: string;
  unit: string;
  sqm: number;
  sqft: number;
  price: number;
  perSqM: number;
  perSqFt: number;
}

export const ESTATE_TRANSLATIONS: Record<string, string> = {
  "SIERRA TERRACE": "樂嶺軒",
  "樂嶺軒": "樂嶺軒",
  "KAI YEUNG COURT": "啟陽苑",
  "啟陽苑": "啟陽苑",
  "HEMMA SAPPHIRE": "灝然",
  "灝然": "灝然",
  "SHING CHI COURT": "盛緻苑",
  "盛緻苑": "盛緻苑",
  "YING FAI COURT": "影輝苑",
  "影輝苑": "影輝苑",
  "WUI HEI COURT": "匯熙苑",
  "匯熙苑": "匯熙苑",
  "YAN NGA COURT": "欣雅苑",
  "欣雅苑": "欣雅苑",
  "HIU NGA COURT": "曉雅苑",
  "曉雅苑": "曉雅苑",
  "LONG FUNG COURT": "朗風苑",
  "朗風苑": "朗風苑",
  "YU FUNG COURT": "裕豐苑",
  "裕豐苑": "裕豐苑"
};

export const OFFICIAL_ESTATES = [
  "盛緻苑 Shing Chi Court",
  "影輝苑 Ying Fai Court",
  "欣雅苑 Yan Nga Court",
  "啟陽苑 Kai Yeung Court",
  "朗風苑 Long Fung Court",
  "裕豐苑 Yu Fung Court",
  "匯熙苑 Wui Hei Court",
  "曉雅苑 Hiu Nga Court",
  "樂嶺軒 Sierra Terrace",
  "灝然 Hemma Sapphire"
];

export const SAMPLE_FLAT_DATABASE: FlatRecord[] = [
  // 盛緻苑 Shing Chi Court
  { estate: "盛緻苑 Shing Chi Court", block: "A", floor: "37", unit: "1", sqm: 35.3, sqft: 380, price: 2853900, perSqM: 80847, perSqFt: 7510 },
  { estate: "盛緻苑 Shing Chi Court", block: "A", floor: "35", unit: "1", sqm: 35.3, sqft: 380, price: 2840700, perSqM: 80473, perSqFt: 7476 },
  { estate: "盛緻苑 Shing Chi Court", block: "A", floor: "33", unit: "1", sqm: 35.3, sqft: 380, price: 2827500, perSqM: 80099, perSqFt: 7441 },
  { estate: "盛緻苑 Shing Chi Court", block: "A", floor: "31", unit: "1", sqm: 35.3, sqft: 380, price: 2814300, perSqM: 79725, perSqFt: 7406 },
  { estate: "盛緻苑 Shing Chi Court", block: "B", floor: "37", unit: "1", sqm: 35.9, sqft: 386, price: 2876000, perSqM: 80111, perSqFt: 7451 },
  // 影輝苑 Ying Fai Court
  { estate: "影輝苑 Ying Fai Court", block: "A", floor: "38", unit: "1", sqm: 35.5, sqft: 382, price: 2764000, perSqM: 77859, perSqFt: 7236 },
  { estate: "影輝苑 Ying Fai Court", block: "A", floor: "30", unit: "1", sqm: 35.5, sqft: 382, price: 2728000, perSqM: 76845, perSqFt: 7141 },
  { estate: "影輝苑 Ying Fai Court", block: "A", floor: "38", unit: "2", sqm: 52.0, sqft: 560, price: 4228700, perSqM: 81321, perSqFt: 7551 },
  // 欣雅苑 Yan Nga Court
  { estate: "欣雅苑 Yan Nga Court", block: "-", floor: "50", unit: "1", sqm: 41.6, sqft: 448, price: 3217500, perSqM: 77344, perSqFt: 7182 },
  { estate: "欣雅苑 Yan Nga Court", block: "-", floor: "49", unit: "1", sqm: 41.6, sqft: 448, price: 3244600, perSqM: 77995, perSqFt: 7242 },
  // 啟陽苑 Kai Yeung Court
  { estate: "啟陽苑 Kai Yeung Court", block: "A", floor: "38", unit: "1", sqm: 44.8, sqft: 482, price: 4638100, perSqM: 103529, perSqFt: 9623 },
  { estate: "啟陽苑 Kai Yeung Court", block: "A", floor: "36", unit: "1", sqm: 44.8, sqft: 482, price: 4623700, perSqM: 103208, perSqFt: 9593 },
  // 朗風苑 Long Fung Court
  { estate: "朗風苑 Long Fung Court", block: "A", floor: "38", unit: "1", sqm: 36.4, sqft: 392, price: 2502200, perSqM: 68742, perSqFt: 6383 },
  { estate: "朗風苑 Long Fung Court", block: "A", floor: "23", unit: "1", sqm: 36.4, sqft: 392, price: 2426700, perSqM: 66668, perSqFt: 6191 },
  // 裕豐苑 Yu Fung Court
  { estate: "裕豐苑 Yu Fung Court", block: "A", floor: "14", unit: "1", sqm: 35.7, sqft: 384, price: 2292000, perSqM: 64202, perSqFt: 5969 },
  { estate: "裕豐苑 Yu Fung Court", block: "A", floor: "12", unit: "2", sqm: 35.4, sqft: 381, price: 2298500, perSqM: 64929, perSqFt: 6033 },
  // 匯熙苑 Wui Hei Court
  { estate: "匯熙苑 Wui Hei Court", block: "A", floor: "15", unit: "1", sqm: 35.7, sqft: 384, price: 2890100, perSqM: 80955, perSqFt: 7526 },
  { estate: "匯熙苑 Wui Hei Court", block: "A", floor: "8", unit: "1", sqm: 35.7, sqft: 384, price: 2816400, perSqM: 78891, perSqFt: 7334 },
  // 曉雅苑 Hiu Nga Court
  { estate: "曉雅苑 Hiu Nga Court", block: "-", floor: "37", unit: "1", sqm: 45.1, sqft: 485, price: 3374200, perSqM: 74816, perSqFt: 6957 },
  { estate: "曉雅苑 Hiu Nga Court", block: "-", floor: "36", unit: "1", sqm: 45.1, sqft: 485, price: 3418200, perSqM: 75792, perSqFt: 7048 },
  // 樂嶺軒 Sierra Terrace
  { estate: "樂嶺軒 Sierra Terrace", block: "4", floor: "A1", unit: "-", sqm: 43.0, sqft: 463, price: 3662000, perSqM: 85160, perSqFt: 7909 },
  { estate: "樂嶺軒 Sierra Terrace", block: "4", floor: "A2", unit: "-", sqm: 28.0, sqft: 305, price: 2360000, perSqM: 84285, perSqFt: 7738 },
  // 灝然 Hemma Sapphire
  { estate: "灝然 Hemma Sapphire", block: "Tower 1A", floor: "2", unit: "A", sqm: 39.457, sqft: 425, price: 3715000, perSqM: 94153, perSqFt: 8741 },
  { estate: "灝然 Hemma Sapphire", block: "Tower 1A", floor: "5", unit: "A", sqm: 39.457, sqft: 425, price: 3772000, perSqM: 95598, perSqFt: 8875 }
];
