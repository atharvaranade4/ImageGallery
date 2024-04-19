"use client"
import React, {useState} from 'react'
import { useSession} from "next-auth/react"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

import UploadImage from './UploadImage'
import UserTag from './UserTag'
import app from '../Shared/firebaseConfig'

import Image from 'next/image'

function Form() {
  const { data: session } = useSession()
  const [title, setTitle] = useState()
  const [desc, setDesc] = useState()
  const [link, setLink] = useState()
  const [file, setFile] = useState()
  const [loading, setLoading] = useState(false)

  const db = getFirestore()
  const postId = Date.now().toString()
  const router = useRouter()
  // Create a root reference
  const storage = getStorage(app)

  const uploadFile = () => {
    const storageRef = ref(storage, 'image-gallery/' + file.name)
    uploadBytes(storageRef, file)
    .then((snapshot) => {
      console.log('Uploaded a file!');
    })
    .then(resp => {
      getDownloadURL(storageRef).then(async (url) => {
        console.log("Download url", url);
        const postData = {
          title,
          desc,
          link,
          image:url,
          userName: session.user.name,
          email: session.user.email,
          userImage: session.user.image,
          id: postId

        }
        await setDoc(doc(db, 'image-gallery-post', postId), postData).then(resp => {
          console.log("saved")
          router.push('/' + session.user.email)
          setLoading(true)
        })
      });
    })
  }

  const onSave = () => {
    console.log(title, desc, link)
    console.log(file)
    uploadFile()
    setLoading(true)
  }

  return (
    <div className=' bg-white p-16 rounded-2xl '>
        <div className='flex justify-end mb-6'>
          <button onClick={()=>onSave()}
            className='bg-red-500 p-2 text-white font-semibold px-3 rounded-lg'>
            { loading? 
            <Image src="/loading-indicator.png" 
              width={30} 
              height={30} 
              alt='loading'
              className='animate-spin'
            /> :
            <span>Save</span>}  
          </button>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>           
          <UploadImage setFile={(file) => setFile(file)}/>          
        <div className="col-span-2">
        <div className='w-[100%]'>
        <input 
          type="text" 
          placeholder='Add your title'
          className='text-[35px] outline-none font-bold w-full 
          border-b-[2px] border-gray-400 placeholder-gray-400'
          onChange={(e)=>setTitle(e.target.value)}
        />
        <h2 className='text-[12px] mb-8 w-full  text-gray-400'>The first 40 Charaters are 
        what usually show up in feeds</h2>
        <UserTag />
        <textarea 
          type="text"
          onChange={(e)=>setDesc(e.target.value)}
          placeholder='Tell everyone what your pin is about' 
          className=' outline-none  w-full mt-8 pb-4 text-[14px]
          border-b-[2px] border-gray-400 placeholder-gray-400'
        />
        <input type="text"
          onChange={(e)=>setLink(e.target.value)}
          placeholder='Add a Destination Link' 
          className=' outline-none  w-full  pb-4 mt-[90px]
          border-b-[2px] border-gray-400 placeholder-gray-400'
        />
    </div>
       </div>
        
        </div>
    </div>
  )
}

export default Form