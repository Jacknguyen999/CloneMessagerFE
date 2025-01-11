import React, { useEffect, useRef } from 'react';
import MessageCard from '../MessageCard/MessageCard';
import { useSelector } from 'react-redux';

const MessageList = ({ messages }) => {
    const messageEndRef = useRef(null);
    const {auth} = useSelector(store => store);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Scroll to the bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div
            className="px-10 h-[85vh] overflow-y-scroll scrollbar-hide bg-gray-300"
            style={{
                backgroundImage: "url('https://img.freepik.com/premium-vector/seamless-pattern-with-different-social-media-icons_405287-75.jpg?semt=ais_hybrid')",
            }}
        >
            <div className="space-y-4 flex flex-col justify-center mt-7 py-2">
                {messages.map((item, i) => (
                    <MessageCard
                        key={i}
                        isReqUserMessage={item.sender.id !== auth.reqUser.id}
                        content={item.content}
                    />
                ))}
                {/* Add a div at the end of the list to scroll to */}
                <div ref={messageEndRef}></div>
            </div>
        </div>
    );
};

export default MessageList;
