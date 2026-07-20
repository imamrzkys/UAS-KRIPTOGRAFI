import './SimulatorLayout.css';

/**
 * SimulatorLayout - Responsive layout with columns
 * @param {Object} props
 * @param {React.ReactNode} props.main - Main column content (or left side)
 * @param {React.ReactNode} props.sidebar - Sidebar content (right side)
 */
export default function SimulatorLayout({ main, sidebar, className = '' }) {
  return (
    <div className={`simulator-layout ${className}`}>
      <div className="simulator-layout__main">
        {main}
      </div>
      {sidebar && (
        <aside className="simulator-layout__sidebar">
          {sidebar}
        </aside>
      )}
    </div>
  );
}
