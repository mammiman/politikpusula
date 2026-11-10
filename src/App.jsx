import React, { useState } from 'react';
import { 
  Download, 
  RotateCcw, 
  FileSpreadsheet, 
  Sparkles, 
  Upload, 
  HelpCircle,
  Sliders
} from 'lucide-react';
import { toPng } from 'html-to-image';
import download from 'downloadjs';

import CompassGrid from './CompassGrid';
import CellEditor from './CellEditor';
import { createInitialGrid, DEMO_PRESET_4X4 } from './constants';

export default function App() {
  const [gridRows, setGridRows] = useState(4);
  const [gridCols, setGridCols] = useState(4);
  const [cells, setCells] = useState(() => createInitialGrid(4, 4));
  const [selectedCellId, setSelectedCellId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [boardTitle, setBoardTitle] = useState('POLİTİK PUSULA');

  const selectedCell = cells.find(c => c.id === selectedCellId) || null;

  const handleSelectCell = (cell) => {
    setSelectedCellId(cell.id);
  };

  const handleUpdateCell = (updatedCell) => {
    setCells(prev =>
      prev.map(c => (c.id === updatedCell.id ? updatedCell : c))
    );
  };

  // Satır veya Sütun değiştiğinde hücreleri koruyarak güncelle
  const applyGridDimensions = (newRows, newCols) => {
    const validRows = Math.max(1, Math.min(10, parseInt(newRows) || 4));
    const validCols = Math.max(1, Math.min(10, parseInt(newCols) || 4));

    setGridRows(validRows);
    setGridCols(validCols);

    setCells(prev => {
      const newGrid = [];
      for (let r = 0; r < validRows; r++) {
        for (let c = 0; c < validCols; c++) {
          const existing = prev.find(item => item.row === r && item.col === c);
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
      return newGrid;
    });

    setSelectedCellId(null);
  };

  const handlePresetSelect = (rows, cols) => {
    applyGridDimensions(rows, cols);
  };

  const handleLoadDemo = () => {
    if (confirm('Örnek 4x4 şablon yüklensin mi? Mevcut içerikleriniz değişecektir.')) {
      setGridRows(4);
      setGridCols(4);
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
    if (confirm('Tüm pusulayı temizlemek istediğinize emin misiniz?')) {
      setCells(createInitialGrid(gridRows, gridCols));
      setSelectedCellId(null);
    }
  };

  const handleExportPNG = async () => {
    const node = document.getElementById('political-compass-board');
    if (!node) return;

    try {
      setIsExporting(true);
      await new Promise(r => setTimeout(r, 150));

      const dataUrl = await toPng(node, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
      });

      download(dataUrl, `politik-pusula-${Date.now()}.png`, 'image/png');
    } catch (err) {
      console.error('Dışa aktarma hatası:', err);
      alert('Görsel oluşturulurken hata oluştu: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = () => {
    const data = {
      title: boardTitle,
      gridRows,
      gridCols,
      cells
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    download(blob, `pusula-${Date.now()}.json`, 'application/json');
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const r = parsed.gridRows || parsed.gridSize || 4;
        const c = parsed.gridCols || parsed.gridSize || 4;
        if (Array.isArray(parsed.cells)) {
          setGridRows(r);
          setGridCols(c);
          setCells(parsed.cells);
          if (parsed.title) setBoardTitle(parsed.title);
          setSelectedCellId(null);
        } else {
          alert('Geçersiz dosya formatı.');
        }
      } catch (err) {
        alert('Dosya okunamadı: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-gray-900 flex flex-col font-sans">
      {/* Beyaz Üst Bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-base tracking-tight text-gray-900">
              Politik Pusula Oluşturucu
            </span>
            <span className="text-xs text-gray-400 font-normal">
              | {gridRows}x{gridCols} Özel Boyutlu Pusula
            </span>
          </div>

          {/* Düğmeler */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleLoadDemo}
              className="text-xs font-medium px-2.5 py-1.5 rounded bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-2xs transition flex items-center gap-1.5"
            >
              <Sparkles size={13} className="text-amber-500" />
              Örnek Şablon
            </button>

            <button
              onClick={handleReset}
              className="text-xs font-medium px-2.5 py-1.5 rounded bg-white hover:bg-red-50 text-red-600 border border-gray-300 hover:border-red-300 transition flex items-center gap-1.5"
            >
              <RotateCcw size={13} />
              Sıfırla
            </button>

            <label className="text-xs font-medium px-2.5 py-1.5 rounded bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-2xs transition cursor-pointer flex items-center gap-1.5">
              <Upload size={13} />
              İçe Aktar
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>

            <button
              onClick={handleExportJSON}
              className="text-xs font-medium px-2.5 py-1.5 rounded bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-2xs transition flex items-center gap-1.5"
            >
              <FileSpreadsheet size={13} />
              JSON
            </button>

            <button
              onClick={handleExportPNG}
              disabled={isExporting}
              className="text-xs font-semibold px-3 py-1.5 rounded bg-gray-900 hover:bg-black text-white shadow-xs transition flex items-center gap-1.5 active:scale-98 disabled:opacity-50"
            >
              <Download size={13} />
              {isExporting ? 'Kaydediliyor...' : 'PNG İndir'}
            </button>
          </div>
        </div>
      </header>

      {/* Ana Gövde */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sol Kolon: Pusula Tablosu */}
        <section className="lg:col-span-8 flex flex-col gap-3">
          {/* Grid Boyutu Kontrol Paneli */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            {/* Hızlı Önayarlar */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-medium text-gray-600 mr-1">Hızlı Boyut:</span>
              {[
                { r: 2, c: 2, label: '2x2' },
                { r: 3, c: 3, label: '3x3' },
                { r: 4, c: 4, label: '4x4' },
                { r: 5, c: 5, label: '5x5' },
                { r: 6, c: 6, label: '6x6' },
                { r: 8, c: 8, label: '8x8' },
              ].map(preset => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetSelect(preset.r, preset.c)}
                  className={`px-2 py-1 text-xs font-semibold rounded border transition ${
                    gridRows === preset.r && gridCols === preset.c
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Özel Satır x Sütun Seçimi */}
            <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
              <span className="text-xs font-medium text-gray-600">Özel:</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={gridRows}
                  onChange={(e) => applyGridDimensions(e.target.value, gridCols)}
                  className="w-12 bg-white border border-gray-300 rounded px-1.5 py-1 text-xs text-center font-bold text-gray-900 focus:outline-none focus:border-gray-500"
                  title="Satır sayısı"
                />
                <span className="text-xs text-gray-400 font-bold">×</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={gridCols}
                  onChange={(e) => applyGridDimensions(gridRows, e.target.value)}
                  className="w-12 bg-white border border-gray-300 rounded px-1.5 py-1 text-xs text-center font-bold text-gray-900 focus:outline-none focus:border-gray-500"
                  title="Sütun sayısı"
                />
              </div>
            </div>

            {/* Başlık Alanı */}
            <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-xs">
              <input
                type="text"
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                placeholder="Pusula Başlığı..."
                className="w-full bg-white border border-gray-300 rounded px-2.5 py-1 text-xs text-gray-900 focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>

          {/* Pusula Başlığı */}
          {boardTitle && (
            <div className="text-center pt-1">
              <h2 className="text-lg md:text-xl font-bold uppercase tracking-wide text-gray-900">
                {boardTitle}
              </h2>
            </div>
          )}

          {/* Tablo Çerçevesi */}
          <div className="relative bg-white border border-gray-200 rounded-lg p-3 sm:p-5 flex flex-col items-center justify-center shadow-2xs">
            <div className="mb-1.5 text-xs font-bold tracking-wider text-red-700 uppercase select-none">
              ▲ OTORİTER (AUTHORITARIAN)
            </div>

            <div className="relative w-full flex items-center justify-center">
              <div className="absolute -left-3 sm:-left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] sm:text-xs font-bold tracking-wider text-red-700 uppercase select-none origin-center pointer-events-none">
                ◄ SOL
              </div>

              {/* Pusula Tablosu */}
              <CompassGrid
                gridRows={gridRows}
                gridCols={gridCols}
                cells={cells}
                selectedCellId={selectedCellId}
                onSelectCell={handleSelectCell}
                isExporting={isExporting}
              />

              <div className="absolute -right-3 sm:-right-1 top-1/2 -translate-y-1/2 rotate-90 text-[10px] sm:text-xs font-bold tracking-wider text-blue-700 uppercase select-none origin-center pointer-events-none">
                SAĞ ►
              </div>
            </div>

            <div className="mt-1.5 text-xs font-bold tracking-wider text-emerald-700 uppercase select-none">
              ▼ ÖZGÜRLÜKÇÜ (LIBERTARIAN)
            </div>
          </div>

          <div className="text-xs text-gray-500 flex items-center gap-1.5 px-1">
            <HelpCircle size={14} className="text-gray-400 shrink-0" />
            <span>İstediğiniz ızgara boyutunu (2x2, 3x3, 4x4, 5x5, 6x6, 8x8 veya özel satır x sütun) seçebilirsiniz. Hücrelerdeki verileriniz korunur.</span>
          </div>
        </section>

        {/* Sağ Kolon: Editör */}
        <section className="lg:col-span-4 sticky top-16 flex flex-col gap-3">
          <CellEditor
            cell={selectedCell}
            gridRows={gridRows}
            gridCols={gridCols}
            onUpdateCell={handleUpdateCell}
            onClose={() => setSelectedCellId(null)}
          />

          {/* Renk Çeyrekleri Bilgisi */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs space-y-1.5 shadow-2xs">
            <div className="font-semibold text-gray-700 mb-1">Pusula Bölgeleri:</div>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="p-1.5 rounded border border-red-200 bg-red-50 text-red-900">
                <span className="font-bold block">Kırmızı</span> Otoriter Sol
              </div>
              <div className="p-1.5 rounded border border-blue-200 bg-blue-50 text-blue-900">
                <span className="font-bold block">Mavi</span> Otoriter Sağ
              </div>
              <div className="p-1.5 rounded border border-green-200 bg-green-50 text-green-900">
                <span className="font-bold block">Yeşil</span> Özgürlükçü Sol
              </div>
              <div className="p-1.5 rounded border border-yellow-200 bg-yellow-50 text-yellow-900">
                <span className="font-bold block">Sarı</span> Özgürlükçü Sağ
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-gray-200 bg-white py-3 text-center text-xs text-gray-500">
        Politik Pusula Oluşturucu
      </footer>
    </div>
  );
}
