import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  X,
  User,
  Mail,
  Phone,
  CalendarDays,
  IndianRupee,
} from "lucide-react";

const schema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),

  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  phone: yup.string().required("Phone number is required"),

  joiningDate: yup.string().required("Joining date is required"),

  deposit: yup
    .number()
    .typeError("Deposit must be a number")
    .min(0, "Deposit cannot be negative")
    .required("Deposit amount is required"),
});

const FIELDS = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "e.g. Rahul Sharma",
    Icon: User,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "e.g. rahul@example.com",
    Icon: Mail,
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "10-digit mobile number",
    Icon: Phone,
  },
  {
    name: "joiningDate",
    label: "Joining Date",
    type: "date",
    placeholder: "",
    Icon: CalendarDays,
  },
  {
    name: "deposit",
    label: "Deposit Amount (₹)",
    type: "number",
    placeholder: "e.g. 5000",
    Icon: IndianRupee,
  },
];

export default function AssignExistingResident({
  isOpen,
  onClose,
  onSubmit,
  existingRes,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      joiningDate: "",
      deposit: "",
    },
  });

  useEffect(() => {
    if (existingRes) {
      reset({
        name: existingRes?.name || "",
        email: existingRes?.email || "",
        phone: existingRes?.phone || "",
        joiningDate: existingRes?.joiningDate || "",
        deposit: existingRes?.deposit || "",
      });
    }
  }, [existingRes, reset]);

  useEffect(() => {
    if (!isOpen) {
      reset({
        name: "",
        email: "",
        phone: "",
        joiningDate: "",
        deposit: "",
      });
    }
  }, [isOpen, reset]);

  const handleFormSubmit = async (data) => {
    try {
      console.log("Submitted Data:", data);

      await onSubmit?.(data);

      onClose?.();
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Assign Resident
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Fill in the resident details
            </p>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <div className="px-6 py-5 grid grid-cols-1 gap-4">
            {FIELDS.map(({ name, label, type, placeholder, Icon }) => (
              <div key={name}>
                <label
                  htmlFor={name}
                  className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5"
                >
                  {label}
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon size={16} />
                  </span>

                  <input
                    id={name}
                    type={type}
                    placeholder={placeholder}
                    {...register(name)}
                    className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border transition-colors outline-none
                    ${
                      errors[name]
                        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 bg-gray-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 focus:bg-white"
                    }`}
                  />
                </div>

                {errors[name] && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors[name]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Saving..." : "Assign Resident"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}