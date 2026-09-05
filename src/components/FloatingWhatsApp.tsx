import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import vartimaxLogo from '../assets/images/vartimax_logo_icon_1788593875243.jpg';

export const FloatingWhatsApp: React.FC = () => {
  const [showBubble, setShowBubble] = useState(false);
  const whatsappNumber = '923401207525';
  const prefilledMessage = encodeURIComponent(
    'Hello VartiMax Consultant, I want to inquire about visa services.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${prefilledMessage}`;

  useEffect(() => {
    // Show polite notification popup bubble after 4 seconds
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
      {/* Speech Bubble Preview */}
      {showBubble && (
        <div className="bg-[#07244A] rounded-2xl p-4 shadow-2xl border border-[#15488A] max-w-xs animate-in fade-in slide-in-from-bottom-3 duration-300 relative text-[#E5E5E5]">
          <button
            onClick={() => setShowBubble(false)}
            className="absolute top-2 right-2 text-[#93C5FD] hover:text-white p-1 cursor-pointer"
            aria-label="Close message"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-start gap-3">
            <div className="relative w-10 h-10 rounded-full bg-white p-0.5 flex items-center justify-center shrink-0 shadow-md border-2 border-[#C5A059] overflow-hidden">
              <img
                src={vartimaxLogo}
                alt="VartiMax Consultant Official Logo"
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = '/vartimax-logo.jpg';
                }}
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-bold text-[#C5A059]">VartiMax Visa Support</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-xs text-[#D1D5DB] leading-snug">
                Assalam-o-Alaikum! Looking for Schengen, Canada, USA, or Umrah visa file creation? Chat directly with a senior consultant in Islamabad.
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Start WhatsApp Chat</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact VartiMax Consultant on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-[#092E5E] ring-4 ring-emerald-500/20"
      >
        {/* Pulsing ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-40 animate-ping"></span>

        {/* WhatsApp Icon */}
        <svg
          className="w-8 h-8 fill-current relative z-10"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.031 2C6.512 2 2.016 6.496 2.016 12.016c0 1.93.55 3.738 1.504 5.275L2 22l4.87-1.478a9.96 9.96 0 0 0 5.161 1.494h.005c5.518 0 10.013-4.496 10.013-10.016 0-2.677-1.042-5.193-2.935-7.086A9.95 9.95 0 0 0 12.031 2zm0 18.344h-.004a8.318 8.318 0 0 1-4.24-1.157l-.304-.18-3.15.955.975-3.07-.197-.314a8.307 8.307 0 0 1-1.275-4.562c0-4.6 3.743-8.344 8.348-8.344 2.228 0 4.323.867 5.898 2.443a8.293 8.293 0 0 1 2.442 5.901c0 4.601-3.744 8.345-8.348 8.345zm4.576-6.244c-.25-.125-1.482-.731-1.712-.814-.23-.083-.397-.125-.564.125-.167.25-.647.814-.793.981-.146.167-.292.188-.542.063s-1.055-.389-2.01-1.24c-.742-.662-1.243-1.48-1.389-1.73-.146-.25-.016-.385.109-.51.113-.112.25-.292.375-.438.125-.146.167-.25.25-.417.083-.167.042-.313-.021-.438-.063-.125-.563-1.356-.772-1.856-.203-.487-.41-.421-.563-.429l-.48-.008c-.167 0-.438.063-.667.313-.23.25-.876.855-.876 2.086 0 1.23.897 2.42 1.022 2.587.125.167 1.765 2.695 4.276 3.78 0.597.258 1.064.412 1.428.528.6.191 1.147.164 1.579.1 0.481-.072 1.482-.605 1.69-1.189.209-.584.209-1.085.146-1.189-.062-.104-.229-.167-.479-.292z" />
        </svg>

        {/* Hover Label */}
        <span className="hidden group-hover:block absolute right-16 bg-[#07244A] text-white border border-[#15488A] text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-md">
          Chat +92 340 1207525
        </span>
      </a>
    </div>
  );
};
