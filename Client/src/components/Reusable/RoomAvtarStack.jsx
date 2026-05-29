import { Plus } from "lucide-react";

function RoomAvatarStack({ residents, onAdd,setAddResidentModal }) {
  const palette = ["bg-blue-400", "bg-violet-400", "bg-teal-400", "bg-amber-400", "bg-rose-400"];

  return (
    <div className="flex items-center ">

      {/* Avatars */}
      <div className="flex items-center">
        {residents?.length === 0 ? (
          <span className="text-xs text-slate-400 italic">Vacant</span>
        ) : (
          <>
            {residents.slice(0, 3).map((r, i) => (
              <div
                key={i}
                title={r?.name}
                className={`w-6 h-6 rounded-full ${palette[i % palette.length]} border-2 border-white flex items-center justify-center text-white text-[9px] font-bold`}
                style={{ marginLeft: i > 0 ? "-6px" : 0, zIndex: 10 - i }}
              >
                {r?.name?.[0]?.toUpperCase()}
              </div>
            ))}
            {residents.length > 3 && (
              <div
                className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-600 text-[9px] font-bold"
                style={{ marginLeft: "-6px" }}
              >
                +{residents.length - 3}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add button */}
      <button
        onClick={(e) => { e.stopPropagation(); setAddResidentModal(true); }}
        className="w-6 h-6 rounded-full border border-dashed cursor-pointer border-slate-300 flex items-center justify-center text-slate-400 hover:border-slate-500 hover:text-slate-600 hover:bg-slate-50 transition-all"
        title="Add resident"
      >
        <Plus size={11} />
      </button>

    </div>
  );
}

export default RoomAvatarStack;