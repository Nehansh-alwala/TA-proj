/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import supabase from '../../config/supabaseClient';
import './tadash.css'; // Import CSS file for styling
import { Badge, Button, Text } from '@mantine/core';
import Spinner from '../spinner';

const TAapplication = ({ token }) => {
  const [coursesApp, setCoursesApp] = useState([]);
  const [acceptedCourses, setAcceptedCourses] = useState([]);
  const [isSpinner, setIsSpinner] = useState(false);
  const [acceptedByUser, setAcceptedByUser] = useState([]);
  const [rejectedByUser, setRejectedByUser] = useState([]);

  useEffect(() => {
    const fetchCoursesApp = async () => {
      try {
        setIsSpinner(true);
        if (token) {
          const { data, error } = await supabase
            .from('coursesapp')
            .select('id, courseName, courseNum, inst, status')
            .eq('userId', token.user.id);

          if (error) {
            throw error;
          }

          if (data && data.length > 0) {
            setIsSpinner(false);
            setCoursesApp(data);
            const accepted = data.filter(course => course.status.toLowerCase() === 'accepted');
            setAcceptedCourses(accepted);
          }
        }
      } catch (error) {
        setIsSpinner(false);
        console.error('Error fetching courses from coursesapp:', error.message);
      }
    };

    fetchCoursesApp();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('coursesapp').delete().eq('id', id);

      if (error) {
        throw error;
      }

      // Update coursesApp state after deletion
      setCoursesApp((prevCourses) => prevCourses.filter((course) => course.id !== id));
    } catch (error) {
      console.error('Error deleting course:', error.message);
    }
  };

  const handleAccept = async (id) => {
    try {
      // Update the acceptedByUser state for the course
      setAcceptedByUser((prevAccepted) => [...prevAccepted, id]);

      // Add your logic for updating the status in the database here
    } catch (error) {
      console.error('Error accepting course:', error.message);
    }
  };

  const handleReject = async (id) => {
    // Add logic to handle rejecting the course
    try {
      // Update the acceptedByUser state for the course
      setRejectedByUser((prevRejected) => [...prevRejected, id]);

      // Add your logic for updating the status in the database here
    } catch (error) {
      console.error('Error rejecting course:', error.message);
    }
  };

  return (
    <div>
      {isSpinner && <Spinner />}
      <div>
        <Text ta="center" fz="h1" c="#0056b3" pt="lg" pb="lg" fw="bold">My Applications</Text>
        <div style={{padding: '0 50px 50px 50px'}}>
          <table className="courses-table">
            <thead>
              <tr style={{background: '#0056b3', color: 'white'}}>
                <th>Course Name</th>
                <th>Course Number</th>
                <th>Instructor</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {coursesApp.map((course) => (
                <tr key={course.id} className="course-row">
                  <td>{course.courseName}</td>
                  <td>{course.courseNum}</td>
                  <td>{course.inst}</td>
                  <td><Badge color={course.status.toLowerCase() === 'accepted' ? "green" :
                  course.status.toLowerCase() === 'rejected' ? "red" : "yellow"}>{course.status}</Badge></td>
                  <td>
                    <span className='cursor' onClick={() => handleDelete(course.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0056b3" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 7l16 0" />
                        <path d="M10 11l0 6" />
                        <path d="M14 11l0 6" />
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                      </svg>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {acceptedCourses.length > 0 && (
            <div>
              <Text ta="center" fz="h1" c="#0056b3" pt="lg" pb="lg" fw="bold">Accepted Courses</Text>
              <table className="courses-table">
                <thead>
                  <tr style={{background: '#0056b3', color: 'white'}}>
                    <th>Course Name</th>
                    <th>Course Number</th>
                    <th>Instructor</th>
                    
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {acceptedCourses.map((course) => (
                    <tr key={course.id} className="course-row">
                      <td>{course.courseName}</td>
                      <td>{course.courseNum}</td>
                      <td>{course.inst}</td>
                      <td>
                          {acceptedByUser.includes(course.id) ? <Badge color="green">Accepted by you</Badge> : (
                            rejectedByUser.includes(course.id) ? <Badge color="red">Rejected by you</Badge>  : (
                              <div>
                                <Button onClick={() => handleAccept(course.id)} variant="outline" color="green">Accept</Button>
                                <Button onClick={() => handleReject(course.id)} variant="outline" color="red">Reject</Button>
                              </div>
                            )
                          )}
                        </td>


                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TAapplication;
