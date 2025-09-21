export const mockAI = async (prompt: string) => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

  const response = {
    title: "Hand-Woven Sunset Basket",
    description: "Crafted from locally sourced palm leaves, this basket captures the warm hues of a summer sunset. Each one is unique, a testament to the artisan's skill and dedication.",
    tags: ["basket", "woven", "handmade", "artisan", "decor"],
    socials: {
      instagram: "Discover the warmth of a summer sunset, captured in our new Hand-Woven Sunset Basket! #handmade #artisan #homedecor",
      twitter: "Add a touch of warmth to your home with our new Hand-Woven Sunset Basket. #handmade #artisan #homedecor",
      facebook: "New in our shop! This beautiful Hand-Woven Sunset Basket is crafted from locally sourced palm leaves, capturing the warm hues of a summer sunset. Each one is unique, a testament to the artisan's skill and dedication. #handmade #artisan #homedecor"
    }
  };

  return response;
};