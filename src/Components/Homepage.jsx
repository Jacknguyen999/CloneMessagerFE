import React, { useEffect, useState } from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import AddCommentIcon from '@mui/icons-material/AddComment';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ChatCard from './ChatCard/ChatCard';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MessageCard from './MessageCard/MessageCard';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AttachmentIcon from '@mui/icons-material/Attachment';
import SendIcon from '@mui/icons-material/Send';
import UserProfile from './Profile/UserProfile';
import { useLocation, useNavigate } from 'react-router-dom';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import CreateGroup from './Group/CreateGroup';
import { useDispatch, useSelector } from 'react-redux';
import { currentUser, logOut, searchUser } from '../Redux/Auth/Action';
import { createChat, getUserChat } from './../Redux/Chat/Action';
import { createChatMessage, getAllChatMessage } from './../Redux/Message/Action';



const Homepage = () => {
    const [query, setQuery] = useState(null);
    const [currentChat, setCurrentChat] = useState(null);
    const [content, setContent] = useState(null);
    const [modal, setModal] = useState(false);
    const [isGroup, setIsGroup] = useState(false);
    const dispatch = useDispatch();
    const { auth, chat, message } = useSelector(store => store);
    const navigate = useNavigate();
    const jwt = localStorage.getItem('jwt');




    const handleSearch = (search) => {
        dispatch(searchUser({ keyword: search, token: jwt }));
    };
    const handleLClickOnChatCard = (userId) => {
        // Check if chat already exists with the selected user
        const existingChat = chat.chat.find(
            (chatItem) =>
                !chatItem.group && // Ensure it's not a group chat
                chatItem.users.some((user) => user.id === userId)
        );
    
        if (existingChat) {
            // If chat exists, set it as the current chat
            setCurrentChat(existingChat);
        } else {
            // Create a new chat if no existing chat is found
            dispatch(createChat({ jwt, data: { userId } }));
        }
    
        // Clear the search query
        setQuery("");
    };

    const handleCreateNewMessage = () => {
        dispatch(createChatMessage({ data: { userId: auth.reqUser?.id, chatId: currentChat.chatId, message: content } }));

    }

    const handleCreateGroup = () => {
        setIsGroup(true);

    }

    const handleOpenModal = () => setModal(true);
    const handleCloseModal = () => setModal(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        dispatch(logOut());
        navigate("/signin");

    }

    const handleCurrentChat = (item) => {
        setCurrentChat(item);

    }




    // load chat , current user
    useEffect(() => {
        dispatch(currentUser(jwt))
        dispatch(getUserChat({ jwt }))

    }, [jwt, chat.createChat, chat.CreateGroup]);


    // KO tim thay user = > login 
    useEffect(() => {
        if (!auth.reqUser) {
            navigate("/signin");
        }
    }, [auth.reqUser]);

    //get all message from current chat 
    useEffect(() => {
        if (currentChat?.chatId)
            dispatch(getAllChatMessage({ chatId: currentChat.chatId }));
    }, [currentChat,message.newMessage]);



    return (
        <div className="relative min-h-screen">
            {/* Header */}
            <div className="py-14 bg-slate-800 w-full"></div>

            {/* Main Content */}
            <div className="flex bg-white h-[90vh] absolute top-6 
            left-10 w-[95%] shadow-lg rounded-md overflow-hidden ">
                {/* Left Sidebar */}
                <div className="left w-[25%] h-full bg-gray-700 flex flex-col">

                    <div className="w-full">
                        {/* User Info */}
                        <div className="flex justify-between items-center p-3">
                            <div className="flex items-center space-x-3 p-3">
                                <img
                                    className="rounded-full w-10 h-10 cursor-pointer"
                                    // src="https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
                                    src={auth.reqUser?.profile_pic || "https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"}
                                    alt="User Avatar"
                                    onClick={handleOpenModal}
                                />

                                <p className="font-bold text-white">{auth.reqUser?.full_name}</p>
                            </div>
                            <div className="space-x-3 text-2xl flex text-white">
                                <CircleIcon />
                                <AddCommentIcon />
                                <MoreVertIcon
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick} />
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                                    <MenuItem onClick={handleCreateGroup}>Create Group</MenuItem>
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </Menu>



                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="relative flex items-center bg-gray-600 rounded-lg shadow-md p-3">
                            <SearchIcon
                                style={{ color: '#9CA3AF' }} // Tailwind's gray-400 equivalent
                                className="absolute left-4 top-[50%] transform -translate-y-1/2 text-xl"
                            />
                            <input
                                type="text"
                                placeholder="Search or start new chat"
                                className="border-none outline-none bg-gray-700
                            text-white rounded-md pl-12 py-2 w-full placeholder-gray-400 focus:ring-2
                             focus:ring-blue-500"
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    handleSearch(e.target.value);
                                }}
                                value={query}
                            />
                            <FilterListIcon
                                style={{ color: '#9CA3AF' }}
                                className="ml-4 text-2xl cursor-pointer hover:text-white transition-colors"
                            />
                        </div>


                        {/* Chat List */}
                        <div className="h-[75.9vh] px-3 overflow-y-auto scrollbar-hide scrollbar-thin 
                        scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                            {query &&
                                auth.searchUser?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="cursor-pointer"
                                        onClick={() => handleLClickOnChatCard(item.id)}
                                    >
                                        {" "}
                                        <hr />
                                        <ChatCard
                                            name={item.full_name}
                                            userImg={
                                                item.profile_pic ||
                                                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                            }
                                        />
                                    </div>
                                ))}
                            {chat.chat.length > 0 && !query &&
                                chat.chat?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="cursor-pointer"
                                        onClick={() => handleCurrentChat(item)}
                                    >
                                        <hr />
                                        {
                                            item.group ? (
                                                <ChatCard
                                                    name={item.chat_name || "Group Default Name"}
                                                    userImg={
                                                        item.chat_image ||
                                                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                                    }
                                                />

                                            ) : (
                                                <ChatCard
                                                    isChat={true}
                                                    name={
                                                        auth.reqUser?.id !== item.users[0]?.id
                                                            ? item.users[0].full_name
                                                            : item.users[1].full_name
                                                    }
                                                    userImg={
                                                        auth.reqUser?.id !== item.users[0].id
                                                            ? item.users[0].profile_pic ||
                                                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                                            : item.users[1].profile_pic ||
                                                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                                    }
                                                />
                                            )
                                        }
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Right Content */}
                <div className="right flex-1 bg-gray-200 flex flex-col">
                    {!currentChat ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="max-w-[70%] text-center">
                                <img
                                    src="https://cdn.pixabay.com/photo/2012/04/15/21/17/speech-35342_1280.png"
                                    alt="Welcome"
                                    className="mx-auto w-[50%] h-[50%] mb-14"
                                />
                                <h1 className="text-gray-600 text-4xl font-bold">
                                    Welcome To Chat Web Hehe
                                </h1>
                                <p className="text-gray-500 text-lg mt-4">
                                    Send and receive messages
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full relative">
                            {/* Chat Header */}
                            <div className="header sticky top-0 w-full bg-[#f5f5f5] shadow-md">
                                <div className="flex justify-between items-center py-3 px-4">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            // src="https://cdn.pixabay.com/photo/2024/12/30/13/06/moped-9300285_640.jpg"
                                            src={
                                                currentChat.group ? currentChat.chat_image || "https://cdn.pixabay.com/photo/2016/11/14/17/39/group-1824145_1280.png" :
                                                    (auth.reqUser?.id === currentChat.users[0].id
                                                        ?
                                                        currentChat.users[1].profile_pic || "https://cdn.pixabay.com/photo/2024/12/30/13/06/moped-9300285_640.jpg"
                                                        :
                                                        currentChat.users[0].profile_pic || "https://cdn.pixabay.com/photo/2024/12/30/13/06/moped-9300285_640.jpg")
                                            }
                                            alt=""
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <p>{
                                            currentChat.group ?
                                                currentChat.chat_name :
                                                (auth.reqUser?.id === currentChat.users[0].id
                                                    ?
                                                    currentChat.users[1].full_name
                                                    :
                                                    currentChat.users[0].full_name)}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <SearchIcon style={{ color: 'black' }} />
                                        <MoreHorizIcon style={{ color: 'black' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Chat Content Below Header */}
                            <div className="px-10 h-[85vh] overflow-y-scroll scrollbar-hide bg-gray-300"
                                style={{
                                    backgroundImage: "url('https://img.freepik.com/premium-vector/seamless-pattern-with-different-social-media-icons_405287-75.jpg?semt=ais_hybrid'",
                                }}

                            >
                                <div className='space-y-4 flex flex-col justify-center  mt-7 py-2'>
                                    {message.messages.length > 0 && message.messages?.map((item, i) =>
                                        <MessageCard
                                            isReqUserMessage={item.sender.id !== auth.reqUser.id}
                                            content={item.content}

                                        />)}
                                </div>

                            </div>
                            {/* Footer */}

                            <div className="footer bg-gray-300 flex items-center justify-between px-4 py-3 sticky bottom-0 shadow-md">
                                {/* Emoji and Attachment Icons */}
                                <div className="flex space-x-3">
                                    <EmojiEmotionsIcon className="cursor-pointer text-gray-500 hover:text-gray-700" />
                                    <AttachmentIcon className="cursor-pointer text-gray-500 hover:text-gray-700" />
                                </div>

                                {/* Input Field */}
                                <input
                                    className="py-2 outline-none border-none bg-white pl-4 rounded-md w-full mx-3"
                                    type="text"
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Type your message"
                                    value={content}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            handleCreateNewMessage();
                                            setContent("");
                                        }
                                    }}
                                />

                                {/* Send Icon */}
                                <SendIcon
                                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                                    onClick={() => {
                                        handleCreateNewMessage();
                                        setContent("");
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Profile Modal */}
            <UserProfile open={modal} onClose={handleCloseModal} />

            {/* Group Modal */}
            <CreateGroup open={isGroup} onClose={() => setIsGroup(false)} />


        </div>

    );
};

export default Homepage;


