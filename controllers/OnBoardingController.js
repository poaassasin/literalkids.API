const db = require('../config/database.js');

const createOnboardingProfile = (req, res) => {
  const {
    childName,
    childUsername,
    parentName,
    parentUsername,
    referralCode,
    selectedPackageIndex
  } = req.body;

  const sql = `
    INSERT INTO onboarding_profiles 
    (child_name, child_username, parent_name, parent_username, referral_code, selected_package_index)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    childName,
    childUsername,
    parentName,
    parentUsername,
    referralCode || null,
    selectedPackageIndex
  ], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Gagal menyimpan data onboarding', details: err });
    }
    // Ambil ID dari profil onboarding yang baru saja dibuat
    const newOnboardingId = result.insertId;

    // 2. Siapkan data untuk tabel homepage_users
    const homepageSql = `
      INSERT INTO homepage_users (id, name, username, level, progress)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const initialLevel = 1;
    const initialProgress = 0.1; // 10%

    // 3. Jalankan query kedua untuk membuat profil homepage
    db.query(homepageSql, [
      newOnboardingId, // Gunakan ID yang sama agar terhubung
      childName,       // Nama dari onboarding
      childUsername,   // Username dari onboarding
      initialLevel,
      initialProgress
    ], (homepageErr, homepageResult) => {
      if (homepageErr) {
        // Jika langkah ini gagal, idealnya Anda harus menghapus data onboarding yang sudah dibuat
        // agar tidak ada data yang menggantung. Namun untuk sekarang, kita kirim error saja.
        return res.status(500).json({ error: 'Gagal membuat profil homepage', details: homepageErr });
      }

    res.status(201).json({ message: 'Profil onboarding dan homepage berhasil dibuat', id: newOnboardingId });
    });
  });
};

module.exports = { createOnboardingProfile };
