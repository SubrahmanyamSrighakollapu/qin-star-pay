import React from 'react';
import { ModulePlaceholder } from '@/components/shared/ModulePlaceholder';

export default function EmailNotificationsPage() {
  return (
    <ModulePlaceholder
      title="Email Notifications"
      moduleCode="/notifications/email"
      description="Transactional email templates, SMTP relay settings, and dispatch status."
    />
  );
}
