"use client";
export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
    const base = 'cursor-pointer inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    const variants = {
        primary: 'bg-accent-gradient text-white hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl',
        outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-white transition-all duration-200',
        ghost: 'hover:bg-accent/10 hover:text-accent transition-all duration-200',
        danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg',
        accent: 'bg-accent-gradient hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl',
        warm: 'bg-accent-warm text-white hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl',
    };
    const sizes = {
        sm: 'h-8 px-3 py-1 text-sm',
        md: 'h-10 px-6 py-2 text-sm font-medium',
        lg: 'h-12 px-8 text-base font-semibold',
        xl: 'h-14 px-10 text-lg font-bold',
    };
    const cn = `${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`;
    return (
        <button className={cn} {...props}>
            {children}
        </button>
    );
}
