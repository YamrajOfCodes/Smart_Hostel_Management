import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { X, BedDouble, Plus, Loader2,  Wifi, Snowflake, Tv, Flame, Wind,
  Bath, ParkingCircle, WashingMachine, Building2, Camera} from "lucide-react";

// ── Validation ─────────────────────────────────────────────────────────
const schema = yup.object({
  floor:        yup.string().required("Floor is required"),
  roomNumber:   yup.string().required("Room number is required").matches(/^[A-Za-z0-9\-]+$/, "Letters, numbers and hyphens only").max(10, "Max 10 characters"),
  roomCategory: yup.string().oneOf(["AC", "Non-AC"], "Select a valid type").required("Room type is required"),
  roomType:     yup.string().oneOf(["Single", "Double", "Triple", "Quad", "Dormitory"]).required("Sharing type is required"),
  totalBeds:    yup.number().typeError("Must be a number").min(1, "Min 1 bed").max(10, "Max 10 beds").integer().required("Total beds required"),
  roomMembers:  yup.number().typeError("Must be a number").min(0).integer().required("Occupancy required")
    .test("not-exceeds", "Cannot exceed total beds", function (val) {
      return val <= this.parent.totalBeds;
    }),
  monthlyRent:  yup.number().typeError("Enter a valid amount").min(1, "Required").required("Rent is required"),
  securityDeposit: yup.number().typeError("Enter a valid amount").min(0).default(0),
  status:       yup.string().oneOf(["vacant", "occupied", "partial", "maintenance"]).required(),
  amenities:    yup.array().of(yup.string()).default([]),
  notes:        yup.string().max(300, "Max 300 characters").optional(),
});

// ── Constants ──────────────────────────────────────────────────────────
const SHARING_TYPES = ["Single", "Double", "Triple", "Quad", "Dormitory"];
const STATUS_OPTIONS = [
  { value: "vacant",      label: "Vacant",      color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { value: "occupied",    label: "Occupied",    color: "text-blue-700 bg-blue-50 border-blue-200" },
  { value: "partial",     label: "Partial",     color: "text-amber-700 bg-amber-50 border-amber-200" },
  { value: "maintenance", label: "Maintenance", color: "text-rose-700 bg-rose-50 border-rose-200" },
];

const AMENITIES = [
  { id: "wifi",          label: "Wi-Fi",       icon: Wifi },
  { id: "ac",            label: "AC",          icon: Snowflake },
  { id: "tv",            label: "TV",          icon: Tv },
  { id: "geyser",        label: "Geyser",      icon: Flame },
  { id: "fridge",        label: "Fridge",      icon: Wind },
  { id: "attached_bath", label: "Attach Bath", icon: Bath },
  { id: "parking",       label: "Parking",     icon: ParkingCircle },
  { id: "laundry",       label: "Laundry",     icon: WashingMachine },
  { id: "balcony",       label: "Balcony",     icon: Building2 },
  { id: "cctv",          label: "CCTV",        icon: Camera },
];

// ── Helpers ────────────────────────────────────────────────────────────
function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
      <span className="inline-block w-3 h-3 rounded-full border border-rose-400 text-center leading-3 text-[9px]">!</span>
      {message}
    </p>
  );
}

