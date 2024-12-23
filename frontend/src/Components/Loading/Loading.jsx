import React from 'react'
import animations from '../../Assets/animations'
export default function Loading() {
  return (
    <div className='position-fixed w-100 h-100 d-flex flex-column justify-content-center align-items-center'>
      {/* <img src={animations.loading} alt="" /> */}
      <img src={animations.loadingText} alt="" />
    </div>
  )
}
