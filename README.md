
# Pide Vakti

Ramazan ayı için yapılmış, şehir veya şehir, ilçe üzerinden sahur ve iftar vakitlerini API üzerinden dinamik olarak çekerek kullanıcıya sunar.

NextJS ile geliştirilen bu projede, sabit tasarım prensipleriyle Shadcn UI kullandım. Kullanıcılar şehir veya şehir, ilçe seçerek iftar ve sahur zamanlarını görebilme imkanı sağlanıyor. API olarak vakit.vercel.app tarafına istek atılıyor ve dinamik olarak zamanlar çekiliyor. Light ve Dark theme desteği bulunmaktadır.


## Demo

<a href="https://pidetime.vercel.app/ara" style="font-size: 24px; font-weight: bold; text-decoration: none; color: black;">
    Pide Vakti
</a>

  
## Kullanılan Teknolojiler

**NextJS, TailwindCSS, ShadCN, Next-Themes** 

## API Kullanımı

Kullanılan API = https://vakit.vercel.app/

* selectedCity = Istanbul
* selectedRegion = Sultanbeyli
* cityOrRegionId =  311922 || 311914 

#### Tüm şehirleri getir
```bash
  GET https://vakit.vercel.app/api/regions?country=Turkey
```

#### Şehir ID getir
```bash
  GET https://vakit.vercel.app/api/searchPlaces?q=${selectedCity}&lang=tr
```

#### Şehir ilçelerini getir
```bash
  GET https://vakit.vercel.app/api/cities?country=Turkey&region=${selectedCity}
```

#### İlçe ID getir
```bash
  GET https://vakit.vercel.app/api/searchPlaces?q=${selectedRegion}&lang=tr
```

#### Belirtilen ID'nin imsak vakitlerini getir
```bash
  GET 
  https://vakit.vercel.app/api/timesForPlace?id=${cityOrRegionId}&date=2025-03-01&days=30&timezoneOffset=180&calculationMethod=Turkey&lang=tr
```

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
