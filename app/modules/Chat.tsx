import {Link} from '@remix-run/react';
import {MessageCircle} from 'lucide-react';
import {useState} from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

const Chat = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const handleClick = () => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'chat_button_click',
        category: 'User Interaction',
        action: 'click',
        label: 'Chat Button',
      });
    }
  };

  return (
    <div className="fixed bottom-5 right-5 shift-left">
      <DropdownMenu>
        <DropdownMenuTrigger
          className="w-14 h-14 rounded-full bg-blueAccent opacity-80 flex items-center justify-center shadow-lg hover:opacity-100 cursor-pointer transition-colors"
          aria-label="Open chat options"
          onClick={handleClick}
        >
          <MessageCircle className="text-white text-3xl" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-white font-bold border rounded-lg shadow-lg p-2">
          <DropdownMenuItem className="text-black hover:bg-gray-200 cursor-pointer">
            <Link
              to="viber://chat?number=+380507025777"
              className="flex items-center space-x-2 mx-auto"
            >
              Viber
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="text-black hover:bg-gray-200 cursor-pointer">
            <Link
              to="https://t.me/NSergiy"
              className="flex items-center space-x-2 mx-auto"
            >
              Telegram
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-black hover:bg-gray-200 cursor-pointer"
            onClick={toggleChatbot}
          >
            <span className="flex items-center space-x-2 mx-auto">
              Інформік
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isChatbotOpen && (
        <div className="fixed bottom-20 right-5 bg-white border rounded-lg shadow-lg w-[400px] p-4 z-50">
          <ChatbotForm />
        </div>
      )}
    </div>
  );
};

const ChatbotForm = () => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'bot',
      content:
        'Привіт! Я — Інформік, ваш персональний помічник із покупок. Чим я можу вам допомогти сьогодні?',
    },
  ]);

  const decodeHTML = (html: string) => {
    return html
      .replace(/^"(.*)"$/, '$1')
      .replace(/\\n/g, '<br>')
      .replace(/\\"/g, '"');
  };

  const handleSubmit = async (event: {preventDefault: () => void}) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Append user's message to chat history
    setChatHistory((prev) => [...prev, {type: 'user', content: message}]);

    try {
      const response = await fetch(
        'https://admin-action-block.gadget.app/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({message}),
        },
      );

      if (!response.body) {
        throw new Error('Response body is empty');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let botResponse = '';

      while (!done) {
        const {value, done: readerDone} = await reader.read();
        done = readerDone;
        botResponse += decoder.decode(value);
      }

      setChatHistory((prev) => [
        ...prev,
        {type: 'bot', content: decodeHTML(botResponse)},
      ]);
    } catch (error) {
      console.error('Error receiving streamed message:', error);
    } finally {
      setIsSubmitting(false);
      setMessage(''); // Clear the input field
    }
  };

  return (
    <div
      id="chatbot-window"
      //  className="border rounded-lg shadow-lg bg-white flex flex-col"
    >
      {/* Chat Messages */}
      <div
        id="chat"
        className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-50 max-h-80"
      >
        {chatHistory.map((entry, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={`${entry.type}-${index}`} className={`mb-2 ${entry.type}`}>
            {entry.type === 'user' ? (
              <span className="block text-right text-blue-600 font-semibold">
                {entry.content}
              </span>
            ) : (
              <p
                className="text-gray-700"
                dangerouslySetInnerHTML={{__html: entry.content}}
              />
            )}
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form
        id="chat-form"
        onSubmit={handleSubmit}
        className="flex p-2 border-t bg-gray-100 space-x-2"
      >
        <input
          type="text"
          name="chatInput"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введіть своє питання..."
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          disabled={isSubmitting}
        />
        <button
          name="chatButton"
          type="submit"
          className={`px-4 py-2 font-bold text-white rounded-lg ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Думаю...' : 'Надіслати'}
        </button>
      </form>
    </div>
  );
};

export default Chat;
