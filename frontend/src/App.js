import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";



import RecipeAdd from "./Components/RecipeManagement/RecipeAdd";
import CookingPlan from "./Components/CookingPlan/CookingPlan"
import CreatePlan from "./Components/CookingPlan/CreatePlan"
import UserLogin from "./Components/UserM/UserLogin"
import UserRegistration from "./Components/UserM/UserRegistration"




function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Home />} />
        
          <Route path="/addrecipe" element={<RecipeAdd />} />
          <Route path="/cooking-plan" element={<CookingPlan />} />
          <Route path="/create-plan" element={<CreatePlan />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-register" element={<UserRegistration />} />

        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;