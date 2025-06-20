// controllers/subscriptionController.js

const db = require('../config/db_local');

const subscriptionPlans = [
  {
    id: 1,
    title: "Paket Ceria",
    price: "Rp25.000 Selama 1 Bulan",
    subscriptionPeriod: "10/04/2025 - 10/05/2025",
  },
  {
    id: 2,
    title: "Paket Hebat",
    price: "Rp65.000 Selama 3 Bulan",
    savings: "Hemat Hingga Rp10.000",
    subscriptionPeriod: "10/04/2025 - 10/07/2025",
  },
  {
    id: 3,
    title: "Paket Juara",
    price: "Rp180.000 Selama 12 Bulan",
    savings: "Setara 4 Bulan Gratis",
    subscriptionPeriod: "10/04/2025 - 10/04/2026",
  },
];

let userSubscription = {
  activePlan: null,
  referralCode: "VK2Z4A"
};

module.exports = {
  getPlans: (req, res) => {
    res.json({ plans: subscriptionPlans });
  },

  getActivePlan: (req, res) => {
    res.json({ activePlan: userSubscription.activePlan });
  },

  getReferralCode: (req, res) => {
    res.json({ referralCode: userSubscription.referralCode });
  },

  subscribeToPlan: (req, res) => {
    const { planId } = req.body;
    const selectedPlan = subscriptionPlans.find(plan => plan.id === planId);

    if (!selectedPlan) {
      return res.status(404).json({ error: "Paket tidak ditemukan" });
    }

    userSubscription.activePlan = selectedPlan;

    res.json({
      message: "Berhasil berlangganan",
      activePlan: selectedPlan
    });
  },

  unsubscribe: (req, res) => {
    if (!userSubscription.activePlan) {
      return res.status(400).json({ error: "Tidak ada langganan aktif untuk dibatalkan" });
    }

    const cancelledPlan = userSubscription.activePlan;
    userSubscription.activePlan = null;

    res.json({
      message: "Langganan berhasil dibatalkan",
      cancelledPlan
    });
  }
};
