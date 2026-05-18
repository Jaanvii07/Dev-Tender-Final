import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-white/10 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            DevTender
          </span>
          <p className="text-gray-400 text-sm ml-2">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-gray-400">
          <span>Made with</span>
          <Heart size={14} className="text-pink-500 fill-pink-500 mx-1 animate-pulse" />
          <span>for developers</span>
        </div>
        
        <div className="flex items-center gap-4 text-gray-400">
          <a href="#" className="hover:text-purple-400 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-purple-400 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-purple-400 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;