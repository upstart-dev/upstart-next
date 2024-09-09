import React from 'react';
import Link from "next/link";
import { FaLinkedin } from 'react-icons/fa';

const socialLinks = [
  { icon: <FaLinkedin className="w-5 h-5" />, href: "https://www.linkedin.com/company/upstart-pt", label: "LinkedIn" },
];

const footerLinks = [
  { text: "Terms of Use", href: "/terms-of-use-main-page", newTab: true },
];

export function Footer() {
  return (
    <footer className="bg-background text-foreground w-full shrink-0 border-t">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">UPSTART</h2>
            <p className="text-sm text-muted-foreground">
              Empowering the next generation of innovators and entrepreneurs. UPSTART is a student&apos;s initiative from University of Porto.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  aria-label={link.label}
                  className="text-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>
          <nav className="md:col-span-2 flex justify-end">
            <ul className="space-y-2">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-sm hover:text-primary transition-colors"
                    target={link.newTab ? "_blank" : undefined}
                    rel={link.newTab ? "noopener noreferrer" : undefined}
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} UPSTART. All rights reserved.</p>
          <p className="text-xs text-muted-foreground mt-4 sm:mt-0">
            Made with ❤️ for innovators worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}