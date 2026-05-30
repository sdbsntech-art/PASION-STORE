import React, { useState } from 'react';
import { Cpu, ShieldCheck, UserCheck, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar({ activeCategory, setActiveCategory, onAdminClick, isAdmin, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'machine', label: 'Machines' },
    { id: 'watch', label: 'Montres' },
    { id: 'tablet', label: 'Tablettes' },
    { id: 'tv', label: 'Télévisions' },
    { id: 'book', label: 'Livres' }
  ];

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--glass-border)'
    }}>
      {/* Brand Logo */}
      <div 
        onClick={() => setActiveCategory('all')} 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          cursor: 'pointer'
        }}
      >
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
          padding: '0.5rem',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--glow-cyan)'
        }}>
          <Cpu size={24} color="#040814" />
        </div>
        <span style={{
          fontFamily: 'var(--font-title)',
          fontSize: '1.4rem',
          fontWeight: 800,
          background: 'linear-gradient(to right, #ffffff, var(--accent-cyan))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '0.05em'
        }}>
          PASSION STORE
        </span>
      </div>

      {/* Desktop Navigation Links */}
      <div className="desktop-nav" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              background: activeCategory === cat.id ? 'rgba(79, 172, 254, 0.15)' : 'transparent',
              border: 'none',
              borderBottom: activeCategory === cat.id ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              color: activeCategory === cat.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              padding: '0.5rem 1rem',
              fontFamily: 'var(--font-title)',
              fontWeight: 500,
              fontSize: '0.95rem',
              cursor: 'pointer',
              borderRadius: '6px 6px 0 0',
              transition: 'var(--transition-snappy)'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Status Badges and Admin Controls */}
      <div className="desktop-actions" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        {/* Security Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          color: '#34d399',
          padding: '0.4rem 0.8rem',
          borderRadius: '50px',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.05em'
        }}>
          <ShieldCheck size={14} />
          <span>SÉCURITÉ ACTIVE</span>
          <span style={{
            width: '6px',
            height: '6px',
            backgroundColor: '#34d399',
            borderRadius: '50%',
            display: 'inline-block',
            boxShadow: '0 0 8px #34d399'
          }}></span>
        </div>

        {/* Admin Buttons */}
        {isAdmin ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={onAdminClick}
              className="btn-secondary" 
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                color: 'var(--accent-cyan)',
                borderColor: 'rgba(0, 242, 254, 0.3)'
              }}
            >
              <LayoutDashboard size={14} />
              <span>Console Admin</span>
            </button>
            <button 
              onClick={onLogout}
              className="btn-danger" 
              style={{ padding: '0.5rem', borderRadius: '8px' }}
              title="Se déconnecter"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button 
            onClick={onAdminClick}
            className="btn-secondary"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.85rem'
            }}
          >
            <UserCheck size={14} />
            <span>Admin</span>
          </button>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          display: 'none' // Controlled in stylesheet/style overrides
        }}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="glass mobile-menu-panel" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          borderBottom: '1px solid var(--glass-border)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setMobileMenuOpen(false);
              }}
              style={{
                background: activeCategory === cat.id ? 'rgba(79, 172, 254, 0.1)' : 'transparent',
                border: 'none',
                color: activeCategory === cat.id ? 'var(--accent-cyan)' : '#fff',
                padding: '0.75rem',
                textAlign: 'left',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              {cat.label}
            </button>
          ))}
          <div style={{ height: '1px', backgroundColor: 'var(--glass-border)' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ShieldCheck size={14} /> SÉCURITÉ ACTIVE
            </span>
            <button 
              onClick={() => {
                onAdminClick();
                setMobileMenuOpen(false);
              }}
              className="btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              {isAdmin ? 'Console Admin' : 'Admin'}
            </button>
          </div>
        </div>
      )}

      {/* Style Overrides for Responsive Behavior inline (since we are not using media queries in custom JS, we can inject a style block) */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav, .desktop-actions {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}