function Label({ children, required }) {
  return (
    <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide">
      {children}
      {required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
  );
}

const inputCls = (err) =>
  `w-full px-3 py-2.5 text-sm rounded-xl border bg-slate-50 text-slate-800 outline-none transition-all
   focus:bg-white focus:ring-2 focus:ring-slate-200
   ${err ? "border-rose-300 bg-rose-50 focus:ring-rose-100" : "border-slate-200"}`;

// ── Component ──────────────────────────────────────────────────────────
export default function AddRoomModal({ onClose, onSubmit: onSubmitProp,Floors }) {
  const {
    register, handleSubmit, control, watch, setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      floor: "", roomNumber: "", roomCategory: "", roomType: "",
      totalBeds: "", roomMembers: 0, monthlyRent: "", securityDeposit: "",
      status: "vacant", amenities: [], notes: "",
    },
  });

  // Auto-derive status
  const watchBeds    = watch("totalBeds");
  const watchMembers = watch("roomMembers");
  useEffect(() => {
    const beds    = Number(watchBeds);
    const members = Number(watchMembers);
    if (!beds) return;
    if (members === 0)          setValue("status", "vacant");
    else if (members >= beds)   setValue("status", "occupied");
    else                        setValue("status", "partial");
  }, [watchBeds, watchMembers, setValue]);

  const watchAmenities = watch("amenities") || [];
  const toggleAmenity  = (id) =>
    setValue("amenities", watchAmenities.includes(id)
      ? watchAmenities.filter(amnty => amnty !== id)
      : [...watchAmenities, id]
    );

  const onSubmit = async (data) => {
     onSubmitProp(data)
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose?.()}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden"
        style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <BedDouble size={17} className="text-white" />
            </div>
            <div>
              <p className="text-[15px] font-bold text-slate-900">Add new room</p>
              <p className="text-xs text-slate-400">Fill in all required fields</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
            <X size={15} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5">

          {/* Section: Location */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Location</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label required>Floor</Label>
                <select {...register("floor")} className={inputCls(errors.floor)}>
                  <option value="">Select floor</option>
                  {Floors.map(floor => floor !== "All"  && <option key={floor} value={floor}>{
                    `${floor}${floor == 1
                        ? "st"
                        : floor == 2
                          ? "nd"
                          : floor == 3
                            ? "rd"
                            : "th"
                      } Floor`
                  } </option>)}
                </select>
                <FieldError message={errors.floor?.message} />
              </div>
              <div>
                <Label required>Room number</Label>
                <input {...register("roomNumber")} placeholder="e.g. A-101"
                  className={inputCls(errors.roomNumber)} />
                <FieldError message={errors.roomNumber?.message} />
              </div>
            </div>
          </div>

          {/* Section: Room Type */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Room Type</p>

            {/* AC / Non-AC */}
            <div className="mb-3">
              <Label required>Category</Label>
              <Controller name="roomCategory" control={control} render={({ field }) => (
                <div className="grid grid-cols-2 gap-2">
                  {["AC", "Non-AC"].map(opt => (
                    <button key={opt} type="button" onClick={() => field.onChange(opt)}
                      className={`py-2.5 rounded-xl text-sm font-semibold border transition-all
                        ${field.value === opt
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}>
                      {opt === "AC" ? "❄️ AC" : "🌀 Non-AC"}
                    </button>
                  ))}
                </div>
              )} />
              <FieldError message={errors.roomCategory?.message} />
            </div>

            {/* Sharing type */}
            <div>
              <Label required>Sharing type</Label>
              <Controller name="roomType" control={control} render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {SHARING_TYPES.map(opt => (
                    <button key={opt} type="button" onClick={() => field.onChange(opt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                        ${field.value === opt
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              )} />
              <FieldError message={errors.roomType?.message} />
            </div>
          </div>

          {/* Section: Capacity */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Capacity</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label required>Total beds</Label>
                <input {...register("totalBeds")} type="number" min="1" max="10" placeholder="e.g. 3"
                  className={inputCls(errors.totalBeds)} />
                <FieldError message={errors.totalBeds?.message} />
              </div>
              <div>
                <Label required>Current occupancy</Label>
                <input {...register("roomMembers")} type="number" min="0" placeholder="e.g. 1"
                  className={inputCls(errors.roomMembers)} />
                <FieldError message={errors.roomMembers?.message} />
              </div>
            </div>
          </div>

          {/* Section: Pricing */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Pricing</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label required>Monthly rent</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">₹</span>
                  <input {...register("monthlyRent")} type="number" min="0" placeholder="8,500"
                    className={`${inputCls(errors.monthlyRent)} pl-7`} />
                </div>
                <FieldError message={errors.monthlyRent?.message} />
              </div>
              <div>
                <Label>Security deposit</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">₹</span>
                  <input {...register("securityDeposit")} type="number" min="0" placeholder="10,000"
                    className={`${inputCls(errors.securityDeposit)} pl-7`} />
                </div>
                <FieldError message={errors.securityDeposit?.message} />
              </div>
            </div>
          </div>

          {/* Section: Status */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Status</p>
            <Controller name="status" control={control} render={({ field }) => (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STATUS_OPTIONS.map(s => (
                  <button key={s.value} type="button" onClick={() => field.onChange(s.value)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all
                      ${field.value === s.value ? s.color : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            )} />
            <p className="text-[11px] text-slate-400 mt-1.5">Auto-set based on occupancy</p>
          </div>

          {/* Section: Amenities */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map(amenity => {
                const active = watchAmenities.includes(amenity.id);
                const Icon = amenity.icon;
                return (
                  <button key={amenity.id} type="button" onClick={() => toggleAmenity(amenity.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5
                       not-only:${active
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}>
                    <Icon size={13} />
                    {amenity.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label>Notes <span className="text-slate-300 font-normal">(optional)</span></Label>
            <textarea {...register("notes")} rows={2} placeholder="Any additional details about this room…"
              className={`${inputCls(errors.notes)} resize-none leading-relaxed`} />
            <FieldError message={errors.notes?.message} />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 mt-1">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-700 disabled:bg-slate-400 rounded-xl flex items-center gap-2 transition-all">
              {isSubmitting
                ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                : <><Plus size={14} /> Add room</>
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}