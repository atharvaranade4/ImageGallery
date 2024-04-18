"use client"
import Image from 'next/image'
import { useSession, signIn, signOut } from "next-auth/react"
import React, { useEffect } from 'react'
import { HiSearch, HiBell, HiChat } from "react-icons/hi";
import { doc, setDoc, getFirestore } from "firebase/firestore"; 
import app from '../Shared/firebaseConfig'
import { useRouter } from 'next/navigation';


function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  console.log(session)
  
  const db = getFirestore(app)

  useEffect(() => {
    saveUserInfo()
  }, [session])

  const saveUserInfo = async () => {
    if (session?.user) {
      // Add a new document in collection "cities"
      await setDoc(doc(db, "user", session.user.email), {
        userName: session.user.name,
        email: session.user.email,
        userImage: session.user.image
      });
    }
  };
  
  return (
    <div className='flex gap-3 md:gap-2 items-center p-6'>
      <Image
        src='/logo.png'
        alt= 'logo' 
        width={50}
        height={50}
        className='hover:bg-gray-300 p-2 rounded-full cursor-pointer'
      />
      <button className='bg-black text-white p-2 px-4 rounded-full'>
        Home
      </button>
      <button 
        className='font-semibold p-2 px-4 rounded-full'
        onClick={() => router.push('/pin-builder')}
      >
        Create
      </button>
      <div className='bg-[#e9e9e9] p-3 gap-3 items-center rounded-full w-full hidden md:flex'>
        <HiSearch className='text-[25px] text-gray-500'/>
        <input 
          type="text"
          placeholder='search'
          className='bg-transparent outline-none'>
        </input>  
      </div>
        <HiSearch className='text-[25px] text-gray-500 md:hidden'/>
        <HiBell className='text-[40px] text-gray-500'/>
        <HiChat className='text-[40px] text-gray-500'/>
        { session?.user? 
        <Image 
          src={session.user.image} 
          onClick={() => router.push('/' + session.user.email)}
          alt="user-image" 
          width={50} 
          height={50} 
          className='hover:bg-gray-300 p-2 rounded-full cursor-pointer'
        /> : 
          <button 
          className='font-semibold p-2 px-4 rounded-full'
          onClick={() => signIn()}>
            Login
          </button>
        }
    </div>
  )
}

export default Header
