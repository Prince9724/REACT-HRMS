// ============================================================
// EDIT EVERYTHING HERE — name, dates, letter, reasons, colors,
// captions, and all site text. No other file needs to change.
// ============================================================

const config = {
  // Basic info
  name: "Alex",
  nickname: "Sunshine",
  birthdayDate: "2026-08-20T00:00:00", // ISO date used by the countdown
  fromName: "Me",

  // Theme colors (hex) — used across gradients/buttons
  theme: {
    primary: "#ff4d6d",
    secondary: "#ffb703",
    accent: "#8338ec",
    background: "#fff0f3",
  },

  // Loading screen
  loading: {
    title: "Preparing something special...",
    subtitle: "Just a moment more",
  },

  // Welcome / hero section
  welcome: {
    heading: "Happy Birthday",
    subheading: "To the most amazing person I know",
    buttonText: "Open Your Surprise",
  },

  // Music player
  music: {
    trackName: "Birthday Song",
    artist: "For You",
    autoPlayLabel: "Tap to play music",
  },

  // Gift box section
  giftBox: {
    heading: "You've Got a Gift!",
    subheading: "Click the box to open it",
    revealMessage: "Wishing you a year full of joy, laughter, and everything your heart desires!",
  },

  // Cake cutting section
  cake: {
    heading: "Let's Cut the Cake!",
    subheading: "Click the candles to blow them out and make a wish",
    wishMessage: "Your wish has been sent to the stars ✨",
  },

  // Photo gallery with captions
  gallery: {
    heading: "Our Favorite Moments",
    subheading: "A little walk down memory lane",
    photos: [
      { src: "photo1", caption: "The day it all began" },
      { src: "photo2", caption: "So many laughs together" },
      { src: "photo3", caption: "Adventures we'll never forget" },
      { src: "photo4", caption: "Just being silly, as always" },
      { src: "photo5", caption: "Here's to many more memories" },
    ],
  },

  // Reasons section
  reasons: {
    heading: "Reasons Why You're Amazing",
    subheading: "Just a few out of a million",
    list: [
      "Your smile brightens every single room you walk into.",
      "You always know exactly what to say to make things better.",
      "Your kindness inspires everyone around you.",
      "You make even the most ordinary days feel special.",
      "You never stop believing in the people you love.",
      "Your laugh is honestly the best sound in the world.",
    ],
  },

  // Letter section
  letter: {
    heading: "A Letter For You",
    subheading: "From the heart",
    body:
      "Happy Birthday! Today is all about celebrating the incredible person you are. " +
      "Thank you for the laughter, the support, and every little moment we've shared together. " +
      "I hope this year brings you closer to all your dreams, fills your days with joy, and surrounds you " +
      "with the people who love you most. You deserve every good thing coming your way. " +
      "Here's to another wonderful year — I can't wait to see what it brings for you.",
    signature: "With all my love",
  },

  // Countdown section (used before or after the birthday date)
  countdown: {
    headingBefore: "Counting Down to Your Big Day",
    headingAfter: "Happy Birthday! The Day is Here",
    subheading: "Every second brings us closer to celebrating you",
  },

  // Balloon pop mini game
  balloonGame: {
    heading: "Pop the Balloons!",
    subheading: "Tap as many as you can before they float away",
    scoreLabel: "Score",
  },

  // Fireworks finale section
  fireworks: {
    heading: "Let's Celebrate!",
    subheading: "Tap anywhere to light up the sky",
  },

  // Footer
  footer: {
    message: "Made with love, just for you.",
    year: new Date().getFullYear(),
  },
};

export default config;
