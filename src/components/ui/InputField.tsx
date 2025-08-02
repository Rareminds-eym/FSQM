import React, { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-black/60 mb-1">
      {label}
    </label>
    <input
      {...props}
      required
      className=" w-full px-4 py-2 bg-gradient-to-b  from-yellow-300 via-yellow-400 to-yellow-500 z-0  
      shadow-lg  rounded-xl border-2 border-yellow-200
         placeholder-black/50
        focus:border-blue-500 focus:ring-1 focus:ring-blue-500
        text-black transition-all duration-300"
    />
  </div>
);

export default InputField;