import React from 'react';
import { motion } from 'framer-motion';

const NutBoltAnimation: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 [.light-theme_&]:opacity-100 transition-opacity duration-1000 z-0">
            {/* Cinematic Background Layer */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src="https://images.unsplash.com/photo-1596461404942-368159bb7b0c?q=80&w=2000&auto=format&fit=crop"
                    alt="Nuts and Bolts Background"
                    className="w-full h-full object-cover object-center opacity-60 grayscale-0 scale-110"
                    loading="eager"
                />
            </div>

            {/* Responsive Overlays for Functionality */}
            {/* Mobile: Stronger fade to ensure text readability on small screens */}
            <div className="absolute inset-0 bg-white/40 md:bg-transparent" />

            {/* Center Radial Fade - Stronger center for text */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.7)_40%,rgba(255,255,255,0.1)_100%)]" />

            {/* Top Fade for Navbar visibility */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white via-white/90 to-transparent" />

            {/* Bottom Fade for smooth transition to content */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent" />
        </div>
    );
};

export default NutBoltAnimation;
