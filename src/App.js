import "./App.css";
import React, { createContext, useReducer } from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Login from "./components/Auth/Login/Login";
import Signup from "./components/Auth/Signup/Signup";
import ForgetPassword from "./components/Auth/ForgetPassword/ForgetPassword";
import ResetPassword from "./components/Auth/ResetPassword/ResetPassword";
import Logout from "./components/Auth/Logout";
import Error from "./components/Error/Error";

// import Home from "./components/Home/Home";
import Home2 from "./components/Home/Home2";
import Home2new from "./components/Home/Home2new";
import Preview from "./components/LeadManagementNew/Content/Files/Preview";

// import Test from "./common/Test";
// import New from "./common/New";

// reducer
import { reducer, initialState } from "./reducer/adminReducer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WhatsAppPreview from "./components/LeadManagementNew/Content/Files/WhatsAppPreview";

export const AdminContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <AdminContext.Provider value={{ state, dispatch }}>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/forgotpassword" element={<ForgetPassword />}></Route>
          <Route path="/resetpassword" element={<ResetPassword />}></Route>
          <Route path="/error" element={<Error />}></Route>
          <Route path="/logout" element={<Logout />}></Route>

          <Route path="/" element={<Home2new />}></Route>
          <Route path="/:route" element={<Home2new />}></Route>
          <Route path="/:route/:id" element={<Home2new />}></Route>
          <Route path="/preview" element={<Preview />}></Route>
          <Route path="/whatsapp-preview/:id1/:id2" element={<WhatsAppPreview />}></Route>
<<<<<<< HEAD
          <Route path="/whatsapp-preview/:id1" element={<WhatsAppPreview />}></Route>
=======
>>>>>>> 04fedc3911e1dd3321940bd01676f64ef01e52f2
        </Routes>
      </AdminContext.Provider>
    </>
  )
}

export default App;