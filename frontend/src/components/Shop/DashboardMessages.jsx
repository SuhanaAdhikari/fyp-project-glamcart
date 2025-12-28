import React from "react"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { AiOutlineArrowLeft, AiOutlineSend } from "react-icons/ai"
import { TfiGallery } from "react-icons/tfi"
import socketIO from "socket.io-client"
import { server } from "../../server"
import { format } from "timeago.js"
import { FiSearch } from "react-icons/fi"

const ENDPOINT = "http://localhost:4000" // Your backend port
const socketId = socketIO(ENDPOINT, {
  transports: ["websocket"],
  withCredentials: true,
})

const DashboardMessages = () => {
  const { seller, isLoading } = useSelector((state) => state.seller)
  const [conversations, setConversations] = useState([])
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const [currentChat, setCurrentChat] = useState()
  const [messages, setMessages] = useState([])
  const [userData, setUserData] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [onlineUsers, setOnlineUsers] = useState([])
  const [activeStatus, setActiveStatus] = useState(false)
  const [, setImages] = useState()
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
  }, [])

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage])
  }, [arrivalMessage, currentChat])

  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await axios.get(`${server}/conversation/get-all-conversation-seller/${seller?._id}`, {
          withCredentials: true,
        })
        setConversations(res.data.conversations)
      } catch (error) {
        console.log(error)
      }
    }
    if (seller?._id) getConversation()
  }, [seller, messages])

  useEffect(() => {
    if (seller?._id) {
      socketId.emit("addUser", seller._id)
      socketId.on("getUsers", (data) => setOnlineUsers(data))
    }
  }, [seller])

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== seller._id)
    return onlineUsers.some((user) => user.userId === chatMembers)
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
    if (currentChat) getMessage()
  }, [currentChat])

  const sendMessageHandler = async (e) => {
    e.preventDefault()
    const message = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
    }
    const receiverId = currentChat.members.find((member) => member !== seller._id)

    socketId.emit("sendMessage", {
      senderId: seller._id,
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
      lastMessageId: seller._id,
    })
    await axios.put(`${server}/conversation/update-last-message/${currentChat._id}`, {
      lastMessage: newMessage,
      lastMessageId: seller._id,
    })
    setNewMessage("")
  }

  const handleImageUpload = (e) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImages(reader.result)
        imageSendingHandler(reader.result)
      }
    }
    reader.readAsDataURL(e.target.files[0])
  }

  const imageSendingHandler = async (image) => {
    const receiverId = currentChat.members.find((member) => member !== seller._id)
    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      images: image,
    })

    try {
      const res = await axios.post(`${server}/message/create-new-message`, {
        sender: seller._id,
        text: "",
        images: image,
        conversationId: currentChat._id,
      })
      setMessages([...messages, res.data.message])
      updateLastMessageForImage()
    } catch (error) {
      console.log(error)
    }
  }

  const updateLastMessageForImage = async () => {
    await axios.put(`${server}/conversation/update-last-message/${currentChat._id}`, {
      lastMessage: "Photo",
      lastMessageId: seller._id,
    })
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const filteredConversations = conversations.filter((conversation) => {
    if (!searchTerm) return true
    return conversation.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="w-full h-[85vh]">
      <div className="gc_card h-full overflow-hidden">
        <div className="gc_cardTopLine" />

        {!open ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-5 md:p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="gc_dot" />
                <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Inbox</p>
              </div>

              <div className="flex items-center justify-between gap-3">
                <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">Messages</h1>
              </div>

              <div className="mt-4 gc_searchWrap">
                <FiSearch className="gc_searchIcon" size={18} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="gc_searchInput"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto bg-white">
              {filteredConversations.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 p-10">
                  <div className="gc_iconCircle mb-4">💬</div>
                  <h3 className="text-lg font-extrabold text-gray-900 mb-1">No conversations found</h3>
                  <p className="text-sm text-gray-600 text-center">
                    {searchTerm ? "Try a different search term." : "Start messaging with your customers."}
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
                    me={seller._id}
                    setUserData={setUserData}
                    online={onlineCheck(item)}
                    setActiveStatus={setActiveStatus}
                    isLoading={isLoading}
                  />
                ))
              )}
            </div>
          </div>
        ) : (
          <SellerInbox
            setOpen={setOpen}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessageHandler={sendMessageHandler}
            messages={messages}
            sellerId={seller._id}
            userData={userData}
            activeStatus={activeStatus}
            scrollRef={scrollRef}
            handleImageUpload={handleImageUpload}
          />
        )}
      </div>

      {/* GlamCart Styles */}
      <style jsx global>{`
        .gc_dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: linear-gradient(90deg, #ec4899, #a855f7);
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.12);
          display: inline-block;
        }

        .gc_card {
          border-radius: 18px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: #fff;
          box-shadow: 0 10px 30px rgba(17, 24, 39, 0.06);
        }

        .gc_cardTopLine {
          height: 5px;
          width: 100%;
          background: linear-gradient(90deg, #ec4899, #a855f7, #8b5cf6);
        }

        .gc_searchWrap {
          position: relative;
        }
        .gc_searchIcon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }
        .gc_searchInput {
          width: 100%;
          padding: 12px 14px 12px 40px;
          border-radius: 16px;
          border: 2px solid rgba(0, 0, 0, 0.08);
          outline: none;
          transition: 160ms ease;
        }
        .gc_searchInput:focus {
          border-color: rgba(168, 85, 247, 0.65);
          box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.15);
        }

        .gc_iconCircle {
          width: 54px;
          height: 54px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(236, 72, 153, 0.12);
          border: 1px solid rgba(236, 72, 153, 0.22);
          color: #111827;
          font-size: 22px;
        }

        .gc_row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          transition: 160ms ease;
          cursor: pointer;
        }
        .gc_row:hover {
          background: rgba(17, 24, 39, 0.03);
        }
        .gc_rowActive {
          background: linear-gradient(90deg, rgba(236, 72, 153, 0.06), rgba(168, 85, 247, 0.06));
        }

        .gc_avatar {
          width: 52px;
          height: 52px;
          border-radius: 999px;
          object-fit: cover;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .gc_statusDot {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          position: absolute;
          top: 2px;
          right: 2px;
          border: 2px solid #fff;
        }

        .gc_chatHeader {
          background: #fff;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .gc_iconBtn {
          min-width: auto;
          padding: 10px;
          border-radius: 999px;
          background: rgba(17, 24, 39, 0.06);
          color: #111827;
          transition: 160ms ease;
        }
        .gc_iconBtn:hover {
          background: rgba(17, 24, 39, 0.12);
        }

        .gc_chatBody {
          background: linear-gradient(180deg, rgba(236, 72, 153, 0.04), rgba(168, 85, 247, 0.02));
        }

        .gc_bubbleMe {
          background: linear-gradient(90deg, #ec4899, #a855f7);
          color: #fff;
          border-radius: 16px;
          border-top-right-radius: 6px;
          padding: 10px 12px;
          box-shadow: 0 10px 18px rgba(168, 85, 247, 0.14);
        }
        .gc_bubbleYou {
          background: #fff;
          color: #111827;
          border-radius: 16px;
          border-top-left-radius: 6px;
          padding: 10px 12px;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .gc_inputBar {
          background: #fff;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          padding: 12px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .gc_textInputWrap {
          flex: 1;
          position: relative;
        }
        .gc_textInput {
          width: 100%;
          padding: 12px 44px 12px 14px;
          border-radius: 999px;
          border: 2px solid rgba(0, 0, 0, 0.08);
          outline: none;
          transition: 160ms ease;
        }
        .gc_textInput:focus {
          border-color: rgba(236, 72, 153, 0.65);
          box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.12);
        }
        .gc_sendBtn {
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(90deg, #ec4899, #a855f7);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: 160ms ease;
        }
        .gc_sendBtn:hover {
          filter: brightness(0.98);
          transform: translateY(-50%) scale(1.02);
        }
      `}</style>
    </div>
  )
}

