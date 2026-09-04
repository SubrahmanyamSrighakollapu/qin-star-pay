import React from 'react';
import { ModulePlaceholder } from '@/components/shared/ModulePlaceholder';

export default function SMSNotificationsPage() {
  return (
    <ModulePlaceholder
      title="SMS Gateway Notifications"
      moduleCode="/notifications/sms"
      description="SMS template configuration, DLT registration headers, and delivery logs."
    />
  );
}
