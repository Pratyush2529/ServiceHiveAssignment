import React, { createContext, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const socket = io(import.meta.env.VITE_API_URL, {
        withCredentials: true,
        autoConnect: false
    });

    useEffect(() => {
        if (user) {
            socket.connect();
            socket.emit('join', user._id);

            socket.on('hired', (data) => {
                toast.success(data.message, {
                    duration: 6000,
                    icon: '🎉',
                    position: 'bottom-center',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
            });
        }

        return () => {
            socket.disconnect();
        };
    }, [user, socket]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
