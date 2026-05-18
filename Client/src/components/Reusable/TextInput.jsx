const TextInput = ({ ...props }) => (
  <input {...props}
    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none text-sm text-slate-800 bg-white transition-all" />
);

export default TextInput;