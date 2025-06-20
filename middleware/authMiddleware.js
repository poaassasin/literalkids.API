// authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('../config/database.js');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ message: "Token required" });
  }

  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(403).json({ message: "Invalid token format" });
  }

  const token = tokenParts[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(500).json({ message: "Email dan password wajib diisi" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(500).json({ message: "Format email tidak valid" });
  }

  next();
};

const validateRegister = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword || req.body.confirm_password;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Format email tidak valid" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password dan konfirmasi tidak cocok" });
  }

  next();
};


const validateChildProfile = (req, res, next) => {
  const { fullName, age, gender, schoolLevel, birthDate } = req.body;

  if (!fullName || age === undefined || !gender || !schoolLevel || !birthDate) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  if (typeof fullName !== 'string' || fullName.trim().length < 3) {
    return res.status(400).json({ message: "Nama lengkap minimal 3 karakter" });
  }

  const parsedAge = parseInt(age);
  if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 10) {
    return res.status(400).json({ message: "Usia harus antara 1 sampai 10 tahun" });
  }

  if (gender !== "laki-laki" && gender !== "perempuan") {
    return res.status(400).json({ message: "Jenis kelamin tidak valid" });
  }

  const validLevels = ['PAUD', 'TK', 'SD'];
  if (!validLevels.includes(schoolLevel)) {
    return res.status(400).json({ message: "Jenjang sekolah tidak valid" });
  }

  const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  if (!dateRegex.test(birthDate)) {
    return res.status(400).json({ message: "Format tanggal lahir tidak valid (contoh: 7/4/2025)" });
  }

  next();
};

const validateParentProfile = (req, res, next) => {
  const { fullName, email, gender, birthDate } = req.body;

  if (!fullName || !email || !gender || !birthDate) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  if (typeof fullName !== 'string' || fullName.trim().length < 3) {
    return res.status(400).json({ message: "Nama lengkap minimal 3 karakter" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Format email tidak valid" });
  }

  if (gender !== "laki-laki" && gender !== "perempuan") {
    return res.status(400).json({ message: "Jenis kelamin tidak valid" });
  }

  const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  if (!dateRegex.test(birthDate)) {
    return res.status(400).json({ message: "Format tanggal lahir tidak valid (contoh: 7/4/2025)" });
  }

  next();
};

const validateSubscription = (req, res, next) => {
  const { packageName, price, duration, startDate, endDate } = req.body;

  if (!packageName || !price || !duration || !startDate || !endDate) {
    return res.status(400).json({ message: "Semua field langganan wajib diisi" });
  }

  const validPackages = ["Paket Ceria", "Paket Hebat", "Paket Juara"];
  if (!validPackages.includes(packageName)) {
    return res.status(400).json({ message: "Nama paket tidak valid" });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ message: "Harga tidak valid" });
  }

  const validDurations = ["1 Bulan", "3 Bulan", "12 Bulan"];
  if (!validDurations.includes(duration)) {
    return res.status(400).json({ message: "Durasi tidak valid" });
  }

  const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    return res.status(400).json({ message: "Format tanggal tidak valid (contoh: 10/04/2025)" });
  }

  next();
};

const leaderboardAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: token required" });
  }

  const allowedRoles = ['parent', 'child'];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied: unauthorized role" });
  }

  next();
};

const validateUserProfile = (req, res, next) => {
  const {
    id,
    full_name,
    username,
    password,
    email,
    phone_number,
    user_type,
  } = req.body;

  if (!id || typeof id !== 'string' || id.trim() === '') {
    return res.status(400).json({ message: 'id is required and must be a non-empty string' });
  }
  if (!full_name || typeof full_name !== 'string' || full_name.trim() === '') {
    return res.status(400).json({ message: 'full_name is required and must be a non-empty string' });
  }
  if (!username || typeof username !== 'string' || username.trim() === '') {
    return res.status(400).json({ message: 'username is required and must be a non-empty string' });
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ message: 'password is required and must be at least 6 characters' });
  }
  if (email && typeof email !== 'string') {
    return res.status(400).json({ message: 'email must be a string' });
  }
  if (phone_number && typeof phone_number !== 'string') {
    return res.status(400).json({ message: 'phone_number must be a string' });
  }
  if (!user_type || !['child', 'parent', 'admin'].includes(user_type)) {
    return res.status(400).json({ message: "user_type is required and must be 'child', 'parent', or 'admin'" });
  }

  next();
};

