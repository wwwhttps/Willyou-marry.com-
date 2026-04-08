import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, HeartHandshake, PartyPopper, XCircle } from 'lucide-react';

export default function App() {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [isAccepted, setIsAccepted] = useState(false);
  const [isAngry, setIsAngry] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const [lastDodgeTime, setLastDodgeTime] = useState(0);

  const DODGE_LIMIT = 4;

  useEffect(() => {
    const handleTrigger = (clientX: number, clientY: number) => {
      if (isAngry || isAccepted || !noButtonRef.current) return;

      const buttonRect = noButtonRef.current.getBoundingClientRect();
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;

      const distance = Math.sqrt(
        Math.pow(clientX - buttonCenterX, 2) + 
        Math.pow(clientY - buttonCenterY, 2)
      );

      // Trigger dodge if mouse/touch is within 120px
      if (distance < 120) {
        const now = Date.now();
        if (now - lastDodgeTime > 500) { // 500ms cooldown
          moveNoButton();
          setLastDodgeTime(now);
        }
      }
    };

    const onMouseMove = (e: MouseEvent) => handleTrigger(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleTrigger(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [dodgeCount, isAngry, isAccepted, lastDodgeTime]);

  const moveNoButton = () => {
    if (dodgeCount >= DODGE_LIMIT) {
      setIsAngry(true);
      return;
    }

    if (!containerRef.current || !noButtonRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const buttonRect = noButtonRef.current.getBoundingClientRect();

    // Calculate a random position within the container
    // We want to avoid the very edges
    const padding = 50;
    const maxX = containerRect.width - buttonRect.width - padding * 2;
    const maxY = containerRect.height - buttonRect.height - padding * 2;

    const randomX = Math.random() * maxX - maxX / 2;
    const randomY = Math.random() * maxY - maxY / 2;

    setNoPosition({ x: randomX, y: randomY });
    setDodgeCount(prev => prev + 1);
  };

  const handleYes = () => {
    setIsAccepted(true);
  };

  // Reset if they finally click "No" (if they manage to)
  const handleNo = () => {
    if (isAngry) {
      // If angry, maybe they can finally click it? 
      // But let's just show the angry message.
    }
  };

  if (isAccepted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-rose-100 p-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10, stiffness: 100 }}
          className="bg-white p-12 rounded-3xl shadow-2xl border-4 border-rose-400 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
             {[...Array(20)].map((_, i) => (
               <motion.div
                 key={i}
                 initial={{ y: "100%", x: Math.random() * 100 + "%", opacity: 0 }}
                 animate={{ y: "-100%", opacity: [0, 1, 1, 0] }}
                 transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
                 className="absolute text-rose-400"
               >
                 <Heart size={20 + Math.random() * 20} fill="currentColor" />
               </motion.div>
             ))}
          </div>
          
          <h1 className="text-5xl md:text-7xl handwriting text-rose-600 mb-6">Yay! ❤️</h1>
          <p className="text-xl text-rose-800 mb-8 font-semibold">I knew you'd say yes!</p>
          <div className="flex justify-center space-x-4">
            <PartyPopper className="text-rose-500 w-12 h-12 animate-bounce" />
            <HeartHandshake className="text-rose-500 w-12 h-12 animate-pulse" />
            <PartyPopper className="text-rose-500 w-12 h-12 animate-bounce" />
          </div>
          
          <img 
            src="https://picsum.photos/seed/love/400/300" 
            alt="Happy celebration" 
            className="mt-8 rounded-xl shadow-lg mx-auto border-2 border-rose-200"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative flex flex-col items-center justify-center min-h-screen bg-rose-50 p-4 overflow-hidden"
    >
      {/* Background Hearts */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3 + i, repeat: Infinity }}
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%` 
            }}
            className="absolute text-rose-300"
          >
            <Heart size={40 + Math.random() * 60} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!isAngry ? (
          <motion.div
            key="proposal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="z-10 text-center"
          >
            <h1 className="text-4xl md:text-6xl handwriting text-rose-600 mb-12 drop-shadow-sm">
              Will you marry me?
            </h1>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 min-h-[300px] w-full max-w-2xl mx-auto">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleYes}
                className="px-12 py-4 bg-rose-500 text-white rounded-full text-2xl font-bold shadow-xl hover:bg-rose-600 transition-colors cursor-pointer z-20"
              >
                Yes!
              </motion.button>

              <div className="relative">
                <motion.button
                  ref={noButtonRef}
                  animate={{ 
                    x: noPosition.x, 
                    y: noPosition.y,
                    rotate: [0, -10, 10, -10, 0]
                  }}
                  transition={{ 
                    x: { type: "spring", stiffness: 300, damping: 20 },
                    y: { type: "spring", stiffness: 300, damping: 20 },
                    rotate: { duration: 0.2 }
                  }}
                  onClick={handleNo}
                  className="px-10 py-3 bg-white text-rose-500 border-2 border-rose-500 rounded-full text-xl font-semibold shadow-lg cursor-default z-20 pointer-events-auto"
                >
                  No
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="angry"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="z-30 bg-white p-8 rounded-3xl shadow-2xl border-4 border-orange-500 text-center max-w-sm"
          >
            <div className="mb-6 flex justify-center">
              <motion.img
                src="https://media.tenor.com/WXgXHvt4BG0AAAAM/cat-gun.gif"
                alt="Angry Cat GIF"
                referrerPolicy="no-referrer"
                className="w-64 h-64 rounded-2xl border-4 border-orange-500 shadow-2xl object-cover"
                animate={{ 
                  x: [-2, 2, -2],
                  rotate: [-1, 1, -1]
                }}
                transition={{ repeat: Infinity, duration: 0.1 }}
              />
            </div>
            <h2 className="text-3xl font-black text-orange-600 mb-4 uppercase tracking-tighter">
              Stop messing with me!
            </h2>
            <p className="text-gray-600 mb-6">
              You've tried to say "No" {dodgeCount} times already. Just click the "Yes" button, I know you want to! 😤
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsAngry(false);
                setDodgeCount(0);
                setNoPosition({ x: 0, y: 0 });
              }}
              className="px-6 py-2 bg-orange-100 text-orange-700 rounded-lg font-bold hover:bg-orange-200 transition-colors"
            >
              Okay, fine... let me try again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      {!isAngry && dodgeCount > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-8 text-rose-300 font-mono text-sm"
        >
          Dodges: {dodgeCount} / {DODGE_LIMIT}
        </motion.div>
      )}
    </div>
  );
}
