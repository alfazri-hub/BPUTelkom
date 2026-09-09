-- Jalankan file ini di Supabase SQL Editor untuk memperbaiki upload.
-- File ini TIDAK membuat atau mengubah tabel public.users maupun documents.
-- Jika kamu menjalankan schema lain dan mendapat 42P07 users already exists,
-- lewati statement CREATE TABLE users karena tabelnya sudah tersedia.
-- Aplikasi saat ini memakai anon key untuk upload, jadi policy anon diperlukan.

insert into storage.buckets (id, name, public)
values ('pdfs', 'pdfs', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can upload PDF files" on storage.objects;
create policy "Public can upload PDF files"
on storage.objects for insert to anon
with check (bucket_id = 'pdfs');

drop policy if exists "Public can view PDF files" on storage.objects;
create policy "Public can view PDF files"
on storage.objects for select to anon
using (bucket_id = 'pdfs');