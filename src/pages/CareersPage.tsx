import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { 
  ChefHat, 
  Users,
  MapPin,
  Clock,
  DollarSign,
  Search,
  Filter,
  Heart,
  Zap,
  Target,
  Globe,
  Coffee,
  Laptop,
  Briefcase,
  GraduationCap
} from 'lucide-react';

export function CareersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const departments = [
    { value: '', label: 'All Departments' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'product', label: 'Product' },
    { value: 'design', label: 'Design' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'operations', label: 'Operations' },
    { value: 'customer-success', label: 'Customer Success' },
  ];

  const locations = [
    { value: '', label: 'All Locations' },
    { value: 'san-francisco', label: 'San Francisco, CA' },
    { value: 'new-york', label: 'New York, NY' },
    { value: 'london', label: 'London, UK' },
    { value: 'remote', label: 'Remote' },
  ];

  const benefits = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, dental, vision, and wellness programs'
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: 'Work-Life Balance',
      description: 'Flexible hours, unlimited PTO, and remote work options'
    },
    {
      icon: <Laptop className="w-6 h-6" />,
      title: 'Equipment & Setup',
      description: 'Top-tier equipment and home office setup allowance'
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: 'Learning & Development',
      description: 'Professional development budget and conference attendance'
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Competitive Compensation',
      description: 'Market-leading salaries and equity participation'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Team Culture',
      description: 'Inclusive environment with regular team events and offsites'
    }
  ];

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Customer First',
      description: 'We obsess over our customers and their success drives everything we do.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Move Fast',
      description: 'We iterate quickly, learn from failures, and continuously improve.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Better Together',
      description: 'We collaborate openly, support each other, and celebrate wins together.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Think Global',
      description: 'We build for scale and consider the global impact of our decisions.'
    }
  ];

  const openPositions = [
    {
      id: '1',
      title: 'Senior Full Stack Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Build scalable web applications and APIs for our B2B marketplace platform.',
      requirements: ['5+ years experience', 'React/Node.js', 'PostgreSQL', 'AWS'],
      posted: '2 days ago'
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Mid-level',
      description: 'Drive product strategy and roadmap for our supplier management tools.',
      requirements: ['3+ years PM experience', 'B2B SaaS', 'Data-driven', 'Agile'],
      posted: '1 week ago'
    },
    {
      id: '3',
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'New York, NY',
      type: 'Full-time',
      experience: 'Mid-level',
      description: 'Design intuitive user experiences for our marketplace platform.',
      requirements: ['4+ years design experience', 'Figma', 'Design systems', 'User research'],
      posted: '3 days ago'
    },
    {
      id: '4',
      title: 'Sales Development Representative',
      department: 'Sales',
      location: 'San Francisco, CA',
      type: 'Full-time',
      experience: 'Entry-level',
      description: 'Generate qualified leads and build relationships with potential customers.',
      requirements: ['1+ years sales experience', 'B2B sales', 'CRM tools', 'Communication skills'],
      posted: '5 days ago'
    },
    {
      id: '5',
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'London, UK',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Manage infrastructure, CI/CD pipelines, and platform reliability.',
      requirements: ['5+ years DevOps', 'Kubernetes', 'AWS/GCP', 'Monitoring'],
      posted: '1 week ago'
    },
    {
      id: '6',
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Mid-level',
      description: 'Ensure customer satisfaction and drive product adoption.',
      requirements: ['3+ years CS experience', 'B2B SaaS', 'Account management', 'Analytics'],
      posted: '4 days ago'
    }
  ];

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case 'Entry-level':
        return 'success';
      case 'Mid-level':
        return 'primary';
      case 'Senior':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const filteredPositions = openPositions.filter(position => {
    const matchesSearch = position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         position.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !departmentFilter || position.department.toLowerCase().replace(/\s+/g, '-') === departmentFilter;
    const matchesLocation = !locationFilter || 
                           position.location.toLowerCase().replace(/[,\s]+/g, '-') === locationFilter ||
                           (locationFilter === 'remote' && position.location === 'Remote');
    
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--primary-900)] via-[var(--primary-800)] to-[var(--primary-700)] text-[var(--foreground)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex p-4 bg-[var(--background)]/10 rounded-2xl mb-6">
              <Briefcase className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-[var(--primary-100)] max-w-3xl mx-auto">
              Help us revolutionize the food industry and build the future of B2B commerce
            </p>
            <div className="flex items-center justify-center space-x-6 text-[var(--primary-200)]">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>150+ Team Members</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>4 Global Offices</span>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5" />
                <span>20+ Open Roles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 bg-[var(--neutral-50)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-[var(--foreground)] mb-4">
              Our Values
            </h2>
            <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
              The principles that guide how we work and make decisions every day
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow" padding="lg">
                <div className="inline-flex p-4 bg-[var(--primary-100)] text-[var(--primary-600)] rounded-2xl mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                  {value.title}
                </h3>
                <p className="text-[var(--muted-foreground)]">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-[var(--foreground)] mb-4">
              Why Work at GastroHub?
            </h2>
            <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
              We offer competitive benefits and a supportive environment where you can do your best work
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow" padding="lg">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-[var(--primary-100)] text-[var(--primary-600)] rounded-xl">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-[var(--muted-foreground)]">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-[var(--neutral-50)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-[var(--foreground)] mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-[var(--muted-foreground)]">
              Find your next opportunity and help shape the future of food commerce
            </p>
          </div>

          {/* Search and Filters */}
          <Card padding="md" className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)] w-4 h-4" />
                <Input
                  placeholder="Search positions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                options={departments}
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              />
              <Select
                options={locations}
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-[var(--muted-foreground)]">
                Showing {filteredPositions.length} of {openPositions.length} positions
              </p>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </Card>

          {/* Positions List */}
          <div className="space-y-6">
            {filteredPositions.map((position) => (
              <Card key={position.id} className="hover:shadow-md transition-shadow" padding="lg">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                          {position.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-[var(--muted-foreground)] mb-3">
                          <div className="flex items-center space-x-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{position.department}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{position.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{position.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getExperienceColor(position.experience) as any}>
                          {position.experience}
                        </Badge>
                        <span className="text-xs text-[var(--muted-foreground)]">{position.posted}</span>
                      </div>
                    </div>
                    
                    <p className="text-[var(--muted-foreground)] mb-4">
                      {position.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {position.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" size="sm">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <Button>
                      Apply Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredPositions.length === 0 && (
            <Card padding="lg" className="text-center">
              <Briefcase className="w-16 h-16 text-[var(--muted-foreground)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                No positions found
              </h3>
              <p className="text-[var(--muted-foreground)] mb-4">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
              <Button variant="outline">
                View All Positions
              </Button>
            </Card>
          )}
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-[var(--foreground)] mb-4">
              Our Hiring Process
            </h2>
            <p className="text-xl text-[var(--muted-foreground)]">
              We've designed a fair and efficient process to help us get to know each other
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--primary-100)] text-[var(--primary-600)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="font-semibold text-[var(--foreground)] mb-2">Application</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Submit your application and we'll review it within 48 hours</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--primary-100)] text-[var(--primary-600)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="font-semibold text-[var(--foreground)] mb-2">Phone Screen</h3>
              <p className="text-sm text-[var(--muted-foreground)]">30-minute call to discuss your background and the role</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--primary-100)] text-[var(--primary-600)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="font-semibold text-[var(--foreground)] mb-2">Technical Interview</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Role-specific assessment and team interviews</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--primary-100)] text-[var(--primary-600)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">4</span>
              </div>
              <h3 className="font-semibold text-[var(--foreground)] mb-2">Final Interview</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Meet with leadership and discuss next steps</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[var(--primary-900)] text-[var(--foreground)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl mb-8 text-[var(--primary-100)]">
            Join us in building the future of food commerce and help transform how the industry operates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              View Open Positions
            </Button>
            <Button size="lg" variant="ghost" className="text-[var(--foreground)] border-[var(--foreground)] hover:bg-[var(--background)] hover:text-[var(--primary-900)]">
              Learn About Our Culture
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--background-dark)] text-[var(--foreground)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ChefHat className="w-8 h-8 text-[var(--secondary-400)]" />
            <span className="text-xl font-heading font-bold text-[var(--foreground)]">GastroHub</span>
          </div>
          <p className="text-[var(--muted-foreground)]">
            &copy; 2024 GastroHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default CareersPage;