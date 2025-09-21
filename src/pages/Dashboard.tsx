
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Package, 
  MessageSquare, 
  Star, 
  BarChart, 
  LogOut,
  Plus,
  Settings,
  Eye,
  Heart,
  Camera,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

const Dashboard = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const isStoryComplete = searchParams.get('story_complete') === 'true';

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (!session) {
          navigate('/auth');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const ProfileContent = () => {
    if (isStoryComplete) {
      return (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Your Story is Ready!</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Your artisan narrative has been successfully created. You can now view it on your public profile.
          </p>
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            View Public Profile
          </Button>
        </div>
      );
    } else {
      return (
        <div className="text-center py-12">
          <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Create Your Story</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Tell us about your heritage, craft, and passion. Our AI will weave it into a beautiful narrative.
          </p>
          <Button 
            onClick={() => navigate('/artisan/setup-profile')}
            className="bg-primary hover:bg-primary/90"
          >
            <Settings className="w-4 h-4 mr-2" />
            Set Up Profile
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">Artisan Dashboard</h1>
              <div className="hidden sm:block">
                <span className="text-sm text-muted-foreground">
                  Welcome back, {user.user_metadata?.name || user.email}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                <Eye className="w-4 h-4 mr-2" />
                View Site
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Artisan Profile</CardTitle>
                <CardDescription>
                  Share your story and let AI help craft your narrative
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileContent />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other Tabs... */}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
