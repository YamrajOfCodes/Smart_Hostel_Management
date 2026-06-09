export const ACTION = { ACCEPT: "accept", REJECT: "reject", CLEAR: "clear" };


export const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
 
export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
};
 
export const getDaysUntilVacating = (noticePeriodStr) => {
  const diff = new Date(noticePeriodStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
 
export const getUrgencyConfig = (days) => {
  if (days <= 7)  return { label: `${days}d left`, dot: "bg-red-500",     pill: "bg-red-50   text-red-700   border border-red-200"    };
  if (days <= 14) return { label: `${days}d left`, dot: "bg-amber-500",   pill: "bg-amber-50 text-amber-700 border border-amber-200"  };
  return              { label: `${days}d left`, dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700 border border-emerald-200" };
};
 


 export const ACTION_CONFIG = {
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