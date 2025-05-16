CREATE OR REPLACE FUNCTION update_peminjaman_status()
RETURNS void AS $$
BEGIN
  UPDATE public."Peminjaman"
  SET "statusId" = 6
  WHERE "tanggalPengembalian" < (now() AT TIME ZONE 'GMT' + INTERVAL '7 hours');
END;
$$ LANGUAGE plpgsql;