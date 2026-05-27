"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { announcements } from "@/data/products";

export default function AnnouncementBar() {
  const [closed, setClosed] = useState(false);
  const activeBar = announcements.find((a) => a.active && a.type === "bar");

  if (!activeBar || closed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-ink-950 text-brand-300 text-xs md:text-sm font-medium tracking-wide relative z-50"
      >
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3">
          <span className="uppercase">{activeBar.content}</span>
          <button
            onClick={() => setClosed(true)}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1 hover:text-white transition-colors"
            aria-label="Close announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
