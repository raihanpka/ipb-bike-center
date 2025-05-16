'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface ReportFilterProps {
  onFilterChange: (month: number, year: number) => void;
  selectedMonth: number;
  selectedYear: number;
}

export function ReportFilter({
  onFilterChange,
  selectedMonth,
  selectedYear
}: ReportFilterProps) {
  const months = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' }
  ];

  // Generate years (current year and 5 years back)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const handleMonthChange = (value: string) => {
    onFilterChange(Number.parseInt(value), selectedYear);
  };

  const handleYearChange = (value: string) => {
    onFilterChange(selectedMonth, Number.parseInt(value));
  };

  return (
    <Card>
      <CardContent className='p-4 sm:p-6'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6'>
          <div className='space-y-1.5 sm:space-y-2'>
            <Label htmlFor='month'>Bulan</Label>
            <Select
              value={selectedMonth.toString()}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger id='month'>
                <SelectValue placeholder='Pilih bulan' />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-1.5 sm:space-y-2'>
            <Label htmlFor='year'>Tahun</Label>
            <Select
              value={selectedYear.toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger id='year'>
                <SelectValue placeholder='Pilih tahun' />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
