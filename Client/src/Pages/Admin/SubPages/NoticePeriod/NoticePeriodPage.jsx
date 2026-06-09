import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";
import {
 
} from "../../../../hooks/UserHooks/noticePeriodHooks";
import {
  useAcceptNoticePeriod,
  useRejectNoticePeriod,
  useClearNoticePeriod,
  useGetAllNoticesForHostel 
} from "../../../../hooks/AdminHooks/noticePeriodHooks";
import StatCard from "../../../../components/AdminComponents/NoticePeriod/StateCard";
import ResidentCard from "../../../../components/AdminComponents/NoticePeriod/ResidentCard";
import ResidentDetailDrawer from "../../../../components/AdminComponents/NoticePeriod/ResidentDetailDrawer";
import ActionConfirmModal from "../../../../components/Models/Admin/ActionConfirmModal";

const Icon = ({
  paths,
  size = 16,
  strokeWidth = 1.75,
  fill = "none",
  stroke = "currentColor",
  className = "",
}) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill={fill} stroke={stroke} strokeWidth={strokeWidth}
    strokeLinecap="round" strokeLinejoin="round"
    className={`shrink-0 block ${className}`}
  >
    {(Array.isArray(paths) ? paths : [paths]).map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
);

const ICONS = {
  shield:        "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  calendar:      ["M3 9h18","M16 3v4","M8 3v4","M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"],
  phone:         ["M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"],
  door:          ["M3 3h18v18H3z","M9 3v18"],
  rupee:         ["M6 3h12","M6 8h12","M6 13h8a4 4 0 000-8","M6 21l7-8"],
  clock:         ["M12 2a10 10 0 100 20 10 10 0 000-20z","M12 6v6l4 2"],
  search:        ["M11 17a6 6 0 100-12 6 6 0 000 12z","M21 21l-4.35-4.35"],
  check:         ["M22 11.08V12a10 10 0 11-5.93-9.14","M22 4L12 14.01l-3-3"],
  x:             ["M18 6L6 18","M6 6l12 12"],
  alertTriangle: ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z","M12 9v4","M12 17h.01"],
  download:      ["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4","M7 10l5 5 5-5","M12 15V3"],
  inbox:         ["M22 12h-6l-2 3H10l-2-3H2","M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"],
  mail:          ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"],
  joiningDate:   ["M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"],
  ban:           ["M12 2a10 10 0 100 20 10 10 0 000-20z","M4.93 4.93l14.14 14.14"],
};


const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
};

