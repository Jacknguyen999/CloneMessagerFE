import React from 'react'

const MessageCard = ({isReqUserMessage,content}) => {
  return (
    <div className={`py-2 px-2 rounded-md max-w-[50%]
     ${isReqUserMessage?"self-start bg-white" :
    "self-end bg-blue-300"}`
    
    }>
    <p className="text-sm text-gray-600">{content}</p>

    </div>
  )
}

export default MessageCard