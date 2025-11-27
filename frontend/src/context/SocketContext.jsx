import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./Authprovider.jsx";
import io from "socket.io-client";

const socketContext = createContext();

export const useSocketContext = () => {
  return useContext(socketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuth();

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

  useEffect(() => {
    const userId = authUser?.user?._id;

    if (userId) {
      const newSocket = io(backendURL, {
        query: { userId },
        transports: ["websocket"],
      });

      setSocket(newSocket);

      newSocket.on("getOnline", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <socketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};
