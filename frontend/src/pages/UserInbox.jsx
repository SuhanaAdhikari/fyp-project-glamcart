import React from "react"
import { useEffect, useRef, useState } from "react"
import Header from "../components/Layout/Header"
import { useSelector } from "react-redux"
import socketIO from "socket.io-client"
import { format } from "timeago.js"
import { server } from "../server"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { AiOutlineArrowLeft, AiOutlineSend } from "react-icons/ai"
import { TfiGallery } from "react-icons/tfi"
import { FiSearch } from "react-icons/fi"

const ENDPOINT = "http://localhost:4000" // Your backend port
const socketId = socketIO(ENDPOINT, {
  transports: ["websocket"],
  withCredentials: true,
})

const UserInbox = () => {
  const { user, loading } = useSelector((state) => state.user)
  const [conversations, setConversations] = useState([])
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const [currentChat, setCurrentChat] = useState()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [userData, setUserData] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [, setImages] = useState()
  const [activeStatus, setActiveStatus] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const scrollRef = useRef(null)

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      })
    })
  }, [setActiveStatus])

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage])
  }, [arrivalMessage, currentChat])

  useEffect(() => {
    const getConversation = async () => {
      try {
        const response = await axios.get(`${server}/conversation/get-all-conversation-user/${user?._id}`, {
          withCredentials: true,
        })
        setConversations(response.data.conversations)
      } catch (error) {
        console.log(error)
      }
    }
    getConversation()
  }, [user, messages])

  useEffect(() => {
    if (user) {
      const sellerId = user?._id
      socketId.emit("addUser", sellerId)
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data)
      })
    }
  }, [user])

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== user?._id)
    const online = onlineUsers.find((user) => user.userId === chatMembers)
    return online ? true : false
  }

  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(`${server}/message/get-all-messages/${currentChat?._id}`)
        setMessages(response.data.messages)
      } catch (error) {
        console.log(error)
      }
    }
    getMessage()
  }, [currentChat])

  const sendMessageHandler = async (e) => {
    e.preventDefault()
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    }
    const receiverId = currentChat.members.find((member) => member !== user?._id)

    socketId.emit("sendMessage", {
      senderId: user?._id,
      receiverId,
      text: newMessage,
    })

    try {
      if (newMessage !== "") {
        const res = await axios.post(`${server}/message/create-new-message`, message)
        setMessages([...messages, res.data.message])
        updateLastMessage()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: user._id,
    })

    await axios.put(`${server}/conversation/update-last-message/${currentChat._id}`, {
      lastMessage: newMessage,
      lastMessageId: user._id,
    })
    setNewMessage("")
  }

  const handleImageUpload = async (e) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImages(reader.result)
        imageSendingHandler(reader.result)
      }
    }
    reader.readAsDataURL(e.target.files[0])
  }

  const imageSendingHandler = async (e) => {
    const receiverId = currentChat.members.find((member) => member !== user._id)
    socketId.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      images: e,
    })

    try {
      const res = await axios.post(`${server}/message/create-new-message`, {
        images: e,
        sender: user._id,
        text: newMessage,
        conversationId: currentChat._id,
      })
      setImages()
      setMessages([...messages, res.data.message])
      updateLastMessageForImage()
    } catch (error) {
      console.log(error)
    }
  }

  const updateLastMessageForImage = async () => {
    await axios.put(`${server}/conversation/update-last-message/${currentChat._id}`, {
      lastMessage: "Photo",
      lastMessageId: user._id,
    })
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conversation) => {
    if (!searchTerm) return true
    // This is a placeholder - actual filtering would depend on how you want to search
    return conversation.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="w-full">
      {!open ? (
        <>
          <Header />
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1a2240] to-[#3d569a] text-white p-6">
                <h1 className="text-2xl font-bold text-center">Messages</h1>
                <div className="mt-4 relative">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2 px-4 pl-10 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={18} />
                </div>
              </div>

              {/* Conversation List */}
              <div className="max-h-[70vh] overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-[#334580]">
                    <div className="bg-[#f0f4fa] p-4 rounded-full mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-[#3d569a]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-[#1a2240] mb-1">No conversations found</h3>
                    <p className="text-center px-4">
                      {searchTerm ? "Try a different search term" : "Start messaging with sellers"}
                    </p>
                  </div>
                ) : (
                  filteredConversations.map((item, index) => (
                    <MessageList
                      key={index}
                      data={item}
                      index={index}
                      setOpen={setOpen}
                      setCurrentChat={setCurrentChat}
                      me={user?._id}
                      setUserData={setUserData}
                      userData={userData}
                      online={onlineCheck(item)}
                      setActiveStatus={setActiveStatus}
                      loading={loading}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={user._id}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          handleImageUpload={handleImageUpload}
        />
      )}
    </div>
  )
}

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  userData,
  online,
  setActiveStatus,
  loading,
}) => {
  const [active, setActive] = useState(0)
  const [user, setUser] = useState([])
  const navigate = useNavigate()

  const handleClick = (id) => {
    navigate(`/inbox?${id}`)
    setOpen(true)
  }

  useEffect(() => {
    setActiveStatus(online)
    const userId = data.members.find((user) => user !== me)
    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${userId}`)
        setUser(res.data.shop)
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
  }, [me, data, online, setActiveStatus])

  return (
    <div
      className={`border-b border-[#dce5f3] hover:bg-[#f0f4fa] transition-colors cursor-pointer ${
        active === index ? "bg-[#f0f4fa]" : "bg-white"
      }`}
      onClick={() => {
        setActive(index)
        handleClick(data._id)
        setCurrentChat(data)
        setUserData(user)
        setActiveStatus(online)
      }}
    >
      <div className="flex items-center p-4">
        <div className="relative">
          <img
            src={user?.avatar?.url || "/placeholder.svg"}
            alt={user?.name || "Shop"}
            className="w-[50px] h-[50px] rounded-full object-cover border border-[#dce5f3]"
          />
          <div
            className={`w-[12px] h-[12px] rounded-full absolute top-[2px] right-[2px] border-2 border-white ${
              online ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-[#1a2240] truncate">{user?.name || "Loading..."}</h3>
            <span className="text-xs text-[#334580]">{format(data?.createdAt || Date.now())}</span>
          </div>
          <p className="text-sm text-[#334580] truncate">
            {!loading && data?.lastMessageId !== userData?._id ? "You: " : `${user?.name?.split(" ")[0] || "Shop"}: `}
            {data?.lastMessage}
          </p>
        </div>
      </div>
    </div>
  )
}

const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  scrollRef,
  handleImageUpload,
}) => {
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a2240] to-[#3d569a] text-white p-4 flex items-center">
        <button
          onClick={() => setOpen(false)}
          className="p-2 rounded-full hover:bg-white/20 transition-colors mr-2"
          aria-label="Back to conversations"
        >
          <AiOutlineArrowLeft size={20} />
        </button>
        <div className="flex items-center">
          <div className="relative">
            <img
              src={userData?.avatar?.url || "/placeholder.svg"}
              alt={userData?.name || "Shop"}
              className="w-[50px] h-[50px] rounded-full object-cover border-2 border-white"
            />
            {activeStatus && (
              <div className="w-[12px] h-[12px] rounded-full absolute bottom-0 right-0 bg-green-500 border-2 border-white" />
            )}
          </div>
          <div className="ml-3">
            <h2 className="font-semibold">{userData?.name || "Shop"}</h2>
            <p className="text-sm text-white/80">{activeStatus ? "Online" : "Offline"}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#f0f4fa]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#334580]">
            <div className="bg-white p-4 rounded-full mb-4 shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-[#3d569a]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[#1a2240] mb-1">No messages yet</h3>
            <p>Start the conversation with {userData?.name}</p>
          </div>
        ) : (
          messages.map((item, index) => (
            <div
              className={`flex w-full my-2 ${item.sender === sellerId ? "justify-end" : "justify-start"}`}
              key={index}
              ref={scrollRef}
            >
              {item.sender !== sellerId && (
                <img
                  src={userData?.avatar?.url || "/placeholder.svg"}
                  className="w-[40px] h-[40px] rounded-full mr-3 self-end"
                  alt={userData?.name || "Shop"}
                />
              )}
              <div className="max-w-[70%]">
                {item.images && (
                  <div
                    className={`rounded-lg overflow-hidden shadow-md mb-1 ${
                      item.sender === sellerId ? "bg-[#3d569a]" : "bg-white"
                    }`}
                  >
                    <img
                      src={item.images?.url || "/placeholder.svg"}
                      className="max-w-full max-h-[300px] object-contain"
                      alt="Sent"
                    />
                  </div>
                )}
                {item.text && item.text !== "" && (
                  <div
                    className={`p-3 rounded-lg shadow-sm ${
                      item.sender === sellerId
                        ? "bg-[#3d569a] text-white rounded-tr-none"
                        : "bg-white text-[#1a2240] rounded-tl-none"
                    }`}
                  >
                    <p className="break-words">{item.text}</p>
                  </div>
                )}
                <p
                  className={`text-xs mt-1 ${item.sender === sellerId ? "text-right text-[#334580]" : "text-[#334580]"}`}
                >
                  {format(item.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <form className="p-4 border-t border-[#dce5f3] bg-white flex items-center gap-2" onSubmit={sendMessageHandler}>
        <label
          htmlFor="image"
          className="p-2 rounded-full hover:bg-[#f0f4fa] transition-colors cursor-pointer"
          title="Send image"
        >
          <TfiGallery className="text-[#3d569a]" size={20} />
        </label>
        <input type="file" id="image" className="hidden" onChange={handleImageUpload} accept="image/*" />

        <div className="flex-1 relative">
          <input
            type="text"
            required
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full py-2 px-4 pr-10 rounded-full border border-[#dce5f3] focus:outline-none focus:border-[#3d569a] focus:ring-1 focus:ring-[#3d569a]"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#3d569a] text-white rounded-full hover:bg-[#2d3a69] transition-colors"
            title="Send message"
          >
            <AiOutlineSend size={18} />
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserInbox
