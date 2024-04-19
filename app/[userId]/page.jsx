"use client"
import { getFirestore, query, collection, getDocs, where, doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import app from '../Shared/firebaseConfig'
import UserInfo from '../components/UserInfo'
import PinList from '../components/Pins/PinList'

function Profile( {params} ) {

  const db = getFirestore(app)
  const [userInfo, setUserInfo] = useState()
  const [listofPins, setListofPins] = useState([])

  useEffect(() => {
    console.log(params.userId.replace('%40' , '@'))
    if (params) {
      getuserInfo(params.userId.replace('%40' , '@'))
    }
  }, [params])

  const getuserInfo = async (email) => {
    const docRef = doc(db, "user", email );
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      setUserInfo(docSnap.data())
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  useEffect(()=> {
    if(userInfo){
      getUserPins()
    }
  },[userInfo])

  const getUserPins= async ()=>{
    const q = query(collection(db, 'image-gallery-post'), where("email", '==', userInfo.email))
    console.log(q)
    const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data())
      setListofPins(listofPins => [...listofPins, doc.data()]);
    });
  }

  return (
    <div>
      { userInfo?
      <UserInfo userInfo={userInfo}/>
      : null }
      <PinList listofPins={listofPins}/>
    </div>
  )
}

export default Profile
