import {
  Moon,
  Sun,
  SunDim,
  SunMedium,
  SunMoon,
  Sunrise,
  Sunset,
} from "lucide-react";

const getPrayerTimes = (times) => {
  if (
    !times ||
    !Array.isArray(times) ||
    times.length === 0 ||
    !times[0]?.times
  ) {
    console.log("Namaz vakitleri yükleniyor...");
    return null;
  }

  const prayerTimes = times[0].times;

  const todayTimes = [
    {
      time: "İmsak Vakti",
      icon: <Sunrise className=" flex-shrink-0" />,
    },
    { time: "Güneş", icon: <Sun className=" flex-shrink-0" /> },
    {
      time: "Öğle Ezanı",
      icon: <SunMedium className=" flex-shrink-0" />,
    },
    {
      time: "İkindi Ezanı",
      icon: <SunDim className=" flex-shrink-0" />,
    },
    {
      time: "İftar Saati",
      icon: <Sunset className=" flex-shrink-0" />,
    },
    {
      time: "Teravih Vakti",
      icon: <Moon className=" flex-shrink-0" />,
    },
  ];

  const updatedTodayTimes = todayTimes.map((item, index) => ({
    ...item,
    clock: prayerTimes[index] ?? "Bilinmiyor",
  }));

  return updatedTodayTimes;
};

export default getPrayerTimes;
