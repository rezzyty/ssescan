/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Camera, Upload, Sparkles, Copy, Trash2, CheckCircle, AlertCircle, 
  Search, Building2, Layers, DollarSign, Calendar, ArrowUpDown, 
  ExternalLink, ShieldCheck, Database, RefreshCw, X, Terminal, Cpu
} from 'lucide-react';
import { OFFICIAL_ESTATES, SAMPLE_FLAT_DATABASE, FlatRecord } from './data/flatDatabase';

interface ExtractedFlat {
  flat: string;
  displayTime: string;
  isoTime: string;
  saleableArea?: string;
  price?: string;
}

export default function App() {
  const [currentImages, setCurrentImages] = useState<{ data: string; mimeType: string }[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [flatsData, setFlatsData] = useState<ExtractedFlat[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'extractor' | 'database'>('extractor');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEstateFilter, setSelectedEstateFilter] = useState('ALL');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('flatsData_cyber_v2');
      if (stored) {
        setFlatsData(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load local storage", e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: { data: string; mimeType: string }[] = [];
    let processed = 0;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        processed++;
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push({
            data: event.target.result as string,
            mimeType: file.type
          });
        }
        processed++;
        if (processed === files.length) {
          setCurrentImages(prev => [...prev, ...newImages]);
          showToast(`已載入 ${newImages.length} 張光學圖像`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setCurrentImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleExtract = async () => {
    if (currentImages.length === 0) {
      showToast('請先上傳或拍攝最少一張圖片');
      return;
    }

    setIsExtracting(true);
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: currentImages })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '提取失敗');
      }

      if (data.flats && Array.isArray(data.flats)) {
        let addedCount = 0;
        const updated = [...flatsData];

        data.flats.forEach((item: ExtractedFlat) => {
          const normNew = item.flat.replace(/\s/g, '').toLowerCase();
          const exists = updated.some(f => f.flat.replace(/\s/g, '').toLowerCase() === normNew);
          if (!exists) {
            updated.push(item);
            addedCount++;
          }
        });

        updated.sort((a, b) => new Date(a.isoTime).getTime() - new Date(b.isoTime).getTime());

        setFlatsData(updated);
        localStorage.setItem('flatsData_cyber_v2', JSON.stringify(updated));
        showToast(`AI 光學識別完成！成功新增 ${addedCount} 個單位`);
      }
    } catch (err: any) {
      console.error(err);
      showToast(`錯誤: ${err.message || 'AI 識別異常'}`);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleClear = () => {
    if (flatsData.length === 0) return;
    setFlatsData([]);
    localStorage.removeItem('flatsData_cyber_v2');
    showToast('已清空提取終端');
  };

  const generateFormattedText = () => {
    if (flatsData.length === 0) return '';
    let text = '⚡ CYBER 揀樓結果清單 ⚡\n\n';
    flatsData.forEach((item, idx) => {
      text += `${idx + 1}. ${item.flat} (${item.displayTime})`;
      if (item.price) text += ` - HKD $${item.price}`;
      text += '\n';
    });
    return text;
  };

  const handleCopy = () => {
    const text = generateFormattedText();
    if (!text) {
      showToast('沒有可複製的內容');
      return;
    }
    navigator.clipboard.writeText(text);
    showToast('已複製高亮文字到剪貼板！');
  };

  const filteredFlats = flatsData.filter(item => {
    if (selectedEstateFilter !== 'ALL' && !item.flat.includes(selectedEstateFilter)) {
      return false;
    }
    if (searchQuery && !item.flat.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const filteredDatabase = SAMPLE_FLAT_DATABASE.filter(record => {
    if (selectedEstateFilter !== 'ALL' && !record.estate.includes(selectedEstateFilter)) {
      return false;
    }
    if (searchQuery && !Object.values(record).some(val => String(val).toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen text-slate-900 flex flex-col font-sans selection:bg-cyan-500 selection:text-white relative overflow-x-hidden">
      
      {/* Glowing Cyber Header */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-white/80 border-b border-cyan-500/30 shadow-[0_4px_30px_rgba(6,182,212,0.15)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] text-white font-bold text-2{-xl} border border-white/60">
              <Cpu className="w-6 h-6 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white animate-ping"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300 font-bold">
                  CYBER AI VISION V3.2
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                  ONLINE
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-cyan-700 to-blue-700">
                揀樓結果提取工具
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-cyan-500/30 shadow-inner">
            <button
              onClick={() => setActiveTab('extractor')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'extractor' 
                  ? 'cyber-button text-white shadow-lg' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              智能光學掃描
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'database' 
                  ? 'cyber-button text-white shadow-lg' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Database className="w-4 h-4 text-cyan-200" />
              官方樓盤資料庫 ({SAMPLE_FLAT_DATABASE.length}+)
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 flex-grow flex flex-col gap-6 relative z-10">
        


        {activeTab === 'extractor' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Upload and Scanner */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="cyber-card p-6 sm:p-7 rounded-3xl flex flex-col gap-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"></div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-sm border border-cyan-300 shadow-sm">01</span>
                    <h2 className="text-base font-black text-slate-900">高解像度光學上傳</h2>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-700 bg-cyan-100 px-2.5 py-1 rounded-full font-bold border border-cyan-300">NEON SCANNER</span>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <label className="cursor-pointer cyber-button text-white p-4.5 rounded-2xl flex flex-col items-center justify-center gap-2 text-center group shadow-lg">
                    <Upload className="w-6 h-6 group-hover:scale-110 transition-transform text-cyan-200" />
                    <span className="text-sm font-bold tracking-wide">上傳截圖</span>
                    <span className="text-[10px] text-cyan-100 font-medium opacity-90">支援批次多圖</span>
                    <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                  </label>

                  <label className="cursor-pointer bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white p-4.5 rounded-2xl flex flex-col items-center justify-center gap-2 text-center group shadow-lg shadow-blue-500/25">
                    <Camera className="w-6 h-6 group-hover:scale-110 transition-transform text-blue-200" />
                    <span className="text-sm font-bold tracking-wide">現場拍照</span>
                    <span className="text-[10px] text-blue-100 font-medium opacity-90">實時相機捕捉</span>
                    <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>

                {currentImages.length > 0 && (
                  <div className="flex flex-col gap-3 mt-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700 px-1">
                      <span>已選光學畫面 ({currentImages.length} 張)</span>
                      <button onClick={() => setCurrentImages([])} className="text-rose-600 hover:text-rose-700 font-semibold">清除全部</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-2.5 bg-slate-100/90 rounded-2xl border border-cyan-200 shadow-inner">
                      {currentImages.map((img, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video bg-white border border-cyan-300 shadow-sm">
                          <img src={img.data} alt={`preview ${idx}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      disabled={isExtracting}
                      onClick={handleExtract}
                      className="w-full mt-2 cyber-button text-white font-black py-4 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 text-sm tracking-wide uppercase"
                    >
                      {isExtracting ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin text-cyan-200" />
                          <span>AI 正在進行高頻光學識別與校正...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 text-cyan-200 animate-pulse" />
                          <span>啟動 Cyber AI 提取名單</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Status & Tech Info */}
              <div className="cyber-card p-5 rounded-3xl flex flex-col gap-3 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2 text-cyan-700 font-black">
                  <Terminal className="w-4 h-4" />
                  <span>核心數據處理機制</span>
                </div>
                <p className="leading-relaxed text-slate-600">
                  系統透過 Gemini AI Vision 提取所有屋苑、座數、樓層與單位號碼，自動轉換中文命名，並比對官方數據庫進行時間軸嚴格順序排序。
                </p>
              </div>
            </div>

            {/* Right: Extracted Results Terminal */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="cyber-card p-6 sm:p-7 rounded-3xl flex flex-col h-full min-h-[500px] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-300 shadow-sm">02</span>
                    <div>
                      <h2 className="text-base font-black text-slate-900">提取結果高光終端</h2>
                      <p className="text-xs text-slate-600 font-medium">實時已提取單位 ({filteredFlats.length} 筆)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all border border-cyan-300 shadow-sm hover:shadow"
                    >
                      <Copy className="w-4 h-4 text-cyan-600" />
                      <span>複製結果</span>
                    </button>
                    <button
                      onClick={handleClear}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all border border-rose-300 shadow-sm"
                    >
                      <Trash2 className="w-4 h-4 text-rose-600" />
                      <span>清空</span>
                    </button>
                  </div>
                </div>

                {filteredFlats.length === 0 ? (
                  <div className="flex-grow flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-cyan-300/60 rounded-2xl text-slate-500 bg-white/50">
                    <Building2 className="w-12 h-12 mb-3 text-cyan-600 opacity-60" />
                    <p className="text-sm font-bold text-slate-700">尚未接收到光學提取數據</p>
                    <p className="text-xs text-slate-500 mt-1">請上傳圖片以啟動 AI 智能識別</p>
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col gap-2.5 overflow-y-auto max-h-[560px] pr-1">
                    {filteredFlats.map((item, index) => (
                      <div 
                        key={index}
                        className="bg-white/90 hover:bg-white p-4 rounded-2xl border border-cyan-200 hover:border-cyan-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all shadow-[0_4px_20px_rgba(6,182,212,0.08)]"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="w-7 h-7 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-mono text-xs font-black border border-cyan-300 shadow-sm">
                            {index + 1}
                          </span>
                          <div>
                            <div className="text-sm font-black text-slate-900 flex items-center gap-2.5">
                              <span className="tracking-tight">{item.flat}</span>
                              {item.price && (
                                <span className="text-xs font-mono text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-300 font-bold">
                                  HKD ${item.price}
                                </span>
                              )}
                            </div>
                            {item.saleableArea && (
                              <div className="text-xs text-slate-500 font-medium mt-0.5">
                                實用面積: {item.saleableArea}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center text-xs font-mono text-cyan-800 bg-cyan-50 px-3 py-1.5 rounded-xl border border-cyan-300 font-bold shadow-sm">
                          <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                          <span>{item.displayTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          /* Official Database Tab */
          <div className="cyber-card p-6 sm:p-7 rounded-3xl flex flex-col gap-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"></div>

            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-600" />
                  官方樓盤參考資料庫 (Official Flat Types & Reference)
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  實時收錄全港多個重點屋苑（樂嶺軒、啟陽苑、灝然、盛緻苑、影輝苑、欣雅苑、匯熙苑、曉雅苑、朗風苑、裕豐苑）官方定價與戶型明細
                </p>
              </div>

              <div className="text-xs font-mono text-cyan-800 bg-cyan-100 px-3.5 py-2 rounded-xl border border-cyan-300 font-bold shadow-sm">
                總計收錄 {SAMPLE_FLAT_DATABASE.length} 筆官方記錄
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-cyan-200 shadow-inner bg-white/80">
              <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                <thead className="bg-slate-900 text-cyan-300 uppercase tracking-wider font-mono text-[11px] border-b border-cyan-500/30">
                  <tr>
                    <th className="p-3.5 font-bold">屋苑名稱</th>
                    <th className="p-3.5 font-bold">座數 / Block</th>
                    <th className="p-3.5 font-bold">樓層 / Floor</th>
                    <th className="p-3.5 font-bold">單位 / Unit</th>
                    <th className="p-3.5 font-bold">實用面積</th>
                    <th className="p-3.5 font-bold">售價 (港元)</th>
                    <th className="p-3.5 font-bold">呎價 ($/sq.ft.)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-100">
                  {filteredDatabase.map((record, index) => (
                    <tr key={index} className="hover:bg-cyan-50/60 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">{record.estate}</td>
                      <td className="p-3.5 text-cyan-700 font-mono font-bold">{record.block}</td>
                      <td className="p-3.5 text-slate-700 font-mono font-semibold">{record.floor}</td>
                      <td className="p-3.5 text-slate-700 font-mono font-semibold">{record.unit}</td>
                      <td className="p-3.5 text-slate-700 font-mono">{record.sqft} sq.ft. ({record.sqm} m²)</td>
                      <td className="p-3.5 text-emerald-700 font-mono font-black">${record.price.toLocaleString()}</td>
                      <td className="p-3.5 text-slate-600 font-mono font-semibold">${record.perSqFt.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-cyan-300 border border-cyan-400 px-6 py-3.5 rounded-2xl shadow-[0_10px_40px_rgba(6,182,212,0.4)] z-50 text-sm font-bold flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
