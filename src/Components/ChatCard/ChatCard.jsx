import React from 'react'

const ChatCard = ({userImg,name}) => {
  return (
    <div className='flex items-center justify-center py-2 group cursor-pointer '>
        <div className=' flex items-center space-x-3 p-3'>
            <img className='rounded-full w-10 h-10 cursor-pointer'
            src={
                userImg}
            alt=''
            />
            </div>
            <div className='pl-5 w-[80%]'>
                <div className='flex justify-between items-center text-white '>
                    <p className='text-lg'>{name}</p>
                    <p className=' text-sm'>Unread Message</p>
                </div>
                <div className='flex justify-between items-center text-white'>
                    <p className='text-gray-500'>Message...</p>
                    <div className='flex space-x-2 items-center'>
                        <p className='text-xs py-1 px-2 text-white bg-blue-400 rounded-full'>
                            5
                        </p>
                    </div>

                </div>
            </div>
        
        
    </div>
  )
}

export default ChatCard