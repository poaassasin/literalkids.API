// controllers/subscriptionController.js

const db = require('../config/database.js');

// Daftar paket ini bisa kita biarkan sebagai data statis/hardcode
// karena ini adalah "produk" yang Anda tawarkan.
const subscriptionPlans = [
  {
    id: 1, // Pastikan ID ini cocok dengan yang digunakan di frontend
    title: "Paket Ceria",
    price: 25000,
    durationInMonths: 1,
  },
  {
    id: 2,
    title: "Paket Hebat",
    price: 65000,
    durationInMonths: 3,
  },
  {
    id: 3,
    title: "Paket Juara",
    price: 180000,
    durationInMonths: 12,
  },
];

module.exports = {
  // Fungsi ini tetap sama, untuk menampilkan paket apa saja yang tersedia.
  getPlans: (req, res) => {
    res.json({ plans: subscriptionPlans });
  },

  // [DIUBAH] Mengambil data langganan aktif dari database untuk user yang sedang login
  getActivePlan: (req, res) => {
    // 1. Ambil ID user dari token yang sudah divalidasi oleh middleware verifyToken
    // Pastikan token Anda berisi 'id' saat dibuat (saat login)
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID tidak ditemukan dari token." });
    }

    // 2. Query ke database untuk mencari langganan aktif
    // Langganan aktif adalah yang tanggal berakhirnya >= hari ini
    const sqlQuery = "SELECT * FROM subscriptions WHERE user_id = ? AND end_date >= CURDATE() ORDER BY end_date DESC LIMIT 1";

    db.query(sqlQuery, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching active plan:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      // Jika ada hasilnya, kirim data langganan tersebut. Jika tidak, kirim null.
      const activePlan = results.length > 0 ? results[0] : null;
      res.json({ activePlan });
    });
  },

  // [DIUBAH] Membuat langganan baru dan menyimpannya ke database
  subscribeToPlan: (req, res) => {
    // 1. Ambil ID user dari token dan planId dari body request
    const userId = req.user.id;
    const { planId } = req.body; // Frontend harus mengirimkan ID dari paket yang dipilih

    // 2. Cari detail paket dari array statis kita
    const selectedPlan = subscriptionPlans.find(plan => plan.id === parseInt(planId));

    if (!selectedPlan) {
      return res.status(404).json({ message: "Paket tidak ditemukan" });
    }

    // 3. Siapkan data untuk dimasukkan ke database
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + selectedPlan.durationInMonths);

    const newSubscription = {
      user_id: userId,
      plan_name: selectedPlan.title,
      price: selectedPlan.price,
      savings: 0, // Anda bisa tambahkan logika untuk ini jika perlu
      start_date: startDate,
      end_date: endDate
    };

    // 4. Query INSERT ke database
    // Sebaiknya, sebelum insert, cek dulu apakah sudah ada langganan aktif dan tangani kasus tsb.
    // Tapi untuk contoh ini, kita langsung insert.
    const sqlQuery = "INSERT INTO subscriptions SET ?";

    db.query(sqlQuery, newSubscription, (err, result) => {
      if (err) {
        console.error("Error creating subscription:", err);
        return res.status(500).json({ message: "Gagal membuat langganan" });
      }

      res.status(201).json({
        message: "Berhasil berlangganan",
        subscriptionId: result.insertId,
        activePlan: newSubscription
      });
    });
  },

  // [DIUBAH] Membatalkan langganan di database
  unsubscribe: (req, res) => {
    const userId = req.user.id;

    // Cara paling sederhana adalah menghapus record langganan user tersebut.
    // Cara yang lebih baik adalah dengan menandai `is_active = false` (jika ada kolomnya)
    const sqlQuery = "DELETE FROM subscriptions WHERE user_id = ?";

    db.query(sqlQuery, [userId], (err, result) => {
      if (err) {
        console.error("Error cancelling subscription:", err);
        return res.status(500).json({ message: "Gagal membatalkan langganan" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Tidak ada langganan aktif untuk dibatalkan." });
      }

      res.json({ message: "Langganan berhasil dibatalkan" });
    });
  },
  
  getReferralCode: (req, res) => {
    res.json({ referralCode: userSubscription.referralCode });
  },
  
};
