import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.scss';
import { Profile, Group, Home, Login, MakeFriend, Notification, Register, Setting, Message } from './Pages';
import { Layout, Post } from './Components';



function App() {
  return (
    <Routes>
      <Route path='' element={<Layout/>}>
        <Route path='' element={<Home/>}/>
        <Route path='makeFriend' element={<MakeFriend />} />
        <Route path='group' element={<Group />} />
        <Route path='notification' element={<Notification />} />
        <Route path='setting' element={<Setting />} />
        <Route path='profile' element={<Profile/>} />
        <Route path='message' element={<Message/>} />
      </Route>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
    </Routes>

  );
}

export default App;
