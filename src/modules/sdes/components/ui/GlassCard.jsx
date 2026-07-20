import './GlassCard.css';

/**
 * GlassCard - Frosted glass container with glow and top highlight
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.className
 * @param {'default'|'accent'|'elevated'} props.variant
 * @param {object} props.style
 */
export default function GlassCard({
  children,
  className = '',
  variant = 'default',
  style = {},
  ...rest
}) {
  return (
    <div
      className={`glass-card glass-card--${variant} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}
