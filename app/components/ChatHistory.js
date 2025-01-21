export default function ChatHistory({ messages }) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
        >
          {/* Avatar for AI */}
          {!msg.isUser && (
            <div className="w-10 h-10 rounded-full flex items-center justify-center mr-2 bg-baseAccent">
              <img
                src="/avatar.png"
                alt="Clankerius Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          )}
          
          {/* Message Content */}
          <div
            className={`p-2 rounded-lg ${
              msg.isUser
                ? "bg-blue-500 text-white max-w-lg"
                : "bg-gray-300 text-black max-w-lg"
            }`}
          >
            {msg.isUser ? (
              // Render user messages as plain text
              msg.text
            ) : (
              // Render AI messages with HTML
              <div dangerouslySetInnerHTML={{ __html: msg.text }}></div>
            )}
          </div>
          
          {/* Avatar for User */}
          {msg.isUser && (
            <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center ml-2">
              U
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
