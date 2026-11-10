// Politik Pusula için renk tonları (AuthLeft: Kırmızı, AuthRight: Mavi, LibLeft: Yeşil, LibRight: Sarı)
export function getQuadrantColor(row, col, totalRows, totalCols) {
  const isTop = row < totalRows / 2;
  const isLeft = col < totalCols / 2;

  if (isTop && isLeft) {
    return {
      name: "Otoriter Sol (Auth-Left)",
      bg: "#fca5a5",
      cardBg: "#fecaca",
      badge: "bg-red-700 text-white",
      border: "#b91c1c"
    };
  } else if (isTop && !isLeft) {
    return {
      name: "Otoriter Sağ (Auth-Right)",
      bg: "#93c5fd",
      cardBg: "#bfdbfe",
      badge: "bg-blue-700 text-white",
      border: "#1d4ed8"
    };
  } else if (!isTop && isLeft) {
    return {
      name: "Özgürlükçü Sol (Lib-Left)",
      bg: "#86efac",
      cardBg: "#bbf7d0",
      badge: "bg-emerald-700 text-white",
      border: "#15803d"
    };
  } else {
    return {
      name: "Özgürlükçü Sağ (Lib-Right)",
      bg: "#fde047",
      cardBg: "#fef08a",
      badge: "bg-amber-700 text-white",
      border: "#a16207"
    };
  }
}

export function createInitialGrid(rows = 4, cols = 4) {
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({
        id: `cell-${r}-${c}`,
        row: r,
        col: c,
        title: '',
        image: null,
        traits: ['']
      });
    }
  }
  return cells;
}

// Örnek Sıfır Bir dizi şablonu (4x4)
export const DEMO_PRESET_4X4 = [
  {
    row: 0, col: 0,
    title: "cezaevi müdürü",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=60",
    traits: ["Bir boktan haberi olmayan bürokrat"]
  },
  {
    row: 0, col: 1,
    title: "Sazcı mahkum",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=60",
    traits: ["Aimi bok gibidir", "Seyfi yüzünden alakasız olayda gg"]
  },
  {
    row: 0, col: 2,
    title: "Kantinci",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=60",
    traits: ["Haberci ajan", "Sahadan uzaktır", "Görevini kötüye kulanır"]
  },
  {
    row: 0, col: 3,
    title: "Koguştaki gençler 3 sezon",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=60",
    traits: ["2017 seçmelerde katılıp 1 bölüm oynayıp ugura kanıp gg oldular"]
  },
  {
    row: 1, col: 0,
    title: "Garibin bacısı",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=60",
    traits: ["Sistem için ömrünü harcayan figuran enayi"]
  },
  {
    row: 1, col: 1,
    title: "Yahyanın oglu",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=60",
    traits: ["İşsiz", "Okulu salıp hırt olmuştur", "Babasını sevmez"]
  },
  {
    row: 1, col: 2,
    title: "Yahyanın oglu küçük",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=60",
    traits: ["Sistemin dostu", "Abisi azar yesin diye çalışıyor"]
  },
  {
    row: 1, col: 3,
    title: "Kedi ahmet",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=60",
    traits: ["Kadın çocuk düşmanı", "Düğünde gg olmuştur"]
  },
  {
    row: 2, col: 0,
    title: "Dizideki içkici kız",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=60",
    traits: ["paragöz", "kadın"]
  },
  {
    row: 2, col: 1,
    title: "Mahkum cezaevi",
    image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop&q=60",
    traits: ["Geç uyandığı için sistem tarafından hayatı bitirielen hassas genç erkek"]
  },
  {
    row: 2, col: 2,
    title: "Yahyanın karısı",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=60",
    traits: ["Pragmatik", "Yaşlı düşmanı", "Kocasını kandırıyor"]
  },
  {
    row: 2, col: 3,
    title: "hülyanın abisi",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=60",
    traits: ["kardeşlerinin intikamını alamadı", "ömrü bok yoluna gitti"]
  },
  {
    row: 3, col: 0,
    title: "tefecinin karısı",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=60",
    traits: ["Tüm sistemi yok eden herkesi bok yoluna götüren kişi"]
  },
  {
    row: 3, col: 1,
    title: "Atom Adnanın gençleri",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=60",
    traits: ["Hırsız", "Silah kullanmaz", "Parasını paylaşır"]
  },
  {
    row: 3, col: 2,
    title: "Mahmutun arabasını yedigi adam",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=60",
    traits: ["Ultra pragmatik", "bencil", "ikiyüzlü oe"]
  },
  {
    row: 3, col: 3,
    title: "sarı pipi",
    image: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=300&auto=format&fit=crop&q=60",
    traits: ["Atom adnandan daha fazla icraati olan çocuk"]
  }
];
