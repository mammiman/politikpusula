import React, { useRef } from 'react';
import { Upload, X, Plus, Trash2 } from 'lucide-react';
import { getQuadrantColor } from './constants';

export default function CompassGrid({
  gridSize,
  cells,
  onSelectCell,
  selectedCellId,
  isExporting = false
}) {
  const getCellData = (r, c) => {
    return cells.find(cell => cell.row === r && cell.col === c) || {
      id: `cell-${r}-${c}`,
      row: r,
      col: c,
      title: '',
      image: null,
      traits: []
    };
  };

  // Dinamik grid-template-columns
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
    aspectRatio: '1 / 1',
    width: '100%',
    maxWidth: isExporting ? '1200px' : '900px',
    margin: '0 auto',
    backgroundColor: '#000000',
    gap: '2px', // Ayrım çizgileri
    border: '3px solid #000000',
  };

  return (
    <div className="relative w-full flex items-center justify-center p-2 select-none">
      <div id="political-compass-board" style={gridStyle} className="shadow-2xl overflow-hidden rounded-sm">
        {Array.from({ length: gridSize }).map((_, r) =>
          Array.from({ length: gridSize }).map((_, c) => {
            const cell = getCellData(r, c);
            const quadrant = getQuadrantColor(r, c, gridSize, gridSize);
            const isSelected = selectedCellId === cell.id;

            // Pusulanın orta eksen çizgilerini daha kalın/belirgin yap
            const isCenterHoriz = r === gridSize / 2 - 1;
            const isCenterVert = c === gridSize / 2 - 1;

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => !isExporting && onSelectCell(cell)}
                style={{
                  backgroundColor: quadrant.bg,
                }}
                className={`relative flex flex-col justify-between p-2.5 transition-all duration-150 cursor-pointer overflow-hidden ${
                  isSelected && !isExporting
                    ? 'ring-4 ring-indigo-600 ring-inset z-10 scale-[0.99] shadow-lg'
                    : 'hover:brightness-95'
                }`}
              >
                {/* Orta eksen çizgisi vurgusu */}
                {isCenterHoriz && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/40 pointer-events-none" />
                )}
                {isCenterVert && (
                  <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-black/40 pointer-events-none" />
                )}

                {/* Üst Kısım: Fotoğraf (Sol) + Başlık (Sağ) */}
                <div className="flex items-start gap-2 min-h-[70px]">
                  {/* Fotoğraf Kutusu */}
                  <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-black/10 rounded overflow-hidden border border-black/30 shadow-sm flex items-center justify-center">
                    {cell.image ? (
                      <img
                        src={cell.image}
                        alt={cell.title || 'Karakter'}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-black/40 text-[10px] p-1 text-center">
                        <Upload size={16} className="mb-0.5 opacity-60" />
                        <span>Resim</span>
                      </div>
                    )}
                  </div>

                  {/* Başlık (Vurucu, kalın, meme stili) */}
                  <div className="flex-1 min-w-0 flex items-center">
                    <h3
                      className="font-extrabold text-black leading-tight tracking-tight break-words"
                      style={{
                        fontSize: gridSize > 4 ? '11px' : 'clamp(12px, 1.4vw, 19px)',
                        fontFamily: "'Impact', 'Arial Black', -apple-system, sans-serif"
                      }}
                    >
                      {cell.title || (
                        <span className="text-black/30 italic font-normal text-xs">
                          {isExporting ? '' : 'Karakter İsmi...'}
                        </span>
                      )}
                    </h3>
                  </div>
                </div>

                {/* Alt Kısım: Özellik Maddeleri (- item1 \n - item2) */}
                <div className="mt-2 flex-1 flex flex-col justify-start">
                  <div className="space-y-0.5">
                    {cell.traits && cell.traits.length > 0 ? (
                      cell.traits.filter(Boolean).map((trait, idx) => (
                        <div
                          key={idx}
                          className="font-bold text-black leading-tight flex items-start gap-1"
                          style={{
                            fontSize: gridSize > 4 ? '10px' : 'clamp(11px, 1.15vw, 14px)',
                            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                          }}
                        >
                          <span className="select-none font-black text-black shrink-0">-</span>
                          <span className="break-words">{trait}</span>
                        </div>
                      ))
                    ) : (
                      !isExporting && (
                        <div className="text-black/30 text-[11px] italic">
                          - Özellikler ekleyin...
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Hücre Koordinat Belirteci (Köşede hafif) */}
                {!isExporting && (
                  <div className="absolute bottom-0.5 right-1 text-[9px] font-mono text-black/25">
                    [{r},{c}]
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
