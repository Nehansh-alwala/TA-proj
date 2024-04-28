/* eslint-disable no-unused-vars */
import React from 'react'
import { useEffect, useState } from 'react'
import supabase from '../../config/supabaseClient'
import "./tadash.css"
import { Multiselect } from 'multiselect-react-dropdown'

import { Anchor, Button, Flex, Text } from '@mantine/core'


const Tadash = ({ token }) => {
  
  const [userId, setUserId] = useState('');
  const [semester, setSemester] = useState('');
  const [zNumber, setZNumber] = useState('');
  const [enrollmentStatus, setEnrollmentStatus] = useState('');
  const [expectedGraduation, setExpectedGraduation] = useState('');
  const [citizenshipStatus, setCitizenshipStatus] = useState('');
  const [employedByFAU, setEmployedByFAU] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState(0);
  const [graduateProgram, setGraduateProgram] = useState('');
  const [creditsCompleted, setCreditsCompleted] = useState(0);
  const [programStart, setProgramStart] = useState('');
  const [currentGPA, setCurrentGPA] = useState('');
  const [undergradMajor, setUndergradMajor] = useState('');
  const [coursesAsTA, setCoursesAsTA] = useState('');
  const [coursesForTA, setCoursesForTA] = useState('');
  const [isThesisStudent, setIsThesisStudent] = useState('');
  const [fetchError, setFetchError] = useState(null)
  const [courses, setCourses] = useState([])

  const [file, setFile] = useState(null);


  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('title')

      if (error) {
        setFetchError("could not fetch")
        //setCourses(null)
        console.log(error)
      }
      if (data) {
        setCourses(data)
        setFetchError(null)
      }
    }

    fetchCourses()
  },
    [])
  useEffect(() => {
    if (token) {
      const userId = token.user.id; // Access the user ID from the token
      setUserId(userId);
    }
  }, [token]);


  const handleSubmitForm = async (e) => {
    e.preventDefault();

    try {
      // Your form submission code
    } catch (error) {
      console.error('Error submitting form:', error.message);
    }
  };
  
  const handleFileUpload = async () => {
    try {
      if (file) {
        const uid = token.user.id;
        const { udata, uerror } = await supabase.storage
          .from('documents')
          .upload(uid + `/${file.name}`, file);
  
        if (uerror) {
          console.error('Error uploading file:', uerror.message);
        } else {
          console.log('File uploaded successfully:', udata.Key);
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error.message);
    }
  };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!semester || !zNumber || !enrollmentStatus || !expectedGraduation || !citizenshipStatus || !employedByFAU || !graduateProgram ||!creditsCompleted || !programStart  || !currentGPA|| !undergradMajor|| !coursesAsTA || !coursesForTA || !isThesisStudent ||!file) {
        alert('Please fill out all fields.');
        return;
      }
    
    try {
      const user = token.user.user_metadata.fullName;
      await handleSubmitForm(e);
      await handleFileUpload();

      // Upload resume file to Supabase storage
      const currentDate = new Date().toLocaleDateString('en-US', {

        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).split('/').join(' ');

      const { data, error } = await supabase.from('taform').insert([
        {
          semester,
          zNumber,
          enrollmentStatus,
          expectedGraduation,
          citizenshipStatus,
          employedByFAU,
          hoursPerWeek,
          graduateProgram,
          creditsCompleted,
          programStart,
          currentGPA,
          undergradMajor,
          coursesAsTA,
          coursesForTA,
          isThesisStudent,

          username: user,
          userId: userId,
          submissionDate: currentDate,
          fileName:file.name
        }
      ]);

      if (error) {
        console.error('Error inserting data:', error);
      } else {
        console.log('Data inserted successfully:', data);
        
        for (const course of coursesForTA) {
          const { data: courseData, error: courseError } = await supabase
            .from('courses')
            .select('courseNumber, instructor')
            .eq('title', course.label)
            .single();

          if (courseError) {
            console.error('Error fetching course data:', courseError);
          } else {
            await supabase.from('coursesapp').insert([
              {
                courseName: course.label,
                courseNum: courseData.courseNumber,
                inst: courseData.instructor,
                status: 'pending',
                username: user,
                userId: userId,
                zNumber: zNumber,
                submissionDate: currentDate,
                semester:semester,
                enrollmentStatus:enrollmentStatus,
                expectedGraduation:expectedGraduation,
                citizenshipStatus:citizenshipStatus,
                employedByFAU:employedByFAU,
                hoursPerWeek:hoursPerWeek,
                graduateProgram:graduateProgram,
                creditsCompleted:creditsCompleted,
                programStart:programStart,
                currentGPA:currentGPA,
                undergradMajor:undergradMajor,
                coursesAsTA:coursesAsTA,
                isThesisStudent:isThesisStudent,
                fileName: file.name
                


              },
            ]);
          }
        }

        setSemester('');
        setZNumber('');
        setEnrollmentStatus('');
        setExpectedGraduation('');
        setCitizenshipStatus('');
        setEmployedByFAU('');
        setHoursPerWeek(0);
        setGraduateProgram('');
        setCreditsCompleted(0);
        setProgramStart('');
        setCurrentGPA('');
        setUndergradMajor('');
        setCoursesAsTA('');
        setCoursesForTA('');
        setIsThesisStudent('');
        
      }
    } catch (error) {
      console.error('Error inserting data:', error.message);
    }
  };



  return (
    <div>
      {/* <Navbar/> */}
      <div className="hero">
        <div className='container'>
          <div className='ctnt'>
            <div className='hdng'>
              GRADUATE TEACHING ASSISTANTSHIPS
            </div>
            <div className='mt-4r' style={{ display: "flex", justifyContent: "space-between" }}>
              <div className='btm-hdng'>
                At Florida Atlantic Your Future Awaits
              </div>
              <div>
                <Anchor className='btn cursor' href='#req' p="xs" c="white" ml="md" style={{ background: "red" }}>Learn more</Anchor>
                <Anchor className='btn cursor' href='#form' p="xs" bg="#0073e6" c="white" ml="md">Get started</Anchor>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      <div>
        <div id='req' style={{ paddingLeft: "10px", marginBottom: "50px" }}>
          <h1>TA Application Requirements for Graduate Students:</h1>
          <ol style={{ fontSize: "18px", lineHeight: "1.5" }}>
            <li>Graduate teaching assistantships are provided for eligible graduate students with a 3.0 GPA, with a priority given to new doctoral students, new BS to PhD Direct-Path program students, and incoming joint BS/MS degree program students.&nbsp;</li>
            <li>Support may be provided up to 20 hours/week with tuition covered proportionally.&nbsp;</li>
            <li>The TA Committee makes the final selection after all the required documentation is reviewed.</li>
          </ol>
        </div>
        <Flex mb="xl" style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)' }}>
          <div className='form-left'></div>
          <form id='form' className="application-form" onSubmit={handleSubmit}>
            <Text ta="center" fz="h1" pb="xl" style={{ textDecoration: "underline" }} c="#036">Application Form</Text>
            <label>
              Semester:<span class="required">*</span>
              <select value={semester} onChange={(e) => setSemester(e.target.value)}>
                <option value="">Select Semester</option>
                <option value="Summer 2024">Summer 2024</option>
                <option value="Fall 2024">Fall 2024</option>
                <option value="Summer 2024 & Fall 2024">Summer 2024 & Fall 2024</option>
              </select>
            </label>
            <label>
              Z#:<span class="required">*</span>
              <input type="text" value={zNumber} onChange={(e) => setZNumber(e.target.value)} />
            </label>
            <label>
              Enrollment Status:<span class="required">*</span>
              <select value={enrollmentStatus} onChange={(e) => setEnrollmentStatus(e.target.value)}>
                <option value="">Select Enrollment Status</option>
                <option value="New student, starting Summer 2024">New student, starting Summer 2024</option>
                <option value="New student, starting Fall 2024">New student, starting Fall 2024</option>
                <option value="Continuing student">Continuing student</option>
              </select>
            </label>
            <label>
              Expected Graduation:<span class="required">*</span>
              <input type="text" value={expectedGraduation} onChange={(e) => setExpectedGraduation(e.target.value)} />
            </label>
            <label>
              Citizenship Status:<span class="required">*</span>
              <select value={citizenshipStatus} onChange={(e) => setCitizenshipStatus(e.target.value)}>
                <option value="">Select Citizenship Status</option>
                <option value="U.S Citizen/Resident Alien">U.S Citizen/Resident Alien</option>
                <option value="International student">International student</option>
              </select>
            </label>
            <label>
              Employed by FAU:<span class="required">*</span>
              <select value={employedByFAU} onChange={(e) => setEmployedByFAU(e.target.value)}>
                <option value="">Select Employed by FAU</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            <label>
              Hours per Week (if employed):<span class="required">*</span>
              <input type="number" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} />
            </label>

            <label>
              Graduate Program and Major:<span class="required">*</span>
              <input type="text" value={graduateProgram} onChange={(e) => setGraduateProgram(e.target.value)} />
            </label>
            <label>
              Credits Completed at FAU:<span class="required">*</span>
              <input type="number" value={creditsCompleted} onChange={(e) => setCreditsCompleted(e.target.value)} />
            </label>
            <label>
              Program Start Date:<span class="required">*</span>
              <input type="text" value={programStart} onChange={(e) => setProgramStart(e.target.value)} />
            </label>

            <label>
              Current FAU GPA:<span class="required">*</span>
              <input type="text" value={currentGPA} onChange={(e) => setCurrentGPA(e.target.value)} />
            </label>
            <label>
              Undergraduate Major:<span class="required">*</span>
              <input type="text" value={undergradMajor} onChange={(e) => setUndergradMajor(e.target.value)} />
            </label>
            <label>
              Courses served as TA:<span class="required">*</span>
              <input type="text" value={coursesAsTA} onChange={(e) => setCoursesAsTA(e.target.value)} />
            </label>


            <label>
              Courses available to serve as TA (Summer & Fall 2024):<span class="required">*</span>
              <Multiselect
                options={courses.map(course => ({ label: course.title }))}
                selectedValues={coursesForTA}
                onSelect={(selectedList, selectedItem) => setCoursesForTA(selectedList)}
                onRemove={(selectedList, removedItem) => setCoursesForTA(selectedList)}
                displayValue="label"
              />
            </label>

            <label>
              Ph.D or M.S. Thesis Student:<span class="required">*</span>
              <select value={isThesisStudent} onChange={(e) => setIsThesisStudent(e.target.value)}>
                <option value="">Select Thesis Student Status</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>


            <label>
            Upload File:
            <input type="file" onChange={(e) => setFile(e.target.files[0])}/>
          </label>


            <Text ta="end"><Button type="submit">Submit</Button></Text>
          </form>
        </Flex>
      </div>
    </div>

  )
}


export default Tadash
