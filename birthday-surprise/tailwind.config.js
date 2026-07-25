/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff4d6d",
        secondary: "#ffb703",
        accent: "#8338ec",
        bgsoft: "#fff0f3",
      },
      fontFamily: {
        heading: ["'Pacifico'", "cursive"],
        body: ["'Poppins'", "sans-serif"],
      },
      keyframes: {
        floatUp: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-120vh)", opacity: "0" },
        },
        pop: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        floatUp: "floatUp 8s linear infinite",
        pop: "pop 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
