import React from 'react';
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import StudentRoutes from './Student/routes/AppRoutes';

//import LoginSignUp from './Components/LoginSignUp/LoginSignUp';

function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/*" element={<StudentRoutes />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
