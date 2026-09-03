/**
 * Centralized theme constants for Qin Star Pay.
 */

export const THEME_COLORS = {
  brand: {
    primary: '#1E40AF',
    primaryHover: '#1E3A8A',
    primaryLight: '#EFF6FF',
    accent: '#F59E0B',
    accentHover: '#D97706',
    accentLight: '#FFFBEB',
  },
  semantic: {
    success: '#10B981',
    successLight: '#ECFDF5',
    warning: '#F59E0B',
    warningLight: '#FFFBEB',
    danger: '#EF4444',
    dangerLight: '#FEF2F2',
    info: '#06B6D4',
    infoLight: '#ECFEFF',
  },
  surface: {
    app: '#F8FAFC',
    card: '#FFFFFF',
    secondary: '#F1F5F9',
    sidebar: '#0F172A',
    header: '#FFFFFF',
  },
  text: {
    primary: '#0F172A',
    secondary: '#334155',
    muted: '#64748B',
    disabled: '#94A3B8',
    inverse: '#FFFFFF',
  },
  border: {
    normal: '#E2E8F0',
    subtle: '#F1F5F9',
    focus: '#2563EB',
    strong: '#CBD5E1',
  },
} as const;

export const LAYOUT_DIMENSIONS = {
  sidebarWidth: '260px',
  sidebarCollapsedWidth: '72px',
  headerHeight: '64px',
  maxContentWidth: '1440px',
} as const;
