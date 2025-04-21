import React from 'react';
const Footer = () => {
    return (
        <footer className="bg-gray-850 border-t border-slate-700 text-white py-8 px-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Logo / Brand */}
                <div className="text-xl font-semibold">Feedback-App</div>

                <div className="flex gap-6 text-sm">
                    <a href="/" className="hover:underline">Home</a>
                    <a href="/about" className="hover:underline">About</a>
                    <a href="/services" className="hover:underline">Services</a>
                    <a href="/contact" className="hover:underline">Contact</a>
                </div>

                <div className="flex gap-8">
                    <a href="https://x.com/abhi_Nirala01" target="_blank" rel="noopener noreferrer">
                        <svg className="w-8 h-8 fill-current hover:text-blue-400" viewBox="0 0 24 24">
                            <path d="M24 4.56c-.89.39-1.85.65-2.86.77a4.94 4.94 0 0 0 2.17-2.72 9.8 9.8 0 0 1-3.12 1.2 4.92 4.92 0 0 0-8.38 4.49A13.97 13.97 0 0 1 1.67 3.15a4.91 4.91 0 0 0 1.52 6.56A4.9 4.9 0 0 1 .96 9.1v.06a4.92 4.92 0 0 0 3.95 4.82 4.93 4.93 0 0 1-2.21.08 4.93 4.93 0 0 0 4.6 3.42A9.88 9.88 0 0 1 0 19.54 13.94 13.94 0 0 0 7.55 22c9.05 0 14-7.5 14-14v-.64A9.94 9.94 0 0 0 24 4.56z" />
                        </svg>
                    </a>
                    <a href="https://github.com/abhishek-nirala" target="_blank" rel="noopener noreferrer">
                        <svg className="w-8 h-8 fill-current hover:text-gray-400" viewBox="0 0 24 24">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 
      3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 
      0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61 
      -.546-1.385-1.333-1.754-1.333-1.754-1.09-.744.084-.729.084-.729 
      1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998 
      .108-.776.418-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 
      0-1.31.47-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 
      0 0 1.005-.322 3.3 1.23a11.49 11.49 0 0 1 3-.405 
      c1.02.005 2.045.138 3 .405 2.28-1.552 3.285-1.23 
      3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 
      1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 
      5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 
      3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 
      24 12.297c0-6.627-5.373-12-12-12"/>
                        </svg>
                    </a>

                </div>
            </div>

            {/* Bottom text */}
            <div className="text-center text-sm text-gray-400 mt-6">
                © {new Date().getFullYear()} Feedback App. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
