const db = require('../config/db_local');

const getLeaderboardUsers = (req, res) => {
  const query = `
    SELECT id, full_name, username, level, avatar_url, is_current_user 
    FROM leaderboard_users 
    ORDER BY level DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching leaderboard users:', err);
      return res.status(500).json({ message: 'Failed to get leaderboard users' });
    }

    const users = results.map(user => ({
      id: user.id,
      fullName: user.full_name,
      username: user.username,
      level: user.level,
      avatarUrl: user.avatar_url,
      isCurrentUser: user.is_current_user === 1
    }));

    res.json(users);
  });
};

module.exports = {
  getLeaderboardUsers,
};
