import {Link, replace} from '@remix-run/react';
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
            <span className="flex items-center space-x-2 mx-auto">Робот</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isChatbotOpen && (
        <div className="fixed bottom-20 right-5 bg-white border rounded-lg shadow-lg w-80 p-4 z-50">
          <ChatbotForm />
        </div>
      )}
    </div>
  );
};

const ChatbotForm = () => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatResponse, setChatResponse] = useState('');
  const decodedChatResponse = decodeHTML(chatResponse);
  console.log('🚀 ~ chatResponse:', chatResponse);
  console.log('🚀 ~ decodedChatResponse:', decodedChatResponse);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setChatResponse(''); // Clear previous response

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

      while (!done) {
        const {value, done: readerDone} = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value);
        setChatResponse((prev) => prev + chunk); // Append chunk to response
      }
    } catch (error) {
      console.error('Error receiving streamed message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          name="chatInput"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="border rounded-lg p-2 w-full"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="bg-blueAccent text-white font-bold rounded-lg px-4 py-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
      </div>
      <div
        className="mt-4 bg-gray-100 p-2 rounded-lg overflow-y-auto max-h-64"
        dangerouslySetInnerHTML={{__html: decodedChatResponse}}
      />
    </form>
  );
};

const decodeHTML = (html) => {
  return (
    html
      .replace(/^"(.*)"$/, '$1')
      //.replace(/&quot;/g, '"')
      //.replace(/&amp;/g, '&')
      //.replace(/&#39;/g, "'")
      .replace(/\\n\\n/g, '<br>')
      .replace(/\\"/g, '"')
  ); // Replace escaped quotes
};

export default Chat;