const getDaysUntilVacating = (noticePeriodStr) => {
  const diff = new Date(noticePeriodStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const getNoticeState = (noticePeriod) => {
  if (!noticePeriod)               return "none";
  if (noticePeriod === "approved") return "approved";
  if (noticePeriod === "rejected") return "rejected";
  return "pending";
};




const getUrgencyConfig = (days) => {
  if (days <= 7)  return { label: `${days}d left`, dot: "bg-red-500",     pill: "bg-red-50   text-red-700   border border-red-200"    };
  if (days <= 14) return { label: `${days}d left`, dot: "bg-amber-500",   pill: "bg-amber-50 text-amber-700 border border-amber-200"  };
  return              { label: `${days}d left`, dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700 border border-emerald-200" };
};

// ─── Action types ─────────────────────────────────────────────────────────────
const ACTION = { ACCEPT: "accept", REJECT: "reject", CLEAR: "clear" };

const ACTION_CONFIG = {
  [ACTION.ACCEPT]: {
    label:        "Accept Notice",
    title:        "Confirm Acceptance",
    confirmLabel: "Accept Notice",
    confirmClass: "bg-emerald-700 hover:bg-emerald-800 text-white",
    headerClass:  "text-emerald-700",
    checklist: [
      "Notice period dates have been verified.",
      "Resident has been formally acknowledged.",
      "Room is scheduled for inspection on exit.",
    ],
  },
  [ACTION.REJECT]: {
    label:        "Reject Notice",
    title:        "Confirm Rejection",
    confirmLabel: "Reject Notice",
    confirmClass: "bg-red-700 hover:bg-red-800 text-white",
    headerClass:  "text-red-700",
    checklist: [
      "Grounds for rejection have been documented.",
      "Resident has been informed of the reason.",
      "New notice period terms have been communicated.",
    ],
  },
  [ACTION.CLEAR]: {
    label:        "Mark Vacated",
    title:        "Confirm Vacated",
    confirmLabel: "Confirm Vacated",
    confirmClass: "bg-[#1A1714] hover:bg-[#2D2825] text-white",
    headerClass:  "text-[#5A5248]",
    checklist: [
      "Room has been inspected and cleared.",
      "Keys have been returned by the resident.",
      "Deposit refund has been processed.",
    ],
  },
};


export default function PageAdminNoticePeriod() {
  const { id: hostelId } = useParams();

  const [searchQuery,    setSearchQuery]    = useState("");
  const [drawerResident, setDrawerResident] = useState(null);
  const [pendingAction,  setPendingAction]  = useState(null); // { resident, action }

  const { data: notices = [], isLoading } = useGetAllNoticesForHostel(hostelId);

  const { mutate: clearNotice,  isPending: isClearing  } = useClearNoticePeriod();
  const { mutate: acceptNotice, isPending: isAccepting } = useAcceptNoticePeriod();
  const { mutate: rejectNotice, isPending: isRejecting } = useRejectNoticePeriod();

  const isProcessing = isClearing || isAccepting || isRejecting;

  /* Search */
  const filteredResidents = notices.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      r.name.toLowerCase().includes(q)       ||
      r.email.toLowerCase().includes(q)      ||
      r.roomNumber.toLowerCase().includes(q) ||
      r.phone.includes(q)
    );
  });

  /* Stats */
  const urgentCount   = notices.filter((r) => getNoticeState(r.noticePeriod) === "pending" && getDaysUntilVacating(r.noticePeriod) <= 7).length;
  const soonCount     = notices.filter((r) => { if (getNoticeState(r.noticePeriod) !== "pending") return false; const d = getDaysUntilVacating(r.noticePeriod); return d > 7 && d <= 14; }).length;
  const upcomingCount = notices.filter((r) => getNoticeState(r.noticePeriod) === "pending" && getDaysUntilVacating(r.noticePeriod) > 14).length;

  const openActionModal = (resident, action) => {
    setDrawerResident(null);
    setPendingAction({ resident, action });
  };

  const closeModal = () => setPendingAction(null);

  const handleConfirmAction = () => {
    const { resident, action } = pendingAction;
    const payload = { email: resident.email, hostelId };

    const mutationOptions = {
      onSuccess: () => closeModal(),
      onError:   () => closeModal(), 
    };

    if (action === ACTION.CLEAR)  clearNotice(payload,  mutationOptions);
    if (action === ACTION.ACCEPT) acceptNotice(payload, mutationOptions);
    if (action === ACTION.REJECT) rejectNotice(payload, mutationOptions);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <div className="max-w-4xl mx-auto px-4 py-7 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-px w-5 bg-[#9E8E7A]" />
              <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#9E8E7A]">
                Hostel Management
              </span>
            </div>
            <h1 className="text-[28px] leading-none text-[#1A1714] mb-1.5"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
              Notice Period
            </h1>
            <p className="text-[13px] text-[#9B9086]">
              Residents who have submitted a vacating notice
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1714] text-white text-xs font-semibold rounded-lg border-none cursor-pointer hover:bg-[#2D2825] transition-colors">
            <Icon paths={ICONS.download} size={13} stroke="white" />
            Export
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <StatCard dotClass="bg-[#3B82F6]"  label="Total Notices" value={notices.length}  valueClass="text-[#1A1714]"    />
          <StatCard dotClass="bg-red-500"     label="This Week"     value={urgentCount}     valueClass="text-red-700"      />
          <StatCard dotClass="bg-amber-500"   label="Next 2 Weeks"  value={soonCount}       valueClass="text-amber-700"    />
          <StatCard dotClass="bg-emerald-500" label="Upcoming"      value={upcomingCount}   valueClass="text-emerald-700"  />
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 bg-white border border-[#EAE7E2] rounded-xl px-4 py-2.5">
          <Icon paths={ICONS.search} size={14} stroke="#C0B8B0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, room or phone…"
            className="flex-1 text-sm text-[#1A1714] placeholder-[#C0B8B0] bg-transparent outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}
              className="text-[#C0B8B0] hover:text-[#5A5248] transition-colors cursor-pointer border-none bg-transparent">
              <Icon paths={ICONS.x} size={13} stroke="currentColor" />
            </button>
          )}
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin w-5 h-5 text-[#9E8E7A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.25"/>
              <path d="M21 12a9 9 0 01-9 9"/>
            </svg>
          </div>
        ) : filteredResidents.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 bg-[#F2EFE9] rounded-xl flex items-center justify-center mx-auto mb-4">
              <Icon paths={ICONS.inbox} size={22} stroke="#B0A898" />
            </div>
            <p className="text-sm font-semibold text-[#1A1714] mb-1">No notices found</p>
            <p className="text-xs text-[#B0A898]">
              {searchQuery ? "Try a different search term." : "No residents have submitted a notice period yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredResidents.map((resident) => (
                <ResidentCard
                  key={resident._id}
                  resident={resident}
                  onViewDetails={setDrawerResident}
                  onAction={openActionModal}
                />
              ))}
            </div>
            <p className="text-xs text-[#B0A898] text-center">
              Showing {filteredResidents.length} of {notices.length} notice{notices.length !== 1 ? "s" : ""}
            </p>
          </>
        )}

      </div>


      {drawerResident && (
        <ResidentDetailDrawer
          resident={drawerResident}
          onClose={() => setDrawerResident(null)}
          onAction={openActionModal}
        />
      )}

      {pendingAction && (
        <ActionConfirmModal
          resident={pendingAction.resident}
          action={pendingAction.action}
          onConfirm={handleConfirmAction}
          onCancel={closeModal}
          isLoading={isProcessing}
        />
      )}

    </div>
  );
}