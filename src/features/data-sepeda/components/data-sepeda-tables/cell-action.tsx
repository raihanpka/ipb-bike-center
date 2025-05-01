'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sepeda } from '@/constants/data';
import { IconEdit, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface CellActionProps {
  data: Sepeda;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('DataSepeda')
        .delete()
        .eq('nomorSeri', data.nomorSeri);

      if (error) {
        alert('Gagal menghapus data: ' + error.message);
      } else {
        setOpen(false);
        router.refresh(); // Refresh halaman setelah penghapusan
      }
      window.location.href = '/admin/data-sepeda';

    } catch (err: any) {
      alert('Unexpected error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Buka Menu</span>
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/admin/data-sepeda/${data.nomorSeri}`)}
          >
            <IconEdit className='mr-2 h-4 w-4' /> Perbarui
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <IconTrash className='mr-2 h-4 w-4' /> Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
