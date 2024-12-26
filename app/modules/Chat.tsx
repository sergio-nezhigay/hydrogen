import {Link} from '@remix-run/react';
import {MessageCircle, MessageSquare, Search, Send, Loader} from 'lucide-react';
import {useState} from 'react';

import {ScrollArea} from '~/components/ui/scroll-area';
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
      {!isChatbotOpen ? (
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
                className="flex items-center gap-2"
              >
                <MessageSquare className="text-purple-500" size={20} />
                Viber
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="text-black hover:bg-gray-200 cursor-pointer">
              <Link
                to="https://t.me/NSergiy"
                className="flex items-center gap-2"
              >
                <Send className="text-blue-500" size={20} />
                Telegram
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 font-narrow hover:cursor-pointer"
              onClick={toggleChatbot}
            >
              <Search className="text-green-500" size={20} />
              Чат-бот
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="fixed bottom-20 right-5 bg-white border rounded-lg shadow-lg w-full max-w-[440px] p-4 z-50">
          <ChatbotForm toggleChatbot={toggleChatbot} />
        </div>
      )}
    </div>
  );
};

type ChatbotFormProps = {
  toggleChatbot: () => void;
};

const ChatbotForm: React.FC<ChatbotFormProps> = ({toggleChatbot}) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'bot',
      content:
        'Привіт! Я — Інформік, ваш персональний помічник із покупок. Чим я можу вам допомогти ?',
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
      setMessage('');
    }
  };

  return (
    <div>
      {/* Chat Messages */}
      <ScrollArea className="flex p-2 flex-col max-h-80 overflow-y-auto">
        {chatHistory.map((entry, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={`${entry.type}-${index}`} className={`mb-2 ${entry.type}`}>
            {entry.type === 'user' ? (
              <div className="ml-auto w-fit text-right rounded-lg p-2 bg-blue-500 text-white font-semibold">
                {entry.content}
              </div>
            ) : (
              <p
                className="text-black bg-gray-50 rounded-lg p-2 message-content"
                dangerouslySetInnerHTML={{__html: entry.content}}
              />
            )}
          </div>
        ))}
      </ScrollArea>
      {/* Input Form */}
      <form
        id="chat-form"
        onSubmit={handleSubmit}
        className="flex p-2 border-t space-x-2"
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
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader className="animate-spin" size={20} /> Зачекайте...
            </span>
          ) : (
            <span className="flex items-center gap-2">Надіслати</span>
          )}
        </button>
      </form>
      <button
        className="mt-2 w-full text-center text-sm text-blue-500 hover:underline"
        onClick={toggleChatbot}
      >
        Закрити чат
      </button>
    </div>
  );
};

export default Chat;
