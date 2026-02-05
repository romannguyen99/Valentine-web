"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";

// --- Configuration ---
const PHOTO_COUNT = 18; // Number of unique photos
const TOTAL_CARDS = PHOTO_COUNT * 2;

// Generate paths: "/game-photos/1.jpeg" to "/game-photos/18.jpeg"
const SOURCE_IMAGES = Array.from({ length: PHOTO_COUNT }, (_, i) => `/game-photos/${i + 1}.jpeg`);

const heartLayout = [
  [null, null, 0, 1, null, 2, 3, null, null],
  [null, 4, 5, 6, 7, 8, 9, 10, null],
  [11, 12, 13, 14, 15, 16, 17, 18, 19],
  [null, 20, 21, 22, 23, 24, 25, 26, null],
  [null, null, 27, 28, 29, 30, 31, null, null],
  [null, null, null, 32, 33, 34, null, null, null],
  [null, null, null, null, 35, null, null, null, null],
];

// Fisher-Yates Shuffle
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

type ValentinesProposalProps = {
  handleShowProposal: () => void;
};

export default function PhotoPairGame({ handleShowProposal }: ValentinesProposalProps) {
  // --- State ---
  // Create matched pairs (36 images total) and shuffle them once on mount
  const [cards, setCards] = useState<string[]>([]);
  
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
  const [disableBoard, setDisableBoard] = useState(false);

  // Initialize game
  useEffect(() => {
    const pairs = [...SOURCE_IMAGES, ...SOURCE_IMAGES];
    setCards(shuffleArray(pairs));
  }, []);

  // --- Game Logic ---
  
  // 1. Handle Card Click
  const handleCardClick = (index: number) => {
    // Stop if: board is locked, card is already matched, or card is already selected
    if (disableBoard || matchedIndices.includes(index) || selectedIndices.includes(index)) {
      return;
    }

    setSelectedIndices((prev) => [...prev, index]);
  };

  // 2. Check for Matches (Effect listens to selection changes)
  useEffect(() => {
    if (selectedIndices.length === 2) {
      setDisableBoard(true); // Lock board
      
      const [firstIndex, secondIndex] = selectedIndices;

      if (cards[firstIndex] === cards[secondIndex]) {
        // MATCH found
        setMatchedIndices((prev) => [...prev, firstIndex, secondIndex]);
        setSelectedIndices([]);
        setDisableBoard(false);
      } else {
        // NO MATCH - Wait 1 second then flip back
        const timer = setTimeout(() => {
          setSelectedIndices([]);
          setDisableBoard(false);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedIndices, cards]);

  // 3. Check Win Condition
  useEffect(() => {
    if (matchedIndices.length > 0 && matchedIndices.length === TOTAL_CARDS) {
      // Small delay to let the last card flip animation finish before showing proposal
      const winTimer = setTimeout(() => {
        handleShowProposal();
      }, 500);
      return () => clearTimeout(winTimer);
    }
  }, [matchedIndices, handleShowProposal]);

  // --- Render Helpers ---

  // Calculate card state
  const getCardStatus = (index: number) => {
    if (matchedIndices.includes(index)) return "matched";
    if (selectedIndices.includes(index)) return "flipped";
    return "hidden";
  };

  if (cards.length === 0) return null; // Prevent hydration mismatch

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="grid grid-cols-9 gap-1 lg:gap-2 max-w-[95vw] mx-auto place-items-center">
        {heartLayout.flat().map((index, gridId) => {
          // If grid spot is null, render empty space
          if (index === null) {
            return <div key={`spacer-${gridId}`} className="w-[10vh] h-[10vh] lg:w-20 lg:h-20" />;
          }

          const status = getCardStatus(index);
          const isFlipped = status === "flipped" || status === "matched";

          return (
            <div
              key={`card-${index}`}
              className="w-[10vh] h-[10vh] lg:w-20 lg:h-20 relative cursor-pointer perspective-1000"
              onClick={() => handleCardClick(index)}
            >
              <motion.div
                className="w-full h-full relative preserve-3d"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* BACK OF CARD (Cover) */}
                <div
                  className="absolute inset-0 w-full h-full bg-gray-300 rounded-sm lg:rounded-md backface-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                />

                {/* FRONT OF CARD (Image) */}
                <div
                  className="absolute inset-0 w-full h-full rounded-md overflow-hidden backface-hidden"
                  style={{ 
                    backfaceVisibility: "hidden", 
                    transform: "rotateY(180deg)" 
                  }}
                >
                  <Image
                    src={cards[index]}
                    alt="Memory Card"
                    fill
                    sizes="(max-width: 768px) 10vw, 80px"
                    className="object-cover"
                  />
                  {/* Optional: Overlay when matched to dim it slightly */}
                  {status === "matched" && (
                    <div className="absolute inset-0 bg-white/20" />
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}