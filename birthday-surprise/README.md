# 🎂 Birthday Surprise Website

A personal, interactive birthday surprise website built with React + Vite + Tailwind CSS.

## Getting Started

```bash
npm install
npm run dev
```

Then open the local URL shown in your terminal (usually `http://localhost:5173`).

## How to Customize

### 1. All text, dates, and colors
Edit **`src/data/config.js`**. This single file controls:
- Name, nickname, birthday date
- Every heading, subheading, and button label
- The full letter text
- The list of "reasons"
- Photo captions
- Music track name
- Theme colors

No other file needs to change for text/content edits.

### 2. Photos
Replace the files in `src/assets/images/`:
- `photo1.jpg`, `photo2.jpg`, `photo3.jpg`, `photo4.jpg`, `photo5.jpg`

Just copy your own photos over these filenames (keep the same names) and they'll appear automatically in the gallery. If you want to change captions, edit `config.gallery.photos` in `src/data/config.js`.

### 3. Music
Replace `src/assets/music/birthday.mp3` with your own MP3 file (same filename).

### 4. Video
Replace `src/assets/videos/intro.mp4` with your own MP4 file (same filename) if you build a video intro feature.

## Project Structure

```
birthday-surprise/
├── public/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── music/
│   │   ├── videos/
│   │   └── lottie/
│   ├── components/
│   │   ├── LoadingScreen/
│   │   ├── Welcome/
│   │   ├── MusicPlayer/
│   │   ├── GiftBox/
│   │   ├── CakeCutting/
│   │   ├── BalloonEffects/
│   │   ├── PhotoGallery/
│   │   ├── Reasons/
│   │   ├── Letter/
│   │   ├── Countdown/
│   │   ├── BalloonGame/
│   │   ├── Fireworks/
│   │   └── Footer/
│   ├── hooks/
│   ├── utils/
│   ├── data/
│   │   └── config.js   ← edit this for all personalization
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder, ready to deploy anywhere (Vercel, Netlify, GitHub Pages, etc).

## Notes

- The bundled `photo1–5.jpg`, `birthday.mp3`, and `intro.mp4` are lightweight placeholder files so the project runs immediately out of the box. Swap them out with your real files any time — no code changes needed.
