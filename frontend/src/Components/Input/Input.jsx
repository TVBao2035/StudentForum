import React, { useEffect, useState } from 'react'
import firstLetterUpperCase from '../../Helpers/firstLetterUpperCase';
import { BiShow, BiHide } from "react-icons/bi";
import './InputStyle.scss';
export default function Input(
{
    label="name", 
    type="text", 
    message,
    setMessage,
    handleChange,
    name,
    value
}) {
    const [show, setShow] = useState(false);
    
    const handleClick = (e) => {
        
        e.target.select();

        setMessage(pre => {
            return {
                ...pre,
                [e.target.name]: ""
            }
        })
    }

    const handleBlur = (e) => {
        if (e.target.value.trim().length === 0) {
            setMessage(pre => {
                return {
                    ...pre,
                    [e.target.name]: `Trường ${firstLetterUpperCase(e.target.name)} không được để trống!!!`
                }
            })
           return;
        }
       
        if (type === "email" 
            && !(/^([A-Za-z0-9\.])+\@([A-Za-z0-9])+\.([A-Za-z]{2,4})$/).test(e.target.value)){
            setMessage(pre => {
                return {
                    ...pre,
                    [e.target.name]: "Email không hợp lệ!!!"
                }
            })
            return;
        }

        if (type === "password" && e.target.value.length < 3){
            setMessage(pre => {
                return {
                    ...pre,
                    [e.target.name]: "Password có ít nhất 3 ký tự!!!"
                }
            })
            return;
        }
    }


  return (
      <div className='Input mb-2 user-select-none w-100'>
          <div className='d-flex justify-content-center  gap-1 flex-column w-100'>
            <label 
              htmlFor=""
            >{firstLetterUpperCase(label)}: </label>
            <div className='d-flex justify-content-center align-items-center position-relative'>
                <input
                    name={name}
               
                    type={(type === "password" && show ) ? "text" : type}
                    value={value ? value : "" }
                    className=' form-control'
                    onChange={(e) => handleChange(e)}
                    onBlur={(e) => handleBlur(e)}
                    onClick={e => handleClick(e)}
                />
                <div className = 'position-absolute end-0 me-2' onClick={()=>setShow(!show)}>
                    {
                        type === "password" && (
                            show ? <BiShow /> : <BiHide />
                        )
                    }
                </div >
                
            </div>
        </div>
        <div className=' position-relative'>
              <div className='col  w-100 d-flex justify-content-start'>
                  <span className='message_error text-danger ps-2'>
                      {
                          message
                      }
                  </span>
              </div>
        </div>
      </div>
  )
}
