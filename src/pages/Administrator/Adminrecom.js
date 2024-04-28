/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import supabase from '../../config/supabaseClient';
import './admin.css';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './Adminnav';
import Spinner from '../spinner';

const CDNURL = 'https://tnbwpgqqregwtzbacppk.supabase.co/storage/v1/object/public/documents/';

const CourseOptions = ({ token }) => {
  const [courseApplicantsMap, setCourseApplicantsMap] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isRecommended, setIsRecommended] = useState(false);
  const [fileData, setFileData] = useState(null); // State for file data
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [isSpinner, setIsSpinner] = useState(false);
  

  let navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  useEffect(() => {
    const fetchCoursesAndApplicants = async () => {
      try {
        setIsSpinner(true);
        const coursesResponse = await supabase.from('courses').select('title');

        if (coursesResponse.error) {
          throw coursesResponse.error;
        }

        const courses = coursesResponse.data.map(course => course.title);

        const courseApplicants = {};
        for (const course of courses) {
          const { data: applicantsData, error } = await supabase
            .from('coursesapp')
            .select('username, userId')
            .eq('courseName', course);

          if (error) {
            throw error;
          }

          courseApplicants[course] = applicantsData || [];
        }

        setCourseApplicantsMap(courseApplicants);
      } catch (error) {
        console.error('Error fetching courses and applicants:', error.message);
      }
    };

    fetchCoursesAndApplicants();
  }, [token]);

  const handleCourseClick = async course => {
    setSelectedCourse(course);
    setActiveCourse(course);
    setActiveUser(null);
    
    try {
      setIsSpinner(true);
      const applicants = courseApplicantsMap[course];
      setSelectedApplicants(applicants);
      setSelectedUserDetails(null);
    } catch (error) {
      console.error('Error fetching applicants:', error.message);
    }
  };

  const handleUserClick = async (userId, courseName) => {
    setActiveUser(userId);
    try {
      setIsSpinner(true);
      const { data: userDetails, error } = await supabase
        .from('coursesapp')
        .select()
        // .select('semester, zNumber, enrollmentStatus, expectedGraduation, citizenshipStatus, employedByFAU, hoursPerWeek, graduateProgram, creditsCompleted, programStart, currentGPA, undergradMajor, coursesAsTA, isThesisStudent, fileName')
        .eq('userId', userId)
        .eq('courseName', courseName)
        .single();

      if (error) {
        throw error;
      }

      console.log('User details:', userDetails); // Log user details to check if fetched correctly

      setSelectedUserDetails(userDetails);

      const { data: recommendations, error: recommendationError } = await supabase
        .from('recommend')
        .select()
        .eq('courseName', selectedCourse)
        .eq('recommendedUser', userId);

      setIsRecommended(recommendations && recommendations.length > 0);

      const fileName = userDetails.fileName;
      const fileURL = `${CDNURL}${userId}/${fileName}`;

      const response = await fetch(fileURL);
      const blob = await response.blob();
      setFileData(blob);
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    }
  };

  const handleRecommend = async () => {
    try {
      setIsSpinner(true);
      await supabase
        .from('coursesapp')
        .update({ status: 'Processing', feedback: feedback, recommend: 'recommended' })
        .eq('courseName', selectedCourse)
        .eq('userId', activeUser);

      await supabase.from('recommend').insert([{ courseName: selectedCourse, recommendedUser: activeUser }]);

      setIsRecommended(true);

      setSelectedUserDetails(prevState => ({
        ...prevState,
        feedback: feedback,
      }));
      setFeedback('');
    } catch (error) {
      console.error('Error updating status:', error.message);
    }
  };

  return (
    <div>
      <div className="course-options-container">
        <div className="column column-1">
          <h3>Courses</h3>
          {Object.entries(courseApplicantsMap).map(([course, applicants]) => (
            <div
              key={course}
              className={`course-card ${activeCourse === course ? 'active' : ''}`}
              onClick={() => handleCourseClick(course)}
            >
              <h3>{course}</h3>
              <p>{applicants.length} Applicants</p>
            </div>
          ))}
        </div>
        <div className="column column-2">
          <h3>Applicants for {selectedCourse}</h3>
          {selectedApplicants.map(applicant => (
            <div
              key={applicant.userId}
              className={`applicant-card ${activeUser === applicant.userId ? 'active' : ''}`}
              onClick={() => handleUserClick(applicant.userId, selectedCourse)} // Pass selectedCourse
            >
              <p>{applicant.username}</p>
            </div>
          ))}
        </div>
        <div className="column column-3">
          <h3>User Details</h3>
          {selectedUserDetails && (
            <div className="user-details">
              <p><b>Semester:</b> {selectedUserDetails.semester}</p>
              <p><b>Z Number:</b> {selectedUserDetails.zNumber}</p>
              <p><b>Enrollment Status:</b> {selectedUserDetails.enrollmentStatus}</p>
              <p><b>Expected Graduation:</b> {selectedUserDetails.expectedGraduation}</p>
              <p><b>Citizenship Status:</b> {selectedUserDetails.citizenshipStatus}</p>
              <p><b>Employed by FAU:</b> {selectedUserDetails.employedByFAU}</p>
              <p><b>Hours Per Week:</b> {selectedUserDetails.hoursPerWeek}</p>
              <p><b>Graduate Program:</b> {selectedUserDetails.graduateProgram}</p>
              <p><b>Credits Completed:</b> {selectedUserDetails.creditsCompleted}</p>
              <p><b>Program Start:</b> {selectedUserDetails.programStart}</p>
              <p><b>Current GPA:</b> {selectedUserDetails.currentGPA}</p>
              <p><b>Undergrad Major:</b> {selectedUserDetails.undergradMajor}</p>
              <p><b>Courses As TA: </b>{selectedUserDetails.coursesAsTA}</p>
              <p><b>Thesis Student:</b> {selectedUserDetails.isThesisStudent ? 'Yes' : 'No'}</p>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Enter Feedback"
              ></textarea>
              {isRecommended ? (
                <button className="inactive">Recommended</button>
              ) : (
                <button onClick={handleRecommend}>Recommend</button>
              )}
              {fileData && (
                <div>
                  <h3>Document</h3>
                  <embed src={URL.createObjectURL(fileData)} type="application/pdf" width="100%" height="600px" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseOptions;
