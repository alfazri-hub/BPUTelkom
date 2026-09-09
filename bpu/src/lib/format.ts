const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const tanggalPanjang = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function formatRupiah(value: number) {
  return rupiah.format(value);
}

export function formatTanggal(isoDate: string) {
  return tanggalPanjang.format(new Date(`${isoDate}T00:00:00`));
}
