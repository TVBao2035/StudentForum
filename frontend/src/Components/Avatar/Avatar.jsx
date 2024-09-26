import './AvatarStyle.scss';
export default function Avatar(props) {
    const {link, ...style} = props;
  
  return (
    <div className='Avatar '>
        <img
            className={Object.keys(style)}
            src={link} 
            alt="" 
        />
        
    </div>

  )
}
