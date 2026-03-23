import React from 'react'
import Footer from '@/components/footer-1'
import { HeroHeader } from '@/components/header'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
      <HeroHeader />
      {children}
      <Footer />
    </div>
  )
}

export default layout