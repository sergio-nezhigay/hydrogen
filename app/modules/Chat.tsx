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

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form behavior
    setIsSubmitting(true); // Set loading state

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

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      console.log('Server response:', data); // Handle server response

      // Clear the input field after successful submission
      setMessage('');
    } catch (error) {
      console.error('Error submitting message:', error);
    } finally {
      setIsSubmitting(false); // Reset loading state
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
          disabled={isSubmitting} // Disable input while submitting
        />
        <button
          type="submit"
          className="bg-blueAccent text-white font-bold rounded-lg px-4 py-2"
          disabled={isSubmitting} // Disable button while submitting
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  );
};

export default Chat;
