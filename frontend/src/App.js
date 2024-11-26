import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.scss';
import { GroupDetail, Profile, Group, Home, Login, MakeFriend, Notification, Register, Setting, Message, Account, GroupJoin, GroupInvitation } from './Pages';

import { useDispatch, useSelector } from 'react-redux';
import { GroupLayout, MainLayout } from './Components/Layout';
import { refresh } from './API/UserAPI';
import timeOut from './Helpers/timeOut';
import { setLoading } from './Redux/loadingSlice';
import { Loading } from './Components';
import { setDataMain } from './Redux/userSlice';



function App() {
  const whitelist = ['/login', '/register'];
  const loading = useSelector(state => state.loading);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const location = useLocation();

  const fetchApi = async () => {
    let res = await refresh();
    if(res.status === 200){
      dispatch(setDataMain({
        id: res.data.id,
        name: res.data.name,
        avatar: res.data.avatar,
        isAdmin: res.data.isAdmin,
        token: res.data.accessToken,
      }));
      await timeOut(2000);
      dispatch(setLoading(false));
      return;
    }
  }

  useEffect(()=>{
    if (!whitelist.some(item => item === location.pathname 
      && !localStorage.getItem(process.env.REACT_APP_LOGIN_LOCAL_STORAGE)))
    {
      fetchApi();
      dispatch(setLoading(true));

    }
  }, []);
  return (
    <Routes>
      <Route path='' element={loading.isLoading ? <Loading/> :<MainLayout/>}>
        <Route path='' element={<Home/>}/>
        <Route path='/makeFriend' element={<MakeFriend />} />
        <Route path='/notification' element={<Notification />} />
        <Route path='/setting' element={<Setting />} />
        <Route path={`/:id`} element={<Profile/>}/>
        <Route path='/account' element={<Account/>}/>
        <Route path='/message' element={<Message/>} />
      </Route>
      <Route path='group' element={loading.isLoading ? <Loading/>: <GroupLayout />}>
        <Route path='discover' element={<Group />}/>
        <Route path='join' element={<GroupJoin/>} />
        <Route path={`:id`} element={<GroupDetail />} />
        
      </Route>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
    </Routes>

  );
}

export default App;
