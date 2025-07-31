import { Home, LogOut } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../home/AuthContext';
import AnimatedTitle from '../ui/AnimatedTitle';
import CircuitLines from '../ui/animations/CircuitLines';
import GameplaySettings from './sections/GameplaySettings';
import SoundSettings from './sections/SoundSettings';


const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex-1 bg-yelloww p-4  md:p-8 relative overflow-hidden">
      <CircuitLines />
      
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Home Button */}
        <div className="absolute left-0 top-0">
          <button
            onClick={() => navigate('/')}
            className="group bg-gradient-to-b from-red-200 to-red-300 rounded-full shadow-lg p-4 text-black font-semibold  hover:scale-105 active:scale-95 
              transform hover:-translate-y-1 hover:translate-x-1 border-2 border-red-100
              transition-all duration-300"
          >
            <Home className="w-5 h-5 text-red-700 group-hover:text-blue-400 transition-colors duration-300" />
          </button>
        </div>

        <div className="space-y-12 pt-16 mt-4">
          <AnimatedTitle text="SETTINGS" className="text-center" />
          
          <div className="space-y-8 ">
            <SoundSettings />
            {/* <LanguageSettings /> */}
            <GameplaySettings />
            
            {/* Logout Button */}
            <div className='flex items-center justify-center'>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 p-4
                px-6 py-2 shadow-lg bg-yellow-300 text-black/70 border-2
                 border-yellow-100 text-xl font-semibold rounded-lg hover:bg-yellow-400 transition"
            >
              <LogOut className="w-5 h-5"/>
              <span className="font-medium">Logout</span>
            </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;