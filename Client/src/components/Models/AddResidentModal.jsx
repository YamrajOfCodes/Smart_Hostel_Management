import { useEffect, useState } from "react";
import { X, UserPlus, User, Phone, Mail, Building2, BedDouble, IndianRupee,Lock, CalendarArrowDown, Loader2 } from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide">
      {children}
      {required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
  );
}

const inputCls = "w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-slate-200 placeholder:text-slate-400";

function InputWithIcon({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <Icon size={14} />
      </div>
      <input {...props} className={`${inputCls} pl-9`} />
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────
function AddResidentModal({ onClose, onAdd, floors = [], rooms = [] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [form, setForm] = useState({
    name: "", floor: "", room: "", phone: "", email: "", deposite: "",joiningDate:"",password:"",
  });

  // Filter available rooms when floor changes
  useEffect(() => {
    if (!form.floor) return setAvailableRooms([]);
    const filtered = rooms
      .filter(r => r.floor === form.floor && r.status !== "occupied")
      .map(r => ({ id: r._id, roomNumber: r.roomNumber, totalBeds: r.totalBeds, occupied: r.roomMembers?.length || 0 }));
    setAvailableRooms(filtered);
    setForm(prev => ({ ...prev, room: "" })); // reset room on floor change
  }, [form.floor]);

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(res => setTimeout(res, 500));
    onAdd({ ...form, id: Date.now(), status: "active" });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md flex flex-col overflow-hidden"
        style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.16)" }}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <UserPlus size={16} className="text-white" />
            </div>
            <div>
              <p className="text-[15px] font-bold text-slate-900">Add Resident</p>
              <p className="text-xs text-slate-400">Fill in the tenant details</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
            <X size={15} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5 overflow-y-auto">

          {/* Personal Info */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Personal Info</p>
            <div className="flex flex-col gap-3">
              <div>
                <Label required>Full name</Label>
                <InputWithIcon
                  icon={User}
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  onChange={e => set("name", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label required>Phone</Label>
                  <InputWithIcon
                    icon={Phone}
                    required
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={e => set("phone", e.target.value)}
                  />
                </div>
                <div>
                  <Label required>Email</Label>
                  <InputWithIcon
                    icon={Mail}
                    required
                    type="email"
                    placeholder="rahul@email.com"
                    value={form.email}
                    onChange={e => set("email", e.target.value)}
                  />
                </div>
              </div>

                 <div>
                  <Label required>Password</Label>
                  <InputWithIcon
                    icon={Lock}
                    required
                    type="input"
                    placeholder="*****"
                    value={form.password}
                    onChange={e => set("password", e.target.value)}
                  />
                </div>
            </div>

            
          </div>

          {/* Room Assignment */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Room Assignment</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label required>Floor</Label>
                <div className="relative">
                  <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    required
                    value={form.floor}
                    onChange={e => set("floor", e.target.value)}
                    className={`${inputCls} pl-9 appearance-none`}
                  >
                    <option value="">Select floor</option>
                    {floors.map(floor => (
                      <option key={floor} value={floor}>{floor}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label required>Room</Label>
                <div className="relative">
                  <BedDouble size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    required
                    value={form.room}
                    onChange={e => set("room", e.target.value)}
                    disabled={!form.floor || availableRooms.length === 0}
                    className={`${inputCls} pl-9 appearance-none disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <option value="">
                      {!form.floor
                        ? "Select floor first"
                        : availableRooms.length === 0
                          ? "No rooms available"
                          : "Select room"}
                    </option>
                    {availableRooms.map(r => (
                      <option key={r.id} value={r.roomNumber}>
                        Room {r.roomNumber} · {r.occupied}/{r.totalBeds} beds
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
               <div className="mt-2">
                  <Label required>Joining Date</Label>
                  <InputWithIcon
                    icon={CalendarArrowDown}
                    required
                    type="date"
                    value={form.joiningDate}
                    onChange={e => set("joiningDate", e.target.value)}
                  />
                </div>

            {/* No rooms notice */}
            {form.floor && availableRooms.length === 0 && (
              <p className="mt-2 text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                No available rooms on this floor. Try a different floor.
              </p>
            )}
          </div>

          {/* Rent */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Rent</p>
            <div>
              <Label required>Deposite</Label>
              <div className="relative">
                <IndianRupee size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="number"
                  min="0"
                  placeholder="8,500"
                  value={form.deposite}
                  onChange={e => set("deposite", e.target.value)}
                  className={`${inputCls} pl-9`}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-700 disabled:bg-slate-400 rounded-xl flex items-center gap-2 transition-all">
              {isSubmitting
                ? <><Loader2 size={14} className="animate-spin" /> Adding…</>
                : <><UserPlus size={14} /> Add Resident</>
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddResidentModal;