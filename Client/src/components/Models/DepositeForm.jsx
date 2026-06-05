import { useState } from "react";
import { CheckCircle, Receipt, Building2, User, Phone, Mail, Calendar, Hash, X, Pencil } from "lucide-react";
import Field from "../Reusable/Field";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatAmount(data) {
  return data?.toLocaleString("en-IN");
}

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function DepositForm({ onSubmit, onClose, resident }) {
  const today = new Date().toISOString().split("T")[0];

  // console.log(resident);

  const [form, setForm] = useState({
    name: resident.name ?? "",
    email: resident.email ?? "",
    phone: resident.phone ?? "",
    joiningDate: resident.joiningDate
      ? new Date(resident.joiningDate).toISOString().split("T")[0]
      : today,
    room: resident.room ?? "",
    hostelId: resident.hostelId ?? "",
    deposite: resident.deposite ?? "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Bank transfer");
  const [paymentDate, setPaymentDate] = useState(today);
  const [referenceId, setReferenceId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleConfirm = () => {
    const payload = {
      ...form,
      deposit: Number(form.deposit),
      paymentMethod,
      paymentDate,
      referenceId,
    };
    onSubmit?.(payload);
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose?.();
  };

  const inputCls =
    "text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all w-full";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="bg-white rounded-2xl border border-slate-100 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
      >
    
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 text-sm font-semibold flex-shrink-0">
                  {initials(form.name || "?")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{form.name || "—"}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500">Resident</span>
                    <span className="text-slate-300 text-xs">·</span>
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      <Building2 size={10} />
                      Room {form.room || "—"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <X size={15} />
              </button>
            </div>

            {/* Resident details */}
            <div className="px-5 py-4 border-b border-slate-100">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
                Resident details
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-xs text-slate-500">
                    <User size={12} /> Full name
                  </label>
                  <input className={inputCls} value={form.name} onChange={set("name")} placeholder="Full name" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Mail size={12} /> Email address
                  </label>
                  <input className={inputCls} type="email" value={form.email} onChange={set("email")} placeholder="email@example.com" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Phone size={12} /> Phone number
                  </label>
                  <input className={inputCls} type="tel" value={form.phone} onChange={set("phone")} placeholder="Phone number" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar size={12} /> Joining date
                  </label>
                  <input className={inputCls} type="date" value={form.joiningDate} onChange={set("joiningDate")} />
                </div>
              </div>
            </div>


            {/* Deposit */}
            <div className="px-5 py-4 border-b border-slate-100">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
                Deposit
              </p>

              {/* Editable amount */}
              <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 mb-4 gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-500 flex-shrink-0">
                  <Receipt size={15} />
                  Security deposit
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-slate-400 font-medium">₹</span>
                  <input
                    type="number"
                    value={form.deposite}
                    onChange={set("deposite")}
                    className="text-xl font-semibold text-slate-800 bg-transparent border-b border-dashed border-slate-300 focus:border-blue-400 focus:outline-none text-right w-36 transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-500">Payment method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className={inputCls}
                  >
                    {["Bank transfer", "Cash", "UPI", "Cheque"].map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-500">Payment date</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
{/* 
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500">
                  Reference / transaction ID{" "}
                  <span className="text-slate-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  placeholder="e.g. UTR123456789"
                  className={inputCls}
                />
              </div> */}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-3.5 bg-slate-50 rounded-b-2xl">
              <button
                onClick={handleClose}
                className="text-sm text-slate-500 px-4 py-2 rounded-lg border border-slate-200 hover:bg-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex items-center cursor-pointer gap-2 text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all"
              >
                <CheckCircle size={14} />
                Update User
              </button>
            </div>
      </div>
    </div>
  );
}