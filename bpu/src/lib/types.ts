export type DocumentRecord = {
  id: number;
  nomor_referensi: string;
  tanggal_bukti_potong: string;
  dasar_pengenaan_pajak: number;
  pph_terhutang: number;
  nama_unit_kerja: string;
  nomor_akun: string;
  pdf_url: string;
  created_at?: string;
};
