# 🧭 Politik Pusula Oluşturucu (Political Compass Meme Generator)

Görseldeki gibi **4x4 (veya 2x2, 3x3, 6x6)** Wojak / Dizi / Karakter politik pusulaları oluşturmanızı, düzenlemenizi ve HD kalitede görsel olarak indirmenizi sağlayan modern bir React uygulamasıdır.

## 🚀 Özellikler

- **Birebir Format:** 
  - Kırmızı (Otoriter Sol)
  - Mavi (Otoriter Sağ)
  - Yeşil (Özgürlükçü Sol)
  - Sarı (Özgürlükçü Sağ)
- **Hücre Düzenleyici:**
  - Karakter görseli yükleme (Yerel dosya veya Web linki)
  - Kalın ve dikkat çekici meme başlığı
  - Tire (`-`) ile madde işaretli özellikler ekleme/çıkarma
- **HD Dışa Aktarma:** Tek tıkla yüksek çözünürlüklü `.PNG` formatında indirme
- **Proje Kaydet / Yükle:** Pusulanızı `.JSON` olarak kaydedip daha sonra tekrar yükleyebilme
- **Hazır Şablon:** Tek tıkla görseldeki formata benzer örnek şablon yükleme

## 📦 GitHub Pages'e Dağıtım (Deploy)

Bu proje GitHub Pages ile tam uyumlu olarak ayarlanmıştır (`base: './'` ve hazır GitHub Actions workflow'u).

1. Projeyi bir GitHub reposuna yükleyin:
   ```bash
   git init
   git add .
   git commit -m "feat: politik pusula meme generator"
   git branch -M main
   git remote add origin https://github.com/KULLANICI_ADINIZ/REPO_ADINIZ.git
   git push -u origin main
   ```
2. GitHub reponuzda **Settings > Pages** sekmesine gidin.
3. **Build and deployment > Source** kısmını **GitHub Actions** olarak seçin.
4. Repo her güncellendiğinde `.github/workflows/deploy.yml` otomatik olarak derleyip yayına alacaktır.

## 💻 Yerel Geliştirme

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Üretim çıktısı alın
npm run build
```
