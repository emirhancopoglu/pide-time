import { Moon, Sun, SunDim, SunMedium, Sunrise, Sunset } from "lucide-react";

const getPrayerTimes = (todayData) => {
  if (!todayData || !todayData.times) {
    console.log("Namaz vakitleri yükleniyor...");
    return null;
  }

  const prayerTimes = todayData.times;

  const todayTimes = [
    { time: "İmsak Vakti", icon: <Sunrise className="flex-shrink-0" /> },
    { time: "Güneş", icon: <Sun className="flex-shrink-0" /> },
    { time: "Öğle Ezanı", icon: <SunMedium className="flex-shrink-0" /> },
    { time: "İkindi Ezanı", icon: <SunDim className="flex-shrink-0" /> },
    { time: "İftar Saati", icon: <Sunset className="flex-shrink-0" /> },
    { time: "Teravih Vakti", icon: <Moon className="flex-shrink-0" /> },
  ];

  return todayTimes.map((item, index) => ({
    ...item,
    clock: prayerTimes[index] ?? "Bilinmiyor",
  }));
};

export default getPrayerTimes;
