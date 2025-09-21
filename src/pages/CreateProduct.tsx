import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UploadCloud, Wand2 } from 'lucide-react';

// To enable mock AI, set VITE_USE_MOCK_AI=true in your .env.local file
const useMockAI = import.meta.env.VITE_USE_MOCK_AI === 'true';

const CreateProduct = () => {
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<any | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setGeneratedContent(null); // Reset content when new image is selected
    }
  };

  const handleGenerate = async () => {
    if (!imageFile) {
      toast({
        title: 'No Image Selected',
        description: 'Please select an image to generate content.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    setGenerating(true);

    try {
      // 1. Upload the image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;
      
      setUploading(false);

      // 2. Get the public URL and call the AI function
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
        
      let content;
      if (useMockAI) {
        console.log('Using mock AI endpoint...')
        const response = await fetch('/api/create-product-with-socials-mock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl: publicUrl }),
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to generate mock content');
        }
        const data = await response.json();
        content = data.content;
      } else {
        const { data, error } = await supabase.functions.invoke('product-ai-generator', {
          body: { imageUrl: publicUrl },
        });

        if (error) throw error;
        content = data.content;
      }
      
      setGeneratedContent(content);

    } catch (error: any) {
      toast({
        title: 'Error Generating Content',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Product Listing</CardTitle>
          <CardDescription>Upload an image and let our AI assistant help you write a compelling story for your creation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="product-image">Product Image</Label>
            <Input id="product-image" type="file" onChange={handleFileChange} accept="image/*" />
          </div>

          {previewURL && (
            <div className="border rounded-lg p-4 bg-muted">
                <img src={previewURL} alt="Product preview" className="rounded-md max-h-64 mx-auto" />
            </div>
          )}

          <div className='text-center'>
             <Button onClick={handleGenerate} disabled={!imageFile || generating} size='lg'>
                {generating ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Working my magic...</>
                ) : (
                    <><Wand2 className="mr-2 h-4 w-4" /> Generate Description with AI</>
                )}
            </Button>
          </div>
          
          {generatedContent && (
            <div className="space-y-4 pt-6 border-t">
                <h3 className="text-xl font-semibold">AI Generated Content</h3>
                 <div className="space-y-2">
                    <Label htmlFor="title">Product Title</Label>
                    <Input id="title" defaultValue={generatedContent.title} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea id="description" defaultValue={generatedContent.description} className="w-full h-32 p-2 border rounded-md" />
                </div>
                <div className="space-y-2">
                    <Label>Suggested Tags</Label>
                    <div className="flex flex-wrap gap-2">
                        {generatedContent.tags.map((tag: string) => <span key={tag} className='px-2 py-1 bg-secondary rounded-md text-sm'>{tag}</span>)}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Social Media Post Suggestions</Label>
                     {Object.entries(generatedContent.socials).map(([platform, content]) => (
                        <div key={platform} className='p-3 bg-muted rounded-md text-sm'>
                            <p className='font-bold capitalize'>{platform}</p>
                            <p>{content as string}</p>
                        </div>
                     ))}
                </div>
                 <Button className="w-full" size='lg'>Publish Product</Button>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProduct;
