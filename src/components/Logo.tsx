import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'white' | 'emblem';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  showTagline = true
}) => {
  // Sizing scales
  const sizeMap = {
    sm: { height: 'h-10', width: 'w-auto' },
    md: { height: 'h-13 sm:h-14', width: 'w-auto' },
    lg: { height: 'h-20', width: 'w-auto' },
    xl: { height: 'h-28', width: 'w-auto' }
  };

  const isWhite = variant === 'white';
  const navyColor = isWhite ? '#FFFFFF' : '#042354';
  const goldColor1 = '#BF8B2A';
  const goldColor2 = '#F5CE6D';
  const goldColor3 = '#C5A059';
  const dividerColor = isWhite ? '#E2E8F0' : '#042354';
  const tagColor = isWhite ? '#CBD5E1' : '#042354';

  if (variant === 'emblem') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <svg viewBox="0 0 350 330" className={`${sizeMap[size].height} w-auto`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="emblemGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={goldColor1} />
              <stop offset="50%" stopColor={goldColor2} />
              <stop offset="100%" stopColor={goldColor3} />
            </linearGradient>
            <linearGradient id="emblemNavy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isWhite ? '#FFFFFF' : '#041B3B'} />
              <stop offset="50%" stopColor={isWhite ? '#F8FAFC' : '#042354'} />
              <stop offset="100%" stopColor={isWhite ? '#E2E8F0' : '#0B356D'} />
            </linearGradient>
          </defs>
          <g transform="translate(10, 15)">
            {/* Globe Outer Circle */}
            <circle cx="150" cy="180" r="105" fill={isWhite ? 'transparent' : '#FFFFFF'} stroke={navyColor} strokeWidth="6" />
            
            {/* Globe Lat/Long grid */}
            <ellipse cx="150" cy="180" rx="55" ry="105" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 3" opacity="0.6"/>
            <line x1="45" y1="180" x2="255" y2="180" stroke="#94A3B8" strokeWidth="2" opacity="0.6"/>
            <ellipse cx="150" cy="180" rx="105" ry="55" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 3" opacity="0.6"/>
            
            {/* Continents */}
            <path d="M90,140 Q105,120 120,135 Q135,160 115,190 Q95,220 110,245 Q90,240 80,210 Q70,180 90,140 Z" fill={navyColor} opacity="0.95"/>
            <path d="M165,115 Q190,105 210,125 Q230,150 215,180 Q190,195 175,175 Q160,150 165,115 Z" fill={navyColor} opacity="0.95"/>
            <path d="M185,190 Q215,200 225,230 Q210,255 190,250 Q175,230 185,190 Z" fill={navyColor} opacity="0.95"/>

            {/* Giant V Left Wing */}
            <path d="M50,45 L118,45 L175,250 L125,250 Z" fill="url(#emblemNavy)" />
            {/* Giant V Right Wing */}
            <path d="M245,45 L180,45 L155,165 L190,165 Z" fill="url(#emblemGold)" />

            {/* Swoosh Arc */}
            <path d="M55,230 C65,275 140,285 210,230 C240,205 270,165 300,105" fill="none" stroke="url(#emblemGold)" strokeWidth="9" strokeLinecap="round"/>
            <path d="M68,245 C85,285 150,290 215,235 C245,210 275,165 305,108" fill="none" stroke="#FEF08A" strokeWidth="2" opacity="0.8"/>

            {/* Airplane */}
            <g transform="translate(300, 105) rotate(42)">
              <path d="M0,-25 C4,-25 6,-15 6,25 L-6,25 C-6,-15 -4,-25 0,-25 Z" fill={navyColor}/>
              <path d="M0,-2 L28,12 L28,18 L0,8 L-28,18 L-28,12 Z" fill={navyColor}/>
              <path d="M0,18 L12,25 L12,28 L0,24 L-12,28 L-12,25 Z" fill={navyColor}/>
            </g>
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox={showTagline ? "0 0 920 380" : "0 0 920 290"}
        className={`${sizeMap[size].height} w-auto`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`goldGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={goldColor1} />
            <stop offset="35%" stopColor="#DF9B35" />
            <stop offset="70%" stopColor={goldColor2} />
            <stop offset="100%" stopColor={goldColor3} />
          </linearGradient>

          <linearGradient id={`navyGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isWhite ? '#FFFFFF' : '#041B3B'} />
            <stop offset="50%" stopColor={isWhite ? '#F8FAFC' : '#042354'} />
            <stop offset="100%" stopColor={isWhite ? '#E2E8F0' : '#0B356D'} />
          </linearGradient>

          <linearGradient id={`goldStroke-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#F3D078" />
            <stop offset="100%" stopColor="#AA7C1E" />
          </linearGradient>
        </defs>

        {/* Left Emblem */}
        <g transform="translate(30, 20)">
          {/* Globe Circle */}
          <circle cx="150" cy="180" r="105" fill={isWhite ? 'transparent' : '#FFFFFF'} stroke={navyColor} strokeWidth="6" />
          
          {/* Globe Lat/Long grid */}
          <ellipse cx="150" cy="180" rx="55" ry="105" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 3" opacity="0.6"/>
          <line x1="45" y1="180" x2="255" y2="180" stroke="#94A3B8" strokeWidth="2" opacity="0.6"/>
          <ellipse cx="150" cy="180" rx="105" ry="55" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 3" opacity="0.6"/>
          
          {/* Continents */}
          <path d="M90,140 Q105,120 120,135 Q135,160 115,190 Q95,220 110,245 Q90,240 80,210 Q70,180 90,140 Z" fill={navyColor} opacity="0.95"/>
          <path d="M165,115 Q190,105 210,125 Q230,150 215,180 Q190,195 175,175 Q160,150 165,115 Z" fill={navyColor} opacity="0.95"/>
          <path d="M185,190 Q215,200 225,230 Q210,255 190,250 Q175,230 185,190 Z" fill={navyColor} opacity="0.95"/>

          {/* Giant V Left Wing */}
          <path d="M50,45 L118,45 L175,250 L125,250 Z" fill={`url(#navyGrad-${variant})`} />
          
          {/* Giant V Right Wing */}
          <path d="M245,45 L180,45 L155,165 L190,165 Z" fill={`url(#goldGrad-${variant})`} />

          {/* Swoosh Arc */}
          <path d="M55,230 C65,275 140,285 210,230 C240,205 270,165 300,105" fill="none" stroke={`url(#goldStroke-${variant})`} strokeWidth="9" strokeLinecap="round"/>
          <path d="M68,245 C85,285 150,290 215,235 C245,210 275,165 305,108" fill="none" stroke="#FEF08A" strokeWidth="2.5" opacity="0.8"/>

          {/* Airplane */}
          <g transform="translate(300, 105) rotate(42)">
            <path d="M0,-25 C4,-25 6,-15 6,25 L-6,25 C-6,-15 -4,-25 0,-25 Z" fill={navyColor}/>
            <path d="M0,-2 L28,12 L28,18 L0,8 L-28,18 L-28,12 Z" fill={navyColor}/>
            <path d="M0,18 L12,25 L12,28 L0,24 L-12,28 L-12,25 Z" fill={navyColor}/>
          </g>
        </g>

        {/* Vertical Divider Line */}
        <line x1="365" y1="80" x2="365" y2="280" stroke={dividerColor} strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />

        {/* Right Brand Typography */}
        <g transform="translate(395, 0)">
          {/* Main Name VartiMax */}
          <text
            x="0"
            y="190"
            fontFamily="'Plus Jakarta Sans', 'Outfit', sans-serif"
            fontWeight="800"
            fontSize="98"
            letterSpacing="-1.5"
          >
            <tspan fill={navyColor}>Varti</tspan>
            <tspan fill={`url(#goldGrad-${variant})`}>Max</tspan>
          </text>

          {/* Horizontal Bar with CONSULTANT */}
          <line x1="0" y1="230" x2="55" y2="230" stroke={`url(#goldGrad-${variant})`} strokeWidth="3" strokeLinecap="round"/>
          <text
            x="70"
            y="238"
            fontFamily="'Plus Jakarta Sans', 'Outfit', sans-serif"
            fontWeight="700"
            fontSize="28"
            fill={navyColor}
            letterSpacing="11"
          >
            CONSULTANT
          </text>
          <line x1="410" y1="230" x2="480" y2="230" stroke={`url(#goldGrad-${variant})`} strokeWidth="3" strokeLinecap="round"/>

          {/* Subtext Tagline */}
          {showTagline && (
            <text
              x="25"
              y="280"
              fontFamily="'Plus Jakarta Sans', 'Outfit', sans-serif"
              fontStyle="italic"
              fontWeight="500"
              fontSize="28"
              fill={tagColor}
              letterSpacing="0.5"
            >
              Your Global Journey, Our Expertise.
            </text>
          )}
        </g>
      </svg>
    </div>
  );
};
