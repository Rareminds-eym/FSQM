import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2'
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify CSS

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min,
  max,
  step
}) => {
  
  const sound = new Audio('/sounds/click.mp3'); 
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
    
    const volume = (newValue - min) / (max - min); 
    sound.volume = volume; 
    sound.play(); 

    if (newValue === max) {
      Swal.fire({
        title: 'Warning',
        text: 'Too Loud!',
        icon: 'warning',
        confirmButtonText: 'Close',
        background:'gold',
        
      })
    }
  };

  return (
    <div className="space-y-2 mt-4">
      <label>Increase Volume:
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="w-full h-2 bg-yelloww  shadow-inner  rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:hover:bg-blue-400
            [&::-webkit-slider-thumb]:transition-colors
            [&::-webkit-slider-thumb]:duration-300"
        />
      </label>
       
    </div>
  );
};

export default Slider;
