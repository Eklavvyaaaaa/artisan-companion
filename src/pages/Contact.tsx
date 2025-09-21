// src/pages/Contact.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  Send, 
  Heart, 
  MessageCircle,
  Calendar,
  DollarSign,
  User,
  Building,
  Globe,
  Star,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Camera,
  FileText,
  Palette,
  Users,
  Gift,
  Truck,
  Shield,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    
    // Inquiry Details
    inquiryType: '',
    subject: '',
    message: '',
    budget: '',
    timeline: '',
    urgency: 'normal',
    
    // Project Specifications
    projectType: '',
    dimensions: '',
    materials: [] as string[],
    colors: '',
    customization: '',
    quantity: '1',
    
    // Preferences
    newsletter: false,
    updates: true,
    consultation: false,
    portfolio: false,
    
    // Additional Services
    shipping: '',
    packaging: '',
    warranty: false,
    maintenance: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const { toast } = useToast();

  // Real-time cost estimation
  useEffect(() => {
    calculateEstimate();
  }, [formData.projectType, formData.quantity, formData.materials, formData.budget]);

  const calculateEstimate = () => {
    if (!formData.projectType || !formData.quantity) return;
    
    let baseCost = 0;
    switch (formData.projectType) {
      case 'pottery': baseCost = 50; break;
      case 'jewelry': baseCost = 100; break;
      case 'textile': baseCost = 75; break;
      case 'woodwork': baseCost = 150; break;
      case 'metalwork': baseCost = 200; break;
      default: baseCost = 100;
    }
    
    const materialMultiplier = formData.materials.length * 0.2 + 1;
    const quantity = parseInt(formData.quantity) || 1;
    
    setEstimatedCost(Math.round(baseCost * materialMultiplier * quantity));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string) => (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleMaterialToggle = (material: string) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter(m => m !== material)
        : [...prev.materials, material]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    if (formData.message.length < 20) {
      newErrors.message = 'Please provide more details (at least 20 characters)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please check your form",
        description: "Some required fields are missing or invalid.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Simulate form submission with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData);
      
      toast({
        title: "Message sent successfully! 🎨",
        description: `Thank you ${formData.name}! We'll get back to you within 24 hours with a detailed response.`,
      });

      // Reset form
      setFormData({
        name: '', email: '', phone: '', company: '', website: '',
        inquiryType: '', subject: '', message: '', budget: '', timeline: '', urgency: 'normal',
        projectType: '', dimensions: '', materials: [], colors: '', customization: '', quantity: '1',
        newsletter: false, updates: true, consultation: false, portfolio: false,
        shipping: '', packaging: '', warranty: false, maintenance: false
      });
      setActiveTab('general');
    } catch (error) {
      toast({
        title: "Oops! Something went wrong",
        description: "Please try again or contact us directly at hello@artisancraft.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const materials = [
    'Clay', 'Wood', 'Metal', 'Glass', 'Fabric', 'Leather', 
    'Stone', 'Ceramic', 'Silver', 'Gold', 'Bronze', 'Wool'
  ];

  const urgencyLevels = [
{ value: 'low', label: 'No rush (2-4 weeks)', icon: '⏳' },
{ value: 'normal', label: 'Standard (1-2 weeks)', icon: '⚙️' },
{ value: 'high', label: 'Urgent (3-7 days)', icon: '⚡' },
{ value: 'rush', label: 'Rush order (1-2 days)', icon: '🚀' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-soft/10 to-secondary-soft/20 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-soft/30 px-4 py-2 rounded-full text-sm font-medium text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            Let's Create Together
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Bring Your Vision
            <span className="text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
              {" "}to Life
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            From custom commissions to wholesale orders, we're here to help you create something extraordinary. 
            Our master artisans combine traditional techniques with modern innovation.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">24h</div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">15+</div>
              <div className="text-sm text-muted-foreground">Craft Types</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="shadow-craft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Get in Touch
                </CardTitle>
                <CardDescription>
                  Multiple ways to reach our artisan team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-primary-soft/20 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">hello@artisancraft.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary-soft/20 rounded-lg">
                  <Phone className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-accent-soft/20 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-muted-foreground">Available 9 AM - 6 PM PST</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <MapPin className="w-5 h-5 text-foreground" />
                  <div>
                    <p className="font-medium">Studio Location</p>
                    <p className="text-sm text-muted-foreground">San Francisco, CA</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Types */}
            <Card className="shadow-craft">
              <CardHeader>
                <CardTitle>Our Services</CardTitle>
                <CardDescription>What we can create for you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { icon: Palette, title: 'Custom Commissions', desc: 'Unique pieces made just for you' },
                    { icon: Users, title: 'Wholesale Orders', desc: 'Bulk orders for businesses' },
                    { icon: Calendar, title: 'Workshop Bookings', desc: 'Learn from master artisans' },
                    { icon: Gift, title: 'Corporate Gifts', desc: 'Branded artisan pieces' },
                    { icon: Building, title: 'Interior Design', desc: 'Custom pieces for spaces' }
                  ].map((service, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 hover:bg-muted/20 rounded-lg transition-colors">
                      <service.icon className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm">{service.title}</p>
                        <p className="text-xs text-muted-foreground">{service.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="shadow-craft bg-gradient-to-br from-primary-soft/20 to-accent-soft/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Why Choose Us?</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>100% Handcrafted Quality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Satisfaction Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Secure Payment & Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Expert Customer Support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-craft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" />
                  Tell Us About Your Project
                </CardTitle>
                <CardDescription>
                  The more details you share, the better we can help you create something amazing
                </CardDescription>
                {estimatedCost && (
                  <Alert className="mt-4">
                    <DollarSign className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Estimated Cost:</strong> ${estimatedCost} - ${estimatedCost * 1.5} 
                      <span className="text-sm text-muted-foreground ml-2">(Final quote may vary)</span>
                    </AlertDescription>
                  </Alert>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
                      <TabsTrigger value="project" className="text-xs">Project</TabsTrigger>
                      <TabsTrigger value="preferences" className="text-xs">Preferences</TabsTrigger>
                      <TabsTrigger value="services" className="text-xs">Services</TabsTrigger>
                    </TabsList>

                    {/* General Information Tab */}
                    <TabsContent value="general" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                            className={errors.name ? 'border-destructive' : ''}
                          />
                          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your@email.com"
                            className={errors.email ? 'border-destructive' : ''}
                          />
                          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company/Organization</Label>
                          <Input
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="Your company name"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="inquiryType">Inquiry Type</Label>
                          <Select onValueChange={handleSelectChange('inquiryType')}>
                            <SelectTrigger>
                              <SelectValue placeholder="What can we help with?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="commission">Custom Commission</SelectItem>
                              <SelectItem value="wholesale">Wholesale Order</SelectItem>
                              <SelectItem value="workshop">Workshop Booking</SelectItem>
                              <SelectItem value="partnership">Partnership</SelectItem>
                              <SelectItem value="press">Press & Media</SelectItem>
                              <SelectItem value="consultation">Design Consultation</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Urgency Level</Label>
                          <Select value={formData.urgency} onValueChange={handleSelectChange('urgency')}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {urgencyLevels.map(level => (
                                <SelectItem key={level.value} value={level.value}>
                                  <span className="flex items-center gap-2">
                                    <span>{level.icon}</span>
                                    {level.label}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Brief description of your project"
                          className={errors.subject ? 'border-destructive' : ''}
                        />
                        {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Project Description *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us about your vision, inspiration, intended use, and any specific requirements..."
                          className={`min-h-[120px] ${errors.message ? 'border-destructive' : ''}`}
                        />
                        <div className="flex justify-between items-center">
                          {errors.message ? (
                            <p className="text-sm text-destructive">{errors.message}</p>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {formData.message.length}/500 characters
                            </p>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Project Details Tab */}
                    <TabsContent value="project" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="projectType">Craft Type</Label>
                          <Select onValueChange={handleSelectChange('projectType')}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select craft type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pottery">Pottery & Ceramics</SelectItem>
                              <SelectItem value="jewelry">Jewelry Making</SelectItem>
                              <SelectItem value="textile">Textile Arts</SelectItem>
                              <SelectItem value="woodwork">Woodworking</SelectItem>
                              <SelectItem value="metalwork">Metalworking</SelectItem>
                              <SelectItem value="glasswork">Glasswork</SelectItem>
                              <SelectItem value="leatherwork">Leatherwork</SelectItem>
                              <SelectItem value="sculpture">Sculpture</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input
                            id="quantity"
                            name="quantity"
                            type="number"
                            min="1"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            placeholder="How many pieces?"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dimensions">Dimensions</Label>
                        <Input
                          id="dimensions"
                          name="dimensions"
                          value={formData.dimensions}
                          onChange={handleInputChange}
                          placeholder={'e.g., 12" x 8" x 4" or describe size preferences'}
                        />
                      </div>

                      <div className="space-y-3">
                        <Label>Materials Preference</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {materials.map(material => (
                            <div key={material} className="flex items-center space-x-2">
                              <Checkbox
                                id={material}
                                checked={formData.materials.includes(material)}
                                onCheckedChange={() => handleMaterialToggle(material)}
                              />
                              <Label htmlFor={material} className="text-sm">{material}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="colors">Color Preferences</Label>
                        <Input
                          id="colors"
                          name="colors"
                          value={formData.colors}
                          onChange={handleInputChange}
                          placeholder="Describe your preferred colors, themes, or mood"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="budget">Budget Range</Label>
                          <Select onValueChange={handleSelectChange('budget')}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under-100">Under $100</SelectItem>
                              <SelectItem value="100-250">$100 - $250</SelectItem>
                              <SelectItem value="250-500">$250 - $500</SelectItem>
                              <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                              <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                              <SelectItem value="over-2500">Over $2,500</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timeline">Timeline</Label>
                          <Select onValueChange={handleSelectChange('timeline')}>
                            <SelectTrigger>
                              <SelectValue placeholder="When do you need this?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="asap">ASAP (Rush Fee Applies)</SelectItem>
                              <SelectItem value="1-week">Within 1 week</SelectItem>
                              <SelectItem value="2-weeks">2-3 weeks</SelectItem>
                              <SelectItem value="1-month">1 month</SelectItem>
                              <SelectItem value="2-months">2-3 months</SelectItem>
                              <SelectItem value="flexible">Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customization">Special Customizations</Label>
                        <Textarea
                          id="customization"
                          name="customization"
                          value={formData.customization}
                          onChange={handleInputChange}
                          placeholder="Any engravings, personalization, special techniques, or unique features?"
                          className="min-h-[80px]"
                        />
                      </div>
                    </TabsContent>

                    {/* Preferences Tab */}
                    <TabsContent value="preferences" className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Communication Preferences
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-1">
                              <Label htmlFor="updates" className="font-medium">Project Updates</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive progress updates on your project
                              </p>
                            </div>
                            <Switch
                              id="updates"
                              checked={formData.updates}
                              onCheckedChange={handleCheckboxChange('updates')}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-1">
                              <Label htmlFor="newsletter" className="font-medium">Newsletter</Label>
                              <p className="text-sm text-muted-foreground">
                                Get our monthly newsletter with new collections and workshops
                              </p>
                            </div>
                            <Switch
                              id="newsletter"
                              checked={formData.newsletter}
                              onCheckedChange={handleCheckboxChange('newsletter')}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-1">
                              <Label htmlFor="consultation" className="font-medium">Free Consultation</Label>
                              <p className="text-sm text-muted-foreground">
                                Schedule a 15-minute call to discuss your project
                              </p>
                            </div>
                            <Switch
                              id="consultation"
                              checked={formData.consultation}
                              onCheckedChange={handleCheckboxChange('consultation')}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-1">
                              <Label htmlFor="portfolio" className="font-medium">Portfolio Updates</Label>
                              <p className="text-sm text-muted-foreground">
                                See photos of your completed piece in our portfolio
                              </p>
                            </div>
                            <Switch
                              id="portfolio"
                              checked={formData.portfolio}
                              onCheckedChange={handleCheckboxChange('portfolio')}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Services Tab */}
                    <TabsContent value="services" className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Truck className="w-5 h-5" />
                          Additional Services
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="shipping">Shipping Preference</Label>
                            <Select onValueChange={handleSelectChange('shipping')}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select shipping option" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standard">Standard Shipping</SelectItem>
                                <SelectItem value="express">Express Shipping</SelectItem>
                                <SelectItem value="insured">Insured & Tracked</SelectItem>
                                <SelectItem value="pickup">Studio Pickup</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="packaging">Packaging</Label>
                            <Select onValueChange={handleSelectChange('packaging')}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select packaging type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standard">Standard Packaging</SelectItem>
                                <SelectItem value="gift">Gift Wrapping</SelectItem>
                                <SelectItem value="custom">Custom Branded Box</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-1">
                                <Label htmlFor="warranty" className="font-medium">Extended Warranty</Label>
                                <p className="text-sm text-muted-foreground">
                                    Add a one-year extended warranty for your piece.
                                </p>
                                </div>
                                <Switch
                                id="warranty"
                                checked={formData.warranty}
                                onCheckedChange={handleCheckboxChange('warranty')}
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-1">
                                <Label htmlFor="maintenance" className="font-medium">Maintenance Plan</Label>
                                <p className="text-sm text-muted-foreground">
                                    Include a yearly cleaning and maintenance service.
                                </p>
                                </div>
                                <Switch
                                id="maintenance"
                                checked={formData.maintenance}
                                onCheckedChange={handleCheckboxChange('maintenance')}
                                />
                            </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                  </Tabs>

                  <Separator />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Your Inquiry
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;