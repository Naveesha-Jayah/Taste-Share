import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Register from "./Components/UserManagement/Registration";
import  Login from "./Components/UserManagement/Login";
import Profile from "./Components/UserManagement/UserProfile";
import RecipeAdd from "./Components/RecipeManagement/RecipeAdd";

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/addrecipe" element={<RecipeAdd />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;