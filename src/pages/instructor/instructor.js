/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import supabase from '../../config/supabaseClient';
import { Badge, Flex, Modal, Text } from '@mantine/core';
import Spinner from '../spinner';

const InstRecommendations = ({ token }) => {
  const [courseData, setCourseData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isSpinner, setIsSpinner] = useState(false);

  const fetchData = async () => {
    try {
      setIsSpinner(true);
      const { data, error } = await supabase
        .from('coursesapp')
        .select('courseName, username, feedback')
        .not('feedback', 'is', null) // Filter to fetch only where feedback is provided
        
        .order('courseName');

      if (error) {
        throw error;
      }

      setIsSpinner(false);
      setCourseData(data || []);
    } catch (error) {
      setIsSpinner(false);
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEyeClick = (course) => {
    setSelectedCourse(course);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      {isSpinner && <Spinner />}
      <Text ta="center" c="darkgoldenrod" fz="h1" td="underline" fw="bold">Course Recommendations</Text>
      <div style={{ padding: "20px 50px" }}>
        <table style={{
          boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px'
        }}>
          <thead>
            <tr style={{ background: '#0056b3', color: 'white' }}>
              <th>Course</th>
              <th>Applicant</th>
              <th>Feedback</th>
             
            </tr>
          </thead>
          <tbody>
            {courseData.length ? courseData.map((course) => (
              <tr key={course.courseName}>
                <td>{course.courseName}</td>
                <td>{course.username}</td>
                <td>{course.feedback}</td>
                
              </tr>
            )) : <tr><td colSpan="5" style={{
              textAlign: "center", fontSize: "larger", fontWeight: "bold",
              color: "red"
            }}>No Data</td></tr>}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default InstRecommendations;
