import { ArrowUp, ArrowDown, ArrowUpDown, Inbox, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

// ── Avatar helper ────────────────────────────────────────────────────────────
function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_PALETTE = [
  ["#E8F4FD", "#2D7DD2"],
  ["#F0FDF4", "#16A34A"],
  ["#FFF7ED", "#EA580C"],
  ["#FDF4FF", "#9333EA"],
  ["#FFF1F2", "#E11D48"],
  ["#ECFDF5", "#059669"],
  ["#EFF6FF", "#3B82F6"],
  ["#FFFBEB", "#D97706"],
];

function hashName(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h % AVATAR_PALETTE.length;
}

function Avatar({ name, src, size = 32 }) {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(name);
  const [bg, fg] = AVATAR_PALETTE[hashName(name)];

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImgError(true)}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #fff",
          boxShadow: "0 0 0 1.5px #e2e8f0",
          flexShrink: 0,
          display: "block",
        }}
      />
    );
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color: fg,
        fontSize: size * 0.36,
        fontWeight: 700,
        letterSpacing: "0.02em",
        border: "2px solid #fff",
        boxShadow: "0 0 0 1.5px #e2e8f0",
        flexShrink: 0,
        userSelect: "none",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      {initials}
    </span>
  );
}

// ── Name cell with avatar ─────────────────────────────────────────────────────
function NameCell({ row, nameKey = "name", avatarKey = "avatar" }) {
  const name = row[nameKey] || row.fullName || row.residentName || "—";
  const src = row[avatarKey] || row.avatarUrl || row.photo || null;
  const sub = row.email || row.unit || row.role || null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Avatar name={name} src={src} size={32} />
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#1e293b",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1.3,
          }}
        >
          {name}
        </div>
        {sub && (
          <div
            style={{
              fontSize: 11,
              color: "#94a3b8",
              marginTop: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Detect which column is the "name" column ──────────────────────────────────
function detectNameColumn(columns) {
  const nameKeys = ["name", "fullname", "residentname", "username", "title", "label"];
  return columns.find((c) =>
    nameKeys.includes((c.key || "").toLowerCase().replace(/[_\s]/g, ""))
  );
}

// ── Main Table ────────────────────────────────────────────────────────────────
function Table({ columns, data, loading = false, onEdit, onDelete, setUpdateResidentModal,setExistingRes }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [deletingId, setDeletingId] = useState(null);

  const handleSort = (key) => {
    if (!key) return;
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const handleSubmit = (data)=>{
    console.log(data);
    setExistingRes(data)
  }


  const handleEdit = (row) => { console.log(row); onEdit?.(row); };
  const handleDelete = (row) => { console.log(row); onDelete?.(row); };

  const sorted = [...(data || [])].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey] ?? "";
    const bVal = b[sortKey] ?? "";
    const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
    return sortDir === "asc" ? cmp : -cmp;
  });

  const hasActions = onEdit || onDelete;
  const nameCol = detectNameColumn(columns);

  // Inject avatar renderer into the name column
  const enrichedColumns = columns.map((col) => {
    if (col === nameCol && !col.render) {
      return {
        ...col,
        render: (row) => <NameCell row={row} nameKey={col.key} />,
      };
    }
    return col;
  });

  const allColumns = hasActions
    ? [
        ...enrichedColumns,
        {
          key: "__actions",
          label: "Actions",
          align: "right",
          sortable: false,
          render: (row) => {
            const id = row._id || row.id;
            const isDeleting = deletingId === id;
            return (
              <div className="flex items-center justify-end gap-1">
                {onEdit && (
                  <button
                    onClick={() => handleEdit(row)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                      text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => handleDelete(row)}
                    disabled={isDeleting}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                      transition-all duration-150
                      ${isDeleting
                        ? "text-red-300 bg-red-50 cursor-not-allowed"
                        : "text-slate-500 hover:text-red-600 hover:bg-red-50"
                      }`}
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                )}
              </div>
            );
          },
        },
      ]
    : enrichedColumns;

  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {allColumns.map((col) => {
                const isSorted = sortKey === col.key;
                const sortable = col.sortable !== false && !col.render;
                return (
                  <th
                    key={col.key}
                    onClick={() => sortable && handleSort(col.key)}
                    className={`px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap select-none
                      ${sortable ? "cursor-pointer hover:text-slate-600 transition-colors" : ""}
                      ${col.align === "right" ? "text-right" : ""}
                    `}
                  >
                    <div className={`flex items-center gap-1.5 ${col.align === "right" ? "justify-end" : ""}`}>
                      {col.label}
                      {sortable && (
                        <span className="text-slate-300">
                          {isSorted
                            ? sortDir === "asc"
                              ? <ArrowUp size={11} className="text-slate-500" />
                              : <ArrowDown size={11} className="text-slate-500" />
                            : <ArrowUpDown size={11} />
                          }
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-50">
                  {allColumns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5">
                      {col === nameCol || col.key === (nameCol?.key) ? (
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse flex-shrink-0" />
                          <div className="space-y-1.5">
                            <div className="h-3 bg-slate-100 rounded-full animate-pulse w-28" />
                            <div className="h-2.5 bg-slate-100 rounded-full animate-pulse w-20" />
                          </div>
                        </div>
                      ) : (
                        <div
                          className="h-3.5 bg-slate-100 rounded-full animate-pulse"
                          style={{ width: `${Math.random() * 40 + 40}%` }}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={allColumns.length}>
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <Inbox size={22} className="text-slate-300" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-500">No records found</p>
                      <p className="text-xs text-slate-400 mt-0.5">Try adjusting your filters</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              sorted.map((row, i) => {
                const id = row._id || row.id || i;
                const isDeleting = deletingId === id;
                return (
                  <tr
                    key={id}
                    className={`border-b border-slate-50 transition-all duration-300
                      ${isDeleting ? "opacity-40 scale-[0.99]" : "hover:bg-slate-50/60"}
                    `}
                  >
                    {allColumns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 text-sm text-slate-700 whitespace-nowrap
                       ${col.align === "right" ? "text-right" : ""}
                       ${col.className || ""}
                     `}
                      >
                        {col.render
                          ? col.render(row)
                          : row[col.key] != null && row[col.key] !== ""
                            ? row[col.key]
                            : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-dashed border-slate-300 text-slate-400 text-xs font-medium cursor-pointer hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all duration-150 select-none"
                               onClick={()=>{handleSubmit(row)}}>
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                {col.emptyLabel || "Assign"}
                              </span>
                            )
                        }
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && sorted.length > 0 && (
        <div className="px-4 py-2.5 border-t border-slate-50 bg-slate-50/50">
          <p className="text-[11px] text-slate-400">
            Showing <span className="font-semibold text-slate-600">{sorted.length}</span> record{sorted.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}

export default Table;