"use client";

import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { CloseIcon } from "./Icons";

interface RulesOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  rules: string;
  title: string;
}

export default function RulesOverlay({
  isOpen,
  onClose,
  rules,
  title,
}: RulesOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-plum-900 rounded-t-3xl max-h-[80vh] overflow-y-auto border-t border-plum-700/30"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-8 h-1 rounded-full bg-plum-700" />
            </div>
            <div className="sticky top-0 bg-plum-900 px-6 pt-2 pb-3 flex items-center justify-between border-b border-plum-800/50">
              <h2 className="text-base font-bold text-white">
                How to Play: {title}
              </h2>
              <button
                onClick={onClose}
                className="text-plum-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-plum-800 transition-colors"
              >
                <CloseIcon size={18} />
              </button>
            </div>
            <div className="px-6 py-4 prose prose-invert prose-sm max-w-none prose-headings:text-coral-400 prose-strong:text-white prose-li:text-plum-200">
              <ReactMarkdown>{rules}</ReactMarkdown>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
