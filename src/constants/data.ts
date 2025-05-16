import { NavItem } from '@/types';

export type Sepeda = {
  nomorSeri: string;
  merk: string;
  jenis: string;
  status: string;
  tanggalPerawatanTerakhir: string;
  deskripsi: string;
};

export const adminNavItems: NavItem[] = [
  {
    title: 'Utama',
    url: '/admin/utama',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['u', 'u'],
    items: []
  },
  {
    title: 'Data Sepeda',
    url: '/admin/data-sepeda',
    icon: 'dataSepeda',
    shortcut: ['s', 's'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Kelola Peminjaman',
    url: '/admin/peminjaman',
    icon: 'peminjaman',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Laporan Peminjaman',
    url: '/admin/laporan',
    icon: 'history',
    shortcut: ['l', 'l'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'QR Generator',
    url: '/admin/qr-generator',
    icon: 'qrcode',
    shortcut: ['q', 'q'],
    isActive: false,
    items: [] // No child items
  }
];

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
    title: 'Form Peminjaman',
    url: '/dashboard/peminjaman/',
    icon: 'peminjaman',
    shortcut: ['f', 'f'],
    items: [] // No child items
  },
  {
    title: 'Riwayat Peminjaman',
    url: '/dashboard/peminjaman/riwayat',
    icon: 'history',
    shortcut: ['r', 'r'],
    items: [] // No child items
  },
  {
    title: 'Tentang Kami',
    url: '/dashboard/about',
    icon: 'help',
    isActive: false,
    shortcut: ['t', 't'],
    items: []
  }
];
