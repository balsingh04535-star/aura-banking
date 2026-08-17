import React from 'react';

interface PunjabiMascotProps {
  className?: string;
  size?: number;
}

export const PunjabiMascot: React.FC<PunjabiMascotProps> = ({
  className = '',
  size = 40,
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-tr from-[#1a1d24] via-[#242933] to-[#2c3240] border border-white/20 shadow-sm shrink-0 select-none ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Radial Glow */}
        <circle cx="50" cy="50" r="50" fill="url(#bgGrad)" />

        <defs>
          <radialGradient
            id="bgGrad"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(50 30) rotate(90) scale(60)"
          >
            <stop stopColor="#FF9F43" stopOpacity="0.25" />
            <stop offset="0.7" stopColor="#1E232D" />
            <stop offset="1" stopColor="#12151B" />
          </radialGradient>

          <linearGradient id="turbanGrad" x1="20" y1="15" x2="80" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF9F43" />
            <stop offset="0.5" stopColor="#EE5253" />
            <stop offset="1" stopColor="#5F27CD" />
          </linearGradient>

          <linearGradient id="skinGrad" x1="35" y1="40" x2="65" y2="70" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F5CD79" />
            <stop offset="1" stopColor="#E17055" />
          </linearGradient>

          <linearGradient id="beardGrad" x1="30" y1="60" x2="70" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2C3E50" />
            <stop offset="1" stopColor="#1A252F" />
          </linearGradient>
        </defs>

        {/* Shoulders / Torso with Royal Kurta */}
        <path
          d="M20 95 C20 80, 35 76, 50 76 C65 76, 80 80, 80 95 Z"
          fill="#1E272E"
        />
        <path
          d="M50 76 L50 95"
          stroke="#FF9F43"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Face Silhouette */}
        <path
          d="M34 42 C34 32, 66 32, 66 42 C66 58, 62 68, 50 72 C38 68, 34 58, 34 42 Z"
          fill="url(#skinGrad)"
        />

        {/* Sleek Modern Beard & Moustache */}
        <path
          d="M34 52 C38 52, 44 58, 50 58 C56 58, 62 52, 66 52 C67 62, 62 76, 50 82 C38 76, 33 62, 34 52 Z"
          fill="url(#beardGrad)"
        />
        {/* Crisp Moustache */}
        <path
          d="M36 54 C42 57, 48 57, 50 60 C52 57, 58 57, 64 54 C61 58, 55 62, 50 62 C45 62, 39 58, 36 54 Z"
          fill="#111827"
        />

        {/* Eyes & Eyebrows */}
        <path
          d="M39 44 C42 42, 45 42, 47 44"
          stroke="#1E272E"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M53 44 C55 42, 58 42, 61 44"
          stroke="#1E272E"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="43" cy="48" r="2" fill="#1E272E" />
        <circle cx="57" cy="48" r="2" fill="#1E272E" />

        {/* Royal Stylized Pagri / Turban Fold Layers */}
        <g>
          {/* Base Crown Dome */}
          <path
            d="M24 38 C22 24, 38 12, 50 12 C62 12, 78 24, 76 38 C72 28, 62 20, 50 20 C38 20, 28 28, 24 38 Z"
            fill="url(#turbanGrad)"
          />

          {/* Diagonal Wrap Fold 1 */}
          <path
            d="M22 36 C30 20, 55 16, 76 30 C65 24, 40 24, 26 42 Z"
            fill="#EE5253"
            opacity="0.9"
          />

          {/* Diagonal Wrap Fold 2 (Crossing) */}
          <path
            d="M78 34 C70 18, 45 16, 24 30 C35 24, 60 24, 74 42 Z"
            fill="#FF9F43"
          />

          {/* Central Peak Wrap (Turla Peak) */}
          <path
            d="M48 10 C50 6, 52 6, 54 10 L50 14 Z"
            fill="#FFC048"
          />

          {/* Front Center Brooch / Kalgi Jewel */}
          <circle cx="50" cy="24" r="3.5" fill="#FFFFFF" />
          <circle cx="50" cy="24" r="2" fill="#5C7CFF" />
          <path
            d="M50 20 L50 14"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};
