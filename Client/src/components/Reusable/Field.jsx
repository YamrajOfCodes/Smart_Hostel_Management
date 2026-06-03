function Field({ icon, label, value, mono = false }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-1.5 text-xs text-slate-400">
        {icon}
        {label}
      </label>
      <p className={`text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2 truncate
        ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </p>
    </div>
  );
}

export default Field;