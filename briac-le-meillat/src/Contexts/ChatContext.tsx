import React, { createContext, useContext, useState } from 'react';

interface ChatContextType {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const ChatContext = createContext<ChatContextType>({
    isOpen: false,
    setIsOpen: () => {},
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <ChatContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChatWidget() {
    return useContext(ChatContext);
}
