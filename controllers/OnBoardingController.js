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

    res.status(201).json({ message: 'Profil onboarding berhasil disimpan', id: result.insertId });
  });
};

module.exports = { createOnboardingProfile };
