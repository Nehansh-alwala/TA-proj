/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import supabase from '../../config/supabaseClient';
import './comm.css';
import { Badge, Flex, Modal, Text } from '@mantine/core';
import Spinner from '../spinner';

const CourseRecommendations = ({ token }) => {
  const [processingUsers, setProcessingUsers] = useState([]);
  const [acceptedUsers, setAcceptedUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [courseStatus, setCourseStatus] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [isSpinner, setIsSpinner] = useState(false);

  const fetchData = async () => {
    try {
      setIsSpinner(true);
      const { data: processingData, error: processingError } = await supabase
        .from('coursesapp')
        .select('courseName, username, zNumber, status')
        .eq('status', 'Processing');

      if (processingError) {
        throw processingError;
      }

      const { data: acceptedData, error: acceptedError } = await supabase
        .from('coursesapp')
        .select('courseName, username, zNumber, status')
        .eq('status', 'Accepted');

      if (acceptedError) {
        throw acceptedError;
      }

      const { data: rejectedData, error: rejectedError } = await supabase
        .from('coursesapp')
        .select('courseName, username, zNumber, status')
        .eq('status', 'Rejected');

      if (rejectedError) {
        throw rejectedError;
      }

      setIsSpinner(false);
      setProcessingUsers(processingData || []);
      setAcceptedUsers(acceptedData || []);
      setRejectedUsers(rejectedData || []);

      // Extract course status for processing users
      const processingStatus = {};
      processingData.forEach(user => {
        processingStatus[user.courseName] = user.status;
      });
      setCourseStatus(prevState => ({
        ...prevState,
        ...processingStatus
      }));
    } catch (error) {
      setIsSpinner(false);
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchUserData = async (zNumber, courseName, username) => {
    try {
      setIsSpinner(true);
      const { data, error } = await supabase
        .from('coursesapp')
        .select('*')
        .eq('zNumber', zNumber)
        .eq('courseName', courseName)
        .eq('username', username)
        .single();

      if (error) {
        throw error;
      }

      setIsSpinner(false);
      setUserData(data || null);
    } catch (error) {
      setIsSpinner(false);
      console.error('Error fetching user data:', error.message);
    }
  };

  const handleEyeClick = async (zNumber, courseName, username) => {
    setSelectedUser(zNumber);
    await fetchUserData(zNumber, courseName, username);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleAccept = async (zNumber, courseName) => {
    try {
      // Update status in database
      await supabase
        .from('coursesapp')
        .update({ status: 'Accepted' })
        .eq('zNumber', zNumber)
        .eq('courseName', courseName).select();

      // Update course status locally
      setCourseStatus(prevState => ({
        ...prevState,
        [courseName]: 'Accepted'
      }));
      fetchData();
    } catch (error) {
      console.error('Error accepting user:', error.message);
    }
  };

  const handleReject = async (zNumber, courseName) => {
    try {
      // Update status in database
      await supabase
        .from('coursesapp')
        .update({ status: 'Rejected' })
        .eq('zNumber', zNumber)
        .eq('courseName', courseName).select();

      // Update course status locally
      setCourseStatus(prevState => ({
        ...prevState,
        [courseName]: 'Rejected'
      }));
      fetchData();
    } catch (error) {
      console.error('Error rejecting user:', error.message);
    }
  };

  return (
    <div>
      {isSpinner && <Spinner />}
      <Text ta="center" c="darkgoldenrod" fz="h1" td="underline" fw="bold">Recommendation Info</Text>
      {/* Display processing users */}
      <div style={{ padding: "20px 50px" }}>
        <Text ta="center" c="#036" pb="sm" fz="h2" td="underline" fw="bold">Processing Applications</Text>
        <table style={{
          boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px'
        }}>
          <thead>
            <tr style={{ background: '#0056b3', color: 'white' }}>
              <th>Course</th>
              <th>Status</th>
              <th>Username</th>
              <th>Z Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {processingUsers.length ? processingUsers.map((user) => (
              <tr key={user.zNumber}>
                <td>{user.courseName}</td>
                <td>{courseStatus[user.courseName]}</td>
                <td>{user.username}</td>
                <td>{user.zNumber}</td>
                <td>
                  <Flex gap="lg">
                    <span className='cursor' onClick={() => handleEyeClick(user.zNumber, user.courseName, user.username)}>
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0056b3" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                        <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                      </svg>
                    </span>
                    {courseStatus[user.courseName] === 'Accepted' && <span className="status accepted">Accepted</span>}
                    {courseStatus[user.courseName] === 'Rejected' && <span className="status rejected">Rejected</span>}
                    {courseStatus[user.courseName] !== 'Accepted' && courseStatus[user.courseName] !== 'Rejected' && (
                      <React.Fragment>
                        <span className='cursor' onClick={() => handleAccept(user.zNumber, user.courseName)}>
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-check" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="green" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M5 12l5 5l10 -10" />
                          </svg>
                        </span>
                        <span className='cursor' onClick={() => handleReject(user.zNumber, user.courseName)}>
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="red" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M18 6l-12 12" />
                            <path d="M6 6l12 12" />
                          </svg>
                        </span>
                      </React.Fragment>
                    )}
                  </Flex>
                </td>
              </tr>
            )) : <tr><td colSpan="5" style={{
              textAlign: "center", fontSize: "larger", fontWeight: "bold",
              color: "red"
            }}>No Data</td></tr>}
          </tbody>
        </table>
      </div>
      {/* Display accepted users */}
      <div style={{ padding: "20px 50px" }}>
        <Text ta="center" c="#036" pb="sm" fz="h2" td="underline" fw="bold">Accepted Applications</Text>
        <table style={{
          boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px'
        }}>
          <thead>
            <tr style={{ background: '#0056b3', color: 'white' }}>
              <th>Course</th>
              <th>Username</th>
              <th>Z Number</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {acceptedUsers.length ? acceptedUsers.map((user) => (
              <tr key={user.zNumber}>
                <td>{user.courseName}</td>
                <td>{user.username}</td>
                <td>{user.zNumber}</td>
                <td><Badge color="green">{user.status}</Badge></td>
              </tr>
            )) : <tr><td colSpan="5" style={{
              textAlign: "center", fontSize: "larger", fontWeight: "bold",
              color: "red"
            }}>No Data</td></tr>}
          </tbody>
        </table>
      </div>
      {/* Display rejected users */}
      <div style={{ padding: "20px 50px 50px 50px" }}>
        <Text ta="center" c="#036" pb="sm" fz="h2" td="underline" fw="bold">Rejected Applications</Text>
        <table style={{
          boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px'
        }}>
          <thead>
            <tr style={{ background: '#0056b3', color: 'white' }}>
              <th>Course</th>
              <th>Username</th>
              <th>Z Number</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rejectedUsers.length ? rejectedUsers.map((user) => (
              <tr key={user.zNumber}>
                <td>{user.courseName}</td>
                <td>{user.username}</td>
                <td>{user.zNumber}</td>
                <td><Badge color='red'>{user.status}</Badge></td>
              </tr>
            )) : <tr><td colSpan="5" style={{
              textAlign: "center", fontSize: "larger", fontWeight: "bold",
              color: "red"
            }}>No Data</td></tr>}
          </tbody>
        </table>
      </div>
      {/* Display user details in a popup */}
        <Modal opened={showPopup} centered onClose={()=>setShowPopup(false)} title="Authentication">
            <h2>User Details</h2>
            {userData && (
              <div>
                <p>Z Number: {userData.zNumber}</p>
                <p>Semester: {userData.semester}</p>
                <p>Enrollment Status: {userData.enrollmentStatus}</p>
                <p>Expected Graduation: {userData.expectedGraduation}</p>
                <p>Citizenship Status: {userData.citizenshipStatus}</p>
                <p>Employed by FAU: {userData.employedByFAU}</p>
                <p>Hours Per Week: {userData.hoursPerWeek}</p>
                <p>Graduate Program: {userData.graduateProgram}</p>
                <p>Credits Completed: {userData.creditsCompleted}</p>
                <p>Program Start: {userData.programStart}</p>
                <p>Current GPA: {userData.currentGPA}</p>
                <p>Undergrad Major: {userData.undergradMajor}</p>
                <p>Courses as TA: {userData.coursesAsTA}</p>
                <p>Is Thesis Student: {userData.isThesisStudent}</p>
              </div>
            )}
        </Modal>
    </div>
  );
};

export default CourseRecommendations;
