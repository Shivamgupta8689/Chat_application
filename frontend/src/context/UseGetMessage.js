import React, { useEffect, useState } from 'react'
import axios from 'axios'
import useConversation from '../statemanage/Useconversation.js'
import API from '../utils/axiosInstance.js'

const UseGetMessage = () => {
    const [loading, setLoading] = useState(false)
    const {messages, setMessages, selectedConversation} = useConversation();

    useEffect(() => {
        let isMounted = true;
        const getMessage = async ()=>{
            
            if(selectedConversation && selectedConversation._id){
            try {
                setLoading(true);
                const response = await API.get(
                 `/api/message/get/${selectedConversation._id}`
                ) 
                if (isMounted) {
                    setMessages(response.data);
                    setLoading(false);
                  }
             } catch (error) {
                if (isMounted) setLoading(false);
                 console.log("Error in useGetMessage: ", error)
             }
            }
        }
        getMessage();
        return () => { isMounted = false };
    }, [selectedConversation, setMessages])
    return {
        messages,
        loading
    }
}

export default UseGetMessage
