'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Sepeda } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Text, XCircle } from 'lucide-react';
import { CellAction } from './cell-action';
import { CATEGORY_OPTIONS } from './options';

export const columns: ColumnDef<Sepeda>[] = [
  {
    id: 'nomorSeri',
    accessorKey: 'nomorSeri',
    header: ({ column }: { column: Column<Sepeda, unknown> }) => (
      <DataTableColumnHeader column={column} title='Nomor Seri' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Sepeda['nomorSeri']>()}</div>,
    meta: {
      label: 'Nomor Seri',
      placeholder: 'Mencari Nomor Seri...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'jenis',
    accessorKey: 'jenis',
    header: ({ column }: { column: Column<Sepeda, unknown> }) => (
      <DataTableColumnHeader column={column} title='Jenis' />
    ),
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
    enableColumnFilter: true,
    meta: {
      label: 'Jenis Sepeda',
      variant: 'multiSelect',
      options: CATEGORY_OPTIONS
    }
  },
  {
    accessorKey: 'merk',
    header: 'Merk',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'tanggalPerawatanTerakhir',
    header: 'Tanggal Perawatan Terakhir',
  },
  {
    accessorKey: 'deskripsi',
    header: 'Catatan',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
