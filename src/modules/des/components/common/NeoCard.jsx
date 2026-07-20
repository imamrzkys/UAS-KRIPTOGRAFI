import React from 'react';

/**
 * Neubrutalist Custom Card
 * @param {string} variant - 'white' | 'yellow' | 'purple' | 'orange' | 'green' | 'coral' | 'cream' | 'surface'
 * @param {boolean} interactive - Lift slightly on hover
 * @param {string} title - Card header title (uppercase)
 * @param {React.ReactNode} headerActions - Extra content for header right side
 */
export function NeoCard({
  children,
  variant = 'white',
  interactive = false,
  title = '',
  headerActions = null,
  className = '',
  shadowSize = 'normal' // 'sm' | 'normal' | 'lg' | 'none'
}) {
  const bgColors = {
    white: 'bg-brutal-white',
    yellow: 'bg-brutal-yellow',
    purple: 'bg-brutal-purple',
    orange: 'bg-brutal-orange',
    green: 'bg-brutal-green',
    coral: 'bg-brutal-coral',
    cream: 'bg-brutal-cream',
    surface: 'bg-brutal-surface',
  };

  const shadowClasses = {
    sm: 'shadow-brutal-sm',
    normal: 'shadow-brutal',
    lg: 'shadow-brutal-lg',
    none: 'shadow-none',
  };

  const selectedBg = bgColors[variant] || bgColors.white;
  const selectedShadow = shadowClasses[shadowSize] || shadowClasses.normal;

  return (
    <div
      className={`
        brutal-border-3 border-black
        ${selectedBg}
        ${selectedShadow}
        ${interactive ? 'transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lg' : ''}
        flex flex-col
        h-full
        ${className}
      `}
      style={{ border: '3px solid #000000', borderRadius: '0px' }}
    >
      {/* Optional Header */}
      {title && (
        <div className="flex justify-between items-center px-4 py-2.5 sm:px-5 sm:py-3 border-b-3 border-black bg-brutal-surface">
          <h4 className="font-grotesk font-bold text-base uppercase tracking-wider text-black select-none">
            {title}
          </h4>
          {headerActions && <div className="flex items-center">{headerActions}</div>}
        </div>
      )}
      
      {/* Content */}
      <div className="p-4 sm:p-5 flex-grow">
        {children}
      </div>
    </div>
  );
}

export default NeoCard;
