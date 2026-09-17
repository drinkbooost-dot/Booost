import React, { useState } from 'react';
import { 
  Instagram, 
  Sparkles, 
  ExternalLink, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  QrCode, 
  Check, 
  Copy, 
  MapPin, 
  ShoppingBag,
  Flame,
  Award,
  ShieldCheck,
  Camera
} from 'lucide-react';
import { MenuItem, CupSize } from '../types';
import { MENU_ITEMS } from '../data/menuData';

interface InstagramPostItem {
  id: string;
  image: string;
  caption: string;
  likes: number;
  commentsCount: number;
  timeAgo: string;
  shakeId: string;
  shakeName: string;
  location: string;
  tags: string[];
  gradientBg: string;
  cupBadge: string;
}

const INSTAGRAM_POSTS: InstagramPostItem[] = [
  {
    id: 'post-1',
    image: 'iron-man-hero',
    caption: 'Post-leg day fuel that hits different. 💪 Green apples, crisp baby spinach, organic spirulina, and 28g of ultra-filtered whey isolate. Power your day the natural way!',
    likes: 842,
    commentsCount: 39,
    timeAgo: '2 HOURS AGO',
    shakeId: 'iron-man-supreme',
    shakeName: 'Iron Man Supreme (22oz)',
    location: 'SM City Dasmariñas - Lower Ground',
    tags: ['#BooostPH', '#PowerYourDay', '#IronManSupreme', '#SMDasma', '#ProteinShake'],
    gradientBg: 'from-emerald-900 via-teal-900 to-green-950',
    cupBadge: '🥦 High Protein • 28g Whey'
  },
  {
    id: 'post-2',
    image: 'profee-hero',
    caption: 'The ultimate morning cheat code ☕️⚡️ Artisan cold brew espresso meets pure vanilla whey protein isolate. 120mg clean caffeine + 28g protein. No jittery crashes, just pure focus.',
    likes: 1205,
    commentsCount: 64,
    timeAgo: '1 DAY AGO',
    shakeId: 'profee-supreme-coffee',
    shakeName: 'Profee Supreme',
    location: 'SM City Trece - Ground Level',
    tags: ['#ProfeeSupreme', '#BooostCoffee', '#SMTrece', '#ColdBrewProtein', '#MorningFuel'],
    gradientBg: 'from-amber-950 via-stone-900 to-yellow-950',
    cupBadge: '⚡️ 120mg Caffeine + 28g Protein'
  },
  {
    id: 'post-3',
    image: 'chocoloco-hero',
    caption: 'Satisfy your deepest chocolate cravings 100% guilt-free. 🍫 Real Dutch cocoa, natural peanut butter, fresh bananas, and oat milk. Tag your workout buddy who needs this!',
    likes: 974,
    commentsCount: 48,
    timeAgo: '2 DAYS AGO',
    shakeId: 'chocoloco',
    shakeName: 'Chocoloco Protein Deluxe',
    location: 'SM City Dasmariñas',
    tags: ['#Chocoloco', '#ChocolateLover', '#CaviteFitness', '#GuiltFreeFuel', '#BooostPH'],
    gradientBg: 'from-amber-950 via-stone-900 to-orange-950',
    cupBadge: '🍫 30g Protein • Real Peanut Butter'
  },
  {
    id: 'post-4',
    image: 'kid-friendly-hero',
    caption: 'Wholesome nutrition the kids love! 👶🍓 Real strawberries & milk with zero artificial junk. Special Kid-Friendly pricing: 16oz at only ₱180 and 22oz at ₱220! Drop by our kiosks with the family.',
    likes: 651,
    commentsCount: 22,
    timeAgo: '3 DAYS AGO',
    shakeId: 'classic-strawberry',
    shakeName: 'Classic Strawberry (Kid Friendly)',
    location: 'SM City Dasmariñas & SM City Trece',
    tags: ['#BooostKids', '#KidFriendly', '#RealFruitShake', '#CaviteMoms', '#HealthyKids'],
    gradientBg: 'from-rose-950 via-pink-900 to-stone-900',
    cupBadge: '👶 16oz ₱180 • 22oz ₱220'
  },
  {
    id: 'post-5',
    image: 'biscoff-hero',
    caption: 'Caramelized Lotus Biscoff biscuit crunch folded with creamy vanilla protein. 🍪 30g protein never tasted this gourmet. Have you tried our Biscoff Protein Deluxe yet?',
    likes: 1480,
    commentsCount: 77,
    timeAgo: '4 DAYS AGO',
    shakeId: 'biscoff-protein-deluxe',
    shakeName: 'Biscoff Protein Deluxe',
    location: 'SM City Dasmariñas',
    tags: ['#BiscoffDeluxe', '#LotusBiscoff', '#ProteinShakePH', '#BooostFavorites'],
    gradientBg: 'from-amber-900 via-yellow-950 to-stone-950',
    cupBadge: '🍪 Lotus Biscoff • 30g Protein'
  },
  {
    id: 'post-6',
    image: 'loyalty-hero',
    caption: 'Collect 10 stamps on your digital Booost Pass & unlock a FREE 16oz drink of your choice! 🏷️ Ask our baristas at the counter or scan our QR code to log your stamp today.',
    likes: 1120,
    commentsCount: 53,
    timeAgo: '5 DAYS AGO',
    shakeId: 'iron-man-supreme',
    shakeName: 'Digital Loyalty Stamp Card',
    location: 'SM City Trece',
    tags: ['#BooostLoyalty', '#FreeDrink', '#10Stamps', '#CaviteHealth', '#BooostFam'],
    gradientBg: 'from-[#06291b] via-[#093c27] to-[#04150e]',
    cupBadge: '🎁 10 Stamps = 1 Free Drink'
  }
];

