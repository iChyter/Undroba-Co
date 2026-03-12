const SUPABASE_URL = 'http://production-supabase-1a91ae-137-131-172-79.traefik.me';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzMyNDE4NjYsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.cXK92ci0x21YLG4YadqqXjmhthF33oRPQsr4TowDk_4';

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const BUCKET_NAME = 'productos';

async function uploadImage(file, productoId) {
  const fileName = `${productoId}/${Date.now()}.webp`;
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: 'image/webp'
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

async function deleteImage(url) {
  const path = url.split('/').slice(-2).join('/');
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path]);
  
  if (error) console.error('Error deleting image:', error);
}

const AUTH_ADMINS = [
  'admin@undrobaco.com',
  'alejandro@example.com'
];

const Auth = {
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  isAdmin(email) {
    return AUTH_ADMINS.includes(email.toLowerCase());
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
