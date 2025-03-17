import { Moon, Sun, SunDim, SunMedium, Sunrise, Sunset } from "lucide-react";

const getPrayerTimes = (todayData) => {
  if (!todayData || !todayData.times) {
    console.log("Namaz vakitleri yükleniyor...");
    return null;
  }

  const prayerTimes = todayData.times;

  const todayTimes = [
    { time: "İmsak", icon: <Sunrise className="flex-shrink-0" /> },
    { time: "Güneş", icon: <Sun className="flex-shrink-0" /> },
    { time: "Öğle", icon: <SunMedium className="flex-shrink-0" /> },
    { time: "İkindi", icon: <SunDim className="flex-shrink-0" /> },
    { time: "Akşam", icon: <Sunset className="flex-shrink-0" /> },
    { time: "Yatsı", icon: <Moon className="flex-shrink-0" /> },
  ];

  return todayTimes.map((item, index) => ({
    ...item,
    clock: prayerTimes[index] ?? "Bilinmiyor",
  }));
};

export default getPrayerTimes;
