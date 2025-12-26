import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const envPath = path.resolve(process.cwd(), '.env');

// Read .env manually
let supabaseUrl = '';
let supabaseKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            const trimmedKey = key.trim();
            const trimmedValue = value.trim();
            if (trimmedKey === 'VITE_SUPABASE_URL') supabaseUrl = trimmedValue;
            if (trimmedKey === 'VITE_SUPABASE_ANON_KEY') supabaseKey = trimmedValue;
        }
    });
} catch (e) {
    console.error("Could not read .env file:", e.message);
}

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLibrary() {
    console.log("Testing Library Connection...");

    // 1. Test Books Table
    console.log("\n1. Testing 'books' table access...");
    const { data: books, error: booksError } = await supabase
        .from('books')
        .select('count', { count: 'exact', head: true });

    if (booksError) {
        console.error("❌ Error accessing 'books' table:", booksError.message);
        console.error("   Code:", booksError.code);
        console.error("   Hint:", booksError.hint);
    } else {
        console.log("✅ 'books' table is accessible (Count query successful).");
    }

    // 2. Test Kindle Highlights Table
    console.log("\n2. Testing 'kindle_highlights' table access...");
    const { data: highlights, error: hlError } = await supabase
        .from('kindle_highlights')
        .select('count', { count: 'exact', head: true });

    if (hlError) {
        console.error("❌ Error accessing 'kindle_highlights' table:", hlError.message);
        console.error("   Code:", hlError.code);
    } else {
        console.log("✅ 'kindle_highlights' table is accessible.");
    }

    // 3. Test Storage Bucket
    console.log("\n3. Testing 'library' storage bucket...");
    try {
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        if (bucketError) {
            console.error("❌ Error listing buckets:", bucketError.message);
        } else {
            const libraryBucket = buckets.find(b => b.name === 'library');
            if (libraryBucket) {
                console.log("✅ 'library' bucket found.");
            } else {
                console.error("❌ 'library' bucket NOT found in list:", buckets.map(b => b.name));
            }
        }
    } catch (e) {
        console.error("❌ Unexpected error checking buckets:", e);
    }
}

testLibrary();
