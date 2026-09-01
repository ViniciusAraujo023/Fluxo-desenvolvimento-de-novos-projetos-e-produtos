const todayISO = () => new Date().toISOString().slice(0, 10);

const fmtDate = (iso) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};
