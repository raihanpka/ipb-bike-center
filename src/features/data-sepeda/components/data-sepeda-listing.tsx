import { Sepeda } from '@/constants/data';
import { ambilDataSepeda } from '@/constants/database-api';
import { searchParamsCache } from '@/lib/searchparams';
import { DataSepedaTable } from './data-sepeda-tables';
import { columns } from './data-sepeda-tables/columns';

type DataSepedaListingPage = {};

export default async function DataSepedaListingPage({}: DataSepedaListingPage) {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('nomorSeri');
  const pageLimit = searchParamsCache.get('perPage');
  const categories = searchParamsCache.get('jenis');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && {
      jenis: Array.isArray(categories) ? categories.join('.') : categories
    })
  };

  const data = await ambilDataSepeda.getSepeda(filters);
  const totalItems = data.total_sepeda;
  const dataSepeda = data.sepeda as Sepeda[];

  return (
    <DataSepedaTable
      data={dataSepeda}
      totalItems={totalItems}
      columns={columns}
    />
  );
}
