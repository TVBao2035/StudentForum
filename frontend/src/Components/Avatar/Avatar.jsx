import defaultAvatar from '../../Assets/images/defaultAvatar';
import './AvatarStyle.scss';

export default function Avatar({link, ...style}) {


export default function Avatar({ link, size = 'small' }) {
  return (
    <div className='Avatar'>
      <img
        className={size}
        src={link || defaultAvatar}
        alt="User Avatar"
      />
    </div>
  );
}