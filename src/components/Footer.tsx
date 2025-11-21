import {
  Github,
  Instagram,
  Linkedin,
  Mail,
  Heart,
  Code,
  ExternalLink,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-slate-900 dark:bg-slate-950 text-white border-t border-slate-800 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Left Section - Institution Info */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold font-poppins mb-3 text-white">
              Mangalam College of Engineering, Ettumanoor
            </h3>
            <p className="text-gray-400 text-sm font-inter leading-relaxed">
              APJ Abdul Kalam Technological University
              <br />
              Department of Computer Science & Engineering
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-slate-800 dark:bg-slate-900 text-gray-300 text-xs font-medium">
                NAAC Accredited
              </span>
              <span className="px-3 py-1 bg-slate-800 dark:bg-slate-900 text-gray-300 text-xs font-medium">
                AICTE Approved
              </span>
            </div>
          </div>

          {/* Center Section - Quick Links */}
          <div className="text-center">
            <h3 className="text-lg font-semibold font-poppins mb-3 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm font-inter">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200 inline-flex items-center gap-1"
                >
                  <span>Results Dashboard</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200 inline-flex items-center gap-1"
                >
                  <span>Upload Results</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200 inline-flex items-center gap-1"
                >
                  <span>Analytics</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Right Section - Developer Info */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold font-poppins mb-1 text-white">
              Connect
            </h3>
            <p className="text-gray-400 text-sm font-inter mb-2">
              Follow the developer
            </p>
            
            <div className="flex gap-3 justify-center md:justify-end">
              <a
                href="https://www.instagram.com/devaduthhhh"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 dark:bg-slate-900 p-2.5 hover:bg-slate-700 dark:hover:bg-slate-800 transition-colors duration-200"
              >
                <Instagram className="w-5 h-5 text-gray-300" />
              </a>
              <a
                href="https://www.linkedin.com/in/kmdevaduth/"
                className="bg-slate-800 dark:bg-slate-900 p-2.5 hover:bg-slate-700 dark:hover:bg-slate-800 transition-colors duration-200"
              >
                <Linkedin className="w-5 h-5 text-gray-300" />
              </a>
              <a
                href="https://github.com/Devaduth"
                className="bg-slate-800 dark:bg-slate-900 p-2.5 hover:bg-slate-700 dark:hover:bg-slate-800 transition-colors duration-200"
              >
                <Github className="w-5 h-5 text-gray-300" />
              </a>
              <a
                href="mailto:devaduth@example.com"
                className="bg-slate-800 dark:bg-slate-900 p-2.5 hover:bg-slate-700 dark:hover:bg-slate-800 transition-colors duration-200"
              >
                <Mail className="w-5 h-5 text-gray-300" />
              </a>
            </div>
            <span className="text-gray-400 font-inter">Made by </span>
            <a
              href="https://www.instagram.com/devaduthhhh"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold font-poppins text-white hover:text-gray-300 transition-colors duration-200 inline-flex items-center gap-1"
            >
              Devaduth
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 dark:border-slate-900 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-400 font-inter">
              © 2025{" "}
              <span className="text-white font-medium">
                Mangalam College of Engineering
              </span>{" "}
              - All rights reserved
            </p>
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <Code className="w-4 h-4" />
            <span className="text-xs font-inter">
              Built with React & TypeScript
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
