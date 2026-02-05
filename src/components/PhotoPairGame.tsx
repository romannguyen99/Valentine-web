"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

// 18 images
const imagesList = [
"/game-photos/1.jpeg",
"/game-photos/3.jpeg",
"/game-photos/2.jpeg",
"/game-photos/6.jpeg",
"/game-photos/7.jpeg",
"/game-photos/8.jpeg",
"/game-photos/10.jpeg",
"/game-photos/12.jpeg",
"/game-photos/14.jpeg",
"/game-photos/15.jpeg",
"/game-photos/17.jpeg",
"/game-photos/19.jpeg",
"/game-photos/20.jpeg",
"/game-photos/21.jpeg",
"/game-photos/23.jpeg",
"/game-photos/24.jpeg",
"/game-photos/25.jpeg",
"/game-photos/18.jpeg",
];

// Create 18 pairs of images (36 images in total)
const imagePairs = imagesList.flatMap((image) => [image, image]);

const shuffleArray = (array: string[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const heartLayout = [
  [null, null, 0, 1, null, 2, 3, null, null],
  [null, 4, 5, 6, 7, 8, 9, 10, null],
  [11, 12, 13, 14, 15, 16, 17, 18, 19],
  [null, 20, 21, 22, 23, 24, 25, 26, null],
  [null, null, 27, 28, 29, 30, 31, null, null],
  [null, null, null, 32, 33, 34, null, null, null],
  [null, null, null, null, 35, null, null, null, null],
];

type ValentinesProposalProps = {
  handleShowProposal: () => void;
};

export default function PhotoPairGame({
  handleShowProposal,
}: ValentinesProposalProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [gameImages] = useState(() => shuffleArray(imagePairs));

  const handleClick = (index: number) => {
    if (isChecking || selected.includes(index) || matched.includes(index))
      return;

    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setIsChecking(true);
      const firstIndex = newSelected[0];
      const secondIndex = newSelected[1];

      if (gameImages[firstIndex] === gameImages[secondIndex]) {
        setMatched((prev) => [...prev, firstIndex, secondIndex]);
        setSelected([]);
        setIsChecking(false);
      } else {
        setTimeout(() => {
          setSelected([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matched.length === imagePairs.length && matched.length > 0) {
      setTimeout(handleShowProposal, 500);
    }
  }, [matched, handleShowProposal]);

  return (
    <div className="grid grid-cols-9 gap-1 lg:gap-2 max-w-[95vw] mx-auto place-items-center">
      {heartLayout.flat().map((index, i) => {
        if (index === null) {
          return <div key={i} className="w-[11vh] h-[11vh] lg:w-20 lg:h-20" />;
        }

        const isFlipped = selected.includes(index) || matched.includes(index);

        return (
          <div
            key={i}
            className="w-[11vh] h-[11vh] lg:w-20 lg:h-20 relative cursor-pointer group"
            onClick={() => handleClick(index)}
            style={{ perspective: "1000px" }}
          >
            <motion.div
              className="w-full h-full relative"
              initial={false}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{
                duration: 0.6,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front of Card (The Image) - Hidden until flipped */}
              <div
                className="absolute w-full h-full rounded-sm lg:rounded-md overflow-hidden border-2 border-pink-300 bg-white"
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                <Image
                  src={gameImages[index]}
                  alt={`Memory Card ${index}`}
                  fill
                  sizes="(max-width: 768px) 11vh, 80px"
                  className="object-cover"
                  priority={true} // Ensures image loads immediately
                />
              </div>

              {/* Back of Card (The Gray Cover) */}
              <div
                className="absolute w-full h-full bg-gray-300 rounded-sm lg:rounded-md shadow-sm hover:bg-gray-400 transition-colors"
                style={{ backfaceVisibility: "hidden" }}
              />
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}