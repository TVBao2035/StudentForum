import timeFormat from '../../Helpers/timeFormat';
import './HistoryItemStyle.scss'; 
import { PiSealWarning } from "react-icons/pi";
import { FaRegCircleCheck } from "react-icons/fa6";
const HistoryItem = ({title, content, time, isRead, onClick}) => {
  return (
    <div className='HistoryItem' onClick={onClick}>
      <div className={`container ${!isRead && 'isRead'} d-flex align-items-center gap-3`}>
          <div className=''>
            {
              isRead ? 
              <FaRegCircleCheck className='fs-1 icon-check' />
              :
              <PiSealWarning className='fs-1 icon-warning' />
            }
          </div>
          <div className='w-100'>
            <div className='d-flex justify-content-between'>
              <div className='d-flex gap-3'>
                <h5 className='m-0 text-title'>{title}</h5>
                {
                  !isRead ?
                  <p className='fw-bold text-new'>Mới</p>
                  :
                  <p className='fst-italic fs-6'>Đã đọc</p>
                }
              </div>
              <p className='text-time'>{timeFormat(time)}</p>
            </div>
            <div>
                <p>{content}</p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default HistoryItem