import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

const useGetRealTimeNotification = () => {
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        let socket;
        if (user) {
            socket = io('http://localhost:8000', {
                query: {
                    userId: user._id
                },
                transports: ['websocket']
            });

            socket.on('notification', (res) => {
                toast(res.message);
            });
        }
        return () => {
            if (socket) {
                socket.close();
            }
        }
    }, [user]);
}

export default useGetRealTimeNotification;
