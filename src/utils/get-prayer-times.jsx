import { Moon, Sun, SunDim, SunMedium, Sunrise, Sunset } from "lucide-react";

const getPrayerTimes = (todayData) => {
  if (!todayData || !todayData.times) {
    console.log("Namaz vakitleri yükleniyor...");
    return null;
  }

  const prayerTimes = todayData.times;

  const todayTimes = [
    {
      time: "İmsak",
      icon: (
        <Sunrise
          className="flex-shrink-0 text-yellow-500 bg-gray-800 rounded-full p-1"
          size={30}
        />
      ),
    },
    {
      time: "Güneş",
      icon: (
        <Sun
          className="flex-shrink-0 text-yellow-300 bg-gray-800 rounded-full p-1"
          size={30}
        />
      ),
    },
    {
      time: "Öğle",
      icon: (
        <SunMedium
          className="flex-shrink-0 text-yellow-400 bg-gray-800 rounded-full p-1"
          size={30}
        />
      ),
    },
    {
      time: "İkindi",
      icon: (
        <SunDim
          className="flex-shrink-0 text-yellow-500 bg-gray-800 rounded-full p-1"
          size={30}
        />
      ),
    },
    {
      time: "Akşam",
      icon: (
        <Sunset
          className="flex-shrink-0 text-orange-600 bg-gray-800 rounded-full p-1"
          size={30}
        />
      ),
    },
    {
      time: "Yatsı",
      icon: (
        <Moon
          className="flex-shrink-0 text-sky-600 bg-gray-800 rounded-full p-1"
          size={30}
        />
      ),
    },
  ];

  return todayTimes.map((item, index) => ({
    ...item,
    clock: prayerTimes[index] ?? "Bilinmiyor",
  }));
};

export default getPrayerTimes;
