import React from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


  const formSchema = yup.object().shape({
    name:yup.string().required("Name is required"),
    email:yup.string().email("Invalid email format").required("Email is required"),
    password:yup.string().min(8,"Password must be at least 8 characters").required("Password is required"),
    phone:yup.number().min(10,"phone number cannot be exceed more than 10 numbers").required("Phone number is required"),
    role:yup.string().oneOf(["owner","student"],"Select a valid role").required("Role is required"),
  })




const RegisterAdminModal = ({setShowModal,addHostel}) => {
    
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const onSubmit = (data) => {
    addHostel(data);
    setShowModal(false);
  };

  return (
     <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl shadow-black/60" onClick={(e) => e.stopPropagation()}>

            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-600/15 border border-violet-500/25 flex items-center justify-center">
                  <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">Create New User</h2>
                  <p className="text-xs text-slate-500">Fill in the details below</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
              {[
                { name: "name", label: "Full Name", type: "text", placeholder: "e.g. Amit Sharma" },
                { name: "email", label: "Email Address", type: "email", placeholder: "e.g. amit@example.com" },
                { name: "password", label: "Password", type: "password", placeholder: "Min. 8 characters" },
                { name: "phone", label: "Phone Number", type: "text", placeholder: "e.g. 1234567890" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    {
                        ...register(field.name)
                    }
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 transition-all"
                  />
                  <p className="text-red-400 text-xs mt-1">
                    {errors[field.name]?.message}
                  </p>
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                  Role
                </label>
                <select
                  {...register("role")}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 transition-all cursor-pointer"
                >
                  <option value="" disabled>Select a role…</option>
                  <option value="owner">Owner</option>
                  <option value="student">Student</option>
                </select>
                <p className="text-red-400 text-xs mt-1">
                  {errors.role?.message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-600/25"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
  )
}

export default RegisterAdminModal
