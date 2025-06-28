import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useTheme } from '../hooks/useTheme';
import { DicedHeroSection } from '../components/ui/diced-hero-section';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { 
  ChefHat, 
  ShoppingCart, 
  Package, 
  Truck, 
  Users, 
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  Star
} from 'lucide-react';

export function HomePage() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const heroSlides = [
    {
      title: "Fruits and Vegetables",
            image: "https://images.unsplash.com/photo-1646340691161-521e588e9964?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Packaging",
      image: "https://images.pexels.com/photos/25551694/pexels-photo-25551694/free-photo-of-paper-cups-and-bowls-with-forks-and-straws-on-table.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      title: "Craft Spirits",
      image: "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      title: "Meat",
      image: "https://images.pexels.com/photos/12884545/pexels-photo-12884545.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ];

  const features = [
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: 'Smart Marketplace',
      description: 'Connect with verified suppliers and discover quality food products with advanced search and filtering.',
      color: 'primary',
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: 'Supplier Tools',
      description: 'Manage your inventory, track orders, and grow your business with powerful analytics and insights.',
      color: 'secondary',
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Delivery Network',
      description: 'Reliable delivery partners ensure your orders arrive fresh and on time, every time.',
      color: 'success',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure Payments',
      description: 'Industry-standard security with multiple payment options and fraud protection.',
      color: 'warning',
    },
  ];

  const benefits = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Save Time',
      description: 'Streamlined ordering process reduces procurement time by 70%',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Grow Revenue',
      description: 'Access to wider markets increases supplier revenue by 40%',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Build Network',
      description: 'Connect with 10,000+ verified food industry professionals',
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Quality Assured',
      description: '99.8% order accuracy with comprehensive quality controls',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Restaurant Owner',
      company: 'Downtown Bistro',
      content: 'GastroHub has transformed how we source ingredients. The quality is consistent and delivery is always on time.',
      rating: 5,
    },
    {
      name: 'Mike Chen',
      role: 'Food Supplier',
      company: 'Fresh Valley Farms',
      content: 'Since joining GastroHub, our sales have increased by 60%. The platform makes it easy to reach new customers.',
      rating: 5,
    },
    {
      name: 'David Rodriguez',
      role: 'Delivery Partner',
      company: 'Swift Delivery',
      content: 'The delivery management system is intuitive and the earnings are great. Highly recommend for delivery professionals.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Bolt.new Badge Start */}
      <style>{`
        .bolt-badge {
          transition: all 0.3s ease;
        }
        @keyframes badgeIntro {
          0% { transform: rotateY(-90deg); opacity: 0; }
          100% { transform: rotateY(0deg); opacity: 1; }
        }
        .bolt-badge-intro {
          animation: badgeIntro 0.8s ease-out 1s both;
        }
        .bolt-badge-intro.animated {
          animation: none;
        }
        @keyframes badgeHover {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(22deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .bolt-badge:hover {
          animation: badgeHover 0.6s ease-in-out;
        }
        .bolt-badge-fixed {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 50;
        }
      `}</style>
      
      {/* Bolt.new Badge End */}
      <Header />      

      {/* Hero Section with DicedHeroSection */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:bg-gradient-to-br dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
        <DicedHeroSection
          topText="The Future of"
          mainText="Food & Beverage Commerce"
          subMainText="Connect buyers, suppliers, and delivery partners in one powerful platform. Streamline your operations, discover quality products, and grow your business with GastroHub."
          buttonText="Get Started Free"
          slides={heroSlides}
          onMainButtonClick={() => navigate('/register')}
          onGridImageClick={(index) => console.log(`Clicked on ${heroSlides[3-index].title}`)}
          topTextStyle={{ 
            color: "var(--diced-hero-section-top-text)",
            fontSize: "1.25rem"
          }}
          mainTextStyle={{
            fontSize: "clamp(3rem, 8vw, 5rem)",
            gradient: "linear-gradient(90deg, var(--diced-hero-section-main-gradient-from), var(--diced-hero-section-main-gradient-to))",
          }}
          subMainTextStyle={{ 
            color: "var(--diced-hero-section-sub-text)",
            fontSize: "1.25rem"
          }}
          buttonStyle={{
            backgroundColor: "var(--diced-hero-section-button-bg)",
            color: "var(--diced-hero-section-button-fg)",
            borderRadius: "0.875rem",
            hoverColor: "var(--diced-hero-section-button-hover-bg)",
            hoverForeground: "var(--diced-hero-section-button-hover-fg)",
          }}
          separatorColor="var(--diced-hero-section-separator)"
          backgroundColor={theme === 'dark' ? '#000000' : 'white'}
          mobileBreakpoint={1024}
          fontFamily="inherit"
        />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Comprehensive tools and features designed specifically for the food industry
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow" padding="lg">
                <div className={`inline-flex p-4 rounded-2xl mb-4 ${
                  feature.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                  feature.color === 'secondary' ? 'bg-secondary-100 text-secondary-600' :
                  feature.color === 'success' ? 'bg-success-100 text-success-600' :
                  'bg-warning-100 text-warning-600'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                Proven Results for Food Businesses
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8">
                Join thousands of successful food businesses that have transformed their operations with GastroHub.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-2 bg-primary-100 text-primary-600 rounded-lg">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-2xl transform rotate-3"></div>
              <div className="relative bg-card p-8 rounded-2xl shadow-xl">
                <div className="text-center">
                  <div className="inline-flex p-4 bg-primary-900 dark:bg-primary-600 text-white dark:text-primary-foreground rounded-full mb-4">
                    <ChefHat className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Join 10,000+ Users
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Be part of the largest food industry network
                  </p>
                  <Button>
                    <Link to="/register">
                      Start Your Journey
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400">
              Don't just take our word for it
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center" padding="lg">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-secondary-400 dark:text-secondary-300 fill-current" />
                  ))}
                </div>
                <blockquote className="text-neutral-700 dark:text-neutral-300 mb-6 italic">
                  "{testimonial.content}"
                </blockquote>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{testimonial.role}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-500">{testimonial.company}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to Transform Your Food Business?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join GastroHub today and experience the future of food commerce.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button>
              <Link to="/register">
                Start Free Trial
              </Link>
            </Button>
            <Button>
              <Link to="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}