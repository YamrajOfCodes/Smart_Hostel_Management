const floorColors = {
  "Ground Floor": { bg: "bg-violet-500", light: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" },
  "1st Floor":    { bg: "bg-sky-500",    light: "bg-sky-50",    text: "text-sky-700",    border: "border-sky-200",    dot: "bg-sky-500" },
  "2nd Floor":    { bg: "bg-teal-500",   light: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200",   dot: "bg-teal-500" },
  "3rd Floor":    { bg: "bg-amber-500",  light: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500" },
};



function FloorTab({ label, count, active, onClick }) {
  const fc = label !== "All Floors" ? floorColors[label] : null;
  const isAll = label === "All Floors";
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200
        ${active
          ? isAll ? "bg-slate-900 text-white shadow-sm" : `${fc?.bg} text-white shadow-sm`
          : "hover:bg-slate-100 text-slate-600"
        }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${active ? "bg-white/70" : (fc?.dot || "bg-slate-400")}`} />
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px] text-center
        ${active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
        {count}
      </span>
    </button>
  );
}

export default FloorTab;