import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SettingsSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ 
  title, 
  icon: Icon, 
  children 
}) => {
  return (
    <div className="bg-gradient-to-b from-yellow-200/85 to-yellow-300 rounded-[2rem]  shadow-lg p-4 
     border-4 border-yellow-200 backdrop-blur-sm  hover:border-yellow-500/50
      transform hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl shadow-md bg-yellow-300  border-2 border-yellow-100">
          <Icon className="w-5 h-5 text-black" />
        </div>
        <h2 className="text-xl font-semibold text-black/80">{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default SettingsSection;