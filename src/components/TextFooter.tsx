import { Playfair_Display } from "next/font/google";
import Link from "next/link";

const playfairDisplay = Playfair_Display({
  display: "swap",
  subsets: ["latin"],
});

export default function TextFooter() {
  return (
    <>
      {/* Left Text */}
      <h1
        className={`absolute left-10 bottom-5 transform -translate-y-1/2 text-4xl lg:text-5xl font-bold leading-tight ${playfairDisplay.className}`}
        style={{ color: "var(--foreground)" }}
      >
        <span style={{ color: "var(--accent-pink)" }}>Chỉ dành cho</span> <br /> Phương Hiền
      </h1>

      {/* Right Text */}
      <h1
        className={`absolute right-10 bottom-5 transform -translate-y-1/2 text-4xl lg:text-5xl font-bold leading-tight text-right ${playfairDisplay.className}`}
        style={{ color: "var(--foreground)" }}
      >
        Giải trò chơi <br /> <span style={{ color: "var(--accent-pink)" }}>sẽ có bất ngờ!</span>
      </h1>
    </>
  );
}
