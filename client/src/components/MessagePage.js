import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avatar from './Avatar'
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { MdLock, MdLockOpen } from "react-icons/md";
import uploadFile from '../helpers/uploadFile';
import { IoClose } from "react-icons/io5";
import Loading from './Loading';
import backgroundImage from '../assets/wallapaper.jpeg'
import { IoMdSend } from "react-icons/io";
import moment from 'moment'

const MessagePage = () => {
  const params = useParams()
  const socketConnection = useSelector(state => state?.user?.socketConnection)
  const user = useSelector(state => state?.user)
  const [dataUser,setDataUser] = useState({
    name : "",
    email : "",
    profile_pic : "",
    online : false,
    _id : ""
  })
  const [openImageVideoUpload,setOpenImageVideoUpload] = useState(false)
  const [message,setMessage] = useState({
    text : "",
    imageUrl : "",
    videoUrl : "",
    encrypt: false,
    secretKey: ""
  })
  const [loading,setLoading] = useState(false)
  const [allMessage,setAllMessage] = useState([])
  const currentMessage = useRef(null)
  const [showEncryptInput, setShowEncryptInput] = useState(false)

  useEffect(()=>{
      if(currentMessage.current){
          currentMessage.current.scrollIntoView({behavior : 'smooth', block : 'end'})
      }
  },[allMessage])

  const handleUploadImageVideoOpen = ()=>{
    setOpenImageVideoUpload(preve => !preve)
  }

  const handleUploadImage = async(e)=>{
    const file = e.target.files[0]

    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)

    setMessage(preve => ({
      ...preve,
      imageUrl : uploadPhoto.url
    }))
  }

  const handleClearUploadImage = ()=>{
    setMessage(preve => ({
      ...preve,
      imageUrl : ""
    }))
  }

  const handleUploadVideo = async(e)=>{
    const file = e.target.files[0]

    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)

    setMessage(preve => ({
      ...preve,
      videoUrl : uploadPhoto.url
    }))
  }

  const handleClearUploadVideo = ()=>{
    setMessage(preve => ({
      ...preve,
      videoUrl : ""
    }))
  }

  const handleDecrypt = (messageId, encryptedText, secretKey) => {
    socketConnection.emit('decrypt message', {
      messageId,
      encryptedText,
      secretKey
    });
  }

  useEffect(()=>{
      if(socketConnection){
        socketConnection.emit('message-page',params.userId)
        socketConnection.emit('seen',params.userId)

        socketConnection.on('message-user',(data)=>{
          setDataUser(data)
        }) 
        
        socketConnection.on('message',(data)=>{
          setAllMessage(data)
        })

        socketConnection.on('decrypted message', ({ messageId, decryptedText }) => {
          setAllMessage(prev => prev.map(msg => 
            msg._id === messageId ? {...msg, decryptedText} : msg
          ))
        })
      }
  },[socketConnection,params?.userId,user])

  const handleOnChange = (e)=>{
    const { name, value} = e.target
    setMessage(preve => ({
      ...preve,
      [name]: value
    }))
  }

  const handleSendMessage = (e)=>{
    e.preventDefault()

    if(message.text || message.imageUrl || message.videoUrl){
      if(socketConnection){
        socketConnection.emit('new message',{
          sender : user?._id,
          receiver : params.userId,
          text : message.text,
          imageUrl : message.imageUrl,
          videoUrl : message.videoUrl,
          msgByUserId : user?._id,
          encrypt: message.encrypt,
          secretKey: message.secretKey
        })
        setMessage({
          text : "",
          imageUrl : "",
          videoUrl : "",
          encrypt: false,
          secretKey: ""
        })
        setShowEncryptInput(false)
      }
    }
  }

  const toggleEncryption = () => {
    setShowEncryptInput(!showEncryptInput)
    setMessage(prev => ({
      ...prev,
      encrypt: !prev.encrypt,
      secretKey: ""
    }))
  }

  return (
    <div style={{ backgroundImage : `url(${backgroundImage})`}} className='bg-no-repeat bg-cover'>
          <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
              <div className='flex items-center gap-4'>
                  <Link to={"/"} className='lg:hidden'>
                      <FaAngleLeft size={25}/>
                  </Link>
                  <div>
                      <Avatar
                        width={50}
                        height={50}
                        imageUrl={dataUser?.profile_pic}
                        name={dataUser?.name}
                        userId={dataUser?._id}
                      />
                  </div>
                  <div>
                     <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
                     <p className='-my-2 text-sm'>
                      {
                        dataUser.online ? <span className='text-primary'>online</span> : <span className='text-slate-400'>offline</span>
                      }
                     </p>
                  </div>
              </div>

              <div >
                    <button className='cursor-pointer hover:text-primary'>
                      <HiDotsVertical/>
                    </button>
              </div>
          </header>

          {/***show all message */}
          <section className='h-[calc(100vh-165px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50'>
                  
                
                  {/**all message show here */}
                  <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
                    {
                      allMessage.map((msg) => (
                        <div key={msg._id} className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg?.msgByUserId ? "ml-auto bg-teal-100" : "bg-white"}`}>
                          <div className='w-full relative'>
                            {
                              msg?.imageUrl && (
                                <img 
                                  src={msg?.imageUrl}
                                  className='w-full h-full object-scale-down'
                                  alt="message"
                                />
                              )
                            }
                            {
                              msg?.videoUrl && (
                                <video
                                  src={msg.videoUrl}
                                  className='w-full h-full object-scale-down'
                                  controls
                                />
                              )
                            }
                          </div>
                          
                          {msg.isEncrypted && (
                            <div className="flex items-center gap-1 mb-1">
                              {msg.decryptedText ? <MdLockOpen /> : <MdLock />}
                              <span className="text-sm">{msg.decryptedText ? 'Decrypted' : 'Encrypted'}</span>
                            </div>
                          )}
                          
                          <p className='px-2'>
                            {msg.isEncrypted 
                              ? (msg.decryptedText || '🔒 Encrypted Message') 
                              : msg.text
                            }
                          </p>
                          
                          {msg.isEncrypted && !msg.decryptedText && (
                            <div className="mt-2">
                              <input
                                type="text"
                                placeholder="Enter decryption key"
                                className="px-2 py-1 text-sm rounded border"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleDecrypt(msg._id, msg.text, e.target.value)
                                    e.target.value = ''
                                  }
                                }}
                              />
                            </div>
                          )}
                          
                          <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format('hh:mm')}</p>
                        </div>
                      ))
                    }
                  </div>


                  {/**upload Image display */}
                  {
                    message.imageUrl && (
                      <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                        <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadImage}>
                            <IoClose size={30}/>
                        </div>
                        <div className='bg-white p-3'>
                            <img
                              src={message.imageUrl}
                              alt='uploadImage'
                              className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                            />
                        </div>
                      </div>
                    )
                  }

                  {/**upload video display */}
                  {
                    message.videoUrl && (
                      <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                        <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadVideo}>
                            <IoClose size={30}/>
                        </div>
                        <div className='bg-white p-3'>
                            <video 
                              src={message.videoUrl} 
                              className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                              controls
                              muted
                              autoPlay
                            />
                        </div>
                      </div>
                    )
                  }

                  {
                    loading && (
                      <div className='w-full h-full flex sticky bottom-0 justify-center items-center'>
                        <Loading/>
                      </div>
                    )
                  }
          </section>

          {/**send message */}
          <section className='h-[7rem] bg-white flex items-center px-4 border-t'>
              <div className='relative'>
                  <div className="flex gap-2">
                    <button onClick={handleUploadImageVideoOpen} className='flex justify-center items-center w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600'>
                      <FaPlus size={20}/>
                    </button>
                    <button 
                      onClick={toggleEncryption}
                      className={`flex justify-center items-center w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600 ${message.encrypt ? 'bg-[#00a884] text-white' : ''}`}
                      title={message.encrypt ? "Disable encryption" : "Enable encryption"}
                    >
                      {message.encrypt ? <MdLock size={20}/> : <MdLockOpen size={20}/>}
                    </button>
                  </div>

                  {/**video and image */}
                  {
                    openImageVideoUpload && (
                      <div className='bg-white shadow-lg rounded-lg absolute bottom-14 w-48 py-2'>
                      <form>
                          <label htmlFor='uploadImage' className='flex items-center py-3 px-4 gap-4 hover:bg-gray-50 cursor-pointer'>
                              <div className='text-[#00a884]'>
                                  <FaImage size={20}/>
                              </div>
                              <p className='text-gray-700'>Photos</p>
                          </label>
                          <label htmlFor='uploadVideo' className='flex items-center py-3 px-4 gap-4 hover:bg-gray-50 cursor-pointer'>
                              <div className='text-[#00a884]'>
                                  <FaVideo size={20}/>
                              </div>
                              <p className='text-gray-700'>Videos</p>
                          </label>

                          <input 
                            type='file'
                            id='uploadImage'
                            onChange={handleUploadImage}
                            className='hidden'
                          />

                          <input 
                            type='file'
                            id='uploadVideo'
                            onChange={handleUploadVideo}
                            className='hidden'
                          />
                      </form>
                      </div>
                    )
                  }
                  
              </div>

              {/**input box */}
              <form className='h-full w-full flex flex-col gap-2 justify-center' onSubmit={handleSendMessage}>
                  {showEncryptInput && (
                    <input
                      type='text'
                      name="secretKey"
                      placeholder='Enter encryption key...'
                      className='py-2 px-4 outline-none w-full border-b text-sm'
                      value={message.secretKey}
                      onChange={handleOnChange}
                    />
                  )}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
                    <input
                      type='text'
                      name="text"
                      placeholder='Message'
                      className='bg-transparent py-1 px-2 outline-none w-full text-gray-700'
                      value={message.text}
                      onChange={handleOnChange}
                    />
                    <button className='text-[#00a884] hover:text-[#017561] p-1'>
                        <IoMdSend size={24}/>
                    </button>
                  </div>
              </form>
              
          </section>



    </div>
  )
}

export default MessagePage
