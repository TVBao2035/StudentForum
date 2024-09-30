import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.scss';
import { Details, Group, Home, Login, MakeFriend, Notifycation, Register, Setting } from './Pages';
import { Layout, Post } from './Components';



function App() {
  return (
    <Routes>
      <Route path='' element={<Layout/>}>
        <Route path='' element={<Home/>}/>
        <Route path='makeFriend' element={<MakeFriend />} />
        <Route path='group' element={<Group />} />
        <Route path='notifycation' element={<Notifycation />} />
        <Route path='setting' element={<Setting />} />
        <Route path='details' element={<Details/>} />
        <Route path='post' element={<Post/>} />
      </Route>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
    </Routes>

  );
}

export default App;
