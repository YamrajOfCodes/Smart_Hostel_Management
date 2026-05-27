function RoomAvatarStack({ residents }) {
    console.log(residents)
  const palette = ["bg-blue-400", "bg-violet-400", "bg-teal-400", "bg-amber-400", "bg-rose-400"];
  if (residents?.length === 0)
    return <span className="text-xs text-slate-400 italic">Vacant</span>;
  return (
    <div className="flex items-center">
      {residents?.slice(0, 3).map((r, i) => (
        <div
          key={i}
          title={r}
          className={`w-6 h-6 rounded-full ${palette[i % palette?.length]} border-2 border-white flex items-center justify-center text-white text-[9px] font-bold`}
          style={{ marginLeft: i > 0 ? "-6px" : 0, zIndex: 10 - i }}
        >
          {r[0]}
        </div>
      ))}
      {residents?.length > 3 && (
        <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-600 text-[9px] font-bold" style={{ marginLeft: "-6px" }}>
          +{residents?.length - 3}
        </div>
      )}
    </div>
  );
}

export default RoomAvatarStack;