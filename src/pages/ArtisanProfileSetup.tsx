
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles } from 'lucide-react';

// This is a placeholder for a future state management solution (like Zustand or Context)
// to share the artisan's profile data across the application.
const useArtisanProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    craft: '',
    materials: '',
    inspiration: '',
    story: '',
    generatedStory: ''
  });

  const updateProfile = (newData) => {
    // In a real app, you'd likely save this to a backend or global state.
    // For now, we'll just log it.
    console.log("Profile updated:", newData);
    // This is where we would persist the data.
  };

  return { profile, updateProfile };
};


const ArtisanProfileSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    craft: '',
    materials: '',
    inspiration: '',
    storyNotes: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // In a real implementation, this would be stored in a global state (Zustand, Redux, Context)
  // and persisted. For this example, we'll just navigate back to the dashboard.
  // const { updateProfile } = useArtisanProfile(); 

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleGenerateStory = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    toast({
      title: "Weaving Your Narrative... ✨",
      description: "Our AI is crafting a beautiful story just for you. Please wait a moment.",
    });

    // --- AI GENERATION SIMULATION ---
    // In a real app, you would send formData to your AI API endpoint here.
    // For now, we'll simulate a delay and generate a story from a template.
    await new Promise(resolve => setTimeout(resolve, 3000));

    const { name, craft, materials, inspiration, storyNotes } = formData;
    const generatedStory = `
In the heart of it all, ${name} brings the timeless art of ${craft} to life. With a deep respect for tradition and a passion for creation, ${name} transforms simple materials like ${materials} into works of art.

Drawing inspiration from ${inspiration}, each piece tells a unique story. As ${name} puts it, "${storyNotes}" This philosophy is woven into every item, creating not just an object, but a piece of a legacy.

Choosing a piece from ${name} is an invitation to appreciate the beauty of handcrafted excellence and to carry a story forward.
    `;
    // --- END SIMULATION ---
    
    setIsGenerating(false);
    toast({
      title: "Your Story is Ready! 🎉",
      description: "We've created a narrative to share with the world. You can review and edit it on your dashboard.",
    });

    // Here, you would save the full profile, including the generated story,
    // to your backend and global state.
    // updateProfile({ ...formData, generatedStory });

    // For now, we'll just navigate back to the dashboard.
    navigate('/dashboard?story_complete=true');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="text-primary h-8 w-8" />
            Tell Your Story
          </CardTitle>
          <CardDescription>
            Provide a few details, and our AI will help you craft a compelling narrative that connects with customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerateStory} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name or Brand</Label>
              <Input id="name" placeholder="e.g., 'Rohan Arts' or 'Priya Sharma'" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="craft">Your Craft</Label>
              <Input id="craft" placeholder="e.g., 'Block Printing', 'Pottery', 'Leatherwork'" value={formData.craft} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="materials">Key Materials You Use</Label>
              <Input id="materials" placeholder="e.g., 'Natural dyes, cotton fabric, and hand-carved wood blocks'" value={formData.materials} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inspiration">What Inspires You?</Label>
              <Input id="inspiration" placeholder="e.g., 'Rajasthan's architecture', 'stories from my grandmother', 'the flow of the Ganges'" value={formData.inspiration} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storyNotes">Your Story & Process (in your own words)</Label>
              <Textarea
                id="storyNotes"
                placeholder="Share a few sentences about your journey, what makes your process special, or your connection to the craft. Don't worry about sounding perfect!"
                value={formData.storyNotes}
                onChange={handleInputChange}
                required
                rows={5}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating ? 'Generating Your Story...' : 'Generate My Artisan Story'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtisanProfileSetup;
