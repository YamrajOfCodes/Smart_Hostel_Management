import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  IndianRupee, Plus, Search, Filter, Download,
  CheckCircle2, Loader2, X, AlertCircle, Receipt,
  Calendar, ChevronDown, BedDouble, SlidersHorizontal
} from "lucide-react";
import { useGetRooms } from "../../../../hooks/AdminHooks/adminHooks";

// ── Helpers ────────────────────────────────────────────────────────
const fmtKey    = (d) => new Date(d).toISOString().split("T")[0];
const AVATAR_PAL = ["bg-blue-500","bg-violet-500","bg-teal-500","bg-amber-500","bg-rose-500","bg-sky-500"];

function nextDueDate(joinedAt) {
  const dueDay = new Date(joinedAt).getDate();
  const now    = new Date();
  let due = new Date(now.getFullYear(), now.getMonth(), dueDay);
  if (due <= now) due = new Date(now.getFullYear(), now.getMonth() + 1, dueDay);
  return due;
}

function monthsSince(joinedAt) {
  const j = new Date(joinedAt), n = new Date();
  return (n.getFullYear() - j.getFullYear()) * 12 + (n.getMonth() - j.getMonth());
}

function buildTenantList(rooms) {
  const list = [];
  rooms?.forEach(room => {
    room.roomMembers?.forEach(member => {
      list.push({
        key:        `${room._id}-${member._id}`,
        memberId:   member._id,
        roomId:     room._id,
        name:       member.name,
        email:      member.email,
        roomNumber: room.roomNumber,
        floor:      room.floor,
        roomType:   room.roomType,
        amount:     room.monthlyRent,
        joinedAt:   member.joinedAt,
        dueDate:    nextDueDate(member.joinedAt),
        monthsStay: monthsSince(member.joinedAt),
      });
    });
  });
  return list;
}

