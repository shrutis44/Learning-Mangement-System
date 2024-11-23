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
  const {
    title,
    course_images,
    url,
    price,
    num_lectures,
    level,
    rating,
    content_duration,
    published_date,
    subject,
    course_content,
  } = req.body;

  if (rating < 0 || rating > 1) {
    return res.status(400).json({ message: 'Rating must be between 0 and 1' });
  }

  if (price < 0) {
    return res.status(400).json({ message: 'Price cannot be negative' });
  }

  if (num_lectures && num_lectures <= 0) {
    return res.status(400).json({ message: 'Number of lectures must be greater than zero' });
  }


  if (published_date) {
    const dateParts = published_date.split('T');
    if (dateParts.length !== 2) {
      return res.status(400).json({
        message: 'Published date must be in the format YYYY-MM-DDTHH:mm',
      });
    }

    const [date, time] = dateParts;
    const dateSegments = date.split('-');
    const timeSegments = time.split(':');

    if (
      dateSegments.length !== 3 ||
      timeSegments.length !== 2 ||
      isNaN(dateSegments[0]) || 
      isNaN(dateSegments[1]) || 
      isNaN(dateSegments[2]) || 
      isNaN(timeSegments[0]) || 
      isNaN(timeSegments[1])    
    ) {
      return res.status(400).json({
        message: 'Published date must be in the format YYYY-MM-DDTHH:mm',
      });
    }

    const [year, month, day] = dateSegments.map(Number);
    const [hour, minute] = timeSegments.map(Number);

    if (
      year < 1 || 
      month < 1 || month > 12 ||
      day < 1 || day > 31 || 
      hour < 0 || hour > 23 ||
      minute < 0 || minute > 59
    ) {
      return res.status(400).json({
        message: 'Published date contains invalid values',
      });
    }
  }

  try {
    const existingCourse = await Course.findOne({ title });
    if (existingCourse) {
     return res.status(400).json({ message: 'A course with this title already exists' });
    }

    const course = new Course({
      title,
      course_images,
      url,
      price,
      num_lectures,
      level,
      rating,
      content_duration,
      published_date, 
      subject,
      course_content,
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
    if (rating < 0 || rating > 1) {
      return res.status(400).json({ message: 'Rating must be between 0 and 1' });
    }
  
    try {
      const course = await Course.findOne({ title });
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      
      if (!course.ratings) {
        course.ratings = [];
      }
  
      const existingRating = course.ratings.find(
        (r) => r.user.toString() === userId.toString()
      );
  
      if (existingRating) {
        existingRating.score = rating;
      } else {
        course.ratings.push({ user: userId, score: rating });
        course.num_reviews += 1;
      }
  
      const totalRatings = course.ratings.reduce((acc, r) => acc + r.score, 0);
      course.rating = totalRatings / course.ratings.length;
  
      await course.save();
  
      res.status(200).json({ message: 'Rating updated successfully', rating: course.rating });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred', error: err.message });
    }
  };
  


  
