'use client'
import { useState } from 'react'
import DashboardApp from '../dashboard-menu-v1'
import PharmxAIApp from '../invoice-menu-v1'
import SupplierManagementApp from '../supplier-menu-v1'
import ExpiryCheckApp from '../expiry-menu-v1'

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('dashboard') // 'dashboard' | 'invoice' | 'supplier' | 'expiry'

  return (
    <>
      {activeMenu === 'dashboard' && (
        <DashboardApp onMenuChange={setActiveMenu} />
      )}
      {activeMenu === 'invoice' && (
        <PharmxAIApp onMenuChange={setActiveMenu} />
      )}
      {activeMenu === 'supplier' && (
        <SupplierManagementApp onMenuChange={setActiveMenu} />
      )}
      {activeMenu === 'expiry' && (
        <ExpiryCheckApp onMenuChange={setActiveMenu} />
      )}
    </>
  )
}