const validateQuizUserAnswer = async (req, res, next) => {
  const { user_id, question_id, selected_answer, is_correct } = req.body;

  if (!user_id || !question_id || !selected_answer || typeof is_correct !== 'boolean') {
    return res.status(400).json({ message: 'user_id, question_id, selected_answer, dan is_correct wajib diisi dengan benar' });
  }

  try {
    const [questions] = await db.query('SELECT id FROM quiz_questions WHERE id = ?', [question_id]);
    if (questions.length === 0) {
      return res.status(400).json({ message: 'question_id tidak ditemukan' });
    }

    const [answers] = await db.query(
      'SELECT answer_text FROM quiz_answers WHERE question_id = ? AND answer_text = ?',
      [question_id, selected_answer]
    );
    if (answers.length === 0) {
      return res.status(400).json({ message: 'selected_answer tidak valid untuk question_id ini' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error validasi jawaban quiz', error });
  }
};

const validateQuizResult = (req, res, next) => {
  const { user_id, total_score, total_coins, feedback_emoji } = req.body;

  if (!user_id || total_score === undefined || total_coins === undefined) {
    return res.status(400).json({ message: 'user_id, total_score, dan total_coins wajib diisi' });
  }

  if (typeof total_score !== 'number' || total_score < 0) {
    return res.status(400).json({ message: 'total_score harus berupa angka >= 0' });
  }
  if (typeof total_coins !== 'number' || total_coins < 0) {
    return res.status(400).json({ message: 'total_coins harus berupa angka >= 0' });
  }
  if (feedback_emoji && typeof feedback_emoji !== 'string') {
    return res.status(400).json({ message: 'feedback_emoji harus berupa string jika diisi' });
  }

  next();
};

const validateHomepage = (req, res, next) => {
  const { name, username, level, progress } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 3) {
    return res.status(400).json({ message: "Isi dengan nama lengkap" });
  }

  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    return res.status(400).json({ message: "Isi dengan username" });
  }

  if (level !== undefined && (typeof level !== 'number' || level < 1)) {
    return res.status(400).json({ message: "Level harus berupa angka >= 1" });
  }

  if (progress !== undefined && (typeof progress !== 'number' || progress < 0 || progress > 1)) {
    return res.status(400).json({ message: "Progress harus antara 0.0 hingga 1.0" });
  }

  next();
};

const validateBacaCerita = (req, res, next) => {
  const { title, genre, synopsis, read_count, is_favorite, xp_reward, coin_reward } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    return res.status(400).json({ message: "Judul cerita wajib diisi dan minimal 3 karakter" });
  }

  if (genre && typeof genre !== 'string') {
    return res.status(400).json({ message: "Genre harus berupa teks" });
  }

  if (synopsis && typeof synopsis !== 'string') {
    return res.status(400).json({ message: "Sinopsis harus berupa teks" });
  }

  if (read_count !== undefined && (typeof read_count !== 'number' || read_count < 0)) {
    return res.status(400).json({ message: "read_count harus angka >= 0" });
  }

  if (is_favorite !== undefined && typeof is_favorite !== 'boolean') {
    return res.status(400).json({ message: "is_favorite harus berupa boolean (true/false)" });
  }

  if (xp_reward !== undefined && (typeof xp_reward !== 'number' || xp_reward < 0)) {
    return res.status(400).json({ message: "xp_reward harus angka >= 0" });
  }

  if (coin_reward !== undefined && (typeof coin_reward !== 'number' || coin_reward < 0)) {
    return res.status(400).json({ message: "coin_reward harus angka >= 0" });
  }

  next();
};

const validateBacaCeritaPage = (req, res, next) => {
  const { story_id, page_number, image_url, text_content } = req.body;

  if (!story_id || typeof story_id !== 'number') {
    return res.status(400).json({ message: "story_id wajib diisi dan berupa angka" });
  }

  if (page_number === undefined || typeof page_number !== 'number' || page_number < 1) {
    return res.status(400).json({ message: "page_number wajib diisi dan >= 1" });
  }

  if (!image_url || typeof image_url !== 'string' || !/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(image_url)) {
    return res.status(400).json({ message: "image_url harus berupa URL gambar yang valid" });
  }

  if (!text_content || typeof text_content !== 'string' || text_content.trim().length < 3) {
    return res.status(400).json({ message: "text_content wajib diisi dan minimal 3 karakter" });
  }

  next();
};

