# Checklist Deploy

## GitHub
- [ ] Buat repository, contoh `sospro-uin-suka`
- [ ] Upload/push seluruh project
- [ ] Jangan commit `.env.local`

## Google Sheets / Apps Script
- [ ] Buat spreadsheet database
- [ ] Tempel `apps-script/Code.gs`
- [ ] Jalankan `setupSheets()`
- [ ] Buat Script Property `API_SECRET`
- [ ] Deploy sebagai Web App
- [ ] Simpan URL `/exec`

## Vercel
- [ ] Import repository GitHub
- [ ] Framework terdeteksi sebagai Next.js
- [ ] Tambahkan `GAS_ENDPOINT`
- [ ] Tambahkan `GAS_SECRET`
- [ ] Tambahkan `ADMIN_PASSWORD`
- [ ] Tambahkan `SESSION_SECRET`
- [ ] Set `NEXT_PUBLIC_DEMO_MODE=0`
- [ ] Deploy

## Uji produksi
- [ ] Halaman `/` menampilkan disclaimer nonresmi
- [ ] `/program-studi` dapat mencari/filter 85 program
- [ ] Tidak ada angka kuota program studi
- [ ] Link Admisi resmi bekerja
- [ ] Login `/admin/login` bekerja
- [ ] Admin dapat menambah kegiatan
- [ ] Peserta dapat presensi tanpa login
- [ ] Nomor HP yang sama tidak dapat presensi dua kali pada event sama
- [ ] Admin dapat menutup presensi
- [ ] Wheel memilih peserta dari presensi
- [ ] Pemenang tersimpan dan tidak terpilih ulang
