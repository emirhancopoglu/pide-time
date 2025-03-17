export const getRemainingTime = (sahurTime, iftarTime) => {
  if (!sahurTime || !iftarTime) return null;

  const now = new Date();
  const [sahurHour, sahurMinute] = sahurTime.split(":").map(Number);
  const [iftarHour, iftarMinute] = iftarTime.split(":").map(Number);

  // Bugünün sahur ve iftar saatlerini belirle
  const sahurDate = new Date(now);
  sahurDate.setHours(sahurHour, sahurMinute, 0, 0);

  const iftarDate = new Date(now);
  iftarDate.setHours(iftarHour, iftarMinute, 0, 0);

  // Eğer şu an iftar saatleri arasındaysa (05:40 - 19:19)
  if (now >= sahurDate && now < iftarDate) {
    return {
      type: "iftar",
      time: formatRemainingTime(iftarDate - now),
    };
  }

  // Eğer şu an sahur saatleri arasındaysa (19:19 - 05:40)
  if (now >= iftarDate || now < sahurDate) {
    // Sahur zamanı geçmişse, sahur vaktine geri sayım başlat
    const nextSahurDate = new Date(now);
    nextSahurDate.setDate(now.getDate() + (now >= sahurDate ? 1 : 0));
    nextSahurDate.setHours(sahurHour, sahurMinute, 0, 0);

    return {
      type: "sahur",
      time: formatRemainingTime(nextSahurDate - now),
    };
  }
};

// Yardımcı fonksiyon: Kalan zamanı formatlar
const formatRemainingTime = (remainingTime) => {
  const hoursLeft = Math.floor(remainingTime / (1000 * 60 * 60));
  const minutesLeft = Math.floor(
    (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
  );
  const secondsLeft = Math.floor((remainingTime % (1000 * 60)) / 1000);

  return `${String(hoursLeft).padStart(2, "0")} : ${String(
    minutesLeft
  ).padStart(2, "0")} : ${String(secondsLeft).padStart(2, "0")}`;
};
