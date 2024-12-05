import { useEffect, useState } from 'react'
import { HistoryItem } from '../../Components'
import { getAllHistoryByUserId, updateStateHistory } from '../../API/HistoryAPI'
import { useSelector } from 'react-redux'

export default function Notification() {
  const user = useSelector(state => state.user);
  const [listHistories, setListHistories] = useState([]);

  const getHistory = async (userId) => {
    let res = await getAllHistoryByUserId(userId);
    if(res.status !== 200){
      alert(res.message);
      return;
    }
    setListHistories(res.data);
  }
  const handleClick = async (id) => {

    let res = await updateStateHistory(id);
    if(res.status !==200) {
      alert(res.message);
      return;
    }
    getHistory(user.id);
  }
  useEffect(() => {
    getHistory(user.id);
  }, [user.id])
  return (
    <div className='Notification px-5 mx-5'>
      <div className='container px-5 mx-5'>
        {
          listHistories.map(history => 
            <HistoryItem 
              title={history.title} 
              key={history.id} 
              onClick={() => !history.isRead ? handleClick(history.id) : null}
              content={history.content} 
              time={history.createdAt}
              isRead={history.isRead} />
          )
        }
      </div>
    </div>
  )
}
