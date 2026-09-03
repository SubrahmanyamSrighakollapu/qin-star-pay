'use client';

import React, { useState, useEffect } from 'react';
import { MOCK_CURRENT_USER, UserContext, UserRole } from '@/config/roles';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Drawer } from '@/components/ui/Drawer';

export interface AppShellProps {
  children: React.ReactNode;
}

const STORAGE_KEY_SIDEBAR = 'qin-star-pay-sidebar-collapsed';

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserContext>(MOCK_CURRENT_USER);
  
  // State 1: Desktop persistent sidebar collapse width (72px collapsed vs 260px expanded)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const savedState = localStorage.getItem(STORAGE_KEY_SIDEBAR);
      return savedState !== null ? JSON.parse(savedState) : false;
    } catch {
      return false;
    }
  });

  // State 2: Tablet/Mobile overlay drawer visibility
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Automatically reset & close tablet drawer if window is resized to Desktop (>= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileDrawerOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Header Toggle Action: Clearly separated between Desktop & Tablet/Mobile viewports
  const handleHeaderToggle = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      // Desktop Mode: Collapse / Expand persistent sidebar (NO backdrop, NO drawer overlay)
      setIsSidebarCollapsed((prev) => {
        const nextState = !prev;
        try {
          localStorage.setItem(STORAGE_KEY_SIDEBAR, JSON.stringify(nextState));
        } catch {
          // Fallback
        }
        return nextState;
      });
    } else {
      // Tablet / Mobile Mode: Open slide-over drawer overlay with backdrop
      setIsMobileDrawerOpen((prev) => !prev);
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role: newRole,
    }));
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[var(--bg-app)] flex">
      {/* Persistent Desktop Sidebar (Only visible on Desktop lg >= 1024px) */}
      <div className="hidden lg:flex flex-col h-screen shrink-0 z-40">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleHeaderToggle}
          currentUser={currentUser}
        />
      </div>

      {/* Tablet & Mobile Overlay Drawer (Only mounted/open on screens < 1024px when triggered) */}
      <Drawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        position="left"
        size="sm"
        className="p-0 bg-[var(--bg-sidebar)] overflow-hidden w-[300px] max-w-[85vw]"
      >
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={() => setIsMobileDrawerOpen(false)}
          currentUser={currentUser}
          onNavigate={() => setIsMobileDrawerOpen(false)}
          className="h-full w-full border-none shadow-none"
        />
      </Drawer>

      {/* Main App Workspace Area (Occupies 100% width on tablet/mobile when drawer is closed) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          onToggleSidebar={handleHeaderToggle}
          currentUser={currentUser}
          onRoleChange={handleRoleChange}
        />

        <main className="flex-1 overflow-y-auto min-h-0 bg-[var(--bg-app)]">{children}</main>
      </div>
    </div>
  );
};
