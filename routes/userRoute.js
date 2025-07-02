const express = require('express');
const router = express.Router();
const {
  loginUser,
  registerUser,
  getAllUsers,
  getUser,
  getUserReport,
  updateUserProfile,
  deleteUser,
  getComments,
  postComment,
  authenticate,
} = require('../controllers/userController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// router.post('/login', loginUser);
router.post('/', upload.single('image'), registerUser);
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.get('/report/:id', getUserReport);
router.put('/:id', upload.single('image'), updateUserProfile);
router.delete('/:id', deleteUser);
router.get('/comments/:reportId', getComments);
router.post('/comments', authenticate, postComment);

module.exports = router;