const express = require('express');
const { getCourses,
    addCourse,
    getCourseById,
    getCourseByTitle, 
    getCourseTitles, 
    toggleEnrollment, 
    rateCourse } = require('../controllers/courseController');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getCourses);
router.post('/add', authenticate, addCourse);
router.get('/titles', getCourseTitles); 
router.get('/by-title', getCourseByTitle)
router.post('/enroll', authenticate, toggleEnrollment); 
router.post('/rate', authenticate, rateCourse); 


module.exports = router;
