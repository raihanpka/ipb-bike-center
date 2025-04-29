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
  {
    title: 'Utama',
    url: '/dashboard/utama',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Data Sepeda',
    url: '/dashboard/data-sepeda',
    icon: 'dataSepeda',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  }
];