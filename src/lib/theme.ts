export function setTheme(mode: "light" | "dark") {
  if (typeof window === "undefined") return;

  const html = document.documentElement;
  html.classList.remove("light", "dark");
  html.classList.add(mode);
  localStorage.setItem("theme", mode);
}

export function toggleTheme() {
  if (typeof window === "undefined") return;

  const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
  const newMode = current === "dark" ? "light" : "dark";
  setTheme(newMode);
}

export function initTheme() {
  if (typeof window === "undefined") return;

  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const mode = saved || (prefersDark ? "dark" : "light");
  setTheme(mode as "light" | "dark");
}