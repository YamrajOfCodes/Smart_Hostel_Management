import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import hostel from "../../assets/svg/hostel.svg"
import * as yup from "yup";
import { useEffect } from "react";

const formSchema = yup.object().shape({
  hostelName: yup.string().required("Hostel name is required"),
  hostelCode: yup.string().required("Hostel code is required"),
  address: yup.string().required("Address is required"),
  phone: yup.string().matches(/^\+?\d{10,15}$/, "Invalid phone number").required("Phone number is required"),
  hostelFloors: yup.number().min(1, "Must have at least 1 floor").required("Number of floors is required"),
  rooms: yup.number().min(1, "Must have at least 1 room").required("Number of rooms is required"),
  rentAmount: yup.number().min(0, "Rent must be a positive number").required("Rent amount is required"),
});

export default function AddHostelModal({ 
  onClose, 
  onSubmit,
  editId,
  setEditId,
  editText,
}) 
{
  const { register, handleSubmit, formState: { errors },reset } = useForm({
    resolver: yupResolver(formSchema),
      defaultValues: {
      hostelName: "",
      hostelCode: "",
      address: "",
      phone: "",
      hostelFloors: "",
      rooms: "",
      rentAmount: "",
    }
  });


    useEffect(() => {
    if (editText) {
      reset({
        hostelName: editText.hostelName,
        hostelCode: editText.hostelCode,
        address: editText.address,
        phone: editText.phone,
        hostelFloors: editText.hostelFloors,
        rooms: editText.room,
        rentAmount: editText.rentAmount,
      });
    }
  }, [editText, reset]);

  const data = (data)=>{
    console.log(data)
     onSubmit(data)
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 21V12h6v9" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">Add new hostel</p>
              <p className="text-xs text-slate-400">Fill in the details to register your property</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form body */}
        <form className="px-6 py-5 flex flex-col gap-4" onSubmit={handleSubmit(data)}>

          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Hostel name
              </label>
              <input
                name="hostelName"
                {
                    ...register("hostelName")
                }
                type="text"
                placeholder="e.g. Sunrise PG & Hostel"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
              />
               <p className="text-red-500 text-xs mt-1">
                    {errors?.hostelName?.message}
                  </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Hostel code
              </label>
              <input
                name="hostelCode"
                {
                    ...register("hostelCode")
                }
                type="text"
                placeholder="e.g. HST-001"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
              />
                <p className="text-red-500 text-xs mt-1">
                    {errors?.hostelCode?.message}
                  </p>
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Address
            </label>
            <textarea
              name="address"
              {
                  ...register("address")
              }
              rows={2}
              placeholder="Street, area, city, state..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
            />
             <p className="text-red-500 text-xs mt-1">
                    {errors?.address?.message}
                  </p>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Phone
              </label>
              <input
                name="phone"
                {
                    ...register("phone")
                }
                type="tel"
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
              />
               <p className="text-red-500 text-xs mt-1">
                    {errors?.phone?.message}
                  </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Total floors
              </label>
              <input
                name="hostelFloors"
                {
                    ...register("hostelFloors")
                }
                type="number"
                min="1"
                placeholder="e.g. 4"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
              />
               <p className="text-red-500 text-xs mt-1">
                    {errors?.hostelFloors?.message}
                  </p>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Total rooms
              </label>
              <input
                name="rooms"
                {
                    ...register("rooms")
                }
                type="number"
                min="1"
                placeholder="e.g. 60"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
              />
               <p className="text-red-500 text-xs mt-1">
                    {errors?.hostelFloors?.message}
                  </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Rent / month
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">₹</span>
                <input
                  name="rentAmount"
                  {
                    ...register("rentAmount")
                  }
                  type="number"
                  min="0"
                  placeholder="e.g. 8000"
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                />
                 <p className="text-red-500 text-xs mt-1">
                    {errors?.rentAmount?.message}
                  </p>
              </div>
            </div>
          </div>

          {/* Info hint */}
          <div className="bg-slate-50 rounded-xl px-3 py-2.5 flex items-start gap-2">
            <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
            </svg>
            <p className="text-xs text-slate-400 leading-relaxed">
              You can add rooms, floors, and amenities in detail after saving the hostel.
            </p>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center border gap-2 px-5 py-2 cursor-pointer rounded-xl hover:bg-blue-500 active:bg-blue-700 text-blue-500 hover:text-white text-sm font-semibold transition-all shadow-sm shadow-blue-600/20"
          >
            <img src={hostel} alt="Hostel" className="w-8 h-8 object-contain" />
            <p>{editId !== null ? "update" : "Add"} hostel</p>
          </button>
        </div>
        </form>

        {/* Footer */}
        

      </div>
    </div>
  );
}