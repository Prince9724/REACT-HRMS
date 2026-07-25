export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export function randomColor(palette) {
  return palette[Math.floor(Math.random() * palette.length)];
}

export function isBirthdayToday(birthdayDate) {
  const target = new Date(birthdayDate);
  const now = new Date();
  return (
    target.getDate() === now.getDate() &&
    target.getMonth() === now.getMonth()
  );
}
