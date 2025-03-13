// utils/remaining-time.jsx

export const getRemainingTime = (targetTime) => {
  if (!targetTime) return null;

  const now = new Date();
  const [hours, minutes] = targetTime.split(":").map(Number);

  // Target Date nesnesini oluşturuyoruz
  const targetDate = new Date(now);
  targetDate.setHours(hours);
  targetDate.setMinutes(minutes);
  targetDate.setSeconds(0);
  targetDate.setMilliseconds(0);

  // Eğer hedef zaman geçmişse, bir sonraki günün saatini ayarlıyoruz
  if (targetDate < now) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  const remainingTime = targetDate - now;

  if (remainingTime < 0) return "Zaman Geçti";

  // 1 dakika geriye çekiyoruz
  const correctedRemainingTime = remainingTime - 60 * 1000; // 60 * 1000 ms = 1 dakika

  const hoursLeft = Math.floor(correctedRemainingTime / (1000 * 60 * 60));
  const minutesLeft = Math.floor(
    (correctedRemainingTime % (1000 * 60 * 60)) / (1000 * 60)
  );
  const secondsLeft = Math.floor((correctedRemainingTime % (1000 * 60)) / 1000);

  return `${hoursLeft} Saat ${minutesLeft} Dakika ${secondsLeft} Saniye`;
};
