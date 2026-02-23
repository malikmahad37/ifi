import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    velocity: { x: number; y: number };
    rotation: number;
}

const ClickEffects: React.FC = () => {
    const { theme } = useTheme();
    const [particles, setParticles] = useState<Particle[]>([]);
    const lastSpawnTime = useRef(0);

    useEffect(() => {
        const spawnParticle = (x: number, y: number, isClick: boolean) => {
            const now = Date.now();
            const count = isClick ? 5 : 1; // Burst on click, stream on move
            const newParticles: Particle[] = [];
            const isDark = theme === 'dark';

            for (let i = 0; i < count; i++) {
                // Randomize physics
                const angle = Math.random() * Math.PI * 2;
                const speed = isClick ? Math.random() * 4 + 2 : Math.random() * 2 + 0.5;

                // Determine color based on theme
                let particleColor;
                if (isDark) {
                    particleColor = Math.random() > 0.5 ? '#D2E82D' : '#ffffff';
                } else {
                    // Dark grey or Black for light mode
                    particleColor = Math.random() > 0.5 ? '#333333' : '#000000';
                }

                newParticles.push({
                    id: now + i,
                    x: x,
                    y: y,
                    size: Math.random() * 4 + 2, // Varied sizes
                    color: particleColor,
                    velocity: {
                        x: Math.cos(angle) * speed,
                        y: Math.sin(angle) * speed
                    },
                    rotation: Math.random() * 360
                });
            }

            setParticles(prev => [...prev.slice(-15), ...newParticles]); // Limit total particles

            // Cleanup
            setTimeout(() => {
                setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
            }, 600);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now();
            if (now - lastSpawnTime.current > 50) { // Throttle: increased to 50ms to fix severe lag
                spawnParticle(e.clientX, e.clientY, false);
                lastSpawnTime.current = now;
            }
        };

        const handleClick = (e: MouseEvent) => spawnParticle(e.clientX, e.clientY, true);

        // Touch handling
        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            const now = Date.now();
            if (now - lastSpawnTime.current > 50) {
                spawnParticle(touch.clientX, touch.clientY, false);
                lastSpawnTime.current = now;
            }
        };
        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0];
            spawnParticle(touch.clientX, touch.clientY, true);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchstart', handleTouchStart);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchstart', handleTouchStart);
        };
    }, [theme]); // Re-bind if theme changes to ensure new particles get correct color immediately

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <AnimatePresence>
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        initial={{
                            opacity: 1,
                            scale: 1,
                            x: 0,
                            y: 0,
                            rotate: particle.rotation
                        }}
                        animate={{
                            opacity: 0,
                            scale: 0,
                            x: particle.velocity.x * 20, // Move outward
                            y: particle.velocity.y * 20 + 20, // Gravity effect (fall down slightly)
                            rotate: particle.rotation + 180
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute rounded-sm shadow-sm"
                        style={{
                            left: particle.x,
                            top: particle.y,
                            width: particle.size,
                            height: particle.size,
                            backgroundColor: particle.color,
                            x: '-50%',
                            y: '-50%',
                            boxShadow: theme === 'dark' ? '0 0 8px rgba(210,232,45,0.6)' : 'none',
                            border: theme === 'light' ? '1px solid rgba(0,0,0,0.1)' : 'none'
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ClickEffects;
