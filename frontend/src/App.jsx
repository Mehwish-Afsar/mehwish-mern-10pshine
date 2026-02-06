import React from "react";
import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import SignUp from "./pages/SignUp/SignUp.jsx";
import Login from "./pages/Login/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword/ResetPassword.jsx";
import Profile from "./pages/Profile/Profile.jsx";


const routes=(
  <Router>
  <Routes>
  <Route path="/dashboard" exact element={<Home />} />
  <Route path="/login" exact element={<Login />} />
  <Route path="/signup" exact element={<SignUp />} />
  
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password/:token" element={<ResetPassword />} />
  <Route path="/profile" element={<Profile />} />
  </Routes>
  </Router>
)

const App=()=>{
    return (
        <div>
          {routes}
        </div>
    )
}
export default App;