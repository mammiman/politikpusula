import React, { useState, useRef } from 'react';
import { 
  Download, 
  RotateCcw, 
  FileSpreadsheet, 
  Sparkles, 
  Grid3X3, 
  Image as ImageIcon, 
  Share2, 
  Upload, 
  FileText,
  HelpCircle,
  Eye
} from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import download from 'downloadjs';
import confetti from 'canvas-confetti';

import CompassGrid from './CompassGrid';
import CellEditor from './CellEditor';
import { createInitialGrid, DEMO_PRESET_4X4 } from './constants';

export default function App() {
  const [gridSize, setGridSize] = useState(4); // 2, 4, 6
  const [cells, setCells] = useState(() => createInitialGrid(4));
  const [selectedCellId, setSelectedCellId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [boardTitle, setBoardTitle] = useState('POLİTİK PUSULA');
  const [compassTheme, setCompassTheme] = useState('classic'); // classic vs custom

  const selectedCell = cells.find(c => c.id === selectedCellId) || null;

  const handleSelectCell = (cell) => {
    setSelectedCellId(cell.id);
  };

  const handleUpdateCell = (updatedCell) => {
    setCells(prev =>
      prev.map(c => (c.id === updatedCell.id ? updatedCell : c))
    );
  };

  const handleGridSizeChange = (newSize) => {
    if (newSize === gridSize) return;
    if (confirm(`${newSize}x${newSize} boyutuna geçmek istiyor musunuz? Mevcut hücreler yeniden konumlandırılacak.`)) {
      setGridSize(newSize);
      // Yeni boyut için hücreleri oluştur, var olanları koru
      const newGrid = [];
      for (let r = 0; r < newSize; r++) {
        for (let c = 0; c < newSize; c++) {
          const existing = cells.find(item => item.row === r && item.col === c);
          if (existing) {
            newGrid.push(existing);
          } else {
            newGrid.push({
              id: `cell-${r}-${c}`,
              row: r,
              col: c,
              title: '',
              image: null,
              traits: ['']
            });
          }
        }
      }
      setCells(newGrid);
      setSelectedCellId(null);
    }
  };

  const handleLoadDemo = () => {
    if (confirm('Örnek şablon yüklensin mi? Mevcut içerikleriniz değişecektir.')) {
      setGridSize(4);
      const demoCells = [];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const match = DEMO_PRESET_4X4.find(p => p.row === r && p.col === c);
          demoCells.push({
            id: `cell-${r}-${c}`,
            row: r,
            col: c,
            title: match ? match.title : '',
            image: match ? match.image : null,
            traits: match ? match.traits : ['']
          });
        }
      }
      setCells(demoCells);
      setSelectedCellId(demoCells[0].id);
      setBoardTitle('DİZİ KARAKTERLERİ POLİTİK PUSULA');
    }
  };

  const handleReset = () => {
    if (confirm('Tüm pusulayı sıfırlamak istediğinize emin misiniz?')) {
      setCells(createInitialGrid(gridSize));
      setSelectedCellId(null);
    }
  };

  const handleExportPNG = async () => {
    const node = document.getElementById('political-compass-board');
    if (!node) return;

    try {
      setIsExporting(true);
      // Kısa bir bekleme render tamamlansın
      await new Promise(r => setTimeout(r, 150));

      const dataUrl = await toPng(node, {
        quality: 1.0,
        pixelRatio: 2, // Yüksek çözünürlük / HD kalite
        cacheBust: true,
      });

      download(dataUrl, `politik-pusula-${Date.now()}.png`, 'image/png');
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      console.error('Dışa aktarma hatası:', err);
      alert('Görsel oluşturulurken bir hata meydana geldi: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  // JSON olarak kaydet ve yükle
  const handleExportJSON = () => {
    const data = {
      title: boardTitle,
      gridSize,
      cells
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    download(blob, `pusula-proje-${Date.now()}.json`, 'application/json');
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.gridSize && Array.isArray(parsed.cells)) {
          setGridSize(parsed.gridSize);
          setCells(parsed.cells);
          if (parsed.title) setBoardTitle(parsed.title);
          setSelectedCellId(null);
          alert('Proje başarıyla yüklendi!');
        } else {
          alert('Geçersiz dosya formatı.');
        }
      } catch (err) {
        alert('Dosya okunurken hata: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Üst Navigasyon Çubuğu */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-red-500 via-blue-500 to-amber-400 p-[2px] shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center font-black text-sm tracking-tighter">
                PC
              </div>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Politik Pusula Oluşturucu
                <span className="text-[10px] bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                  Meme Compass
                </span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Wojak & Meme tarzı 4x4, 2x2 veya 6x6 politik pusula hazırlayın ve HD indirin
              </p>
            </div>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleLoadDemo}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
            >
              <Sparkles size={14} className="text-amber-400" />
              Örnek Şablonu Yükle
            </button>

            <button
              onClick={handleReset}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-red-400 border border-slate-700 transition flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              Sıfırla
            </button>

            <label className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer flex items-center gap-1.5">
              <Upload size={14} />
              İçe Aktar
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>

            <button
              onClick={handleExportJSON}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
            >
              <FileSpreadsheet size={14} />
              JSON Kaydet
            </button>

            <button
              onClick={handleExportPNG}
              disabled={isExporting}
              className="text-xs font-bold px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <Download size={15} />
              {isExporting ? 'Oluşturuluyor...' : 'PNG İndir (HD)'}
            </button>
          </div>
        </div>
      </header>

      {/* Ana Çalışma Alanı */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sol Panel: Pusula Tablosu ve Boyut Seçici */}
        <section className="lg:col-span-8 flex flex-col gap-4">
          {/* Kontrol Şeridi */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Izgara Boyutu:</span>
              {[2, 3, 4, 6].map(size => (
                <button
                  key={size}
                  onClick={() => handleGridSizeChange(size)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                    gridSize === size
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {size}x{size}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <span className="text-xs font-semibold text-slate-400 shrink-0">Başlık:</span>
              <input
                type="text"
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                placeholder="Pusula Başlığı..."
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Pusula Başlığı (Varsa) */}
          {boardTitle && (
            <div className="text-center py-1">
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-slate-100 drop-shadow">
                {boardTitle}
              </h2>
            </div>
          )}

          {/* Eksen Etiketleri ve Izgara Konteyneri */}
          <div className="relative bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center">
            {/* Üst Etiket: Otoriter */}
            <div className="mb-2 text-xs font-black tracking-widest text-red-400 uppercase select-none flex items-center gap-1.5">
              <span>▲</span> OTORİTER (AUTHORITARIAN)
            </div>

            <div className="relative w-full flex items-center justify-center">
              {/* Sol Etiket: Sol */}
              <div className="absolute -left-2 sm:left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] sm:text-xs font-black tracking-widest text-red-400 uppercase select-none origin-center pointer-events-none">
                ◄ SOL (LEFT)
              </div>

              {/* Ana Pusula Tablosu */}
              <CompassGrid
                gridSize={gridSize}
                cells={cells}
                selectedCellId={selectedCellId}
                onSelectCell={handleSelectCell}
                isExporting={isExporting}
              />

              {/* Sağ Etiket: Sağ */}
              <div className="absolute -right-2 sm:right-0 top-1/2 -translate-y-1/2 rotate-90 text-[10px] sm:text-xs font-black tracking-widest text-blue-400 uppercase select-none origin-center pointer-events-none">
                SAĞ (RIGHT) ►
              </div>
            </div>

            {/* Alt Etiket: Özgürlükçü */}
            <div className="mt-2 text-xs font-black tracking-widest text-emerald-400 uppercase select-none flex items-center gap-1.5">
              <span>▼</span> ÖZGÜRLÜKÇÜ (LIBERTARIAN)
            </div>
          </div>

          {/* Hızlı Bilgilendirme */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-400 flex items-start gap-2.5">
            <HelpCircle size={16} className="text-indigo-400 shrink-0 mt-0.5" />
            <p>
              Tablodaki herhangi bir kutuya tıklayarak o karakterin resmini yükleyebilir, başlığını ve tire (-) ile ayrılan özellik maddelerini düzenleyebilirsiniz. Hazır olduğunda <strong>"PNG İndir (HD)"</strong> butonuna basarak yüksek kaliteli görsel elde edebilirsiniz.
            </p>
          </div>
        </section>

        {/* Sağ Panel: Hücre Editörü */}
        <section className="lg:col-span-4 sticky top-20 flex flex-col gap-4">
          <CellEditor
            cell={selectedCell}
            gridSize={gridSize}
            onUpdateCell={handleUpdateCell}
            onClose={() => setSelectedCellId(null)}
          />

          {/* Çeyrek Renk Rehberi */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
            <h4 className="font-bold text-slate-300 mb-2">Pusula Bölgeleri & Anlamları:</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded bg-red-950/40 border border-red-800/40">
                <span className="font-bold text-red-300 block">Kırmızı (Auth-Left)</span>
                <span className="text-[11px] text-slate-400">Otoriter Sol</span>
              </div>
              <div className="p-2 rounded bg-blue-950/40 border border-blue-800/40">
                <span className="font-bold text-blue-300 block">Mavi (Auth-Right)</span>
                <span className="text-[11px] text-slate-400">Otoriter Sağ</span>
              </div>
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/40">
                <span className="font-bold text-emerald-300 block">Yeşil (Lib-Left)</span>
                <span className="text-[11px] text-slate-400">Özgürlükçü Sol</span>
              </div>
              <div className="p-2 rounded bg-amber-950/40 border border-amber-800/40">
                <span className="font-bold text-amber-300 block">Sarı (Lib-Right)</span>
                <span className="text-[11px] text-slate-400">Özgürlükçü Sağ</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        Politik Pusula Oluşturucu • GitHub Pages uyumlu React uygulaması
      </footer>
    </div>
  );
}