const MessageList = ({ data, index, setOpen, setCurrentChat, me, setUserData, online, setActiveStatus, isLoading }) => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const [active, setActive] = useState(0)

  useEffect(() => {
    const userId = data.members.find((member) => member !== me)
    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId}`)
        setUser(res.data.user)
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
    setActiveStatus(online)
  }, [data, me, online, setActiveStatus])

  return (
    <div
      className={`gc_row ${active === index ? "gc_rowActive" : ""}`}
      onClick={() => {
        setActive(index)
        setOpen(true)
        setCurrentChat(data)
        setUserData(user)
        navigate(`/dashboard-messages?${data._id}`)
      }}
    >
      <div className="relative">
        <img src={user?.avatar?.url || "/placeholder.svg"} alt={user?.name || "User"} className="gc_avatar" />
        <div className={`gc_statusDot ${online ? "bg-green-500" : "bg-gray-400"}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-extrabold text-gray-900 truncate">{user?.name || "Loading..."}</h3>
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">{format(data?.createdAt || Date.now())}</span>
        </div>

        <p className="text-sm text-gray-600 truncate mt-0.5">
          {!isLoading && data?.lastMessageId !== user?._id ? "You: " : `${user?.name?.split(" ")[0]}: `}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  )
}

const SellerInbox = ({
  scrollRef,
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  handleImageUpload,
}) => (
  <div className="flex flex-col h-full">
    {/* Header */}
    <div className="gc_chatHeader">
      <div className="flex items-center gap-10">
        <button onClick={() => setOpen(false)} className="gc_iconBtn" aria-label="Back">
          <AiOutlineArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={userData?.avatar?.url || "/placeholder.svg"}
              alt={userData?.name || "User"}
              className="w-[46px] h-[46px] rounded-full object-cover border border-gray-200"
            />
            {activeStatus && (
              <div className="w-[12px] h-[12px] rounded-full absolute bottom-0 right-0 bg-green-500 border-2 border-white" />
            )}
          </div>
          <div>
            <h2 className="font-extrabold text-gray-900 leading-tight">{userData?.name || "User"}</h2>
            <p className="text-xs font-semibold text-gray-500">{activeStatus ? "Online" : "Offline"}</p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2">
        <span className="gc_dot" />
        <span className="text-xs font-semibold text-gray-500 uppercase">Chat</span>
      </div>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto p-4 gc_chatBody">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-600">
          <div className="gc_iconCircle mb-4">✨</div>
          <h3 className="text-lg font-extrabold text-gray-900 mb-1">No messages yet</h3>
          <p className="text-sm text-gray-600">Start the conversation with {userData?.name}</p>
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
                className="w-[36px] h-[36px] rounded-full mr-3 self-end border border-gray-200"
                alt={userData?.name || "User"}
              />
            )}

            <div className="max-w-[76%]">
              {item.images && (
                <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm mb-2">
                  <img
                    src={item.images?.url || "/placeholder.svg"}
                    className="max-w-full max-h-[320px] object-contain"
                    alt="Sent"
                  />
                </div>
              )}

              {item.text && (
                <div className={item.sender === sellerId ? "gc_bubbleMe" : "gc_bubbleYou"}>
                  <p className="break-words text-sm font-medium">{item.text}</p>
                </div>
              )}

              <p className={`text-[11px] mt-1 ${item.sender === sellerId ? "text-right text-gray-500" : "text-gray-500"}`}>
                {format(item.createdAt)}
              </p>
            </div>
          </div>
        ))
      )}
    </div>

    {/* Message Input */}
    <form className="gc_inputBar" onSubmit={sendMessageHandler}>
      <label htmlFor="image" className="gc_iconBtn cursor-pointer" title="Send image">
        <TfiGallery size={18} />
      </label>
      <input type="file" id="image" className="hidden" onChange={handleImageUpload} accept="image/*" />

      <div className="gc_textInputWrap">
        <input
          type="text"
          required
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="gc_textInput"
        />
        <button type="submit" className="gc_sendBtn" title="Send">
          <AiOutlineSend size={18} />
        </button>
      </div>
    </form>
  </div>
)

export default DashboardMessages
