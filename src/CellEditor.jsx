import React, { useRef } from 'react';
import { Upload, Trash2, Plus, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { getQuadrantColor } from './constants';

export default function CellEditor({
  cell,
  gridSize,
  onUpdateCell,
  onClose
}) {
  const fileInputRef = useRef(null);

  if (!cell) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-400">
        <Sparkles className="mx-auto mb-3 opacity-50" size={32} />
        <h4 className="font-semibold text-slate-200 mb-1">Hücre Seçilmedi</h4>
        <p className="text-xs text-slate-400">
          Düzenlemek istediğiniz karakter kutusuna pusula tablosundan tıklayın.
        </p>
      </div>
    );
  }

  const quadrant = getQuadrantColor(cell.row, cell.col, gridSize, gridSize);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        onUpdateCell({ ...cell, image: loadEvent.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTrait = () => {
    onUpdateCell({
      ...cell,
      traits: [...(cell.traits || []), '']
    });
  };

  const handleUpdateTrait = (index, value) => {
    const newTraits = [...(cell.traits || [])];
    newTraits[index] = value;
    onUpdateCell({ ...cell, traits: newTraits });
  };

  const handleRemoveTrait = (index) => {
    const newTraits = (cell.traits || []).filter((_, i) => i !== index);
    onUpdateCell({ ...cell, traits: newTraits });
  };

  const handleClearCell = () => {
    onUpdateCell({
      ...cell,
      title: '',
      image: null,
      traits: ['']
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full border border-black/20"
            style={{ backgroundColor: quadrant.bg }}
          />
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              Karakter Düzenle
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                [{cell.row + 1}, {cell.col + 1}]
              </span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              {quadrant.name}
            </span>
          </div>
        </div>

        <button
          onClick={handleClearCell}
          className="text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 px-2 py-1 rounded transition flex items-center gap-1"
          title="Kutuyu Temizle"
        >
          <Trash2 size={13} /> Temizle
        </button>
      </div>

      {/* Resim Yükleme & Başlık */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Karakter / Kişi Görseli
          </label>
          <div className="flex items-center gap-3">
            <div className="relative w-20 h-20 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
              {cell.image ? (
                <>
                  <img
                    src={cell.image}
                    alt="Önizleme"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => onUpdateCell({ ...cell, image: null })}
                    className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full text-xs transition"
                  >
                    <X size={12} />
                  </button>
                </>
              ) : (
                <ImageIcon className="text-slate-600" size={24} />
              )}
            </div>

            <div className="flex-1 space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <Upload size={14} /> Bilgisayardan Fotoğraf Yükle
              </button>
              <input
                type="text"
                placeholder="Veya Görsel URL'si yapıştır..."
                value={cell.image?.startsWith('data:') ? '' : (cell.image || '')}
                onChange={(e) => onUpdateCell({ ...cell, image: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Karakter Başlığı */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Karakter İsmi / Unvanı
          </label>
          <input
            type="text"
            placeholder="Örn: cezaevi müdürü, Garibin bacısı..."
            value={cell.title || ''}
            onChange={(e) => onUpdateCell({ ...cell, title: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-semibold"
          />
        </div>
      </div>

      {/* Maddeler / Özellikler */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">
            Özellikler / Maddeler (Meme açıklamaları)
          </label>
          <button
            type="button"
            onClick={handleAddTrait}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            <Plus size={13} /> Madde Ekle
          </button>
        </div>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {(!cell.traits || cell.traits.length === 0) ? (
            <p className="text-xs text-slate-500 italic py-2 text-center">
              Henüz madde eklenmedi. "Madde Ekle"ye basarak yazmaya başlayın.
            </p>
          ) : (
            cell.traits.map((trait, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="text-slate-500 text-sm font-bold select-none">-</span>
                <input
                  type="text"
                  placeholder="Madde metni..."
                  value={trait}
                  onChange={(e) => handleUpdateTrait(idx, e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTrait(idx)}
                  className="text-slate-500 hover:text-red-400 p-1 rounded"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
