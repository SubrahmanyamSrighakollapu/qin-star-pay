import { redirect } from 'next/navigation';

export default function AdminWalletIndexPage() {
  redirect('/admin/wallet/balances');
}
