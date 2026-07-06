import React from 'react'
import desktopBanner from '../assets/desktop_banner.png'
import mobileBanner from '../assets/mobile_banner.png'

const BottomBanner = () => {
  return (
    <div className="w-full mt-24">

      {/* Desktop Banner */}
      <img
        src={desktopBanner}
        alt="Desktop Banner"
        className="hidden md:block w-full h-auto object-cover"
      />

      {/* Mobile Banner */}
      <img
        src={mobileBanner}
        alt="Mobile Banner"
        className="block md:hidden w-full h-auto object-cover"
      />

    </div>
  )
}

export default BottomBanner