import React from 'react';

const MessageCard = ({ isReqUserMessage, content, image, timestamp, fullName }) => {
  return (
    <div
      className={`flex w-full ${
        isReqUserMessage ? 'justify-start' : 'justify-end'
      }`}
    >
      {/* Tin nhắn của người đối diện */}
      {isReqUserMessage && (
        <div className="flex items-start space-x-2 max-w-[50%]">
          <img
            src={
              image ||
              'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
            }
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col">
            {/* Tên đầy đủ */}
            {fullName && (
              <p className="text-sm text-gray-600 font-bold mb-1">{fullName}</p>
            )}
            {/* Hộp tin nhắn */}
            <div
              className="bg-white text-black py-2 px-4 rounded-2xl shadow-md break-words"
              style={{
                maxWidth: '100%',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.5', // Tăng khoảng cách giữa các dòng
              }}
            >
              {content}
            </div>
            {/* Thời gian */}
            <p className="text-xs text-gray-500 font-semibold mt-1">
              {new Date(timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              {new Date(timestamp).toLocaleDateString([], {
                day: '2-digit',
                month: '2-digit',
              })}
            </p>
          </div>
        </div>
      )}
      {/* Tin nhắn của người dùng */}
      {!isReqUserMessage && (
        <div className="flex items-end justify-end max-w-[50%]">
          <div className="flex flex-col items-end">
            {/* Hộp tin nhắn */}
            <div
              className="bg-blue-500 text-white py-2 px-4 rounded-2xl shadow-md break-words"
              style={{
                maxWidth: '100%',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.5',
              }}
            >
              {content}
            </div>
            {/* Thời gian */}
            <p className="text-xs text-gray-500 font-semibold mt-1">
              {new Date(timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              {new Date(timestamp).toLocaleDateString([], {
                day: '2-digit',
                month: '2-digit',
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageCard;
