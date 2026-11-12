
# Pide Vakti

Ramazan ayı için yapılmış, şehir veya şehir, ilçe üzerinden sahur ve iftar vakitlerini API üzerinden dinamik olarak çekerek kullanıcıya sunar.

NextJS ile geliştirilen bu projede, sabit tasarım prensipleriyle Shadcn UI kullandım. Kullanıcılar şehir veya şehir, ilçe seçerek iftar ve sahur zamanlarını görebilme imkanı sağlanıyor. Vakitler Diyanet İşleri Başkanlığı verilerinden, uygulamanın kendi API route'ları üzerinden (sunucu tarafı önbellekli) çekiliyor. Konumdan otomatik il/ilçe bulma, canlı iftar/sahur geri sayımı ve 30 günlük imsakiye bulunuyor. Light ve Dark theme desteği bulunmaktadır.

**Tasarım:** Geri sayım büyük, okunur bir cümle olarak gösterilir ("İftara 2 saat 14 dakika var."). Yanındaki **gün yayı** imsaktan iftara (gece fazında iftardan imsaka) uzanır; güneş ya da ay şu anki konumda durur, ara vakitler yay üzerinde işaretlidir (`src/components/sky-arc`). Renkler: kâğıt `#F4F5F7`, çivit mürekkep `#191B33`, alacakaranlık `#3F3DBC` (vurgu), gün batımı `#F2683A` (güneş ve iftar), gece `#1D2050`. Yazı tipleri Funnel Display ve Funnel Sans.

**Logo:** ufukta batan bir Ramazan pidesi (pide batınca iftar). Bileşen `src/components/logo`, favicon `src/app/icon.svg`.

**Ek özellikler:** iftar ve sahurdan 15 dakika önce tarayıcı bildirimi (sekme açıkken), 30 günlük vakitleri alarmlı `.ics` olarak takvime ekleme, oruç süresi grafiği, 12 ilde bugünkü iftarı karşılaştıran nokta grafiği, paylaş butonu, Ramazan sayacı (Ramazan'ın kaçıncı günü ya da Ramazan'a kalan gün), iftardan sonraki 45 dakika "Hayırlı iftarlar" mesajı, ana sayfada İstanbul'un canlı önizlemesi ve büyükşehir kısayolları, son bakılan konumun hatırlanması.


## Demo

<a href="https://pidetime.vercel.app/ara" style="font-size: 24px; font-weight: bold; text-decoration: none; color: black;">
    Pide Vakti
</a>

  
## Kullanılan Teknolojiler

**NextJS, TailwindCSS, ShadCN, Next-Themes** 

## API Kullanımı

Eski `vakit.vercel.app` API'si kapandığı için Diyanet verilerini sunan **https://ezanvakti.emushaf.net** kullanılıyor. İstekler uygulamanın kendi route handler'ları üzerinden yapılır ve Next.js data cache ile önbelleklenir (`src/lib/diyanet.js`).

| Uygulama | Kaynak | Önbellek |
| --- | --- | --- |
| `GET /api/iller` | `/sehirler/2` (Türkiye) | 30 gün |
| `GET /api/ilceler/:ilId` | `/ilceler/:ilId` | 30 gün |
| Sayfa `/:il/:ilce` (sunucu tarafı) | `/vakitler/:ilceId` (~30 gün) | 6 saat |

**Sayfa adresleri:** `/istanbul/kartal`, `/ankara/ankara` (il merkezi). `/istanbul` il merkezine, eski `/istanbul-kartal` biçimindeki bağlantılar yeni adrese yönlendirilir.

**Konumdan bulma:** Tarayıcı konumu → OpenStreetMap Nominatim (yedek: BigDataCloud) ile ters geokodlama → `province` = il, `town` = ilçe. Diyanet'in ayrı vakit yayımlamadığı ilçelerde (ör. Kadıköy) il merkezinin vakitleri kullanılır.

## Ekran Görüntüleri


<p>
    Light Mode Anasayfa
</p>

![light-home](https://github.com/user-attachments/assets/91835b71-605c-4e94-b1e1-d6e5b52d5b26)


<p>
Dark Mode Anasayfa
</p>

![dark-home](https://github.com/user-attachments/assets/866f940f-ff4f-4209-b331-86e2538e9e36)

<p>
    Light Mode Geri Sayım ve Imsakiye
</p>

![imsakiye-light](https://github.com/user-attachments/assets/f36f5539-447b-4b19-89cf-5b60f5ec1f0d)


<p>
    Dark Mode Geri Sayım ve Imsakiye
</p>

![imsakiye-dark](https://github.com/user-attachments/assets/e52488f4-a145-4c71-9c44-aea43a78c3ee)



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
