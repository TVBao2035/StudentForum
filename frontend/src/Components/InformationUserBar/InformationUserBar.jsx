import { SiGmail } from "react-icons/si";
import { BsFillTelephoneFill } from "react-icons/bs";

export default function InformationUserBar({email, phone}) {
  return (
    <div className='Informaiton_Profile_Page '>
      <div>
        <div className='d-flex align-items-center gap-1'>
          <SiGmail />
          <div className='d-flex gap-1'>
            <p className='fw-medium'>Email:</p>
            <p>{email}</p>
          </div>
        </div>
        <div className='d-flex align-items-center gap-1'>
          <BsFillTelephoneFill />
          <div className='d-flex gap-1'>
            <p className='fw-medium'>Phone:</p>
            <p>{phone}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
