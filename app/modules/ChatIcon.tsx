import {Link} from '@remix-run/react';
import {MessageCircle} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

const ChatIcon = () => {
  return (
    <div className="fixed bottom-5 right-5">
      {/* DropdownMenu for Viber and Telegram */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="w-14 h-14 rounded-full bg-[#665CAC] flex items-center justify-center shadow-lg hover:bg-[#564A9C] cursor-pointer transition-colors"
          aria-label="Open chat options"
        >
          <MessageCircle className="text-white text-3xl" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-white border rounded-lg shadow-lg p-2 w-48">
          <DropdownMenuItem className="text-black hover:bg-gray-200 cursor-pointer">
            <Link
              to="viber://chat?number=YOUR_PHONE_NUMBER" // Replace with your actual Viber chat link
              className="flex items-center space-x-2"
            >
              <MessageCircle className="text-violet-600" />
              <span>Viber</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="text-black hover:bg-gray-200 cursor-pointer">
            <Link
              to="https://t.me/YOUR_TELEGRAM_USERNAME" // Replace with your Telegram link
              className="flex items-center space-x-2"
            >
              <MessageCircle className="text-blue-500" />
              <span>Telegram</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChatIcon;
