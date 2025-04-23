import { NavItem } from '@/types';

export type Sepeda = {
  nomorSeri: string;
  merk: string;
  jenis: string;
  status: string;
  tanggalPerawatanTerakhir: string;
  deskripsi: string;
};

//Info: The following data is used for the sidebar navigation
export const navItems: NavItem[] = [
  // {
  //   title: 'Dashboard',
  //   url: '/dashboard/overview',
  //   icon: 'dashboard',
  //   isActive: false,
  //   shortcut: ['d', 'd'],
  //   items: [] // Empty array as there are no child items for Dashboard
  // },
  {
    title: 'Data Sepeda',
    url: '/dashboard/data-sepeda',
    icon: 'dataSepeda',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  }
];