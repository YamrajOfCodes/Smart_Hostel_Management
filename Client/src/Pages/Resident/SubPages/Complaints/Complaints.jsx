import { useState } from "react";
import ComplaintModal from "../../../../components/ResidentComponents/ComplaintModal/ComplaintModal";
import { usegetComplaints, useRaiseComplaint } from "../../../../hooks/UserHooks/complaintHooks";
import { jwtDecode } from "jwt-decode";


const Ic = ({ d, size = 18, sw = 2, fill = "none", stroke = "currentColor" }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill={fill} stroke={stroke} strokeWidth={sw}
    strokeLinecap="round" strokeLinejoin="round"
    className="shrink-0 block"
  >
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

/* ─── Status badge styles ─────────────────────────────────────────────────── */
const statusClass = (s) => ({
  paid:          "bg-emerald-100 text-emerald-700 border border-emerald-200",
  pending:       "bg-amber-100   text-amber-700   border border-amber-200",
  "in-progress": "bg-blue-100   text-blue-700    border border-blue-200",
  resolved:      "bg-emerald-100 text-emerald-700 border border-emerald-200",
  approved:      "bg-emerald-100 text-emerald-700 border border-emerald-200",
  rejected:      "bg-red-100    text-red-700     border border-red-200",
  maintenance:   "bg-orange-100 text-orange-700",
  info:          "bg-blue-100   text-blue-700",
  alert:         "bg-red-100    text-red-700",
}[s] || "bg-slate-100 text-slate-600");

const IC = {
  home:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  bell:    ["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 01-3.46 0"],
  warn:    ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z","M12 9v4","M12 17h.01"],
  wrench:  ["M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"],
  file:    ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"],
  shield:  ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  logout:  ["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4","M16 17l5-5-5-5","M21 12H9"],
  menu:    ["M3 12h18","M3 6h18","M3 18h18"],
  close:   ["M18 6L6 18","M6 6l12 12"],
  plus:    ["M12 5v14","M5 12h14"],
  dl:      ["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4","M7 10l5 5 5-5","M12 15V3"],
  check:   "M20 6L9 17l-5-5",
  clock:   ["M12 2a10 10 0 100 20 10 10 0 000-20z","M12 6v6l4 2"],
  send:    ["M22 2L11 13","M22 2L15 22l-4-9-9-4 22-7z"],
  cal:     ["M3 9h18","M16 3v4","M8 3v4","M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"],
  chevR:   ["M9 18l6-6-6-6"],
  chat:    ["M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"],
};


const Badge = ({ s }) => (
  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${statusClass(s)}`}>{s}</span>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${className}`}>{children}</div>
);

const CardHead = ({ title, right }) => (
  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
    <span className="font-display font-bold text-slate-800 text-base">{title}</span>
    {right}
  </div>
);



function PageComplaints() {

    const COMPLAINTS_INIT = [
  { id:1, title:"Water leakage in bathroom", desc:"Continuous drip from the overhead shower joint since last week.", date:"28 Mar", status:"in-progress", cat:"Plumbing" },
  { id:2, title:"Broken window latch",       desc:"The window latch in my room does not close properly.", date:"20 Mar", status:"resolved",    cat:"Carpentry" },
];

const login = localStorage.getItem("login");
const decodeToken = jwtDecode(login);

 const {mutate:raisecomplaint} = useRaiseComplaint();
 const {data:complaints} = usegetComplaints(decodeToken?.hostelId)

    const [modal,       setModal]       = useState(null);


    const handleSubmitComplaint = (data)=>{
      data.hostelId = decodeToken.hostelId;
      data.userId = decodeToken._id;
      raisecomplaint(data,{
        onSuccess:()=>{
            setModal(null);
        }
      })
    }



  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800">My Complaints</h2>
          <p className="text-sm text-slate-400 mt-1">{complaints?.length} complaint{complaints?.length !== 1 ? "s" : ""} raised</p>
        </div>
        <button
          onClick={() => setModal("complaint")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-teal-100 hover:from-teal-700 hover:to-teal-800 transition-all border-none cursor-pointer"
        >
          <Ic d={IC.plus} size={14} /> Raise
        </button>
      </div>
      <div className="space-y-3">
        {complaints?.map(cmp => (
          <Card key={cmp.id}>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="bg-slate-100 text-slate-600 font-mono text-xs font-semibold px-2 py-0.5 rounded-lg">{cmp.category}</span>
                    <span className="text-xs text-slate-400">{cmp.date}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{cmp.issueTitle}</p>
                </div>
                <Badge s={cmp.status} />
              </div>
              {cmp.details && <p className="text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">{cmp.details}</p>}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
                <Ic d={IC.clock} size={12} stroke="#94a3b8" />
                Last updated: {cmp.date}
              </div>
            </div>
          </Card>
        ))}
        {complaints?.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Ic d={IC.check} size={36} stroke="#94a3b8" />
            <p className="font-semibold mt-3 text-base">No complaints raised</p>
            <p className="text-sm mt-1">You're all good! 🎉</p>
          </div>
        )}
      </div>


      {
        modal && <ComplaintModal     onClose={() => setModal(null)} onSubmit={handleSubmitComplaint} />
      }
    </div>
  );
}

export default PageComplaints;