function StatCard({ dotClass, label, value, valueClass }) {
  return (
    <div className="bg-white border border-[#EAE7E2] rounded-xl p-4">
      <div className={`w-1.5 h-1.5 rounded-full ${dotClass} mb-3`} />
      <p className={`text-[22px] font-semibold leading-none mb-1 ${valueClass}`}>{value}</p>
      <p className="text-[10px] font-semibold tracking-widest uppercase text-[#B0A898]">{label}</p>
    </div>
  );
}

export default StatCard;