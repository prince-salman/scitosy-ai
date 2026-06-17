"use client";

import React from 'react';

export const Button = React.forwardRef(({ children, variant = 'primary', size = 'md', className = '', ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lilac focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-lilac text-zinc-900 hover:brightness-95",
    secondary: "bg-lemon text-zinc-900 hover:brightness-95",
    ghost: "hover:bg-bunny hover:text-zinc-900 text-zinc-700"
  };

  const sizes = {
    sm: "h-9 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-11 px-8 text-base"
  };

  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

export const Input = React.forwardRef(({ label, error, className = '', id, ...props }, ref) => {
  const inputId = id || React.useId();
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      {label && <label className="text-sm font-medium leading-none text-zinc-700" htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        ref={ref}
        className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? 'border-changeling focus-visible:ring-changeling' : 'border-zinc-200 focus-visible:ring-lilac focus-visible:border-lilac'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-changeling font-medium">{error}</span>}
    </div>
  );
});

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`rounded-xl border border-bunny bg-white p-6 shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
};
