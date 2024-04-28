import { BrowserRouter, Routes, Route } from "react-router-dom"
//import supabase from "./config/supabaseClient";
import { useState, useEffect } from "react"
import "./pages/home.css"
import Login from "./pages/authentication/login"
import SignUp from "./pages/authentication/signup"
import ForgotPassword from "./pages/authentication/forgot_password"
import Profile from "./pages/profile"
import Tadash from "./pages/TA_applicant/tadashboard"
import TAapplication from "./pages/TA_applicant/taapplication"
import AdminDashboard from "./pages/Administrator/Administrator"
import AddCourses from "./pages/Administrator/Admincourses"
import CourseOptions from "./pages/Administrator/Adminrecom"
import CourseRecommendations from "./pages/Committee/Committee"
import Header from "./pages/header"
import Home from "./pages/authentication/main"
import InstRecommendations from "./pages/instructor/instructor"

function App() {
  const [token, setToken] = useState(false)

  if (token) {
    sessionStorage.setItem('token', JSON.stringify(token))
  }

  useEffect(() => {
    let data;
    if (sessionStorage.getItem('token')) {
      data = JSON.parse(sessionStorage.getItem('token'))
    } else {
      data = ''
    }
    setToken(data)

  }, [])
  return (
    <div>
      <div className="mt-80">
        <BrowserRouter>
          <Header token={token} setToken={setToken} />
          <Routes>
            {/* <Route path={'/tadash'} element={ <Tadash />} /> */}
            <Route path={'/'} element={<Home setToken={setToken} />} />
            <Route path={'/login'} element={<Login setToken={setToken} />} />
            <Route exact path="/signup" element={<SignUp setToken={setToken} />} />
            <Route exact path="/forgot-password" element={<ForgotPassword setToken={setToken} />} />
            {token ? <Route path={'/tadash'} element={<Tadash token={token} />} /> : ""}
            {token ? <Route path="/taapplication" element={<TAapplication token={token} />} /> : ""}
            {token ? <Route path="/profile" element={<Profile token={token} />} /> : ""}
            {token ? <Route path="/admindash" element={<AdminDashboard token={token} />} /> : ""}
            {token ? <Route path="/addCourses" element={<AddCourses token={token} />} /> : ""}
            {token ? <Route path={'/com'} element={<CourseRecommendations token={token} />} /> : ""}
            {token ? <Route path={'/recom'} element={<CourseOptions token={token} />} /> : ""}
            {token ? <Route path={'/instructor-dashboard'} element={<InstRecommendations token={token} />} /> : ""}
          </Routes>
        </BrowserRouter>
      </div>
    </div>

  )
}

export default App;