import defaultAvatar from '../../Assets/images/defaultAvatar';
import './AvatarStyle.scss';

export default function Avatar({link, ...style}) {
  console.log(Object.keys(style).join(" "));
  return (
    <div className='Avatar d-flex justify-content-center'>
      <img
        className={Object.keys(style).join(" ")}
        src={link || defaultAvatar }
        alt="User Avatar"
      />
    </div>
  );
}