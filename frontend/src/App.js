import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.scss';
import { Profile, Group, Home, Login, MakeFriend, Notification, Register, Setting, Message } from './Pages';
import { useDispatch, useSelector } from 'react-redux';
import { MainLayout } from './Components/Layout';
import { refresh } from './API/UserAPI';
import timeOut from './Helpers/timeOut';
import { setLoading } from './Redux/loadingSlice';
import { Loading } from './Components';
import { setDataMain } from './Redux/userSlice';
import Swal from 'sweetalert2';



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
      dispatch(setLoading(true));
      fetchApi();
    }
  }, []);
  return (
    <Routes>
      <Route path='' element={loading.isLoading ? <Loading/> :<MainLayout/>}>
        <Route path='' element={<Home/>}/>
        <Route path='makeFriend' element={<MakeFriend />} />
        <Route path='group' element={<Group />} />
        <Route path='notification' element={<Notification />} />
        <Route path='setting' element={<Setting />} />
        <Route path={`/:id`} element={<Profile/>}/>
        <Route path='message' element={<Message/>} />
      </Route>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
    </Routes>

  );
}

export default App;
