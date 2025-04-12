import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { ChatList, MessageList, Input, Button } from "react-chat-elements";
import { assets } from "../../assets/assets.js"; // Đảm bảo bạn có file assets tương tự

const DoctorMessages = () => {
  const { dToken, backendUrl, profileData, getProfileData } =
    useContext(DoctorContext);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [doctorId, setDoctorId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State để lưu URL preview của ảnh

  useEffect(() => {
    if (dToken && !profileData) {
      getProfileData();
    }
  }, [dToken, getProfileData, profileData]);

  useEffect(() => {
    if (profileData) {
      setDoctorId(profileData._id);
    }
  }, [profileData]);

  useEffect(() => {
    const fetchConversations = async () => {
      console.log("Doctor ID:", doctorId);
      try {
        const { data } = await axios.get(
          backendUrl + "/api/doctor/conversations",
          {
            headers: { dtoken: dToken },
          }
        );
        console.log("Conversations response:", data);
        if (data.success) {
          setConversations(
            data.data.map((conv) => ({
              id: conv.conversationId,
              title: conv.name || "Bệnh nhân không xác định",
              avatar: conv.avatar || "default-avatar.png",
              userId: conv.userId || "unknown",
            }))
          );
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Error fetching conversations");
      }
    };
    if (dToken) fetchConversations();
  }, [dToken, backendUrl, doctorId]);

  useEffect(() => {
    if (selectedConversation && doctorId) {
      const fetchMessages = async () => {
        try {
          const { data } = await axios.get(
            backendUrl + `/api/doctor/messages/${selectedConversation.id}`,
            { headers: { dtoken: dToken } }
          );
          if (data.success) {
            setMessages(
              data.data.map((msg) => ({
                position:
                  msg.sender._id.toString() === doctorId.toString()
                    ? "right"
                    : "left",
                type: msg.isImage ? "photo" : "text",
                text: msg.isImage ? undefined : msg.content,
                data: msg.isImage ? { uri: msg.content } : undefined,
                date: new Date(msg.timestamp),
              }))
            );
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error("Error fetching messages");
        }
      };
      fetchMessages();
    }
  }, [selectedConversation, dToken, backendUrl, doctorId]);

  // Xử lý khi chọn ảnh: tạo URL preview và lưu file ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file); // Tạo URL tạm thời để hiển thị ảnh
      setImagePreview(previewUrl);

      // Thêm ảnh preview vào danh sách tin nhắn (tạm thời)
      setMessages([
        ...messages,
        {
          position: "right",
          type: "photo",
          data: { uri: previewUrl },
          date: new Date(),
          isPreview: true, // Đánh dấu đây là ảnh preview, chưa gửi
        },
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedConversation) return;

    try {
      // Gửi ảnh nếu có
      if (imageFile) {
        const formData = new FormData();
        formData.append("receiverId", selectedConversation.userId);
        formData.append("conversationId", selectedConversation.id);
        formData.append("receiverModel", "user");
        formData.append("isImage", true);
        formData.append("image", imageFile);

        const response = await axios.post(
          backendUrl + "/api/doctor/messages/send",
          formData,
          { headers: { dtoken: dToken, "Content-Type": "multipart/form-data" } }
        );
        const data = response.data;

        if (data.success) {
          // Xóa ảnh preview và thêm ảnh đã gửi vào danh sách tin nhắn
          setMessages((prevMessages) =>
            prevMessages
              .filter((msg) => !msg.isPreview) // Xóa tin nhắn preview
              .concat({
                position: "right",
                type: "photo",
                data: { uri: data.data.content },
                date: new Date(),
              })
          );
          setImageFile(null);
          setImagePreview(null);
        } else {
          toast.error(data.message);
        }
      }

      // Gửi tin nhắn văn bản nếu có
      if (newMessage.trim()) {
        const response = await axios.post(
          backendUrl + "/api/doctor/messages/send",
          {
            receiverId: selectedConversation.userId,
            content: newMessage,
            conversationId: selectedConversation.id,
            receiverModel: "user",
            isImage: false,
          },
          { headers: { dtoken: dToken, "Content-Type": "application/json" } }
        );
        const data = response.data;

        if (data.success) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              position: "right",
              type: "text",
              text: newMessage,
              date: new Date(),
            },
          ]);
          setNewMessage("");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error("Error sending message");
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] w-full max-w-7xl">
      <div className="w-[35%] border-r p-4">
        <h2 className="text-lg font-semibold mb-4">Cuộc trò chuyện</h2>
        <ChatList
          className="chat-list"
          dataSource={conversations}
          onClick={(conv) => setSelectedConversation(conv)}
        />
      </div>
      <div className="w-[65%] p-4 flex flex-col">
        {selectedConversation ? (
          <>
            <h2 className="text-lg font-semibold mb-4">
              {selectedConversation.title}
            </h2>
            <MessageList
              className="message-list flex-1 overflow-y-auto"
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={messages}
            />
            <div className="flex gap-2 mt-4 border-2 border-gray-400 rounded-md p-2 bg-white">
              <Input
                placeholder="Nhập tin nhắn..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                rightButtons={
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <img
                      src={assets.add_image_icon}
                      alt="Thêm ảnh"
                      className="w-6 h-6 opacity-70 hover:opacity-100"
                    />
                  </label>
                }
                className="flex-grow"
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />

              <Button text="Gửi" onClick={handleSendMessage} className="ml-2" />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</p>
          </div>
        )}
      </div>

      {/* CSS để thu nhỏ kích thước ảnh, giống với Messages */}
      <style jsx>{`
        .message-list .rce-mbox-photo img {
          width: 40% !important;
          height: auto !important;
        }
      `}</style>
    </div>
  );
};

export default DoctorMessages;
