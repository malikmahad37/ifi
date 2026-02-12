
import React from 'react';
import { LOGO_URL } from '../constants';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-48 h-48" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img 
        src={LOGO_URL} 
        alt="iFi Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default Logo;
