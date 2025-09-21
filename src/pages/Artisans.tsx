import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Award, Heart, Eye } from "lucide-react";
// Removed the Navbar import, as it is a global component.

const artisans = [
  {
    id: 1,
    name: "Priya Sharma",
    specialty: "Madhubani Painting",
    location: "Mithila, Bihar",
    rating: 4.9,
    experience: "18 years",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
    description: "Master artist preserving the ancient Madhubani tradition with contemporary themes and natural pigments.",
    skills: ["Traditional Madhubani", "Natural pigments", "Wall art", "Canvas painting"],
    achievements: ["National Award Winner 2022", "UNESCO Artist Fellowship", "Featured in India Today"],
    likes: 245,
    views: 1823
  },
  {
    id: 2,
    name: "Arjun Mehra",
    specialty: "Blue Pottery",
    location: "Jaipur, Rajasthan",
    rating: 4.8,
    experience: "15 years",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    description: "Fifth-generation potter creating stunning blue pottery using traditional Jaipur techniques and Persian influences.",
    skills: ["Blue pottery", "Glazing techniques", "Decorative tiles", "Traditional firing"],
    achievements: ["Rajasthan State Award", "International Craft Council Member", "Export Excellence Award"],
    likes: 189,
    views: 1456
  },
  {
    id: 3,
    name: "Kavitha Reddy",
    specialty: "Kalamkari Art",
    location: "Srikalahasti, Andhra Pradesh",
    rating: 4.9,
    experience: "12 years",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
    description: "Master embroiderer preserving the delicate art of Chikankari with intricate white-on-white needlework.",
    skills: ["Hand embroidery", "Traditional stitches", "Pattern design", "Fabric preparation"],
    achievements: ["National Master Craftsperson", "GI Tag Custodian", "UNESCO Recognition"],
    likes: 278,
    views: 1987
  },
  {
    id: 6,
    name: "Rajesh Kumar",
    specialty: "Dhokra Metal Craft",
    location: "Bastar, Chhattisgarh",
    rating: 4.8,
    experience: "20 years",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    description: "Tribal artisan creating stunning Dhokra sculptures using the ancient lost-wax casting technique.",
    skills: ["Lost-wax casting", "Bronze working", "Tribal motifs", "Traditional techniques"],
    achievements: ["Tribal Arts Award", "Museum Collection Artist", "Cultural Heritage Champion"],
    likes: 198,
    views: 1567
  },
  {
    id: 7,
    name: "Ananya Iyer",
    specialty: "Tanjore Painting",
    location: "Thanjavur, Tamil Nadu",
    rating: 4.9,
    experience: "14 years",
    image: "https://images.unsplash.com/photo-1494790108755-2616c041c04a?w=300&h=300&fit=crop&crop=face",
    description: "Classical painter specializing in traditional Tanjore art with gold leaf work and precious stone embellishments.",
    skills: ["Gold leaf application", "Stone setting", "Classical compositions", "Traditional techniques"],
    achievements: ["Tamil Nadu State Award", "Temple Art Commission", "International Art Collector"],
    likes: 389,
    views: 2456
  },
  {
    id: 8,
    name: "Suresh Patel",
    specialty: "Bandhani Tie-Dye",
    location: "Bhuj, Gujarat",
    rating: 4.6,
    experience: "16 years",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face",
    description: "Traditional textile artist creating vibrant Bandhani patterns using ancient tie-dye techniques.",
    skills: ["Bandhani technique", "Natural dyes", "Pattern creation", "Fabric finishing"],
    achievements: ["Gujarat Craft Award", "Export House Recognition", "Design Innovation Prize"],
    likes: 234,
    views: 1678
  },
  {
    id: 9,
    name: "Lakshmi Nair",
    specialty: "Kerala Mural Art",
    location: "Thrissur, Kerala",
    rating: 4.8,
    experience: "19 years",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face",
    description: "Temple mural artist preserving the classical Kerala painting tradition with natural pigments and gold accents.",
    skills: ["Classical murals", "Natural pigments", "Gold work", "Temple art"],
    achievements: ["Kerala Lalit Kala Akademi Award", "Temple Restoration Expert", "Cultural Documentation"],
    likes: 345,
    views: 2134
  }
];

const Artisans = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6 animate-fade-in">
            Master Indian Artisans
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-delay">
            Discover the extraordinary craftspeople preserving India's rich artistic heritage through 
            generations of traditional techniques and contemporary innovation.
          </p>
        </div>
      </section>

      {/* Artisans Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artisans.map((artisan, index) => (
              <Card 
                key={artisan.id} 
                className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 shadow-lg bg-card/60 backdrop-blur-sm overflow-hidden relative animate-fade-in-up" 
                style={{animationDelay: `${index * 100}ms`}}
              >
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardHeader className="pb-4 relative">
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/60 transition-all duration-300 shadow-lg">
                      <img 
                        src={artisan.image}
                        alt={artisan.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {/* Floating badge for top-rated artisans */}
                    {artisan.rating >= 4.9 && (
                      <div className="absolute -top-2 -right-2 bg-gold text-white text-xs px-2 py-1 rounded-full font-bold shadow-md animate-pulse">
                        ⭐ Top Rated
                      </div>
                    )}
                    <div className="text-center">
                      <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors duration-300">{artisan.name}</CardTitle>
                      <CardDescription className="text-primary font-medium mb-2 text-base">
                        {artisan.specialty}
                      </CardDescription>
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4" />
                        {artisan.location}
                      </div>
                      <div className="flex items-center justify-center gap-4 mb-3">
                        <div className="flex items-center gap-1 bg-gold/10 px-2 py-1 rounded-full">
                          <Star className="w-4 h-4 fill-gold text-gold" />
                          <span className="font-medium">{artisan.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Award className="w-4 h-4 text-primary" />
                          {artisan.experience}
                        </div>
                      </div>
                      
                      {/* Social engagement stats */}
                      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer">
                          <Heart className="w-4 h-4" />
                          {artisan.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {artisan.views}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {artisan.description}
                  </p>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-1">
                      {artisan.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Achievements</h4>
                    <ul className="space-y-1">
                      {artisan.achievements.map((achievement, index) => (
                        <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium transition-all duration-300 transform hover:scale-105">
                      View Portfolio
                    </Button>
                    <Button variant="outline" size="icon" className="border-primary text-primary hover:bg-primary/10 transition-colors">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Artisans;