
import React from 'react';
import type { Message } from '../types';
import { Role } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const LoadingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
  </div>
);

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.User;
  const messageText = message.parts[0]?.text;

  const wrapperClasses = `flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`;
  const bubbleClasses = `max-w-lg lg:max-w-2xl px-4 py-3 rounded-2xl shadow-sm ${
    isUser
      ? 'bg-blue-500 text-white rounded-br-none'
      : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
  }`;

  return (
    <div className={wrapperClasses}>
      {!isUser && (
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          BĐH
        </div>
      )}
      <div className={bubbleClasses}>
        {messageText === "" && !isUser ? (
          <LoadingIndicator />
        ) : (
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{messageText}</p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
