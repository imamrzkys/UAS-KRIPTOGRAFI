import Navbar from '../components/shared/Navbar';

export default function ModuleLayout({ children, accentColor, moduleLabel }) {
  return (
    <div className="min-h-screen" style={{ background: '#FFF8F0' }}>
      <Navbar accentColor={accentColor} moduleLabel={moduleLabel} />
      <main className="nb-container py-8">
        {children}
      </main>
    </div>
  );
}
