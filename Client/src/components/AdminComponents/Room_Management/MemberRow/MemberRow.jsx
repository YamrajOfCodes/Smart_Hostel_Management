import { Calendar, UserMinus } from "lucide-react";

const AVATAR_PALETTE = [
  "bg-blue-500", "bg-violet-500", "bg-teal-500", "bg-amber-500", "bg-rose-500"
];
function MemberRow({ member, index, onUnassign,roomId }) {

    console.log(member)
  const tenant  = member?.email;
  const color   = AVATAR_PALETTE[index % AVATAR_PALETTE.length];
  const initial = member?.name?.[0]?.toUpperCase() || "?";
  const joinedDate = member?.joinedAt
    ? new Date(member.joinedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group">

      {/* Avatar */}
      <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
        {initial}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{member?.name?.toUpperCase() || "Unknown"}</p>
        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
          {tenant?.phone && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Phone size={10} /> {tenant.phone}
            </span>
          )}
          {tenant?.email && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400 truncate">
              <Mail size={10} /> {tenant.email}
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
          <Calendar size={9} /> Joined {joinedDate}
          {member?.bedNumber && <span className="ml-2 px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">Bed {member.bedNumber}</span>}
        </span>
      </div>

      {/* Unassign */}
      <button
        onClick={() => onUnassign(tenant,roomId)}
        className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-100 text-rose-500 hover:bg-rose-50 text-[11px] font-semibold transition-all flex-shrink-0"
      >
        <UserMinus size={12} /> Remove
      </button>
    </div>
  );
}

export default MemberRow;