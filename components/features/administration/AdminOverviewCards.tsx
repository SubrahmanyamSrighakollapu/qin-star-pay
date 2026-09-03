'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { AdminSummary } from '@/types/domain';
import { Users, ShieldCheck, Gauge, Percent, Settings, Palette, Lock, ChevronRight } from 'lucide-react';

export interface AdminOverviewCardsProps {
  summary: AdminSummary;
}

export const AdminOverviewCards: React.FC<AdminOverviewCardsProps> = ({ summary }) => {
  const quickLinks = [
    {
      title: 'Admin User Management',
      description: 'Manage internal operational staff accounts, status, and role assignments',
      href: '/administration/users',
      icon: Users,
      badge: `${summary.activeAdminUsers} Active Staff`,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Roles & Permissions',
      description: 'Configure RBAC system roles, custom role definitions, and granular module permissions',
      href: '/administration/roles',
      icon: ShieldCheck,
      badge: `${summary.totalRoles} Roles Configured`,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      title: 'Transaction Limits',
      description: 'Configure min/max, daily, and monthly transaction limit rules with scope precedence',
      href: '/administration/limits',
      icon: Gauge,
      badge: `${summary.activeLimitRules} Limit Rules`,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Fee & Charge Master',
      description: 'Manage platform commercial fee structures, percentage/flat charges, and GST rates',
      href: '/administration/fees',
      icon: Percent,
      badge: `${summary.activeFeeRules} Fee Rules`,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Platform Settings',
      description: 'Configure platform defaults, transaction timeouts, cut-off times, and notifications',
      href: '/administration/settings',
      icon: Settings,
      badge: 'System Defaults',
      color: 'bg-slate-100 text-slate-800 border-slate-300',
    },
    {
      title: 'Branding & Identity',
      description: 'Customize platform name, brand colors, login titles, and support contact details',
      href: '/administration/branding',
      icon: Palette,
      badge: 'Live Preview',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      title: 'Security Settings',
      description: 'Session timeout rules, password complexity policies, and MFA enforcement',
      href: '/administration/security',
      icon: Lock,
      badge: 'Security Controls',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-4 bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Admin Users</span>
          <div className="mt-1 font-mono font-extrabold text-base text-[var(--primary)]">
            {summary.totalAdminUsers} Staff
          </div>
          <span className="text-[11px] text-emerald-600 block mt-0.5">{summary.activeAdminUsers} Active</span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Super Admins</span>
          <div className="mt-1 font-mono font-extrabold text-base text-purple-900">
            {summary.superAdminsCount}
          </div>
          <span className="text-[11px] text-purple-600 block mt-0.5 font-mono">Full Access</span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Configured Roles</span>
          <div className="mt-1 font-mono font-extrabold text-base text-slate-900">
            {summary.totalRoles} Roles
          </div>
          <span className="text-[11px] text-slate-500 block mt-0.5">{summary.systemRolesCount} System • {summary.customRolesCount} Custom</span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Permissions Tokens</span>
          <div className="mt-1 font-mono font-extrabold text-base text-blue-700">
            {summary.configuredPermissionsCount} Tokens
          </div>
          <span className="text-[11px] text-blue-600 block mt-0.5">Granular Controls</span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Active Limit Rules</span>
          <div className="mt-1 font-mono font-extrabold text-base text-emerald-700">
            {summary.activeLimitRules} Active
          </div>
          <span className="text-[11px] text-slate-500 block mt-0.5">Precedence Enabled</span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Fee Rules</span>
          <div className="mt-1 font-mono font-extrabold text-base text-amber-700">
            {summary.activeFeeRules} Active
          </div>
          <span className="text-[11px] text-slate-500 block mt-0.5">GST Included</span>
        </Card>
      </div>

      {/* Quick Access Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">Administration Workspaces & Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Card className="p-5 hover:border-[var(--primary)] transition-all cursor-pointer group h-full flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-lg ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {item.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-[var(--primary)] transition-colors flex items-center gap-1">
                        <span>{item.title}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
