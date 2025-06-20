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
app.use('/api/child-profiles', verifyToken, childProfileRoutes);
app.use('/api/parent-profiles', verifyToken, parentProfileRoutes);
app.use('/api/subscription', verifyToken, subscriptionRoutes);
app.use('/api/userprofile', verifyToken, userprofileRoutes);
app.use('/api/quiz', verifyToken, quizRoutes);
app.use('/api/bacacerita', verifyToken, bacaCeritaRoutes);
app.use('/api/leaderboard', verifyToken, leaderboardRoutes);  
app.use('/api/homepage', verifyToken, homepageRoutes); 
app.use('/api/search', verifyToken, searchRoutes); 
app.use('/api/onboarding', verifyToken, onboardingRoutes);
app.use('/api/library', verifyToken, libraryRoutes); 
app.use('/api/avatar', verifyToken, avatarRoutes);
app.use('/api/levelselector', verifyToken, levelselectorRoutes);
app.use('/api/occupationselector', verifyToken, occupationSelectorRoutes);
app.use('/api/relationshipselector', verifyToken, relationshipSelectorRoutes);



// --- Error Handling ---
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route tidak ditemukan' });
});

// Jalankan server
const PORT = process.env.SERVER_PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
