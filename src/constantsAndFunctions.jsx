export function formatPrice(price) {
  if (price == null) return "";
  const parts = Number(price).toFixed(2).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${parts[0]},${parts[1]}`;
}

export function parseFecha(fechaStr) {
  if (!fechaStr) return null;

  const match = fechaStr.match(
    /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2}) (AM|PM)/i
  );
  if (!match) return null;

  const [_, dia, mes, anio, hora, min, seg, periodo] = match;
  let h = parseInt(hora, 10);
  if (periodo.toUpperCase() === "PM" && h < 12) h += 12;
  if (periodo.toUpperCase() === "AM" && h === 12) h = 0;

  // Armamos fecha en formato ISO válido
  const iso = `${anio}-${mes}-${dia}T${h
    .toString()
    .padStart(2, "0")}:${min}:${seg}`;
  const d = new Date(iso);
  return isNaN(d) ? null : d;
}

export const getTodayStart = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

export const url = "http://192.168.100.216:8080";
