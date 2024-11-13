import {Link} from '@remix-run/react';
import {MessageCircle} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

const Chat = () => {
  const handleClick = () => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'chatButtonClick',
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
              <span>Viber</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="text-black hover:bg-gray-200 cursor-pointer">
            <Link
              to="https://t.me/NSergiy"
              className="flex items-center space-x-2 mx-auto"
            >
              <span>Telegram</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Chat;
