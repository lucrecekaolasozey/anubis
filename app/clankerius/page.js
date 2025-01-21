import ClankerListings from "../components/ClankerListings";
import AIChat from "../components/AiChat";

export default function ClankerPage() {
  return (
    <div className="h-screen flex bg-baseGray gap-1 pb-10">
      {/* Секция Clanker Listings */}
      <div className="w-1/2 bg-baseDark p-4 m-4 rounded-lg shadow-lg overflow-y-auto">
        <ClankerListings />
      </div>

      {/* Раздел AI Chat */}
      <div className="w-1/2 bg-baseDark p-4 m-4 rounded-lg shadow-lg flex flex-col">
        <h1 className="text-2xl font-bold text-white mb-4">Chat with Clankerius Agent</h1>
        <AIChat />
      </div>
    </div>
  );
}
