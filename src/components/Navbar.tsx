import React, { useState } from 'react';
import { NavigationPage } from '../types';
import { DodgeLogo } from './DodgeLogo';
import { Menu, X, Flame, ShieldAlert, Sparkles, ChevronLeft, Phone, Ghost, Mail } from 'lucide-react';

interface NavbarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  onOpenTestDriveModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenTestDriveModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavigationPage; labelAr: string; badge?: string }[] = [
    { id: 'home', labelAr: 'الرئيسية' },
    { id: 'engines', labelAr: 'محركات V8 والأداء', badge: 'HEMI' },
    { id: 'trims', labelAr: 'الفئات والأسعار' },
    { id: 'gallery', labelAr: 'التصميم والمعرض' },
    { id: 'configurator', labelAr: 'تخصيص سيارتك', badge: '3D Studio' },
  ];

  const handleNavClick = (pageId: NavigationPage) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      id="main-navigation-bar" 
      className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-800/80 transition-all duration-300"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo with word دوج and two red lines */}
          <div 
            onClick={() => handleNavClick('home')}
            className="cursor-pointer group flex items-center py-2"
          >
            <DodgeLogo size="md" showArabic={true} showEnglish={true} />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isActive 
                      ? 'text-white bg-neutral-900 shadow-sm' 
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                  }`}
                >
                  <span>{item.labelAr}</span>
                  {item.badge && (
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/50">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-red-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions: Direct Contact, Test Drive & Model Year */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Direct Phone link */}
            <a
              href="tel:0540773208"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-red-600 text-neutral-300 hover:text-white text-xs font-mono transition-all"
              title="اتصال أو واتساب 0540773208"
            >
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span className="font-bold font-num">0540773208</span>
            </a>

            {/* Snapchat badge */}
            <a
              href="https://www.snapchat.com/add/o.oorayan"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-yellow-500/60 text-yellow-400 text-xs font-mono transition-all"
              title="سناب شات o.oorayan"
            >
              <Ghost className="w-3.5 h-3.5" />
              <span className="font-bold hidden xl:inline">o.oorayan</span>
            </a>

            <button
              id="nav-cta-test-drive"
              type="button"
              onClick={onOpenTestDriveModal}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-white" />
              <span>احجز تجربة قيادة (2,000 ريال)</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href="tel:0540773208"
              className="p-2 rounded-xl text-red-500 bg-neutral-900 border border-neutral-800"
              title="اتصال"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              id="btn-open-mobile-menu"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 border border-neutral-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          id="mobile-navigation-drawer"
          className="lg:hidden border-t border-neutral-800 bg-neutral-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-4"
        >
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-right px-4 py-3 rounded-xl font-bold text-base flex items-center justify-between ${
                  isActive 
                    ? 'bg-red-950/40 text-red-400 border border-red-900/50' 
                    : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{item.labelAr}</span>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-900/50 text-red-300">
                      {item.badge}
                    </span>
                  )}
                </div>
                <ChevronLeft className="w-4 h-4 text-neutral-500" />
              </button>
            );
          })}

          {/* Direct Contact in Mobile Drawer */}
          <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2 text-xs">
            <span className="text-[11px] font-bold text-neutral-400 block">للتواصل المباشر:</span>
            <div className="flex flex-col gap-2">
              <a href="tel:0540773208" className="flex items-center gap-2 text-white font-mono font-bold">
                <Phone className="w-4 h-4 text-red-500" />
                <span>0540773208</span>
              </a>
              <a href="mailto:meliods7777x@gmail.com" className="flex items-center gap-2 text-neutral-300 font-mono text-[11px]">
                <Mail className="w-4 h-4 text-neutral-400" />
                <span>meliods7777x@gmail.com</span>
              </a>
              <a href="https://www.snapchat.com/add/o.oorayan" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-yellow-400 font-mono font-bold">
                <Ghost className="w-4 h-4 text-yellow-400" />
                <span>سناب شات: o.oorayan</span>
              </a>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTestDriveModal();
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Flame className="w-5 h-5" />
              <span>احجز تجربة قيادة دورانجو (2,000 ريال)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
