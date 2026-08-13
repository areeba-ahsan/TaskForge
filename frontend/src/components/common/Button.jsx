import Loader from './Loader';

const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-700',
};

const Button = ({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
        transition-colors disabled:opacity-60 disabled:cursor-not-allowed
        ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader size="sm" />}
      {children}
    </button>
  );
};

export default Button;