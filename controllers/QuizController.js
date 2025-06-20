const db = require('../config/db_local');

// Ambil semua quiz questions
const getAllQuizQuestions = (req, res) => {
  db.query('SELECT * FROM quiz_questions', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching questions', error: err });
    res.json(results);
  });
};

// Ambil jawaban berdasarkan question_id
const getQuizAnswersByQuestionId = (req, res) => {
  const { questionId } = req.params;
  db.query('SELECT * FROM quiz_answers WHERE question_id = ?', [questionId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching answers', error: err });
    res.json(results);
  });
};

// Submit jawaban user saat quiz berjalan
const submitUserAnswer = (req, res) => {
  const { user_id, question_id, selected_answer, is_correct } = req.body;

  if (!user_id || !question_id || !selected_answer || typeof is_correct !== 'boolean') {
    return res.status(400).json({ message: 'Data incomplete' });
  }

  const query = `INSERT INTO quiz_user_answers (user_id, question_id, selected_answer, is_correct) VALUES (?, ?, ?, ?)`;
  db.query(query, [user_id, question_id, selected_answer, is_correct], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error saving answer', error: err });
    res.status(201).json({ message: 'Answer saved successfully' });
  });
};

// Ambil hasil quiz user
const getUserQuizResults = (req, res) => {
  const { userId } = req.params;
  db.query('SELECT * FROM quiz_results WHERE user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching quiz results', error: err });
    res.json(results);
  });
};

module.exports = {
  getAllQuizQuestions,
  getQuizAnswersByQuestionId,
  submitUserAnswer,
  getUserQuizResults,
};
