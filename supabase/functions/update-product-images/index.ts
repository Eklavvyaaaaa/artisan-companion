
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!
);

const productUpdates = [
  {
    title: 'Warli Art',
    image_url: 'https://i.ibb.co/3k5g7rG/344837138-899443354437537-8276943111833486336-n.jpg'
  },
  {
    title: 'Pattachitra Art',
    image_url: 'https://i.ibb.co/VvzHZ2W/pattachitra-1.webp'
  },
  {
    title: 'Madhubani Art',
    image_url: 'https://i.ibb.co/Cbfd223/madhubani-3.webp'
  },
  {
    title: 'Dhokra Craft',
    image_url: 'https://i.ibb.co/dKq6g1R/dhokra-2.webp'
  },
  {
    title: 'Kalamkari Art',
    image_url: 'https://i.ibb.co/YyZtL2q/kalamkari-1.webp'
  },
  {
    title: 'Gond Art',
    image_url: 'https://i.ibb.co/HC38Lgt/gond-3.webp'
  }
];

Deno.serve(async (req) => {
  try {
    for (const update of productUpdates) {
      const { data, error } = await supabase
        .from('products')
        .update({ image_url: update.image_url })
        .eq('title', update.title);

      if (error) {
        console.error(`Error updating ${update.title}:`, error);
      } else {
        console.log(`Successfully updated ${update.title}`);
      }
    }

    return new Response(JSON.stringify({ message: 'Product images updated successfully' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
