import { ambilDataSepeda, DataSepeda } from '@/constants/database-api';
import { notFound } from 'next/navigation';
import DataSepedaForm from './data-sepeda-form';

type TDataSepedaViewPageProps = {
  nomorSeri: string;
};

export default async function DataSepedaViewPage({
  nomorSeri
}: TDataSepedaViewPageProps) {
  let sepeda = null;
  let pageTitle = 'Memasukkan Data Sepeda Baru';

  if (nomorSeri !== 'baru') {
    const data = await ambilDataSepeda.getSepedaByNomorSeri(nomorSeri);
    sepeda = data.sepeda as DataSepeda;
    if (!sepeda) {
      notFound();
    }
    pageTitle = `Edit Data Sepeda`;
  }

  return <DataSepedaForm initialData={sepeda} pageTitle={pageTitle} />;
}
