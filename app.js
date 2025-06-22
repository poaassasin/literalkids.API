// Memuat environment variable terlebih dahulu
require('dotenv').config();

const express = require("express");
const cors = require("cors");

// Middleware custom
const verifyToken = require('./middleware/authMiddleware').verifyToken;

// Import route
const childProfileRoutes = require('./routes/ChildProfileRoutes');
const parentProfileRoutes = require('./routes/ParentProfileRoutes');
const subscriptionRoutes = require('./routes/SubscriptionRoutes');
const userprofileRoutes = require('./routes/UserprofileRoutes');
const quizRoutes = require('./routes/QuizRoutes');
const bacaCeritaRoutes = require('./routes/BacaCeritaRoutes');
const leaderboardRoutes = require('./routes/LeaderboardRoutes');  
const homepageRoutes = require('./routes/HomepageRoutes');
const searchRoutes = require('./routes/SearchRoutes');
const onboardingRoutes = require('./routes/OnBoardingRoutes');
const libraryRoutes = require('./routes/LibraryRoutes'); 
const avatarRoutes = require('./routes/AvatarRoutes');
const levelselectorRoutes = require('./routes/LevelSelectorRoutes');
const occupationSelectorRoutes = require('./routes/OccupationSelectorRoutes');
const relationshipSelectorRoutes = require('./routes/RelationshipSelectorRoutes');


// Controller login
const logResRoutes = require('./routes/LogResRoutes');

const app = express();

// --- Middleware Global ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.use('/api', logResRoutes);
app.use('/api/child-profiles', childProfileRoutes);
app.use('/api/parent-profiles', parentProfileRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/userprofile', userprofileRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/bacacerita', bacaCeritaRoutes);
app.use('/api/leaderboard', leaderboardRoutes);  
app.use('/api/homepage', homepageRoutes); 
app.use('/api/search', searchRoutes); 
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/library', libraryRoutes); 
app.use('/api/avatar', avatarRoutes);
app.use('/api/levelselector', levelselectorRoutes);
app.use('/api/occupationselector', occupationSelectorRoutes);
app.use('/api/relationshipselector', relationshipSelectorRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ 
    status: "success",
    message: "Literakids API is running" 
  });
});

// --- Error Handling ---
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route tidak ditemukan' });
});

// Jalankan server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
