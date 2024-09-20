import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.scss';

import Register from './Pages/Register';
import Login from './Pages/Login';
import Layout from './Components/Layout';
import Input from './Components/Input';
import Home from './Pages/Home';



function App() {
  return (
    <Routes>
      <Route path='' element={<Layout/>}>
        <Route path='' element={<Home/>}/>
      </Route>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
    </Routes>

  );
}

export default App;
