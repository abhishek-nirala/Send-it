'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import Image from 'next/image'

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => setIsOpen(!isOpen)

  const { data: session } = useSession()
  const user: User = session?.user as User
  const pathname = usePathname()

  const routes = [
    { href: '/profile', label: 'Profile' },
    { href: '/messages', label: 'Sends' },
    { href: '/feed', label: 'Feed' },
  ]

  const getLinkStyle = (href: string) =>
    `text-sm font-medium transition duration-150 ease-in-out ${pathname === href
      ? 'text-fuchsia-400 underline underline-offset-4'
      : 'text-white hover:text-fuchsia-400'
    }`

  return (
    <nav
      className="w-full z-50 border-b border-gray-700"
      style={{
        // backgroundColor: 'rgba(17, 34, 51, 0.2)', // similar to #1223
        backgroundColor: '#123',
        backdropFilter: 'blur(8px)',
      }}
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Image className='mr-2 rounded-[50%] border-orange-700 border-[2px]' src='/logo.png' height={40} width={40} alt='send-it logo' />
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Send-It
            </Link>
          </div>
          {/* Center Nav */}
          <div className="hidden md:flex space-x-8">
            {routes.map(({ href, label }) => (
              <Link key={href} href={href} className={getLinkStyle(href)}>
                {label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-sm text-white bg-white/10 px-3 py-1 rounded-md">{user?.username}</span>
                <Button
                  className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-md"
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button className="bg-white/10 text-white hover:bg-white/20">Login</Button>
                </Link>

                <Link href="/sign-up">
                  <Button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white">Sign Up</Button>
                </Link>

              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <motion.div
        className="md:hidden px-4 pb-4 pt-2 space-y-3"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {routes.map(({ href, label }) => (
          <Link key={href} href={href} className={getLinkStyle(href)}>
            {label}
          </Link>
        ))}
        {session ? (
          <>
            <span className="text-white">{user?.username}</span>
            <Button
              className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/sign-in">
              <Button className="w-full bg-white/10 text-white hover:bg-white/20">Login</Button>
            </Link>
            <Link href="/signUp">
              <Button className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white">Sign Up</Button>
            </Link>

          </>
        )}
      </motion.div>
    </nav>
  )
}

export default NavBar