interface InstagramSocialViewProps {
  onSelectItemForOrder: (item: MenuItem, size: CupSize, isProtein: boolean) => void;
}

export const InstagramSocialView: React.FC<InstagramSocialViewProps> = ({
  onSelectItemForOrder,
}) => {
  const [selectedPost, setSelectedPost] = useState<InstagramPostItem | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [showQRModal, setShowQRModal] = useState(false);
  const [copiedHandle, setCopiedHandle] = useState(false);

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleSave = (postId: string) => {
    setSavedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCopyHandle = () => {
    navigator.clipboard.writeText('@drinkbooost');
    setCopiedHandle(true);
    setTimeout(() => setCopiedHandle(false), 2000);
  };

  const handleQuickOrder = (shakeId: string) => {
    const found = MENU_ITEMS.find(i => i.id === shakeId) || MENU_ITEMS[0];
    onSelectItemForOrder(found, '16oz', true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Instagram Official Profile Card */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Background Subtle Gradient Accent */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-pink-100 via-rose-50 to-amber-50 rounded-full blur-3xl opacity-70 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          {/* Avatar with Instagram Gradient Ring */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] shadow-md flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#072418] border-2 border-white flex flex-col items-center justify-center text-white">
                <span className="font-black text-2xl font-['Outfit'] tracking-tight text-[#cbf738]">
                  BOOOST
                </span>
                <span className="text-[9px] uppercase tracking-widest font-bold text-stone-300 -mt-1">
                  OFFICIAL
                </span>
              </div>
            </div>
            <span className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-1 shadow-sm border-2 border-white">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </span>
          </div>

          {/* Profile Bio & Stats */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center md:justify-start">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-stone-900 font-['Outfit']">
                  drinkbooost
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                  Official Page
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-2">
                <a
                  href="https://www.instagram.com/drinkbooost"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 bg-gradient-to-r from-[#e1306c] to-[#fd1d1d] hover:opacity-95 text-white text-xs font-black rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Follow on Instagram</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>

                <button
                  onClick={() => setShowQRModal(true)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl border border-stone-300 transition flex items-center gap-1"
                >
                  <QrCode className="w-3.5 h-3.5 text-stone-700" />
                  <span className="hidden sm:inline">Scan QR</span>
                </button>

                <button
                  onClick={handleCopyHandle}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl border border-stone-300 transition flex items-center gap-1"
                >
                  {copiedHandle ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-600" />
                      <span className="hidden sm:inline">@drinkbooost</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Counts */}
            <div className="flex justify-center md:justify-start gap-6 text-xs text-stone-700 pt-1">
              <div>
                <span className="font-black text-stone-900 text-sm">248</span> posts
              </div>
              <div>
                <span className="font-black text-stone-900 text-sm">18.4K</span> followers
              </div>
              <div>
                <span className="font-black text-stone-900 text-sm">100%</span> real fruit & protein
              </div>
            </div>

            {/* Bio Text */}
            <div className="text-xs text-stone-600 leading-relaxed max-w-xl">
              <div className="font-bold text-stone-900">Booost™ • Power Your Day The Natural Way</div>
              <div>🌿 Plant-based goodness, whole real fruits & ultra-filtered protein.</div>
              <div>📍 SM City Dasmariñas (Lower Ground) & SM City Trece (Ground Level), Cavite</div>
              <div>🥤 Shakes & Blends: 16oz Non-Protein ₱180 | 22oz Non-Protein ₱220</div>
              <div>🏷️ Tag <span className="font-bold text-emerald-800">#BooostPH</span> in your workout & shake stories to be featured!</div>
            </div>

            {/* Direct Link */}
            <div className="text-xs font-bold text-emerald-800 flex items-center justify-center md:justify-start gap-1">
              <span>🔗</span>
              <a href="mailto:drinkbooost@gmail.com" className="hover:underline">
                drinkbooost@gmail.com • SM Dasmariñas & SM Trece
              </a>
            </div>
          </div>
        </div>

        {/* Story Highlights (Strictly no reviews, only menu, branches, macros) */}
        <div className="mt-8 pt-6 border-t border-stone-200 flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none">
          {[
            { label: 'Top Shakes', emoji: '🥤', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
            { label: 'SM Dasma', emoji: '📍', bg: 'bg-blue-100 text-blue-900 border-blue-300' },
            { label: 'SM Trece', emoji: '📍', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
            { label: 'Kid Friendly', emoji: '👶', bg: 'bg-amber-100 text-amber-900 border-amber-300' },
            { label: 'Nutrition', emoji: '💪', bg: 'bg-teal-100 text-teal-900 border-teal-300' },
            { label: 'Franchise', emoji: '🤝', bg: 'bg-stone-100 text-stone-900 border-stone-300' },
          ].map((story, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer">
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-stone-300 to-stone-400 group-hover:from-[#f09433] group-hover:to-[#bc1888] transition-all">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white flex items-center justify-center text-xl sm:text-2xl shadow-xs ${story.bg}`}>
                  {story.emoji}
                </div>
              </div>
              <span className="text-[11px] font-bold text-stone-700 whitespace-nowrap">
                {story.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Instagram Feed Grid Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-stone-900 font-['Outfit'] flex items-center gap-2">
            <Instagram className="w-5 h-5 text-[#e1306c]" />
            <span>Official Instagram Feed (@drinkbooost)</span>
          </h2>
          <p className="text-xs text-stone-500">
            Latest posts, workout pairings, and drink features from our Cavite community.
          </p>
        </div>

        <a
          href="https://www.instagram.com/drinkbooost"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 hover:underline"
        >
          <span>View on Instagram</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Instagram Feed 3-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {INSTAGRAM_POSTS.map((post) => {
          const isLiked = likedPosts[post.id];
          const isSaved = savedPosts[post.id];

          return (
            <div
              key={post.id}
              className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              {/* Post Header */}
              <div className="p-3.5 flex items-center justify-between border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#072418] flex items-center justify-center text-white font-black text-[10px] font-['Outfit']">
                    B
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 flex items-center gap-1">
                      <span>drinkbooost</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#84cc16]" />
                    </div>
                    <div className="text-[10px] text-stone-500 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-stone-400" />
                      <span>{post.location}</span>
                    </div>
                  </div>
                </div>

                <a
                  href="https://www.instagram.com/drinkbooost"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-stone-700"
                >
                  <Instagram className="w-4 h-4 text-[#e1306c]" />
                </a>
              </div>

              {/* Graphic Post Image / Card */}
              <div 
                onClick={() => setSelectedPost(post)}
                className={`h-64 sm:h-72 bg-gradient-to-b ${post.gradientBg} p-6 flex flex-col justify-between text-white relative cursor-pointer group overflow-hidden`}
              >
                {/* Decorative Pattern / Glow */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#cbf738]/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />

                {/* Top Badge */}
                <div className="flex justify-between items-start relative z-10">
                  <span className="text-[11px] font-black bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white border border-white/20">
                    {post.cupBadge}
                  </span>
                  <span className="text-[11px] font-mono text-stone-300 bg-black/40 px-2 py-0.5 rounded-md">
                    #BooostPH
                  </span>
                </div>

                {/* Center Feature Display */}
                <div className="relative z-10 text-center space-y-2">
                  <div className="text-4xl drop-shadow-md">🥤</div>
                  <h3 className="text-2xl font-black font-['Outfit'] text-white drop-shadow-md">
                    {post.shakeName}
                  </h3>
                  <div className="text-xs text-[#cbf738] font-bold">
                    Tap to view post details & order
                  </div>
                </div>

                {/* Bottom Bar on image */}
                <div className="flex items-center justify-between relative z-10 text-[11px] text-stone-300">
                  <span>@drinkbooost</span>
                  <span className="text-xs bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-lg font-bold text-white group-hover:bg-[#cbf738] group-hover:text-[#051811] transition">
                    View Post
                  </span>
                </div>
              </div>

              {/* Post Actions (Like, Comment, Share, Save) */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-stone-700">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`transition ${isLiked ? 'text-rose-600 scale-110' : 'hover:text-stone-900'}`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-600' : ''}`} />
                    </button>
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="hover:text-stone-900"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://www.instagram.com/drinkbooost`);
                        alert('Instagram profile link copied to clipboard!');
                      }}
                      className="hover:text-stone-900"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={() => toggleSave(post.id)}
                    className={`transition ${isSaved ? 'text-amber-600' : 'hover:text-stone-900'}`}
                  >
                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-600' : ''}`} />
                  </button>
                </div>

                {/* Likes Count */}
                <div className="text-xs font-black text-stone-900">
                  {(post.likes + (isLiked ? 1 : 0)).toLocaleString()} likes
                </div>

                {/* Caption snippet */}
                <p className="text-xs text-stone-700 leading-relaxed">
                  <span className="font-black text-stone-900 mr-1.5">drinkbooost</span>
                  {post.caption}
                </p>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-1 text-[11px] font-semibold text-emerald-800">
                  {post.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx}>{tag}</span>
                  ))}
                </div>

                <div className="text-[10px] text-stone-400 uppercase font-medium">
                  {post.timeAgo}
                </div>

                {/* Direct Order Button */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleQuickOrder(post.shakeId)}
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Order {post.shakeName.split(' ')[0]} Now</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Instagram In-Store Counter Standee Card (Recreating the Official Physical Kiosk Display) */}
      <div className="bg-gradient-to-br from-[#062417] via-[#0a3522] to-[#04190f] border-2 border-emerald-600/70 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#cbf738]/20 border border-[#cbf738]/40 text-[#cbf738] text-xs font-black uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5" />
              Counter QR Standee • Tag & Get Featured
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
              Connect With Us On Instagram
            </h3>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              Show your post-workout shake selfies or daily gym routine! Tag <span className="text-[#cbf738] font-bold">@drinkbooost</span> and use hashtag <span className="text-[#cbf738] font-bold">#BooostPH</span> in your Instagram Stories. Our baristas at SM Dasmariñas & SM Trece will repost your stories!
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="https://www.instagram.com/drinkbooost"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#cbf738] hover:bg-[#b5e028] text-[#051811] text-xs font-black rounded-xl shadow-lg transition flex items-center gap-2"
              >
                <Instagram className="w-4 h-4 text-[#051811]" />
                <span>Open @drinkbooost on Instagram</span>
              </a>
              <button
                onClick={() => setShowQRModal(true)}
                className="px-4 py-2.5 bg-emerald-900/70 hover:bg-emerald-800 text-stone-200 text-xs font-bold rounded-xl border border-emerald-700/60 transition flex items-center gap-2"
              >
                <QrCode className="w-4 h-4 text-[#cbf738]" />
                <span>Enlarge Counter QR Code</span>
              </button>
            </div>
          </div>

          {/* QR Code Standee Preview */}
          <div className="bg-white p-5 rounded-2xl text-center text-stone-900 border-4 border-stone-200 shadow-xl max-w-xs mx-auto w-full">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <Instagram className="w-4 h-4 text-[#e1306c]" />
              <span className="font-black text-xs text-stone-900 font-['Outfit']">FOLLOW US ON IG</span>
            </div>
            {/* High res stylized Instagram QR code */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 mb-2">
              <svg className="w-36 h-36 mx-auto" viewBox="0 0 100 100" fill="currentColor">
                {/* 3 Corner Markers */}
                <rect x="5" y="5" width="26" height="26" fill="#0e4a30" rx="3" />
                <rect x="9" y="9" width="18" height="18" fill="#fff" rx="2" />
                <rect x="13" y="13" width="10" height="10" fill="#e1306c" rx="1.5" />

                <rect x="69" y="5" width="26" height="26" fill="#0e4a30" rx="3" />
                <rect x="73" y="9" width="18" height="18" fill="#fff" rx="2" />
                <rect x="77" y="13" width="10" height="10" fill="#e1306c" rx="1.5" />

                <rect x="5" y="69" width="26" height="26" fill="#0e4a30" rx="3" />
                <rect x="9" y="73" width="18" height="18" fill="#fff" rx="2" />
                <rect x="13" y="77" width="10" height="10" fill="#e1306c" rx="1.5" />

                {/* QR Data Grid */}
                <rect x="36" y="8" width="6" height="6" fill="#0e4a30" />
                <rect x="46" y="8" width="8" height="6" fill="#0e4a30" />
                <rect x="36" y="20" width="12" height="6" fill="#0e4a30" />
                <rect x="54" y="20" width="8" height="8" fill="#0e4a30" />
                <rect x="36" y="36" width="28" height="28" fill="#0e4a30" rx="4" />
                {/* Center Instagram camera glyph */}
                <rect x="42" y="42" width="16" height="16" fill="#fff" rx="3" />
                <circle cx="50" cy="50" r="4" fill="#e1306c" />
                <circle cx="54" cy="46" r="1" fill="#e1306c" />

                <rect x="12" y="38" width="14" height="6" fill="#0e4a30" />
                <rect x="12" y="48" width="8" height="14" fill="#0e4a30" />
                <rect x="68" y="38" width="8" height="14" fill="#0e4a30" />
                <rect x="80" y="42" width="12" height="6" fill="#0e4a30" />
                <rect x="36" y="72" width="14" height="8" fill="#0e4a30" />
                <rect x="56" y="72" width="10" height="14" fill="#0e4a30" />
                <rect x="72" y="72" width="20" height="8" fill="#0e4a30" />
                <rect x="72" y="84" width="12" height="8" fill="#0e4a30" />
              </svg>
            </div>
            <div className="font-mono text-xs font-black text-stone-900 tracking-wider">
              @drinkbooost
            </div>
            <div className="text-[10px] text-stone-500">
              SM Dasmariñas & SM Trece
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Scannable Fullscreen Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-stone-300 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative animate-in zoom-in-95">
            <div className="space-y-1">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center text-white mx-auto shadow-md">
                <Instagram className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black text-stone-900 font-['Outfit']">Scan on Instagram</h4>
              <p className="text-xs text-stone-600">
                Open Instagram camera or QR scanner to open <span className="font-bold text-stone-900">@drinkbooost</span>
              </p>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <svg className="w-48 h-48 mx-auto" viewBox="0 0 100 100" fill="currentColor">
                <rect x="5" y="5" width="26" height="26" fill="#0e4a30" rx="3" />
                <rect x="9" y="9" width="18" height="18" fill="#fff" rx="2" />
                <rect x="13" y="13" width="10" height="10" fill="#e1306c" rx="1.5" />

                <rect x="69" y="5" width="26" height="26" fill="#0e4a30" rx="3" />
                <rect x="73" y="9" width="18" height="18" fill="#fff" rx="2" />
                <rect x="77" y="13" width="10" height="10" fill="#e1306c" rx="1.5" />

                <rect x="5" y="69" width="26" height="26" fill="#0e4a30" rx="3" />
                <rect x="9" y="73" width="18" height="18" fill="#fff" rx="2" />
                <rect x="13" y="77" width="10" height="10" fill="#e1306c" rx="1.5" />

                <rect x="36" y="8" width="6" height="6" fill="#0e4a30" />
                <rect x="46" y="8" width="8" height="6" fill="#0e4a30" />
                <rect x="36" y="20" width="12" height="6" fill="#0e4a30" />
                <rect x="54" y="20" width="8" height="8" fill="#0e4a30" />
                <rect x="36" y="36" width="28" height="28" fill="#0e4a30" rx="4" />
                <rect x="42" y="42" width="16" height="16" fill="#fff" rx="3" />
                <circle cx="50" cy="50" r="4" fill="#e1306c" />
                <circle cx="54" cy="46" r="1" fill="#e1306c" />

                <rect x="12" y="38" width="14" height="6" fill="#0e4a30" />
                <rect x="12" y="48" width="8" height="14" fill="#0e4a30" />
                <rect x="68" y="38" width="8" height="14" fill="#0e4a30" />
                <rect x="80" y="42" width="12" height="6" fill="#0e4a30" />
                <rect x="36" y="72" width="14" height="8" fill="#0e4a30" />
                <rect x="56" y="72" width="10" height="14" fill="#0e4a30" />
                <rect x="72" y="72" width="20" height="8" fill="#0e4a30" />
                <rect x="72" y="84" width="12" height="8" fill="#0e4a30" />
              </svg>
            </div>

            <div className="font-mono text-sm font-black text-stone-800">
              instagram.com/drinkbooost
            </div>

            <div className="flex gap-2">
              <a
                href="https://www.instagram.com/drinkbooost"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-gradient-to-r from-[#e1306c] to-[#fd1d1d] hover:opacity-90 text-white text-xs font-black rounded-xl shadow-sm transition"
              >
                Open in App
              </a>
              <button
                onClick={() => setShowQRModal(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl border border-stone-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Detailed Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-stone-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#072418] flex items-center justify-center text-white font-black text-xs font-['Outfit']">
                  B
                </div>
                <div>
                  <div className="text-xs font-black text-stone-900 flex items-center gap-1">
                    <span>drinkbooost</span>
                    <span className="text-[10px] text-emerald-700 font-bold">• Follow</span>
                  </div>
                  <div className="text-[10px] text-stone-500">{selectedPost.location}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-stone-400 hover:text-stone-800 p-1"
              >
                ✕
              </button>
            </div>

            {/* Post Media Graphic */}
            <div className={`h-64 bg-gradient-to-b ${selectedPost.gradientBg} p-6 flex flex-col justify-between text-white`}>
              <div className="flex justify-between items-start">
                <span className="text-xs font-black bg-black/50 px-3 py-1 rounded-full text-white">
                  {selectedPost.cupBadge}
                </span>
                <span className="text-xs text-stone-300 font-mono">
                  #BooostPH
                </span>
              </div>
              <div className="text-center space-y-2">
                <div className="text-5xl">🥤</div>
                <h3 className="text-2xl font-black font-['Outfit']">{selectedPost.shakeName}</h3>
                <p className="text-xs text-[#cbf738] font-bold">SM City Dasmariñas & SM City Trece</p>
              </div>
              <div className="flex justify-between text-xs text-stone-300">
                <span>Real Fruit Nutrition</span>
                <span>@drinkbooost</span>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-5 space-y-3">
              <p className="text-xs text-stone-700 leading-relaxed">
                <span className="font-black text-stone-900 mr-1.5">drinkbooost</span>
                {selectedPost.caption}
              </p>

              <div className="flex flex-wrap gap-1 text-[11px] font-semibold text-emerald-800">
                {selectedPost.tags.map((t, idx) => (
                  <span key={idx}>{t}</span>
                ))}
              </div>

              <div className="text-[10px] text-stone-400 uppercase font-medium">
                {selectedPost.timeAgo}
              </div>

              <div className="pt-3 border-t border-stone-200 flex gap-3">
                <a
                  href="https://www.instagram.com/drinkbooost"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl border border-stone-300 transition flex items-center justify-center gap-1.5"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#e1306c]" />
                  <span>View on Instagram</span>
                </a>
                <button
                  onClick={() => {
                    handleQuickOrder(selectedPost.shakeId);
                    setSelectedPost(null);
                  }}
                  className="flex-1 py-2.5 bg-[#0e4a30] hover:bg-[#12593a] text-white text-xs font-black rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#cbf738]" />
                  <span>Order This Drink</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
