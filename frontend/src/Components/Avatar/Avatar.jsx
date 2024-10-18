import defaultAvatar from '../../Assets/images/defaultAvatar';
import './AvatarStyle.scss';

export default function Avatar({link, ...style}) {

  return (
    <div className='Avatar'>
      <img
        className={Object.keys(style)}
        src={link || defaultAvatar}
        alt="User Avatar"
      />
    </div>
  );
}