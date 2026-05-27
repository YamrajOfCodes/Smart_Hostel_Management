import React from 'react'

const Table = ({columns, data}) => {
  return (
    <div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">Recent Hostels</h2>
                <p className="text-xs text-slate-500 mt-0.5">Latest registered properties</p>
              </div>
              <button className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors flex items-center gap-1">
                View all
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/30">
                    {columns.map((col) => (
                      <th key={col} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {data?.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-bold shrink-0">
                             {item.title[0]}
                          </div>
                          <span className="font-medium text-slate-200 whitespace-nowrap">{item.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 whitespace-nowrap">{item.subtitle}</td>
                      <td className="px-6 py-4 text-slate-400 whitespace-nowrap">{item.location}</td>
                      <td className="px-6 py-4 text-slate-300 font-semibold">{item.helpertext}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                          ${item.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.status === "Active" ? "bg-emerald-400" : "bg-amber-400"}`} />
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
    </div>
  )
}

export default Table
