import {Logo} from '../../assets/index'
import {
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Heart,
    ArrowUp
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const footerLinks = {
        company: [
            { name: 'About Us', href: '#about' },
            { name: 'Our Services', href: '#services' },
            { name: 'Careers', href: '#careers' },
            { name: 'Contact', href: '#contact' },
        ],
        services: [
            { name: 'Find Doctors', href: '#doctors' },
            { name: 'Book Appointment', href: '#booking' },
            { name: 'Health Checkups', href: '#checkups' },
            { name: 'Lab Tests', href: '#labs' },
        ],
        resources: [
            { name: 'Help Center', href: '#help' },
            { name: 'Patient Guide', href: '#guide' },
            { name: 'Health Blog', href: '#blog' },
            { name: 'FAQs', href: '#faq' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '#privacy' },
            { name: 'Terms of Service', href: '#terms' },
            { name: 'Cookie Policy', href: '#cookies' },
            { name: 'Medical Disclaimer', href: '#disclaimer' },
        ],
    };

    const socialLinks = [
        { name: 'Facebook', icon: Facebook, href: '#facebook', color: 'hover:text-blue-600 dark:hover:text-blue-400' },
        { name: 'Twitter', icon: Twitter, href: '#twitter', color: 'hover:text-sky-500 dark:hover:text-sky-400' },
        { name: 'Instagram', icon: Instagram, href: '#instagram', color: 'hover:text-pink-600 dark:hover:text-pink-400' },
        { name: 'LinkedIn', icon: Linkedin, href: '#linkedin', color: 'hover:text-blue-700 dark:hover:text-blue-500' },
    ];

    return (
        <footer className="bg-background transition-colors duration-300">

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">

                    {/* primary Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <img
                                src={Logo}
                                alt="BookMyDoc Logo"
                                className="w-10 h-10 rounded-lg object-cover"
                            />
                            <span className="text-2xl font-bold text-primary">
                                BookMyDoc
                            </span>
                        </div>
                        <p className="text-muted-foreground mb-6 max-w-sm">
                            Your trusted healthcare platform connecting patients with qualified doctors.
                            Book appointments easily and manage your health with confidence.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-muted-foreground">
                                <Phone className="w-4 h-4 text-primary" />
                                <span className="text-sm">+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3 text-muted-foreground">
                                <Mail className="w-4 h-4 text-primary" />
                                <span className="text-sm">support@bookmydoc.com</span>
                            </div>
                            <div className="flex items-center space-x-3 text-muted-foreground">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="text-sm">123 Healthcare Ave, Medical City, MC 12345</span>
                            </div>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            Company
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            Services
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.services.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            Resources
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            Legal
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter Subscription */}
                <div className="mt-12 pt-8 border-t border-muted-foreground">
                    <div className="max-w-md mx-auto text-center lg:max-w-none lg:text-left lg:flex lg:items-center lg:justify-between">
                        <div className="lg:flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                Stay Updated
                            </h3>
                            <p className="text-muted-foreground text-sm mb-4 lg:mb-0">
                                Get the latest health tips and appointment reminders delivered to your inbox.
                            </p>
                        </div>
                        <div className="lg:flex-shrink-0 lg:ml-8">
                            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                                <Input placeholder='Enter your Email' />
                                <Button>Subscribe</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="bg-gray-50 dark:bg-gray-800 border-t border-muted-foreground/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">

                        {/* Copyright */}
                        <div className="flex items-center space-x-1 text-muted-foreground text-sm mb-4 md:mb-0">
                            <span>© 2025 BookMyDoc. Made with</span>
                            <Heart className="w-4 h-4 text-primary fill-current" />
                            <span>for better healthcare.</span>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        className={`text-muted-foreground ${social.color} transition-colors duration-200`}
                                        aria-label={social.name}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
                        </div>

                        {/* Back to Top */}
                        <button
                            onClick={scrollToTop}
                            className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-200 group"
                            aria-label="Back to top"
                        >
                            <span className="text-sm">Back to top</span>
                            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-200" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;