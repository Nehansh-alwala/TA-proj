/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import supabase from '../../config/supabaseClient';
import "./admin.css"
import { useNavigate } from "react-router-dom";
import { Flex, Text } from "@mantine/core";
import Spinner from "../spinner";

const AddCourses = ({ token }) => {
    const [courses, setCourses] = useState([]);
    const [newCourseTitle, setNewCourseTitle] = useState('');
    const [newCourseNumber, setNewCourseNumber] = useState('');
    const [newCourseInstructor, setNewCourseInstructor] = useState('');
    const [isAdded, setIsAdded] = useState(false);
    const [isSpinner, setIsSpinner] = useState(false);
    

    useEffect(() => {
        // Fetch courses from the 'courses' table
        const fetchCourses = async () => {
            try {
                setIsSpinner(true);
                const { data, error } = await supabase.from('courses').select('*');

                if (error) {
                    throw error;
                }

                if (data) {
                    setIsSpinner(false);
                    setCourses(data);
                }
            } catch (error) {
                setIsSpinner(false);
                console.error('Error fetching courses:', error.message);
            }
        };

        fetchCourses();
    }, [token]); // Fetch courses whenever token changes

    const handleDeleteCourse = async (courseTitle) => {
        try {
            // Delete course from the 'courses' table
            const { error } = await supabase.from('courses').delete().eq('title', courseTitle);

            if (error) {
                throw error;
            }

            // Remove the deleted course from the state
            setCourses(prevCourses => prevCourses.filter(course => course.title !== courseTitle));
        } catch (error) {
            console.error('Error deleting course:', error.message);
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        try {
            setIsSpinner(true)
            // Add new course to the 'courses' table
            const { data, error } = await supabase.from('courses').insert([{
                title: newCourseTitle,
                courseNumber: newCourseNumber,
                instructor: newCourseInstructor
            }]).select();

            if (error) {
                throw error;
            }

            if (data) {
                // Update the state with the newly added course
                setCourses(prevCourses => [...prevCourses, {
                    title: newCourseTitle,
                    courseNumber: newCourseNumber,
                    instructor: newCourseInstructor
                }]);
                // Clear input fields
                setNewCourseTitle('');
                setNewCourseNumber('');
                setNewCourseInstructor('');
                setIsAdded(true);
                setIsSpinner(false)
            }
        } catch (error) {
            setIsSpinner(false);
            console.error('Error adding course:', error.message);
        }
    };


    return (
        <div style={{ padding: '40px 30px' }}>
            {isSpinner && <Spinner />}
            <Flex gap={70}>
                <div className="available-courses">
                    <Text fw="bold" ta="center" mb={10} fz="h2" pb="xl" td="underline" c="#036">Available Courses</Text>
                    <table>
                        <thead>
                            <tr style={{ background: '#0056b3', color: 'white' }}>
                                <th>Course Title</th>
                                <th>Course Number</th>
                                <th>Instructor</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course, index) => (
                                <tr key={index}>
                                    <td>{course.title}</td>
                                    <td>{course.courseNumber}</td>
                                    <td>{course.instructor}</td>
                                    <td>
                                        <span onClick={() => handleDeleteCourse(course.title)}>
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
                </div>
                <form className="add-course-form" onSubmit={handleAddCourse}>
                    <Text fw="bold" ta="center" fz="h2" pb="xl" style={{ textDecoration: "underline" }} c="#036">Add new Courses</Text>
                    <div>
                        <label htmlFor="courseTitle">Course Title:</label>
                        <input
                            type="text"
                            id="courseTitle"
                            value={newCourseTitle}
                            onChange={(e) => setNewCourseTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="courseNumber">Course Number:</label>
                        <input
                            type="text"
                            id="courseNumber"
                            value={newCourseNumber}
                            onChange={(e) => setNewCourseNumber(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="courseInstructor">Instructor:</label>
                        <input
                            type="text"
                            id="courseInstructor"
                            value={newCourseInstructor}
                            onChange={(e) => setNewCourseInstructor(e.target.value)}
                        />
                    </div>
                    <Text ta="end"><button type="submit">Add Course</button></Text>
                </form>
            </Flex>
        </div>
    );
};

export default AddCourses;
