import React, { useState, useEffect } from 'react';
import { NavigationPage, Employee } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { V8EnginesPage } from './components/pages/V8EnginesPage';
import { TrimsPage } from './components/pages/TrimsPage';
import { GalleryPage } from './components/pages/GalleryPage';
import { ConfiguratorPage } from './components/pages/ConfiguratorPage';
import { EmployeeDashboard } from './components/pages/EmployeeDashboard';
import { AdminManagementDashboard } from './components/pages/AdminManagementDashboard';
import { TestDriveModal } from './components/TestDriveModal';
import { EmployeeAuthModal } from './components/EmployeeAuthModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { ShieldCheck, Lock, UserCheck, Settings } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
  const [testDriveTrimId, setTestDriveTrimId] = useState<string>('durango-hellcat');
  const [configuratorTrimId, setConfiguratorTrimId] = useState<string>('durango-hellcat');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [showStaffAlert, setShowStaffAlert] = useState(false);
  const [showAdminAlert, setShowAdminAlert] = useState(false);
  const [loggedInEmployee, setLoggedInEmployee] = useState<Employee | null>(() => {
    try {
      const saved = localStorage.getItem('dodge_logged_in_employee');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved loggedInEmployee:', e);
    }
    return null;
  });

  // Global secret shortcuts listener:
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifier = e.ctrlKey || e.metaKey;
      
      // Employee Portal
      if (isModifier && e.shiftKey && (e.key === 'K' || e.key === 'k' || e.code === 'KeyK')) {
        e.preventDefault();
        setCurrentPage((prev) => {
          if (prev === 'employee') {
            return 'home';
          } else {
            setIsAuthModalOpen(true);
            return prev;
          }
        });
        return;
      }

      // Admin & Recruitment Dashboard (Ctrl + Shift + 3, prompts for admin passcode: meilods)
      const isThreeKey = e.key === '3' || e.key === '#' || e.key === '۳' || e.code === 'Digit3' || e.code === 'Numpad3';
      if (isModifier && e.shiftKey && isThreeKey) {
        e.preventDefault();
        setCurrentPage((prev) => {
          if (prev === 'admin') {
            return 'home';
          } else {
            setIsAdminAuthModalOpen(true);
            return prev;
          }
        });
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (page: NavigationPage) => {
    if (page === 'employee') {
      setIsAuthModalOpen(true);
      return;
    }
    if (page === 'admin') {
      setIsAdminAuthModalOpen(true);
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminAuthSuccess = () => {
    setCurrentPage('admin');
    setShowAdminAlert(true);
    setTimeout(() => setShowAdminAlert(false), 3500);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (employee?: Employee) => {
    if (employee) {
      setLoggedInEmployee(employee);
      try {
        localStorage.setItem('dodge_logged_in_employee', JSON.stringify(employee));
      } catch (e) {
        console.warn('Failed to save employee to localStorage:', e);
      }
    }
    setCurrentPage('employee');
    setShowStaffAlert(true);
    setTimeout(() => setShowStaffAlert(false), 4000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTestDriveModal = (trimId?: string) => {
    if (trimId) {
      setTestDriveTrimId(trimId);
    }
    setIsTestDriveOpen(true);
  };

  const handleNavigateToConfigurator = (trimId?: string) => {
    if (trimId) {
      setConfiguratorTrimId(trimId);
    }
    setCurrentPage('configurator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="dodge-durango-app-root" className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-red-600 selection:text-white" dir="rtl">
      
      {/* Top Banner with Dodge Red Stripes */}
      <div className="h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-700 w-full" />

      {/* Toast Notification when entering Employee Mode */}
      {showStaffAlert && (
        <div className="fixed top-6 right-6 z-50 bg-neutral-900 border-2 border-red-600 text-white px-5 py-3 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center gap-3 text-xs animate-bounce" dir="rtl">
          <ShieldCheck className="w-5 h-5 text-red-500 shrink-0" />
          <div>
            <span className="font-bold block">
              {loggedInEmployee 
                ? `مرحباً بك يا ${loggedInEmployee.fullName} [#${loggedInEmployee.employeeCode}]` 
                : 'تم التحقق بنجاح والدخول للوحة موظفي المبيعات'}
            </span>
            <span className="text-neutral-400 text-[10px]">
              {loggedInEmployee ? loggedInEmployee.role : 'لوحة تحكم طلبات وحجوزات الموظفين'}
            </span>
          </div>
        </div>
      )}

      {/* Admin Toast Notification when entering Admin Mode */}
      {showAdminAlert && (
        <div className="fixed top-6 right-6 z-50 bg-neutral-900 border-2 border-red-500 text-white px-5 py-3 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.7)] flex items-center gap-3 text-xs animate-bounce" dir="rtl">
          <Settings className="w-5 h-5 text-red-500 shrink-0" />
          <div>
            <span className="font-bold block">تم الدخول إلى لوحة الإدارة العليا والتوظيف</span>
            <span className="text-neutral-400 text-[10px]">إدارة الكادر الوظيفي وإصدار الأرقام الوظيفية المعتمدة</span>
          </div>
        </div>
      )}

      {/* Main Navbar (Hidden in Employee & Admin modes to provide full focused workspace) */}
      {currentPage !== 'employee' && currentPage !== 'admin' && (
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenTestDriveModal={() => handleOpenTestDriveModal()}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenTestDriveModal={() => handleOpenTestDriveModal()}
          />
        )}

        {currentPage === 'engines' && (
          <V8EnginesPage
            onOpenTestDriveModal={() => handleOpenTestDriveModal()}
            onNavigateToConfigurator={() => handleNavigateToConfigurator()}
          />
        )}

        {currentPage === 'trims' && (
          <TrimsPage
            onOpenTestDriveModal={(trimId) => handleOpenTestDriveModal(trimId)}
            onNavigateToConfigurator={(trimId) => handleNavigateToConfigurator(trimId)}
          />
        )}

        {currentPage === 'gallery' && (
          <GalleryPage />
        )}

        {currentPage === 'configurator' && (
          <ConfiguratorPage
            initialTrimId={configuratorTrimId}
            onOpenTestDriveModal={(trimId) => handleOpenTestDriveModal(trimId)}
          />
        )}

        {currentPage === 'employee' && (
          <EmployeeDashboard
            currentEmployee={loggedInEmployee}
            onExit={() => handleNavigate('home')}
            onSwitchAccount={() => {
              try {
                localStorage.removeItem('dodge_logged_in_employee');
              } catch (e) {}
              setLoggedInEmployee(null);
              setIsAuthModalOpen(true);
            }}
          />
        )}

        {currentPage === 'admin' && (
          <AdminManagementDashboard
            onExit={() => handleNavigate('home')}
            onGoToEmployeePortal={() => setIsAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Footer (Only in customer view) */}
      {currentPage !== 'employee' && currentPage !== 'admin' && (
        <Footer
          onNavigate={handleNavigate}
          onOpenTestDriveModal={() => handleOpenTestDriveModal()}
        />
      )}

      {/* Test Drive Booking Modal */}
      <TestDriveModal
        isOpen={isTestDriveOpen}
        onClose={() => setIsTestDriveOpen(false)}
        defaultTrimId={testDriveTrimId}
      />

      {/* Employee Auth Modal */}
      <EmployeeAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Admin Auth Modal (Code: meilods) */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />

    </div>
  );
}
