function ResidentCard({ resident }) {

    // ─────────────────────────────────────────────────────
    const avatarColor = (str) => {
      const colors = [
        "bg-blue-500",
        "bg-violet-500",
        "bg-emerald-500",
        "bg-pink-500",
        "bg-amber-500",
        "bg-cyan-500",
      ];
    
      let hash = 0;
    
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
    
      return colors[Math.abs(hash) % colors.length];
    };

    const statusStyle = {
  active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
};

const Icon = ({ d, size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {Array.isArray(d)
      ? d.map((p, i) => <path key={i} d={p} />)
      : <path d={d} />}
  </svg>
);


const Icons = {
  search: [
    "M11 17.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5z",
    "M16 16l4.5 4.5",
  ],

  plus: "M12 5v14 M5 12h14",

  users: [
    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2",
    "M23 21v-2a4 4 0 00-3-3.87",
    "M16 3.13a4 4 0 010 7.75",
    "M9 7a4 4 0 100 8 4 4 0 000-8z",
  ],

  close: "M18 6L6 18 M6 6l12 12",

  phone: ["M22 16.92v3a2 2 0 01-2.18 2", "M16 3h3a2 2 0 012 2v3", "M5 3h3", "M3 5v3", "M16 8a6 6 0 006 6"],

  mail: [
    "M4 4h16v16H4z",
    "M22 6l-10 7L2 6",
  ],

  room: ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"],

  eye: [
    "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z",
    "M12 9a3 3 0 100 6 3 3 0 000-6z",
  ],

  edit: [
    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7",
    "M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  ],

  trash: ["M3 6h18", "M8 6V4h8v2", "M19 6l-1 14H6L5 6"],
};


  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      
      {/* TOP */}
      <div className="flex items-start justify-between mb-5">

        <div className="flex items-center gap-3">

          <div
            className={`w-14 h-14 rounded-2xl text-white flex items-center justify-center text-lg font-bold ${avatarColor(
              resident.name
            )}`}
          >
            {resident.name[0]}
          </div>

          <div>
            <h3 className="font-bold text-slate-800 text-lg">
              {resident.name}
            </h3>

            <p className="text-sm text-slate-500">
              {resident.floor}
            </p>
          </div>
        </div>

        <span
          className={`text-xs px-3 py-1 rounded-full border font-semibold capitalize ${statusStyle[resident.status]}`}
        >
          {resident.status}
        </span>
      </div>

      {/* INFO */}
      <div className="space-y-3">

        <div className="flex items-center gap-3 text-sm text-slate-600">
          <div className="text-slate-400">
            <Icon d={Icons.room} size={16} />
          </div>

          <span>Room {resident.room}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-600">
          <div className="text-slate-400">
            <Icon d={Icons.phone} size={16} />
          </div>

          <span>{resident.phone}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-600">
          <div className="text-slate-400">
            <Icon d={Icons.mail} size={16} />
          </div>

          <span className="truncate">
            {resident.email}
          </span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100">

        <div>
          <p className="text-xs text-slate-400">
            Monthly Rent
          </p>

          <p className="font-bold text-slate-800">
            ₹{Number(resident.rent).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="flex items-center gap-2">

          <button className="w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center">
            <Icon d={Icons.eye} size={15} />
          </button>

          <button className="w-10 h-10 rounded-xl border border-slate-200 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center">
            <Icon d={Icons.edit} size={15} />
          </button>

          <button className="w-10 h-10 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center">
            <Icon d={Icons.trash} size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResidentCard;