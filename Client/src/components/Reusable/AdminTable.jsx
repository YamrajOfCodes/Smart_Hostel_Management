import { ArrowUp, ArrowDown, ArrowUpDown, Inbox } from "lucide-react";
import { useState } from "react";

function Table({ columns, data, loading = false }) {
  const [sortKey, setSortKey]     = useState(null);
  const [sortDir, setSortDir]     = useState("asc");

  const handleSort = (key) => {
    if (!key) return;
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = [...(data || [])].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey] ?? "";
    const bVal = b[sortKey] ?? "";
    const cmp  = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
    return sortDir === "asc" ? cmp : -cmp;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {columns.map((col) => {
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
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5">
                      <div className="h-3.5 bg-slate-100 rounded-full animate-pulse"
                        style={{ width: `${Math.random() * 40 + 40}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
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
              sorted.map((row, i) => (
                <tr key={row._id || row.id || i}
                  className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors group">
                  {columns.map((col) => (
                    <td key={col.key}
                      className={`px-4 py-3.5 text-sm text-slate-700 whitespace-nowrap
                        ${col.align === "right" ? "text-right" : ""}
                        ${col.className || ""}`}>
                      {col.render ? col.render(row) : row[col.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* Footer row count */}
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