'use client';
import { Badge } from '@/components/ui/badge';
import { Sepeda } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Text, XCircle } from 'lucide-react';
import { CellAction } from './cell-action';
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from './options';

export const columns: ColumnDef<Sepeda>[] = [
  {
    id: 'nomorSeri',
    accessorKey: 'nomorSeri',
    header: 'Nomor Seri',
    cell: ({ cell }) => <div>{cell.getValue<Sepeda['nomorSeri']>()}</div>,
    meta: {
      label: 'Nomor Seri',
      placeholder: 'Mencari Nomor Seri...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: false,
  },
  {
    id: 'jenis',
    accessorKey: 'jenis',
    header: 'Jenis',
    cell: ({ cell }) => {
      const status = cell.getValue<Sepeda['jenis']>();
      const Icon = status === 'active' ? CheckCircle2 : XCircle;

      return (
        <Badge variant='outline' className='capitalize'>
          <Icon />
          {status}
        </Badge>
      );
    },
    enableColumnFilter: false,
    meta: {
      label: 'Jenis Sepeda',
      variant: 'multiSelect',
      options: CATEGORY_OPTIONS
    }
  },
  {
    accessorKey: 'merk',
    header: 'Merk',
    meta: {
      label: 'Merk',
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ cell }) => {
      const status = cell.getValue<Sepeda['status']>();
      const Icon = status === 'active' ? CheckCircle2 : XCircle;

      return (
        <Badge variant='outline' className='capitalize'>
          <Icon />
          {status}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Status Sepeda',
      variant: 'select',
      options: STATUS_OPTIONS
    }
  },
  {
    accessorKey: 'tanggalPerawatanTerakhir',
    header: 'Tanggal Perawatan Terakhir',
    meta: {
      label: 'Tanggal Perawatan Terakhir',
    }
  },
  {
    accessorKey: 'deskripsi',
    header: 'Deskripsi',
    meta: {
      label: 'Deskripsi',
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
