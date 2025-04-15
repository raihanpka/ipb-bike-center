import { ambilDataSepeda, DataSepeda } from '@/constants/mock-api';
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

  if (nomorSeri !== 'new') {
    const data = await ambilDataSepeda.getSepedaByNomorSeri(nomorSeri);
    sepeda = data.sepeda as DataSepeda;
    if (!sepeda) {
      notFound();
    }
    pageTitle = `Edit Sepeda`;
  }

  return <DataSepedaForm initialData={sepeda} pageTitle={pageTitle} />;
}
