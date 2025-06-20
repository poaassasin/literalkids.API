const express = require('express');
const router = express.Router();

const {
  getAllQuizQuestions,
  getQuizAnswersByQuestionId,
  submitUserAnswer,
  getUserQuizResults
} = require('../controllers/QuizController');

// Ambil semua soal quiz
router.get('/questions', getAllQuizQuestions);
// Ambil pilihan jawaban berdasarkan question_id
router.get('/questions/:questionId/answers', getQuizAnswersByQuestionId);
// Submit jawaban user
router.post('/answers', submitUserAnswer);
// Ambil hasil quiz user
router.get('/results/:userId', getUserQuizResults);

module.exports = router;
