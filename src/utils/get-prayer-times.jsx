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
        <div className="flex-shrink-0 text-yellow-500 bg-gray-800 rounded-full p-1">
          <Sunrise size={24} />
        </div>
      ),
    },
    {
      time: "Güneş",
      icon: (
        <div className="flex-shrink-0 text-yellow-300 bg-gray-800 rounded-full p-1">
          <Sun size={24} />
        </div>
      ),
    },
    {
      time: "Öğle",
      icon: (
        <div className="flex-shrink-0 text-yellow-400 bg-gray-800 rounded-full p-1">
          <SunMedium size={24} />
        </div>
      ),
    },
    {
      time: "İkindi",
      icon: (
        <div className="flex-shrink-0 text-yellow-500 bg-gray-800 rounded-full p-1">
          <SunDim size={24} />
        </div>
      ),
    },
    {
      time: "Akşam",
      icon: (
        <div className="flex-shrink-0 text-orange-600 bg-gray-800 rounded-full p-1">
          <Sunset size={24} />
        </div>
      ),
    },
    {
      time: "Yatsı",
      icon: (
        <div className="flex-shrink-0 text-sky-600 bg-gray-800 rounded-full p-1">
          <Moon size={24} />
        </div>
      ),
    },
  ];

  return todayTimes.map((item, index) => ({
    ...item,
    clock: prayerTimes[index] ?? "Bilinmiyor",
  }));
};

export default getPrayerTimes;
