import React from 'react';
import { Upload } from 'lucide-react';
import { getQuadrantColor } from './constants';

export default function CompassGrid({
  gridRows,
  gridCols,
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

  const maxDimension = Math.max(gridRows, gridCols);

  // Başlık uzunluğuna ve grid yoğunluğuna göre dinamik font boyutu
  const getDynamicTitleFontSize = (title = '') => {
    const len = title.trim().length;
    let baseScale = 1.0;
    if (maxDimension <= 2) baseScale = 1.5;
    else if (maxDimension === 3) baseScale = 1.25;
    else if (maxDimension === 4) baseScale = 1.0;
    else if (maxDimension <= 6) baseScale = 0.8;
    else baseScale = 0.65;

    let fontSizeRem;
    if (len <= 8) fontSizeRem = 1.05 * baseScale;
    else if (len <= 15) fontSizeRem = 0.92 * baseScale;
    else if (len <= 25) fontSizeRem = 0.8 * baseScale;
    else if (len <= 40) fontSizeRem = 0.7 * baseScale;
    else fontSizeRem = 0.6 * baseScale;

    return `clamp(${fontSizeRem * 0.75}rem, ${fontSizeRem * 1.3}cqw, ${fontSizeRem * 1.15}rem)`;
  };

  // Özellik maddeleri için dinamik font boyutu
  const getDynamicTraitsFontSize = (traits = []) => {
    const validTraits = traits.filter(Boolean);
    const count = validTraits.length;
    const totalChars = validTraits.join(' ').length;
    
    let baseScale = 1.0;
    if (maxDimension <= 2) baseScale = 1.4;
    else if (maxDimension === 3) baseScale = 1.2;
    else if (maxDimension === 4) baseScale = 0.98;
    else if (maxDimension <= 6) baseScale = 0.8;
    else baseScale = 0.65;

    let fontSizeRem;
    if (count <= 1 && totalChars < 30) fontSizeRem = 0.85 * baseScale;
    else if (count <= 2 && totalChars < 60) fontSizeRem = 0.77 * baseScale;
    else if (count <= 3 && totalChars < 100) fontSizeRem = 0.69 * baseScale;
    else if (totalChars < 150) fontSizeRem = 0.61 * baseScale;
    else fontSizeRem = 0.52 * baseScale;

    return `clamp(${fontSizeRem * 0.72}rem, ${fontSizeRem * 1.15}cqw, ${fontSizeRem}rem)`;
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
    aspectRatio: `${gridCols} / ${gridRows}`,
    width: '100%',
    maxWidth: isExporting ? '1300px' : '980px',
    margin: '0 auto',
    backgroundColor: '#000000',
    gap: '2px',
    border: '3px solid #000000',
  };

  return (
    <div className="relative w-full flex items-center justify-center p-1 sm:p-2 select-none">
      <div id="political-compass-board" style={gridStyle} className="shadow-2xl overflow-hidden rounded-sm relative">
        {Array.from({ length: gridRows }).map((_, r) =>
          Array.from({ length: gridCols }).map((_, c) => {
            const cell = getCellData(r, c);
            const quadrant = getQuadrantColor(r, c, gridRows, gridCols);
            const isSelected = selectedCellId === cell.id;

            // Eksen çizgisi tam ortadaysa belirgin yap
            const isCenterHoriz = gridRows % 2 === 0 ? r === gridRows / 2 - 1 : false;
            const isCenterVert = gridCols % 2 === 0 ? c === gridCols / 2 - 1 : false;

            const titleFontSize = getDynamicTitleFontSize(cell.title || '');
            const traitFontSize = getDynamicTraitsFontSize(cell.traits || []);

            const imgBoxSize =
              maxDimension <= 2
                ? 'w-24 h-24 sm:w-32 sm:h-32'
                : maxDimension === 3
                ? 'w-18 h-18 sm:w-24 sm:h-24'
                : maxDimension === 4
                ? 'w-14 h-14 sm:w-20 sm:h-20'
                : maxDimension <= 6
                ? 'w-10 h-10 sm:w-14 sm:h-14'
                : 'w-8 h-8 sm:w-11 sm:h-11';

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => !isExporting && onSelectCell(cell)}
                style={{
                  backgroundColor: quadrant.bg,
                }}
                className={`relative flex flex-col justify-between p-2 sm:p-2.5 transition-all duration-150 cursor-pointer overflow-hidden ${
                  isSelected && !isExporting
                    ? 'ring-4 ring-indigo-600 ring-inset z-10 scale-[0.99] shadow-lg'
                    : 'hover:brightness-95'
                }`}
              >
                <div className="absolute inset-0 pointer-events-none compass-noise-overlay opacity-30" />

                {/* Eksen çizgileri */}
                {isCenterHoriz && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/50 pointer-events-none z-10" />
                )}
                {isCenterVert && (
                  <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-black/50 pointer-events-none z-10" />
                )}

                {/* Üst Kısım: Fotoğraf (Sol) + Dinamik Başlık (Sağ) */}
                <div className="flex items-start gap-1.5 sm:gap-2 z-10">
                  <div className={`relative shrink-0 ${imgBoxSize} bg-black/10 rounded overflow-hidden border border-black/35 shadow-sm flex items-center justify-center`}>
                    {cell.image ? (
                      <img
                        src={cell.image}
                        alt={cell.title || 'Karakter'}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-black/40 text-[9px] sm:text-[10px] p-1 text-center">
                        <Upload size={14} className="mb-0.5 opacity-60" />
                        <span>Resim</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex items-center py-0.5">
                    <h3
                      className="meme-font-title break-words"
                      style={{
                        fontSize: titleFontSize,
                        lineHeight: 1.08,
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

                {/* Alt Kısım: Özellik Maddeleri */}
                <div className="mt-1.5 sm:mt-2 flex-1 flex flex-col justify-start overflow-hidden z-10">
                  <div className="space-y-0.5">
                    {cell.traits && cell.traits.length > 0 ? (
                      cell.traits.filter(Boolean).map((trait, idx) => (
                        <div
                          key={idx}
                          className="meme-font-body flex items-start gap-1"
                          style={{
                            fontSize: traitFontSize,
                            lineHeight: 1.16,
                          }}
                        >
                          <span className="select-none font-black text-black shrink-0">-</span>
                          <span className="break-words">{trait}</span>
                        </div>
                      ))
                    ) : (
                      !isExporting && (
                        <div className="text-black/30 text-[10px] italic">
                          - Özellikler ekleyin...
                        </div>
                      )
                    )}
                  </div>
                </div>

                {!isExporting && (
                  <div className="absolute bottom-0.5 right-1 text-[8px] font-mono text-black/25 z-10">
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
