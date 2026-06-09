import { useState } from "react";
import {
  Download, Search, Clock, CheckCircle, Tag, DoorOpen,
  AlertCircle, Loader2, XCircle,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { usedeleteComplaint, usegetComplaints, useUpdateComplaint } from "../../../../hooks/UserHooks/complaintHooks";
import { Pagination } from "../../../../components/Reusable/Pagination";
import StatCard from "../../../../components/AdminComponents/NoticePeriod/StateCard";
import ComplaintCard from "../../../../components/AdminComponents/Complaint/ComplaintCard";
import FullPageLoader from "../../../../components/Loaders/DataLoading/FullPageLoader";

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 3;

const STATUS_FILTERS = ["all", "pending", "in-progress", "resolved", "rejected"];

const STATUS_STYLES = {
  pending:       "bg-amber-50 text-amber-700 border border-amber-200",
  "in-progress": "bg-blue-50 text-blue-700 border border-blue-200",
  resolved:      "bg-emerald-50 text-emerald-700 border border-emerald-200",
  rejected:      "bg-red-50 text-red-700 border border-red-200",
};

const MOCK_COMPLAINTS = [
  { id: 1, issueTitle: "Water leakage in bathroom",  details: "Continuous drip from the overhead shower joint since last week. Causing water damage to the floor.", date: "28 Mar 2025", status: "in-progress", category: "Plumbing",     resident: "Arjun Mehta",   room: "A-204", initials: "AM" },
  { id: 2, issueTitle: "Broken window latch",         details: "The window latch in the room does not close properly, causing a security concern.",                  date: "20 Mar 2025", status: "resolved",    category: "Carpentry",    resident: "Priya Sharma",  room: "B-102", initials: "PS" },
  { id: 3, issueTitle: "No hot water in shower",      details: "Hot water has not been available for the past 3 days. Affects entire B-block.",                     date: "1 Apr 2025",  status: "pending",     category: "Plumbing",     resident: "Rohit Nair",    room: "B-308", initials: "RN" },
  { id: 4, issueTitle: "Electrical socket sparking",  details: "The socket near the study table is sparking when plugging in devices. Immediate attention needed.",   date: "3 Apr 2025",  status: "pending",     category: "Electrical",   resident: "Sneha Kapoor",  room: "C-110", initials: "SK" },
  { id: 5, issueTitle: "Pest infestation in kitchen", details: "Cockroaches spotted near the common kitchen area multiple times this week.",                         date: "30 Mar 2025", status: "in-progress", category: "Pest Control", resident: "Dev Patel",     room: "A-301", initials: "DP" },
  { id: 6, issueTitle: "AC not cooling properly",     details: "Air conditioning unit is running but not bringing temperature below 28°C even on max settings.",     date: "25 Mar 2025", status: "rejected",    category: "HVAC",         resident: "Meera Iyer",    room: "D-207", initials: "MI" },
  { id: 7, issueTitle: "Flickering corridor lights",  details: "Lights in the B-block corridor flicker every evening, making it hard to navigate at night.",        date: "5 Apr 2025",  status: "pending",     category: "Electrical",   resident: "Karan Joshi",   room: "B-201", initials: "KJ" },
  { id: 8, issueTitle: "Clogged washroom drain",      details: "The common washroom drain on floor 3 has been clogged for two days now. Water pooling.",             date: "6 Apr 2025",  status: "pending",     category: "Plumbing",     resident: "Ananya Singh",  room: "C-305", initials: "AS" },
];



function PageAdminComplaints() {
  const { id } = useParams();
  const { data: complaints = [],isPending } = usegetComplaints(id);
  const [isLoading, setIsLoading] = useState(false);
  const {mutate:updatecomplaint} = useUpdateComplaint();
  const {mutate:deletecomplaint} = usedeleteComplaint();
  const [activeFilter, setActiveFilter]   = useState("all");
  const [search, setSearch]               = useState("");
  const [currentPage, setCurrentPage]     = useState(1);
  const [toast, setToast]                 = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const updateStatus = (complaintId, status) => {
    const payload = {
      complaintId,
      status
    }
    setIsLoading(true)
    updatecomplaint(payload,{
      onSuccess:()=>{
        showToast("Status updated successfully.");
      },
      onSettled:()=>{
        setIsLoading(false);
      }
    })
  };

  const handleDeleteComplaint = (id)=>{
    setIsLoading(true);
    deletecomplaint(id,{
      onSuccess:()=>{
        setIsLoading(true);
      },
      onSettled:()=>{
        setIsLoading(true);
      }
    });
  }


  const filtered = complaints.filter(c => {
    const matchFilter = activeFilter === "all" || c.status === activeFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.issueTitle.toLowerCase().includes(q) ||
      c.resident.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.room.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  // ─── Pagination ─────────────────────────────────────────────────────────────

  const totalPages   = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedList = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const countByStatus = (s) => complaints.filter(c => c.status === s).length;


  return (
    <div className="space-y-5 relative px-6 py-4">
       {isLoading && <FullPageLoader message="Updating status…" />}
       {isPending && <FullPageLoader message="Updating status…" />}

    <div className="flex items-start justify-between gap-3">
      ...
    </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1714]">Complaints</h2>
          <p className="text-sm text-[#A09890] mt-1">
            {filtered.length} complaint{filtered.length !== 1 ? "s" : ""} · Hostel Block A–D
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1714] text-white rounded-xl text-sm font-semibold hover:bg-[#2C2825] transition-colors border-none cursor-pointer">
          <Download size={14} />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCard label="Total"       value={complaints.length}         valueClass="text-[#1A1714]" />
        <StatCard label="Pending"     value={countByStatus("pending")}     valueClass="text-amber-600" />
        <StatCard label="In Progress" value={countByStatus("in-progress")} valueClass="text-blue-600" />
        <StatCard label="Resolved"    value={countByStatus("resolved")}    valueClass="text-emerald-600" />
        <StatCard label="Rejected"    value={countByStatus("rejected")}    valueClass="text-red-600" />
      </div>


      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_FILTERS.map(filter => (
          <button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer capitalize ${
              activeFilter === filter
                ? "bg-[#1A1714] text-white border-transparent"
                : "bg-white text-[#6B6560] border-[#DDD9D4] hover:border-[#C8A96E] hover:text-[#1A1714]"
            }`}
          >
            {filter}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 border border-[#DDD9D4] rounded-xl px-3 py-1.5 bg-white focus-within:border-[#C8A96E] transition-colors">
          <Search size={14} className="text-[#A09890] shrink-0" />
          <input
            type="text"
            placeholder="Search complaints…"
            value={search}
            onChange={handleSearchChange}
            className="text-sm outline-none bg-transparent text-[#1A1714] placeholder-[#A09890] w-44"
          />
        </div>
      </div>

      {/* Complaint Cards */}
      <div className="space-y-3">
        {paginatedList.map(complaint => (
          <ComplaintCard key={complaint.id} complaint={complaint} onStatusChange={updateStatus} onDelete={handleDeleteComplaint} />
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#A09890]">
            <CheckCircle size={36} className="mx-auto text-[#C4BFBA]" />
            <p className="font-semibold mt-3 text-base text-[#6B6560]">No complaints found</p>
            <p className="text-sm mt-1">Try adjusting your filter or search term.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between gap-2 text-sm text-[#A09890]">
          <span>
            Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–
            {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 bg-[#1A1714] text-white text-sm px-4 py-2.5 rounded-xl shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}


export default PageAdminComplaints;