import defaultAvatar from '../../Assets/images/defaultAvatar';
import './AvatarStyle.scss';
export default function Avatar({link, ...style}) {
   // const {link, ...style} = props;

  return (
    <div className='Avatar '>
        <img
            className={Object.keys(style)}
            src={link ? link : defaultAvatar} 
            alt="" 
        />
        
    </div>

  )
}
