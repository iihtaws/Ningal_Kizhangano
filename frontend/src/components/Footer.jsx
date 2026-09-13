import React from "react";

export default function Footer({ theme = "dark" }) {
  const isDark = theme === "dark";

  return (
    <footer
      className={`mt-16 py-8 border-t transition-colors ${
        isDark
          ? "border-slate-800/80 text-slate-500"
          : "border-slate-200 text-slate-500"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center text-sm">
        <span className="font-semibold text-amber-500">
          Kizhangano? 🥔
        </span>
      </div>
    </footer>
  );
}