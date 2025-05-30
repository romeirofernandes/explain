"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { TextHoverEffect } from "../components/TextHoverEffect";
import { UnifiedFeedback } from "unified-sdk";
import "unified-sdk/dist/unified-sdk.css";

export default function Home() {
  const router = useRouter();

  const handleCreateGame = () => {
    router.push("/create");
  };

  const handleJoinGame = () => {
    router.push("/join");
  };

  return (
    <>
      <UnifiedFeedback
        projectId="6836c6c18d303c527d634a92"
        theme="dark"
        firebaseUid="5NSVekbcJTO4tJQKm4AD4CAPvDh2"
      />
      <div className="min-h-screen flex items-center justify-center px-4 pb-16">
        <div className="max-w-4xl w-full flex flex-col items-center">
          {/* Title with hover effect */}
          <div className="h-40 w-full flex items-center justify-center mb-4 sm:mb-6">
            <h1 className="sm:hidden text-6xl font-bold bg-gradient-to-r from-[#03624c] to-[#fefefe] bg-clip-text text-transparent">
              explain.
            </h1>
            <div className="hidden sm:flex h-40 w-full items-center justify-center">
              <TextHoverEffect text="EXPLAIN" />
            </div>
          </div>

          {/* Buttons container */}
          <div className="flex flex-col gap-4 w-60 sm:w-full sm:px-52 sm:flex-row sm:gap-6">
            {/* Create Game Button */}
            <motion.button
              className="flex-1 h-12 rounded-lg py-2 text-base font-medium text-white shadow-md"
              style={{
                background: "linear-gradient(135deg, #03624c 0%, #06302b 100%)",
                border: "1.5px solid rgba(254,254,254,0.08)",
              }}
              onClick={handleCreateGame}
              whileHover={{
                scale: 1.03,
                background: "linear-gradient(135deg, #06302b 0%, #03624c 100%)",
                boxShadow: "0 4px 24px 0 #03624c44",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              Create Game
            </motion.button>

            {/* Join Game Button */}
            <motion.button
              className="flex-1 h-12 rounded-lg text-base py-2 font-medium text-white shadow-md"
              style={{
                background: "linear-gradient(135deg, #03624c 0%, #06302b 100%)",
                border: "1.5px solid rgba(254,254,254,0.08)",
              }}
              onClick={handleJoinGame}
              whileHover={{
                scale: 1.03,
                background: "linear-gradient(135deg, #06302b 0%, #03624c 100%)",
                boxShadow: "0 4px 24px 0 #03624c44",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              Join Game
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}
