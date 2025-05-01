import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { checkRole } from '@/utils/roles';

export default async function AdminDashboard() {
  const { userId } = await auth();
  const isAdmin = await checkRole('admin');
  if (!userId) {
    return redirect('/auth/sign-in');
  } else if (isAdmin == true) {
    redirect('/admin/utama');
  } else {
    redirect('/dashboard/utama');
  }
}
