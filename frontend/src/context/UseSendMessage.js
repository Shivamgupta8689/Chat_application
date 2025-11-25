import React, { useState } from 'react'
import useConversation from '../statemanage/Useconversation.js';
import axios from 'axios'
import API from '../utils/axiosInstance.js';

const UseSendMessage = () => {
    const [loading, setLoading] = useState(false)
    const {messages, setMessages, selectedConversation} = useConversation();
    const sendMessage = async (message)=>{
        setLoading(true);
        try {
            const response = await API.post(
             `/api/message/send/${selectedConversation._id}`,
             {message}
            ) 
            setMessages((prev) => [...prev, response.data]);
            setLoading(false)
         } catch (error) {
             console.log("Error in send message: ", error)
         }finally {
          setLoading(false);
        }
       
    }
  return {loading,sendMessage}
}

export default UseSendMessage