const validateGetAllGenres = (req, res, next) => {
  next();
};

const validateGetStoriesByGenre = (req, res, next) => {
  const { genre_id } = req.params;

  const genreIdNumber = parseInt(genre_id);
  if (isNaN(genreIdNumber) || genreIdNumber < 1) {
    return res.status(400).json({ message: "genre_id harus berupa angka positif" });
  }

  next();
};

const validateGetStory = (req, res, next) => {
  const { id } = req.params;

  const storyIdNumber = parseInt(id);
  if (isNaN(storyIdNumber) || storyIdNumber < 1) {
    return res.status(400).json({ message: "id cerita harus berupa angka positif" });
  }

  next();
};

const validateOnboarding = (req, res, next) => {
  const {
    childName,
    childUsername,
    parentName,
    parentUsername,
    referralCode,
    selectedPackageIndex,
  } = req.body;

  if (!childName || typeof childName !== 'string' || childName.trim().length < 3) {
    return res.status(400).json({ message: 'Nama anak wajib diisi dan minimal 3 karakter' });
  }

  if (!childUsername || typeof childUsername !== 'string' || childUsername.trim().length < 3) {
    return res.status(400).json({ message: 'Username anak wajib diisi dan minimal 3 karakter' });
  }

  if (!parentName || typeof parentName !== 'string' || parentName.trim().length < 3) {
    return res.status(400).json({ message: 'Nama orang tua wajib diisi dan minimal 3 karakter' });
  }

  if (!parentUsername || typeof parentUsername !== 'string' || parentUsername.trim().length < 3) {
    return res.status(400).json({ message: 'Username orang tua wajib diisi dan minimal 3 karakter' });
  }

  if (referralCode && typeof referralCode !== 'string') {
    return res.status(400).json({ message: 'Kode referral harus berupa teks jika diisi' });
  }

  if (
    selectedPackageIndex === undefined ||
    typeof selectedPackageIndex !== 'number' ||
    ![0, 1, 2].includes(selectedPackageIndex)
  ) {
    return res.status(400).json({ message: 'Index paket tidak valid. Harus 0, 1, atau 2' });
  }

  next();
};

const validateLibraryShelf = (req, res, next) => {
  const { title, storyCount, coverImage } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    return res.status(400).json({ message: 'Judul rak wajib diisi dan minimal 3 karakter' });
  }

  if (storyCount === undefined || typeof storyCount !== 'number' || storyCount < 0) {
    return res.status(400).json({ message: 'Jumlah cerita harus berupa angka >= 0' });
  }

  if (!coverImage || typeof coverImage !== 'string') {
    return res.status(400).json({ message: 'coverImage wajib diisi dan berupa string (misal URL atau path gambar)' });
  }

  next();
};

const validateAvatarPurchase = (req, res, next) => {
  const { child_id, avatar_id } = req.body;

  if (!child_id || !avatar_id) {
    return res.status(400).json({ message: "child_id dan avatar_id wajib diisi" });
  }

  if (typeof child_id !== 'number' || typeof avatar_id !== 'number') {
    return res.status(400).json({ message: "child_id dan avatar_id harus berupa angka" });
  }

  next();
};

const validateAvatarUpdate = (req, res, next) => {
  const { child_id, avatar_id } = req.body;

  if (!child_id || !avatar_id) {
    return res.status(400).json({ message: "child_id dan avatar_id wajib diisi" });
  }

  if (typeof child_id !== 'number' || typeof avatar_id !== 'number') {
    return res.status(400).json({ message: "child_id dan avatar_id harus berupa angka" });
  }

  next();
};



module.exports = {
  verifyToken,
  validateRegister,
  validateLogin,
  validateSubscription,
  validateParentProfile,
  validateChildProfile,
  leaderboardAccess,
  validateUserProfile,
  validateQuizUserAnswer,
  validateQuizResult,
  validateHomepage,
  validateBacaCerita,
  validateBacaCeritaPage,
  validateGetAllGenres,
  validateGetStoriesByGenre,
  validateGetStory,
  validateOnboarding,
  validateLibraryShelf,
  validateAvatarPurchase,
  validateAvatarUpdate,
};
