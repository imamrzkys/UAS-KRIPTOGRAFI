import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './MainLayout.css';

/**
 * MainLayout - Wraps application with Navbar, main area, and Footer
 */
export default function MainLayout({ children }) {
  return (
    <div className="main-layout animate-fade-in">
      <Navbar />
      <main className="main-layout__content container">
        {children}
      </main>
      <Footer />
    </div>
  );
}
