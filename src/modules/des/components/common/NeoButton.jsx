import React from 'react';

/**
 * Neubrutalist Custom Button
 * @param {string} variant - 'yellow' | 'purple' | 'orange' | 'green' | 'coral' | 'cream' | 'white' | 'black'
 * @param {boolean} active - Active state for segmented toggles
 */
export function NeoButton({
  children,
  onClick,
  variant = 'yellow',
  active = false,
  disabled = false,
  className = '',
  type = 'button',
  ariaLabel = undefined
}) {
  // Mapping variant background colors
  const bgColors = {
    yellow: 'bg-brutal-yellow hover:bg-yellow-400',
    purple: 'bg-brutal-purple hover:bg-purple-400',
    orange: 'bg-brutal-orange hover:bg-orange-400',
    green: 'bg-brutal-green hover:bg-green-400',
    coral: 'bg-brutal-coral hover:bg-red-400',
    cream: 'bg-brutal-cream hover:bg-brutal-surface',
    surface: 'bg-brutal-surface hover:bg-gray-300',
    white: 'bg-brutal-white hover:bg-gray-100',
    black: 'bg-brutal-black text-brutal-white hover:bg-neutral-800',
  };

  const selectedBg = active 
    ? bgColors[variant] 
    : variant === 'black' ? bgColors.black : 'bg-brutal-white hover:bg-neutral-100';

  const borderClass = variant === 'black' ? 'border-brutal-white' : 'border-brutal-black';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        brutal-button
        ${selectedBg}
        font-grotesk font-bold uppercase tracking-wider
        px-5 py-2.5
        border-3 border-black
        shadow-brutal
        transition-all duration-100
        hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-lg
        active:translate-x-[6px] active:translate-y-[6px] active:shadow-none
        disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-brutal-sm
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {children}
    </button>
  );
}
export default NeoButton;
