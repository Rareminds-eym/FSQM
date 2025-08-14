import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github, LucideIcon } from 'lucide-react';

interface SocialMediaIconsProps {
  className?: string;
}

interface SocialLinkIcon {
  type: 'icon';
  icon: LucideIcon;
  href: string;
  label: string;
  color: string;
}

interface SocialLinkImage {
  type: 'image';
  src: string;
  href: string;
  label: string;
  color: string;
}

type SocialLink = SocialLinkIcon | SocialLinkImage;

const SocialMediaIcons: React.FC<SocialMediaIconsProps> = ({ className = '' }) => {
  const socialLinks: SocialLink[] = [
    {
      type: 'image',
      src: '/images/bulb.png',
      href: 'https://rareminds.in/',
      label: 'Bulb Logo',
      color: 'hover:opacity-80'
    },
    {
      type: 'icon',
      icon: Facebook,
      href: 'https://www.facebook.com/people/RaremindsStudents/61576552526095/',
      label: 'Facebook',
      color: 'hover:text-blue-600'
    },
    {
      type: 'icon',
      icon: Instagram,
      href: 'https://www.instagram.com/rareminds_eym/?hl=en',
      label: 'Instagram',
      color: 'hover:text-pink-500'
    },
    {
      type: 'icon',
      icon: Linkedin,
      href: 'https://www.linkedin.com/company/rareminds/',
      label: 'LinkedIn',
      color: 'hover:text-blue-700'
    },
  ];

  return (
    <>
      {/* Desktop - Left side vertical icons */}
      <div className={`hidden  lg:flex fixed left-4 top-1/2 transform -translate-y-1/2 z-40 flex-col space-y-4 ${className}`}>
        {socialLinks.map((social, index) => {
          return (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className={`
                p-2 bg-white/60 backdrop-blur-sm rounded-xl 
                text-black/70 ${social.color} 
                transition-all duration-300 ease-in-out
                hover:bg-white/20 hover:scale-105hover:shadow-lg
                border-2 border-yellow-500 hover:border-white/40
              `}
            >
              {social.type === 'icon' && social.icon ? (
                <social.icon size={25} />
              ) : (
                <img 
                  src={social.src} 
                  alt={social.label}
                  className="w-[25px] h-[25px] object-contain"
                />
              )}
            </a>
          );
        })}
      </div>

      {/* Mobile - Bottom center horizontal icons */}
      <div className={`lg:hidden fixed bottom-16 left-1/2 transform -translate-x-1/2 z-[9999] flex space-x-3 ${className}`}>
        {socialLinks.map((social, index) => {
          return (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className={`
                p-3 ${social.type === 'image' ? 'bg-white/60' : 'bg-white/60'} backdrop-blur-sm rounded-xl
                text-black
                transition-all duration-300 ease-in-out
                hover:bg-white/20 hover:scale-110 hover:shadow-lg
                border-2 border-white shadow-xl
                min-w-[40px] min-h-[40px] flex items-center justify-center
              `}
            >
              {social.type === 'icon' && social.icon ? (
                <social.icon size={25} />
              ) : (
                <img 
                  src={social.src} 
                  alt={social.label}
                  className="w-[25px] h-[25px] object-fill"
                />
              )}
            </a>
          );
        })}
      </div>
    </>
  );
};

export default SocialMediaIcons;