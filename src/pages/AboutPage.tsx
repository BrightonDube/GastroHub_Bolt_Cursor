import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  ChefHat, 
  Users, 
  Globe, 
  Award,
  Heart,
  Lightbulb,
  Shield,
  TrendingUp,
  Star,
  Quote
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

export function AboutPage() {
  const [activeUsers, setActiveUsers] = useState<number | null>(null);

  useEffect(() => {
    async function fetchActiveUsers() {
      const { count, error } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .in('role', ['SUPPLIER', 'BUYER']);
      if (!error && typeof count === 'number') {
        setActiveUsers(count);
      } else {
        setActiveUsers(0);
      }
    }
    fetchActiveUsers();
  }, []);

  const stats = [
    { label: 'Active Users', value: activeUsers !== null ? activeUsers.toLocaleString() : '...', icon: <Users className="w-6 h-6" /> },
    { label: 'Provinces Served', value: '9', icon: <Globe className="w-6 h-6" /> },
    { label: 'Orders Processed', value: '0', icon: <TrendingUp className="w-6 h-6" /> },
    { label: 'Customer Rating', value: '5/5', icon: <Star className="w-6 h-6" /> }
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Quality First',
      description: 'We prioritize quality in every aspect of our platform, from the suppliers we partner with to the technology we build.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Trust & Security',
      description: 'Building trust through transparency, secure transactions, and verified supplier networks.'
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Continuously improving our platform with cutting-edge technology to serve our community better.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community',
      description: 'Fostering a supportive ecosystem where food businesses can thrive and grow together.'
    }
  ];

  const team = [
    {
      name: 'Brighton Dube',
      role: 'CEO & Founder',
      bio: 'Restaurant manager with 15+ years of experience in the South African food industry',
      image: 'https://res.cloudinary.com/dvsbl9nik/image/upload/v1750973046/profile_picture_s1p4k0.jpg'
    },
    
  ];

  const testimonials = [
    {
      quote: "GastroHub has transformed how we source ingredients. The platform is intuitive and the supplier network is exceptional.",
      author: "Octavia Mathebula",
      role: "Executive Chef, La Belle Restaurant",
      image: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      quote: "As a small farm, GastroHub gave us access to restaurants we never could have reached before. Our business has grown 300%.",
      author: "Xolani Mkhize",
      role: "Owner, KwaMkhize Farm",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-[var(--foreground,#fff)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex p-4 bg-[var(--background)]/10 rounded-2xl mb-6">
              <ChefHat className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-[var(--foreground)]">
              About GastroHub
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-[var(--primary-100)] max-w-3xl mx-auto">
              We're revolutionizing the South African food industry by connecting local buyers, suppliers, and delivery partners 
              in one powerful B2B marketplace based in Cape Town.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[var(--card-muted,#f9fafb)] dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex p-3 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-200 rounded-xl mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">{stat.value}</div>
                <div className="text-neutral-600 dark:text-neutral-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-[var(--foreground)] mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-[var(--muted-foreground)]">
                <p>
                  GastroHub was born from a simple observation: the South African food industry was fragmented, 
                  with local suppliers and buyers struggling to connect efficiently. Traditional procurement 
                  methods were outdated, time-consuming, and often unreliable.
                </p>
                <p>
                  Founded in 2025 in Cape Town by an experienced industry veteran and technology expert, 
                  we set out to create a platform that would streamline the entire food supply chain in South Africa. 
                  Our mission is to make quality food more accessible while supporting local South African suppliers 
                  and sustainable practices.
                </p>
                <p>
                  Today, GastroHub serves thousands of restaurants, cafes, hotels, and food service 
                  businesses across all 9 provinces of South Africa, facilitating millions of rands in transactions 
                  and helping local food businesses thrive in an increasingly competitive market.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Food marketplace"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-[var(--background)] p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <Award className="w-8 h-8 text-secondary-400" />
                  <div>
                    <div className="font-semibold text-neutral-900">Industry Leader</div>
                    <div className="text-sm text-[var(--muted-foreground)]">Food Tech Innovation 2025</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-neutral-900 text-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary-700 dark:text-primary-300">
              Our Values
            </h2>
            <p className="text-xl max-w-2xl mx-auto text-[var(--muted-foreground)]">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow" padding="lg">
                <div className="inline-flex p-4 bg-primary-100 text-primary-600 rounded-2xl mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-neutral-600">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary-700 dark:text-primary-300">
              Meet Our Team
            </h2>
            <p className="text-xl max-w-2xl mx-auto text-[var(--muted-foreground)]">
              The passionate people behind GastroHub
            </p>
          </div>
          <div
            className={
              team.length === 1
                ? 'flex flex-col items-center justify-center'
                : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center'
            }
          >
            {team.map((member, index) => (
              <Card
                key={index}
                className={
                  team.length === 1
                    ? 'w-full max-w-xs mx-auto text-center hover:shadow-lg transition-shadow'
                    : 'text-center hover:shadow-lg transition-shadow'
                }
                padding="lg"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-primary-200 dark:border-primary-700 shadow-md"
                />
                <h3 className="text-lg font-semibold mb-1 text-[var(--foreground)]">
                  {member.name}
                </h3>
                <p className="font-medium mb-3 text-[var(--primary-600)]">
                  {member.role}
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {member.bio}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-neutral-900 text-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary-700 dark:text-primary-300">
              What Our Users Say
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100" padding="lg">
                <Quote className="w-8 h-8 text-primary-200 mb-4" />
                <blockquote className="text-lg mb-6 italic text-[var(--muted-foreground)]">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">{testimonial.author}</div>
                    <div className="text-sm text-[var(--muted-foreground)]">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-900 text-[var(--foreground,#fff)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl mb-8 text-[var(--primary-100)]">
            Whether you're a buyer, supplier, or delivery partner, we'd love to have you on board.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default">
              <Link to="/register" className="block w-full h-full">Get Started Today</Link>
            </Button>
            <Button size="lg" variant="ghost" className="text-[var(--foreground,#fff)] border-white hover:bg-primary-800 hover:text-white dark:hover:bg-primary-700 dark:hover:text-white">
              <Link to="/contact" className="block w-full h-full">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AboutPage;