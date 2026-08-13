const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors
          ${error ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-indigo-500'}
          focus:ring-2 ${error ? 'focus:ring-red-100' : 'focus:ring-indigo-100'}
          ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;