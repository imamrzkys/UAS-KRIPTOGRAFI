import { useTheme } from '../../hooks/useTheme';

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg hover:bg-surface-container transition-colors"
      aria-label="Toggle theme"
    >
      <span className="material-symbols-outlined text-on-surface-variant text-xl">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}
