const Course = require('../models/Course');


exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.addCourse = async (req, res) => {
    const { title, duration, description, category, rating, learners } = req.body;

  
  if (rating && (rating < 0 || rating > 5)) {
    return res.status(400).json({ message: 'Rating must be between 0 and 5' });
  }

  if (learners && learners < 0) {
    return res.status(400).json({ message: 'Learners cannot be a negative number' });
  }

  try {
    const existingCourse = await Course.findOne({ title });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course with this title already exists' });
    }

    const course = new Course({
      title,
      duration,
      description,
      category,
      rating: rating || 0, 
      learners: learners || 0, 
    });

    await course.save();
    res.status(201).json({
      message: 'Course added successfully',
      course,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
       
};



exports.getCourseTitles = async (req, res) => {
    try {
      const courses = await Course.find({}, 'title');
      res.status(200).json(courses);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };



  
  exports.getCourseByTitle = async (req, res) => {
    try {
      const { title } = req.query; 
  
      if (!title) {
        return res.status(400).json({ message: 'Title query parameter is required' });
      }
  
      
      const course = await Course.findOne({ title: title });
  
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      res.status(200).json(course);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };


exports.toggleEnrollment = async (req, res) => {
    const { title } = req.body; 
    const userId = req.user._id; 
  
    if (!title) {
      return res.status(400).json({ message: 'Course title is required' });
    }
  
    try {
      console.log("Title in request body:", title);
      console.log("Authenticated User:", req.user);
  
      const course = await Course.findOne({ title: { $regex: new RegExp(title, "i") } });
      if (!course) return res.status(404).json({ message: 'Course not found' });
  
      const isEnrolled = course.enrolledUsers.includes(userId);
  
      if (isEnrolled) {
        course.enrolledUsers.pull(userId);
        course.learners -= 1; 
      } else {
        course.enrolledUsers.push(userId);
        course.learners += 1;
      }
  
      await course.save();
      res.status(200).json({ enrolled: !isEnrolled, learners: course.learners });
    } catch (err) {
      console.error(err); 
      res.status(500).json({ message: err.message });
    }
  };
  
  
  
exports.rateCourse = async (req, res) => {
    const { title, rating } = req.body; 
    const userId = req.user._id; 
  
    if (!title) {
      return res.status(400).json({ message: 'Course title is required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
  
    try {
      const course = await Course.findOne({ title });
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      const existingRating = course.ratings.find(r => r.user.toString() === userId.toString());
  
      if (existingRating) {
        existingRating.score = rating;
      } else {
        course.ratings.push({ user: userId, score: rating });
      }
  
      const totalRatings = course.ratings.reduce((acc, r) => acc + r.score, 0);
      course.rating = totalRatings / course.ratings.length;
  
      await course.save();
  
      res.status(200).json({ message: 'Rating updated successfully', rating: course.rating });
    } catch (err) {
      console.error(err); 
      res.status(500).json({ message: err.message });
    }
  };
  
