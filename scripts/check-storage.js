const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStorageBuckets() {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error('Error fetching buckets:', error);
      return;
    }

    console.log('Available storage buckets:');
    if (buckets.length === 0) {
      console.log('No buckets found. You need to create a bucket for organization logos.');
    } else {
      buckets.forEach(bucket => {
        console.log(`- ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      });
    }

    console.log('\nTo create the organization-logos bucket:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to Storage');
    console.log('3. Click "Create a new bucket"');
    console.log('4. Name it "organization-logos"');
    console.log('5. Make it public');
    console.log('6. Click "Create bucket"');

  } catch (error) {
    console.error('Error:', error);
  }
}

checkStorageBuckets();