import { useState } from "react";
import NoticeCard from "../../../../components/AdminComponents/Notice/NoticeCards";
import AddNoticeModal from "../../../../components/Models/Admin/NoticeModal";
import { usedeleteNotice, usegetNotices, usePublishNotice, useUpdateNotice } from "../../../../hooks/AdminHooks/NoticeHooks";
import { useParams } from "react-router-dom";
import DeleteModal from "../../../../components/Models/DeleteModal";

function makeId() { return Math.random().toString(36).slice(2, 9); }

const SEED = [
  {
    id: makeId(), pinned: true,
    title: "Water supply off — Saturday 6 AM to 12 PM",
    body: "Due to municipal maintenance, water supply will be interrupted on Saturday 7th June from 6:00 AM to 12:00 PM. Please store sufficient water in advance. We apologise for the inconvenience.",
    author: "Admin", createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    id: makeId(), pinned: true,
    title: "June 2026 rent due by 5th June",
    body: "Monthly rent for June 2026 is due by 5th June. Pay via UPI (stayease@upi) or at the office 9 AM – 6 PM. A ₹200/day late fee applies after the due date.",
    author: "Admin", createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: makeId(), pinned: false,
    title: "Main gate closes at 11 PM from today",
    body: "Effective immediately, the main gate will be locked at 11:00 PM every night. Late entry requires prior warden approval. Repeated violations attract a ₹500 fine.",
    author: "Warden", createdAt: new Date(Date.now() - 10 * 3600000).toISOString(),
  },
  {
    id: makeId(), pinned: false,
    title: "Lift on Floor 3 under repair until 10th June",
    body: "The lift serving Floor 3 is currently under repair. Please use the staircase. Technician is scheduled for 10th June and repairs should complete by EOD.",
    author: "Admin", createdAt: new Date(Date.now() - 20 * 3600000).toISOString(),
  },
  {
    id: makeId(), pinned: false,
    title: "Welcome — June 2026 new residents orientation",
    body: "All new residents joining this June are invited to an orientation session on 6th June at 5:00 PM in the common room. Please carry your original ID documents.",
    author: "Admin", createdAt: new Date(Date.now() - 28 * 3600000).toISOString(),
  },
  {
    id: makeId(), pinned: false,
    title: "Housekeeping time change for Floors 1 & 2",
    body: "Starting next week, housekeeping on Floors 1 and 2 will be done from 8:00 AM to 10:00 AM instead of 11 AM – 1 PM. Please keep your rooms accessible.",
    author: "Warden", createdAt: new Date(Date.now() - 40 * 3600000).toISOString(),
  },
  {
    id: makeId(), pinned: false,
    title: "No smoking anywhere inside the building",
    body: "Smoking is strictly prohibited in all areas — rooms, corridors, stairwells, and the terrace. First violation: formal warning. Repeated violations may lead to eviction.",
    author: "Warden", createdAt: new Date(Date.now() - 76 * 3600000).toISOString(),
  },
];





export default function NoticeBoard() {
  const [modal, setModal]     = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch]   = useState("");
  const {id} = useParams();
  
  const {mutate:publishNotice} = usePublishNotice();
  const {data:notices} = usegetNotices(id);
  const {mutate:updateNotice} = useUpdateNotice();
  const {mutate:deleteNotice} = usedeleteNotice();
  // const [notices, setNotices] = useState(noticesData || []);

  // console.log(noticesData);

  const filtered = notices?.filter(n => !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.body.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  function openAdd() {
    setModal({ mode: "add", data: { id: makeId(), title: "", body: "", author: "Admin", pinned: false, createdAt: new Date().toISOString() } });
  }

  
  function openEdit(n) { setModal({ mode: "edit", data: { ...n } }); }

  function save(data) {

        data.hostelId = id;
    if (modal.mode === "add"){
      publishNotice(data);
    }else{
      data.noticeId = data._id;
      updateNotice(data);
    }
    setModal(null);
  }

  function deleteModal(id) {
    deleteNotice(id);
    setDeleteId(null);
  }

  function togglePin(id) { setNotices(p => p.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n)); }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">

      {/* ── Navbar — identical to calendar ── */}
      <header className="bg-white border-b border-slate-200 px-4 md:px-6 h-14 flex items-center justify-between flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-slate-900 leading-tight">StayEase PG</div>
            <div className="text-xs text-slate-400">Hostel Management</div>
          </div>

          <span className="hidden sm:inline text-slate-300">/</span>

          {/* Active page indicator */}
          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/>
            </svg>
            Notice Board
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Nav tabs — same feel as calendar view switcher */}
          <div className="hidden md:flex gap-1 bg-slate-100 rounded-lg p-1">
            <span className="text-xs font-medium px-3 py-1 rounded-md bg-white text-blue-600 shadow-sm">
              Notices
            </span>
          </div>

          <button onClick={openAdd}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span className="hidden sm:inline">Post Notice</span>
          </button>
        </div>
      </header>

      {/* ── Stats bar — same as calendar ── */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex gap-3 overflow-x-auto flex-shrink-0">
        {[
          { label: "Total Notices", val: notices?.length,                           bg: "bg-blue-50",    ic: "text-blue-600",   path: "M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" },
          { label: "This Month",    val: notices?.filter(n => new Date(n.createdAt).getMonth() === new Date().getMonth()).length, bg: "bg-emerald-50", ic: "text-emerald-600", path: "M3 4h18M3 8h18M3 12h6" },
          { label: "Posted Today",  val: notices?.filter(n => { const d = new Date(n.createdAt); const t = new Date(); return d.getDate()===t.getDate()&&d.getMonth()===t.getMonth(); }).length, bg: "bg-purple-50", ic: "text-purple-600", path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 5v5l3 3" },
        ].map(s => (
          <div key={s.label} className={`flex items-center gap-2.5 ${s.bg} rounded-xl px-4 py-2 flex-shrink-0`}>
            <svg className={`w-5 h-5 ${s.ic}`} fill={s.filled ? "currentColor" : "none"} stroke={s.filled ? "none" : "currentColor"} strokeWidth="1.8" viewBox="0 0 24 24">
              <path d={s.path} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <div className="text-lg font-bold text-slate-800 leading-none">{s.val}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar — same as calendar toolbar ── */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between gap-3 flex-wrap flex-shrink-0">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search notices…"
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
        <span className="text-sm text-slate-400 font-medium">
          {filtered?.length} notice{filtered?.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Notices grid ── */}
      <main className="flex-1 px-4 md:px-6 py-6">
        {filtered?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
              </svg>
            </div>
            <div className="text-base font-semibold text-slate-700 mb-1">No notices found</div>
            <div className="text-sm text-slate-400 mb-5">Try a different search or post a new notice.</div>
            <button onClick={openAdd}
              className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Post Notice
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered?.map(notice => (
              <NoticeCard key={notice._id} notice={notice}
                onEdit={openEdit}
                onDelete={id => setDeleteId(id)}
                onPin={togglePin} />
            ))}
          </div>
        )}
      </main>

      {modal && <AddNoticeModal modal={modal} onClose={() => setModal(null)} onSave={save} />}

      {deleteId && (
        <DeleteModal title={"Delete Notice?"}
        description={"Are you sure you want to delete this notice? This action cannot be undone."}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteModal(deleteId)}
        isOpen={deleteId}
        decc={"These notice will be removed froma all the residents which assigned to your hostel"}
        />
      )}
    </div>
  );
}