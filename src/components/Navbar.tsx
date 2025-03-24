'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, MessageSquareShare, X } from 'lucide-react'
import { useSession, signOut, } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'



const NavBar: React.FC = () => {

  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)


  const { data: session } = useSession();
  const user: User = session?.user as User

  const cssClasses = "px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:bg-indigo-50 focus:text-indigo-600 transition duration-150 ease-in-out flex items-center"

  return (
    <nav className="bg-white text-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex gap-1 items-center">
            <MessageSquareShare />
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-indigo-600">Feedback-App</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {
                session ?
                  <>
                    <Link href='#' className={` bg-inherit border ${cssClasses}`}>{user?.username}</Link>
                    <Button className={` bg-inherit border ${cssClasses}`} onClick={() => signOut()}>LogOut</Button>
                  </>
                  :
                  <>
                    <Link href='/sign-in'>
                    <Button >Log-In</Button>
                    </Link>
                    <Link href='/sign-up'><Button>Sign-Up</Button></Link>
                  </>
              }
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:bg-indigo-50 focus:text-indigo-600 transition duration-150 ease-in-out"
            >
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        className="md:hidden"
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? 'auto' : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">

          {
            session ?
              <>
                <Link href='#' className={` bg-inherit border ${cssClasses}`}>{user?.username}</Link>
                <Button className={` bg-inherit border ${cssClasses}`} onClick={() => signOut()}>LogOut</Button>
              </>
              :
              <>
                <Link href='/sign-in'>LogIn</Link>
                <Link href='/sign-up'>SignUp</Link>
              </>
          }
        </div>
      </motion.div>
    </nav>
  )
}

export default NavBar

