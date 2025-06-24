import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { 
  ChefHat, 
  Search, 
  Calendar,
  User,
  Clock,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Tag
} from 'lucide-react';

export function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'industry-news', label: 'Industry News' },
    { value: 'best-practices', label: 'Best Practices' },
    { value: 'technology', label: 'Technology' },
    { value: 'sustainability', label: 'Sustainability' },
    { value: 'case-studies', label: 'Case Studies' },
  ];

  const featuredPost = {
    id: '1',
    title: 'The Future of Food Supply Chain: Trends to Watch in 2024',
    excerpt: 'Explore the latest innovations and trends shaping the food industry, from AI-powered logistics to sustainable sourcing practices.',
    author: 'Sarah Johnson',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'Industry News',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Supply Chain', 'Technology', 'Trends']
  };

  const blogPosts = [
    {
      id: '2',
      title: 'How to Build Strong Supplier Relationships in the Digital Age',
      excerpt: 'Learn the key strategies for maintaining and strengthening supplier partnerships through digital platforms.',
      author: 'Michael Chen',
      date: '2024-01-12',
      readTime: '6 min read',
      category: 'Best Practices',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Relationships', 'Digital', 'Suppliers']
    },
    {
      id: '3',
      title: 'Sustainable Sourcing: A Guide for Restaurant Owners',
      excerpt: 'Discover how to implement sustainable sourcing practices that benefit both your business and the environment.',
      author: 'Emily Rodriguez',
      date: '2024-01-10',
      readTime: '7 min read',
      category: 'Sustainability',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Sustainability', 'Restaurants', 'Environment']
    },
    {
      id: '4',
      title: 'Case Study: How Bella Vista Restaurant Reduced Costs by 30%',
      excerpt: 'A detailed look at how one restaurant transformed their procurement process using GastroHub.',
      author: 'David Kim',
      date: '2024-01-08',
      readTime: '5 min read',
      category: 'Case Studies',
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Case Study', 'Cost Reduction', 'Success Story']
    },
    {
      id: '5',
      title: 'The Role of AI in Modern Food Distribution',
      excerpt: 'Understanding how artificial intelligence is revolutionizing food distribution and logistics.',
      author: 'Alex Thompson',
      date: '2024-01-05',
      readTime: '9 min read',
      category: 'Technology',
      image: 'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['AI', 'Distribution', 'Innovation']
    },
    {
      id: '6',
      title: 'Food Safety Standards: What Every Buyer Should Know',
      excerpt: 'Essential food safety standards and certifications that every food buyer should understand.',
      author: 'Lisa Wang',
      date: '2024-01-03',
      readTime: '6 min read',
      category: 'Best Practices',
      image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Food Safety', 'Standards', 'Compliance']
    },
    {
      id: '7',
      title: 'Market Trends: Plant-Based Foods in Commercial Kitchens',
      excerpt: 'Analyzing the growing demand for plant-based options in restaurants and food service.',
      author: 'Maria Santos',
      date: '2024-01-01',
      readTime: '7 min read',
      category: 'Industry News',
      image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Plant-Based', 'Trends', 'Commercial']
    }
  ];

  const popularTags = [
    'Supply Chain', 'Technology', 'Sustainability', 'Best Practices', 
    'Case Studies', 'Food Safety', 'Innovation', 'Trends'
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Industry News':
        return 'primary';
      case 'Best Practices':
        return 'success';
      case 'Technology':
        return 'secondary';
      case 'Sustainability':
        return 'warning';
      case 'Case Studies':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex p-4 bg-[var(--background)]/10 rounded-2xl mb-6">
              <BookOpen className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              GastroHub Blog
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Insights, trends, and best practices for the food industry
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 bg-[var(--card-muted,#f9fafb)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card padding="md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)] w-4 h-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                options={categories}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              />
            </div>
          </Card>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-[var(--foreground)] mb-2">
              Featured Article
            </h2>
            <div className="w-20 h-1 bg-primary-600 rounded"></div>
          </div>

          <Card className="overflow-hidden hover:shadow-xl transition-shadow" padding="none">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-64 lg:h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant={getCategoryColor(featuredPost.category) as any}>
                    {featuredPost.category}
                  </Badge>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[var(--foreground)] mb-4">
                  {featuredPost.title}
                </h3>
                <p className="text-[var(--muted-foreground)] mb-6">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center space-x-4 mb-6 text-sm text-neutral-500">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredPost.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button>
                  Read Full Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 bg-[var(--card-muted,#f9fafb)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-heading font-bold text-[var(--foreground)] mb-2">
                Latest Articles
              </h2>
              <div className="w-20 h-1 bg-primary-600 rounded"></div>
            </div>
            <p className="text-[var(--muted-foreground)]">
              Showing {blogPosts.length} articles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-shadow" padding="none">
                <div className="relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant={getCategoryColor(post.category) as any} size="sm">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--primary-600)] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[var(--muted-foreground)] text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center space-x-3 mb-4 text-xs text-neutral-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button variant="ghost" size="sm" className="w-full group-hover:bg-[var(--primary-50)]">
                    Read More
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Sidebar Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Popular Tags */}
            <Card padding="lg">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="cursor-pointer hover:bg-[var(--primary-50)]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Newsletter Signup */}
            <Card padding="lg" className="bg-gradient-to-br from-[var(--primary-50)] to-[var(--secondary-50)]">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                Stay Updated
              </h3>
              <p className="text-[var(--muted-foreground)] mb-4 text-sm">
                Get the latest insights and industry news delivered to your inbox.
              </p>
              <div className="space-y-3">
                <Input placeholder="Enter your email" type="email" />
                <Button className="w-full" size="sm">
                  Subscribe
                </Button>
              </div>
            </Card>

            {/* Trending */}
            <Card padding="lg">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Trending This Week
              </h3>
              <div className="space-y-4">
                {blogPosts.slice(0, 3).map((post, index) => (
                  <div key={post.id} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-[var(--primary-600)] rounded-full flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-medium text-[var(--foreground)] mb-1 line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-neutral-500">{post.readTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

  );
}

export default BlogPage;