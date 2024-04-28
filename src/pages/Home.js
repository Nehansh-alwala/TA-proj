import supabase from "../config/supabaseClient"
import { BrowserRouter,Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from "react"
import FileUpload from "./form";

import "./home.css"

const Homee =()=>
{
    const [fetchError, setFetchError]=useState(null)
    const [courses, setCourses]=useState(null)

    useEffect( ()=>{
        const fetchCourses=async()=>
        {
            const{data,error}=await supabase
                .from('courses')
                .select()

            if (error){
                setFetchError("could not fetch")
                setCourses(null)
                console.log(error)
            }
            if(data)
            {
                setCourses(data)
                setFetchError(null)
            }
        }

        fetchCourses()
    },
    [])

    return (
        
        <div>
        
            {fetchError && (<p>{fetchError}</p>)}
            {courses && (
                <div className="course-container">
                    {courses.map(course => (
                        <div key={course.id} className="course-card">
                            <h2>{course.title}</h2>
                            <div className="description">{course.details}</div>
                            <div className="card-footer">
                            <Link to="/form" key={FileUpload}><button>Enroll</button></Link>
                            </div>
                            {/* Add more course details as needed */}
                        </div>
                    ))}
                </div>
            )}

        </div>
        
      
    
    )
}

export default Homee