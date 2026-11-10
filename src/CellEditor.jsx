import React, { useRef } from 'react';
import { Upload, Trash2, Plus, X, Image as ImageIcon } from 'lucide-react';
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
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-500 shadow-sm">
        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
          <ImageIcon size={20} />
        </div>
        <h4 className="font-semibold text-gray-800 text-sm mb-1">Hücre Seçilmedi</h4>
        <p className="text-xs text-gray-500">
          Düzenlemek istediğiniz karakter kutusuna tablodan tıklayın.
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
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col gap-4 text-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded border border-gray-400 shrink-0"
            style={{ backgroundColor: quadrant.bg }}
          />
          <div>
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
              Hücre Düzenle
              <span className="text-[11px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 font-mono border border-gray-200">
                {cell.row + 1}, {cell.col + 1}
              </span>
            </h3>
            <span className="text-[11px] text-gray-500 font-medium">
              {quadrant.name}
            </span>
          </div>
        </div>

        <button
          onClick={handleClearCell}
          className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 px-2 py-1 rounded transition flex items-center gap-1"
          title="Kutuyu Temizle"
        >
          <Trash2 size={13} /> Temizle
        </button>
      </div>

      {/* Resim Yükleme & Başlık */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Karakter / Kişi Fotoğrafı
          </label>
          <div className="flex items-center gap-3">
            <div className="relative w-20 h-20 rounded bg-gray-50 border border-gray-300 flex items-center justify-center overflow-hidden shrink-0">
              {cell.image ? (
                <>
                  <img
                    src={cell.image}
                    alt="Önizleme"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => onUpdateCell({ ...cell, image: null })}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white p-1 rounded-full text-xs transition"
                  >
                    <X size={12} />
                  </button>
                </>
              ) : (
                <ImageIcon className="text-gray-400" size={24} />
              )}
            </div>

            <div className="flex-1 space-y-1.5">
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
                className="w-full py-1.5 px-3 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 border border-gray-300 rounded text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <Upload size={13} /> Dosyadan Fotoğraf Seç
              </button>
              <input
                type="text"
                placeholder="veya Görsel URL'si yapıştırın..."
                value={cell.image?.startsWith('data:') ? '' : (cell.image || '')}
                onChange={(e) => onUpdateCell({ ...cell, image: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded px-2.5 py-1 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Karakter Başlığı */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Karakter İsmi / Unvanı
          </label>
          <input
            type="text"
            placeholder="Örn: cezaevi müdürü, Sazcı mahkum..."
            value={cell.title || ''}
            onChange={(e) => onUpdateCell({ ...cell, title: e.target.value })}
            className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 font-semibold shadow-sm"
          />
        </div>
      </div>

      {/* Maddeler / Özellikler */}
      <div className="space-y-2 pt-1 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-700">
            Özellikler / Maddeler
          </label>
          <button
            type="button"
            onClick={handleAddTrait}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            <Plus size={13} /> Madde Ekle
          </button>
        </div>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {(!cell.traits || cell.traits.length === 0) ? (
            <p className="text-xs text-gray-400 italic py-2 text-center">
              Henüz madde yok. "Madde Ekle"ye basarak yazabilirsiniz.
            </p>
          ) : (
            cell.traits.map((trait, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="text-gray-400 text-sm font-bold select-none">-</span>
                <input
                  type="text"
                  placeholder="Madde açıklaması..."
                  value={trait}
                  onChange={(e) => handleUpdateTrait(idx, e.target.value)}
                  className="flex-1 bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTrait(idx)}
                  className="text-gray-400 hover:text-red-500 p-1 rounded transition"
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
