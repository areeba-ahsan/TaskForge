const express = require('express');
const router = express.Router();

const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember,
} = require('../controllers/projectController');

const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');
const {
  createProjectValidator,
  updateProjectValidator,
  addMemberValidator,
} = require('../validators/projectValidator');

// Sab routes ko login chahiye
router.use(protect);

router.post('/', authorize('admin'), createProjectValidator, validate, createProject);
router.get('/', getAllProjects); // sab roles dekh sakte hain (controller mein filter hota hai)
router.get('/:id', getProjectById);
router.put('/:id', authorize('admin'), updateProjectValidator, validate, updateProject);
router.delete('/:id', authorize('admin'), deleteProject);

router.post('/:id/members', authorize('admin', 'project_manager'), addMemberValidator, validate, addTeamMember);
router.delete('/:id/members/:userId', authorize('admin', 'project_manager'), removeTeamMember);

module.exports = router;