const STATUS_CFG = {
  paid:    { label: "Paid",    bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-100" },
  partial: { label: "Partial", bg: "bg-amber-50",   text: "text-amber-700",  dot: "bg-amber-400",   border: "border-amber-100" },
  unpaid:  { label: "Unpaid",  bg: "bg-rose-50",    text: "text-rose-700",   dot: "bg-rose-500",    border: "border-rose-100" },
};

const METHOD_STYLE = {
  "Cash":          "bg-amber-50 text-amber-700 border-amber-100",
  "Bank Transfer": "bg-sky-50   text-sky-700   border-sky-100",
  "Cheque":        "bg-violet-50 text-violet-700 border-violet-100",
};

function Avatar({ name, index, cls = "w-9 h-9" }) {
  return (
    <div className={`${cls} rounded-xl ${AVATAR_PAL[index % AVATAR_PAL.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
      {name?.[0]?.toUpperCase()}
    </div>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_CFG[status] ?? STATUS_CFG.unpaid;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} /> {s.label}
    </span>
  );
}

// ── Add Record Modal ───────────────────────────────────────────────
function AddRecordModal({ tenants, onClose, onSave }) {
  const [step, setStep]           = useState(1); // 1 = select tenant, 2 = fill details
  const [selected, setSelected]   = useState(null);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [form, setForm] = useState({
    amount: "", method: "Cash", date: fmtKey(new Date()),
    forMonth: new Date().getMonth(),
    forYear:  new Date().getFullYear(),
    notes: "",
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const filteredTenants = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.roomNumber.includes(search)
  );

  const handleSelectTenant = (tenant) => {
    setSelected(tenant);
    set("amount", tenant.amount);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    onSave({
      id:         Date.now(),
      tenant:     selected,
      ...form,
      amount:     Number(form.amount),
      status:     Number(form.amount) >= selected.amount ? "paid" : "partial",
      balance:    Math.max(0, selected.amount - Number(form.amount)),
      recordedAt: new Date().toISOString(),
    });
    setLoading(false);
    onClose();
  };

  const MONTHS = Array.from({ length: 12 }, (_, i) =>
    new Date(2026, i).toLocaleString("en-IN", { month: "long" })
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-md flex flex-col overflow-hidden"
        style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }}>

        <div className="h-1 w-full bg-slate-900" />

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <Receipt size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {step === 1 ? "Select Tenant" : "Record Payment"}
              </p>
              <p className="text-xs text-slate-400">
                {step === 1 ? "Choose who paid" : `${selected?.name} · Room ${selected?.roomNumber}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {step === 2 && (
              <button onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2">
                Change
              </button>
            )}
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Step 1 — Select tenant */}
        {step === 1 && (
          <div className="flex flex-col overflow-hidden" style={{ maxHeight: "70vh" }}>
            <div className="px-4 pt-4 pb-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search tenant or room…"
                  autoFocus
                  className="w-full pl-8 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white" />
              </div>
            </div>
            <div className="overflow-y-auto px-4 pb-4 flex flex-col gap-2">
              {filteredTenants.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-400">No tenants found</div>
              ) : filteredTenants.map((t, i) => (
                <button key={t.key} onClick={() => handleSelectTenant(t)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all text-left">
                  <Avatar name={t.name} index={i} cls="w-9 h-9" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{t.name}</p>
                    <p className="text-[11px] text-slate-400">
                      Room {t.roomNumber} · {t.floor} · {t.monthsStay}mo stay
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black text-slate-800">₹{t.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">
                      Due {t.dueDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Fill payment details */}
        {step === 2 && selected && (
          <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-4 overflow-y-auto max-h-[70vh]">

            {/* Tenant summary */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3">
              <Avatar name={selected.name} index={0} cls="w-9 h-9" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{selected.name}</p>
                <p className="text-[11px] text-slate-400">Room {selected.roomNumber} · {selected.floor}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-slate-800">₹{selected.amount.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400">monthly rent</p>
              </div>
            </div>

            {/* Offline only notice */}
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
              <AlertCircle size={13} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-amber-700 leading-relaxed">
                For <span className="font-bold">cash or offline payments only</span>. Online payments are recorded automatically.
              </p>
            </div>

            {/* For month + year */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">For month <span className="text-rose-400">*</span></label>
                <div className="relative">
                  <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select value={form.forMonth} onChange={e => set("forMonth", Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-slate-200 appearance-none">
                    {MONTHS.map((m, i) => (
                      <option key={i} value={i}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Year <span className="text-rose-400">*</span></label>
                <select value={form.forYear} onChange={e => set("forYear", Number(e.target.value))}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-slate-200">
                  {[2024, 2025, 2026, 2027].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-500">Amount <span className="text-rose-400">*</span></label>
                <button type="button" onClick={() => set("amount", selected.amount)}
                  className="text-[10px] text-blue-600 hover:underline font-semibold">
                  Full amount
                </button>
              </div>
              <div className="relative">
                <IndianRupee size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="number" value={form.amount} onChange={e => set("amount", e.target.value)}
                  required min="1" max={selected.amount} placeholder={selected.amount}
                  className="w-full pl-8 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white" />
              </div>
              {/* Partial indicator */}
              {form.amount && Number(form.amount) < selected.amount && (
                <p className="text-[11px] text-amber-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle size={11} />
                  Partial — ₹{(selected.amount - Number(form.amount)).toLocaleString()} balance remaining
                </p>
              )}
              {form.amount && Number(form.amount) >= selected.amount && (
                <p className="text-[11px] text-emerald-600 mt-1.5 flex items-center gap-1">
                  <CheckCircle2 size={11} /> Full payment
                </p>
              )}
            </div>

            {/* Method */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Method <span className="text-rose-400">*</span></label>
              <div className="grid grid-cols-3 gap-2">
                {["Cash", "Bank Transfer", "Cheque"].map(m => (
                  <button key={m} type="button" onClick={() => set("method", m)}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all
                      ${form.method === m ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment date */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Payment date <span className="text-rose-400">*</span></label>
              <div className="relative">
                <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
                  required
                  className="w-full pl-8 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white" />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Notes <span className="text-slate-300 font-normal">(optional)</span></label>
              <textarea value={form.notes} onChange={e => set("notes", e.target.value)}
                rows={2} placeholder="Any additional notes…"
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white resize-none" />
            </div>

            {/* Footer */}
            <div className="flex gap-2 pt-1 border-t border-slate-100">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-700 disabled:bg-slate-400 rounded-xl flex items-center justify-center gap-2 transition-all">
                {loading
                  ? <><Loader2 size={13} className="animate-spin" /> Saving…</>
                  : <><CheckCircle2 size={13} /> Save Record</>
                }
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────
export default function RentRecords() {
  const { id } = useParams();
  const { data: rooms = [] } = useGetRooms(id);

  const tenants = useMemo(() => buildTenantList(rooms), [rooms]);

  const [records, setRecords]       = useState([]);
  const [showModal, setShowModal]   = useState(false);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState("all");
  const [methodFilter, setMethod]   = useState("all");
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth());
  const [yearFilter, setYearFilter]   = useState(new Date().getFullYear());

  const filtered = records.filter(r => {
    const matchSearch = !search ||
      r.tenant.name.toLowerCase().includes(search.toLowerCase()) ||
      r.tenant.roomNumber.includes(search);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchMethod = methodFilter === "all" || r.method === methodFilter;
    const matchMonth  = r.forMonth === monthFilter && r.forYear === yearFilter;
    return matchSearch && matchStatus && matchMethod && matchMonth;
  });

  // Stats
  const totalCollected = filtered.reduce((a, r) => a + r.amount, 0);
  const totalExpected  = tenants.reduce((a, t) => a + t.amount, 0);
  const paidCount      = filtered.filter(r => r.status === "paid").length;
  const partialCount   = filtered.filter(r => r.status === "partial").length;

  const MONTHS = Array.from({ length: 12 }, (_, i) =>
    new Date(2026, i).toLocaleString("en-IN", { month: "long" })
  );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Payment Records</h1>
              <p className="text-sm text-slate-400 mt-0.5">Manual / offline payment records</p>
            </div>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-all">
              <Plus size={15} /> Add Record
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Records this month", value: filtered.length,                       color: "text-slate-800",    bg: "bg-slate-100",   icon: Receipt },
              { label: "Collected",          value: `₹${totalCollected.toLocaleString()}`, color: "text-emerald-700",  bg: "bg-emerald-50",  icon: CheckCircle2 },
              { label: "Fully paid",         value: paidCount,                             color: "text-blue-700",     bg: "bg-blue-50",     icon: CheckCircle2 },
              { label: "Partial",            value: partialCount,                          color: "text-amber-700",    bg: "bg-amber-50",    icon: AlertCircle },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon size={15} className={s.color} />
                </div>
                <div>
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[11px] text-slate-400">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 lg:px-8 py-3 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-3">

          {/* Month + Year */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select value={monthFilter} onChange={e => setMonthFilter(Number(e.target.value))}
                className="pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-medium focus:outline-none appearance-none">
                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
            </div>
            <select value={yearFilter} onChange={e => setYearFilter(Number(e.target.value))}
              className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-medium focus:outline-none">
              {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Status pills */}
          <div className="flex gap-1.5">
            {["all", "paid", "partial"].map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-all
                  ${statusFilter === s
                    ? s === "all"     ? "bg-slate-900 text-white border-slate-900"
                    : s === "paid"    ? "bg-emerald-500 text-white border-emerald-500"
                    :                   "bg-amber-400 text-white border-amber-400"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                {s}
              </button>
            ))}
          </div>

          {/* Method filter */}
          <select value={methodFilter} onChange={e => setMethod(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-medium focus:outline-none">
            <option value="all">All methods</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
          </select>

          {/* Search */}
          <div className="relative sm:ml-auto">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search tenant or room…"
              className="pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs w-48 focus:outline-none focus:ring-2 focus:ring-slate-100" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Desktop table */}
        <div className="hidden md:block bg-white rounded-2xl border border-slate-100 overflow-hidden"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Tenant", "Room", "For Month", "Amount", "Balance", "Method", "Paid On", "Status", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                        <Receipt size={20} className="text-slate-300" />
                      </div>
                      <p className="text-sm text-slate-400">No records for this month</p>
                      <button onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">
                        <Plus size={13} /> Add first record
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((r, i) => (
                <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors group">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={r.tenant.name} index={i} cls="w-8 h-8" />
                      <span className="font-semibold text-slate-800 text-sm">{r.tenant.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <BedDouble size={12} className="text-slate-400" />
                      <span className="text-slate-600 text-xs">{r.tenant.roomNumber} · {r.tenant.floor}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">
                    {new Date(2026, r.forMonth).toLocaleString("en-IN", { month: "long" })} {r.forYear}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-slate-800">₹{r.amount.toLocaleString()}</span>
                    <span className="text-slate-400 text-xs"> / ₹{r.tenant.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    {r.balance > 0
                      ? <span className="text-amber-600 font-semibold text-xs">₹{r.balance.toLocaleString()}</span>
                      : <span className="text-emerald-600 font-semibold text-xs">—</span>
                    }
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${METHOD_STYLE[r.method] || "bg-slate-50 text-slate-500 border-slate-100"}`}>
                      {r.method}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">
                    {new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    {r.status === "partial" && (
                      <button
                        onClick={() => { setShowModal(true); }}
                        className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2.5 py-1.5 border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 text-[11px] font-bold rounded-lg transition-all"
                      >
                        <Plus size={10} /> Add payment
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length > 0 && (
            <div className="px-4 py-2.5 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
              <p className="text-[11px] text-slate-400">
                {filtered.length} record{filtered.length !== 1 ? "s" : ""}
              </p>
              <p className="text-[11px] text-slate-400">
                Total collected: <span className="font-black text-slate-700">₹{totalCollected.toLocaleString()}</span>
              </p>
            </div>
          )}
        </div>

        {/* Mobile cards */}
        <div className="md:hidden flex flex-col gap-3">
          {filtered.map((r, i) => (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-100 p-4"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <Avatar name={r.tenant.name} index={i} cls="w-9 h-9" />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{r.tenant.name}</p>
                    <p className="text-[11px] text-slate-400">Room {r.tenant.roomNumber} · {r.tenant.floor}</p>
                  </div>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-xl p-3 mb-3 text-center">
                <div>
                  <p className="text-sm font-black text-slate-800">₹{r.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400">Paid</p>
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">
                    {r.balance > 0 ? `₹${r.balance.toLocaleString()}` : "—"}
                  </p>
                  <p className="text-[10px] text-slate-400">Balance</p>
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">
                    {new Date(2026, r.forMonth).toLocaleString("en-IN", { month: "short" })}
                  </p>
                  <p className="text-[10px] text-slate-400">Month</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${METHOD_STYLE[r.method]}`}>
                  {r.method}
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
              <Receipt size={28} className="text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400 mb-3">No records for this month</p>
              <button onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl mx-auto">
                <Plus size={13} /> Add first record
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <AddRecordModal
          tenants={tenants}
          onClose={() => setShowModal(false)}
          onSave={(record) => {
            setRecords(prev => [record, ...prev]);
            // Replace with: await addTransaction(payload) API call
          }}
        />
      )}
    </div>
  );
}