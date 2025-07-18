import ChatWindow from "../components/ChatWindow";
import SidebarTools from "../components/SidebarTools";

export default function ChatPage() {
  return (
    <div className="w-full h-screen flex bg-calming-light">
      <div className="flex-1 flex flex-col">
        <ChatWindow />
      </div>
      <div className="hidden lg:block w-1/4 p-4 border-l border-gray-300 bg-white">
        <SidebarTools />
      </div>
    </div>
  );
}
