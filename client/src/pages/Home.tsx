import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
    Calendar,
    Shield,
    Clock,
    CreditCard,
    Search,
    Video,
    Star,
    ArrowRight,
    Stethoscope,
    Heart,
    Brain,
    Eye,
    Bone
} from 'lucide-react';
import { Banner, Doc1, Doc2, Doc3, Doc4 } from '../assets/index'
import { Button } from '../components/ui/button';
import Footer from '@/components/user/Footer';

interface AnimatedSectionProps {
    children: React.ReactNode;
    index: number;
    className?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, index, className = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-20%' });
    const [hasBeenInView, setHasBeenInView] = useState(false);



    useEffect(() => {
        if (isInView && !hasBeenInView) {
            setHasBeenInView(true);
        }
    }, [isInView, hasBeenInView]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={hasBeenInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

const HomePage = () => {
    const features = [
        {
            icon: Calendar,
            title: "Easy Booking",
            description: "Book appointments with your preferred doctors in just a few clicks"
        },
        {
            icon: Shield,
            title: "Certified Doctors",
            description: "All our doctors are verified and certified medical professionals"
        },
        {
            icon: Clock,
            title: "24/7 Availability",
            description: "Emergency consultations and support available round the clock"
        },
        {
            icon: CreditCard,
            title: "Secure Payments",
            description: "Safe and encrypted payment gateway for all transactions"
        }
    ];

    const howItWorks = [
        {
            title: "Search Doctor",
            description: "Browse through our extensive list of qualified doctors by specialty, location, or availability",
            icon: Search
        },
        {
            title: "Book Appointment",
            description: "Select your preferred time slot and book an appointment instantly with confirmation",
            icon: Calendar
        },
        {
            title: "Consult Online",
            description: "Join the video consultation at your scheduled time from anywhere, anytime",
            icon: Video
        }
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Patient",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
            rating: 5,
            review: "BookMyDoc made it so easy to find and consult with a specialist. The online consultation was smooth and professional."
        },
        {
            name: "Michael Chen",
            role: "Patient",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
            rating: 5,
            review: "Amazing platform! Got an appointment with a cardiologist within hours. Highly recommend for urgent medical needs."
        },
        {
            name: "Emily Davis",
            role: "Patient",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
            rating: 5,
            review: "The doctors are very professional and the video quality is excellent. It's like having a clinic visit from home."
        }
    ];

    const topDoctors = [
        {
            name: "Dr. James Wilson",
            specialty: "Cardiologist",
            experience: "15+ years",
            rating: 4.9,
            image: Doc1,
            icon: Heart,
            consultations: "500+"
        },
        {
            name: "Dr. Sarah Martinez",
            specialty: "Neurologist",
            experience: "12+ years",
            rating: 4.8,
            image: Doc2,
            icon: Brain,
            consultations: "400+"
        },
        {
            name: "Dr. David Kim",
            specialty: "Ophthalmologist",
            experience: "10+ years",
            rating: 4.9,
            image: Doc3,
            icon: Eye,
            consultations: "350+"
        },
        {
            name: "Dr. Lisa Thompson",
            specialty: "Orthopedic Surgeon",
            experience: "18+ years",
            rating: 4.9,
            image: Doc4,
            icon: Bone,
            consultations: "600+"
        }
    ];

    return (
        <div className="bg-background transition-colors duration-300">

            {/* Hero Section - No animation needed */}
            <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                                Your Health,
                                <span className="text-primary"> Our Priority</span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                Connect with certified doctors instantly. Book appointments, get consultations,
                                and manage your health from the comfort of your home.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" className="text-lg px-8 py-4">
                                    Book Appointment
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                                    Learn More
                                </Button>
                            </div>
                            <div className="mt-12 flex items-center space-x-8">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">500+</div>
                                    <div className="text-sm text-muted-foreground">Doctors</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">10K+</div>
                                    <div className="text-sm text-muted-foreground">Patients</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">98%</div>
                                    <div className="text-sm text-muted-foreground">Satisfaction</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative z-10">
                                <img
                                    src={Banner}
                                    alt="Doctor consultation"
                                    className="rounded-2xl shadow-2xl"
                                />
                            </div>
                            <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-blue-200/20 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <AnimatedSection index={1}>
                <section className="py-20 bg-primary/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Why Choose BookMyDoc?
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                We provide the most convenient and secure platform for all your healthcare needs
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className="bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-muted"
                                    >
                                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                            <Icon className="w-8 h-8 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-foreground mb-4">
                                            {feature.title}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            {/* How It Works Section */}
            <AnimatedSection index={2}>
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                How It Works
                            </h2>
                            <p className="text-xl text-muted-foreground">
                                Get started in just 3 simple steps
                            </p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {howItWorks.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <div key={index} className="relative">
                                        <div className="text-center">
                                            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6">
                                                <Icon className="w-10 h-10 text-white" />
                                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-dark rounded-full flex items-center justify-center">
                                                </div>
                                            </div>
                                            <h3 className="text-2xl font-semibold text-foreground mb-4">
                                                {step.title}
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                        {index < howItWorks.length - 1 && (
                                            <div className="hidden lg:block absolute top-10 left-50 w-full">
                                                <ArrowRight className="w-8 h-8 text-foreground mx-auto" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            {/* Testimonials Section */}
            <AnimatedSection index={3}>
                <section className="py-20 bg-primary/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                What Our Patients Say
                            </h2>
                            <p className="text-xl text-muted-foreground">
                                Real experiences from real people
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="bg-card p-8 rounded-2xl shadow-lg border border-muted hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex items-center mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground mb-6 italic leading-relaxed">
                                        "{testimonial.review}"
                                    </p>
                                    <div className="flex items-center">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full object-cover mr-4"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-foreground">
                                                {testimonial.name}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            {/* Top Doctors Section */}
            <AnimatedSection index={4}>
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Meet Our Top Doctors
                            </h2>
                            <p className="text-xl text-muted-foreground">
                                Experienced professionals ready to help you
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {topDoctors.map((doctor, index) => {
                                const SpecialtyIcon = doctor.icon;
                                return (
                                    <div
                                        key={index}
                                        className="bg-card p-6 rounded-2xl shadow-lg border border-muted hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
                                    >
                                        <div className="relative mb-6">
                                            <img
                                                src={doctor.image}
                                                alt={doctor.name}
                                                className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                                            />
                                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                                <SpecialtyIcon className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-semibold text-foreground mb-2">
                                            {doctor.name}
                                        </h3>
                                        <p className="text-primary font-medium mb-2">{doctor.specialty}</p>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {doctor.experience} Experience
                                        </p>
                                        <div className="flex items-center justify-center space-x-4 mb-4">
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 text-primary fill-current mr-1" />
                                                <span className="text-sm font-medium text-foreground">
                                                    {doctor.rating}
                                                </span>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {doctor.consultations} consultations
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="w-full">
                                            Book Appointment
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            {/* Final CTA Section */}
            <AnimatedSection index={5}>
                <section className="py-20 bg-primary">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <Stethoscope className="w-16 h-16 text-white mx-auto mb-8" />
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Ready to Take Control of Your Health?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                            Join thousands of satisfied patients who trust BookMyDoc for their healthcare needs.
                            Get started today and experience the future of healthcare.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                variant="secondary"
                                className="text-lg px-8 py-4"
                            >
                                Get Started Now
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="secondary"
                                className="text-lg px-8 py-4"
                            >
                                Download App
                            </Button>
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            <Footer />
        </div>
    );
};

export default HomePage;