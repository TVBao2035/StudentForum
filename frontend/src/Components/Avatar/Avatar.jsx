import defaultAvatar from '../../Assets/images/defaultAvatar';
import './AvatarStyle.scss';

export default function Avatar({link, className : classname, ...style}) {

  return (
    <div className='Avatar'>
      <img
        className={`${Object.keys(style)} ${classname}`}
        src={link || defaultAvatar}
        alt="User Avatar"
      />
    </div>
  );
}