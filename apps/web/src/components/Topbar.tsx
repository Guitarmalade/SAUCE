'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Topbar() {
  const pathname = usePathname()

  return (
    <header className="topbar">
      <div className="shell topbar-inner">
        <Link className="brand" href="/student/dashboard">
          <span className="brand-mark">GM</span>
          <span className="brand-copy">
            <span className="brand-name">Guitarmalade</span>
            <span className="brand-subtitle">SAUCE practice system</span>
          </span>
        </Link>

        <nav className="main-nav">
          <Link 
            href="/student/dashboard" 
            className={pathname === '/student/dashboard' ? 'active' : ''}
          >
            Dashboard
          </Link>
          <Link 
            href="/student/practice/level-1-a-major" 
            className={pathname.includes('/student/practice') ? 'active' : ''}
          >
            My Shed
          </Link>
          <Link 
            href="/student/tricks" 
            className={pathname === '/student/tricks' ? 'active' : ''}
          >
            Bag O' Tricks
          </Link>
          <Link 
            href="/student/roadmap" 
            className={pathname === '/student/roadmap' ? 'active' : ''}
          >
            Curriculum
          </Link>
        </nav>

        <div className="toolbar">
          <div className="avatar"></div>
        </div>
      </div>
    </header>
  )
}
