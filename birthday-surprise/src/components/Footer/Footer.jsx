import config from "../../data/config.js";

export default function Footer() {
  return (
    <footer className="w-full py-8 text-center text-sm text-gray-500 bg-white/50">
      <p>
        {config.footer.message} © {config.footer.year}
      </p>
    </footer>
  );
}
