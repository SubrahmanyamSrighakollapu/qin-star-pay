'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getDefaultRouteForRole } from '@/services/mockAuthService';
import { DEV_FEATURES } from '@/config/devFeatures';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Modal } from '@/components/ui/Modal';
import { Eye, EyeOff, Lock, User, AlertCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { session, isAuthenticated, isLoading, login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  // Automatic redirect if user is already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && session) {
      const defaultRoute = getDefaultRouteForRole(session.role);
      router.replace(defaultRoute);
    }
  }, [isLoading, isAuthenticated, session, router]);

  const validate = (): boolean => {
    const errs: { identifier?: string; password?: string } = {};

    if (!identifier.trim()) {
      errs.identifier = 'Username, email, or mobile number is required.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await login(identifier, password, rememberMe);

      if (result.success && result.defaultRoute) {
        router.push(result.defaultRoute);
      } else {
        setErrorMessage(result.error || 'Invalid credentials or account restricted.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = (demoId: string) => {
    setIdentifier(demoId);
    setPassword('demo1234');
    setErrorMessage(null);
    setFieldErrors({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-screen bg-[var(--bg-app)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center font-bold animate-pulse">
            QSP
          </div>
          <span className="text-xs text-[var(--text-muted)] font-medium">Loading session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-[var(--bg-app)] flex flex-col justify-between p-4 sm:p-6 md:p-10">
      {/* Top Header Logo */}
      <header className="w-full max-w-[1280px] mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[var(--primary)] text-white font-extrabold flex items-center justify-center tracking-tighter shadow-md">
            QSP
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-[var(--text-primary)]">
              QIN STAR PAY
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">
              Fintech Operations Platform
            </span>
          </div>
        </div>
      </header>

      {/* Main Login Center Workspace */}
      <main className="w-full max-w-md mx-auto my-auto py-6 space-y-6">
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-xl)] p-6 sm:p-8 shadow-sm space-y-6">
          {/* Card Header */}
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Sign in to continue to your Qin Star Pay workspace
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-[var(--radius-md)] flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Username, Email or Mobile" required error={fieldErrors.identifier}>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                <Input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@qinstarpay.com or mobile"
                  className="pl-9"
                  autoComplete="username"
                />
              </div>
            </FormField>

            <FormField label="Password" required error={fieldErrors.password}>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>

            {/* Options: Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[var(--primary)] focus:ring-[var(--border-focus)] cursor-pointer"
                />
                <span className="text-[var(--text-secondary)] font-medium">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)}
                className="text-xs font-semibold text-[var(--primary)] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2 font-bold tracking-wide"
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Collapsible Demo Accounts Section for Testing (guarded by DEV_FEATURES) */}
          {DEV_FEATURES.showDemoCredentials && (
            <div className="border-t border-[var(--border-subtle)] pt-4">
              <button
                type="button"
                onClick={() => setShowDemoAccounts((prev) => !prev)}
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-[var(--primary)] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
                  <span>Quick Demo Credentials</span>
                </div>
                {showDemoAccounts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showDemoAccounts && (
                <div className="mt-3 space-y-2 text-xs animate-in fade-in duration-150">
                  <span className="text-[11px] text-[var(--text-muted)] block">
                    Click any credential below to auto-fill input fields:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => fillDemoAccount('admin@qinstarpay.com')}
                      className="p-2 text-left bg-slate-50 hover:bg-blue-50/80 border border-slate-200 rounded-md transition-colors cursor-pointer"
                    >
                      <div className="font-bold text-[var(--text-primary)]">Admin Account</div>
                      <div className="text-[10px] text-slate-500 font-mono">admin@qinstarpay.com</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => fillDemoAccount('md001@qinstarpay.com')}
                      className="p-2 text-left bg-slate-50 hover:bg-purple-50/80 border border-slate-200 rounded-md transition-colors cursor-pointer"
                    >
                      <div className="font-bold text-[var(--text-primary)]">Master Distributor</div>
                      <div className="text-[10px] text-slate-500 font-mono">md001@qinstarpay.com</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => fillDemoAccount('dst001@qinstarpay.com')}
                      className="p-2 text-left bg-slate-50 hover:bg-emerald-50/80 border border-slate-200 rounded-md transition-colors cursor-pointer"
                    >
                      <div className="font-bold text-[var(--text-primary)]">Distributor</div>
                      <div className="text-[10px] text-slate-500 font-mono">dst001@qinstarpay.com</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => fillDemoAccount('ret001@qinstarpay.com')}
                      className="p-2 text-left bg-slate-50 hover:bg-amber-50/80 border border-slate-200 rounded-md transition-colors cursor-pointer"
                    >
                      <div className="font-bold text-[var(--text-primary)]">Approved Retailer</div>
                      <div className="text-[10px] text-slate-500 font-mono">ret001@qinstarpay.com</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        title="Password Recovery"
        description="Password recovery instructions can be dispatched to your registered credentials."
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Please contact your platform account administrator or support desk to initiate an identity verification and password reset request for your account.
          </p>
          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" onClick={() => setIsForgotPasswordOpen(false)}>
              Understood
            </Button>
          </div>
        </div>
      </Modal>

      {/* Footer */}
      <footer className="py-2 text-center text-xs text-[var(--text-muted)]">
        Qin Star Pay — Enterprise Payment Gateway Platform
      </footer>
    </div>
  );
}
