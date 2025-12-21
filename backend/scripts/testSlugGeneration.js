// Test slug generation with different languages

// Generate a clean slug from title (uses full title, supports Unicode)
function generateSlug(title) {
  if (!title || typeof title !== 'string') {
    return '';
  }

  // Support Unicode characters (Hindi, Arabic, Chinese, etc.) along with English
  // Note: We only lowercase ASCII characters to preserve Hindi/Devanagari script integrity
  let slug = title
    .trim()
    // Only lowercase ASCII characters (a-z, A-Z), preserve Unicode characters as-is
    .replace(/[A-Z]/g, char => char.toLowerCase())
    // Keep Unicode letters, numbers, combining marks (essential for Hindi/Devanagari), spaces, and hyphens
    // \p{L} = Unicode letters, \p{N} = Unicode numbers, \p{M} = Unicode marks (matras, diacritics)
    // Remove only special symbols like !@#$%^&*()+={}[]|\\:;"'<>,.?/
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Replace multiple dashes with single dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes

  return slug;
}

// Test cases
const testCases = [
  {
    title: 'वार्षिक राशिफल 2026 प्रस्तुत किया जा रहा हैं पढ़े जरूर',
    description: 'Hindi title'
  },
  {
    title: 'Best Astrology Tips for 2026',
    description: 'English title'
  },
  {
    title: '2026 का राशिफल - Know Your Future!',
    description: 'Mixed Hindi-English with special chars'
  },
  {
    title: '!!!Hello World!!!',
    description: 'Title with special characters'
  },
  {
    title: 'ज्योतिष शास्त्र',
    description: 'Pure Hindi'
  },
  {
    title: '   Spaces   Around   Title   ',
    description: 'Title with extra spaces'
  }
];

console.log('🧪 Testing Slug Generation\n');
console.log('='.repeat(80));

testCases.forEach((test, index) => {
  const slug = generateSlug(test.title);
  console.log(`\nTest ${index + 1}: ${test.description}`);
  console.log(`Input:  "${test.title}"`);
  console.log(`Slug:   "${slug}"`);
  console.log(`Length: ${slug.length} characters`);
  console.log(`Empty:  ${slug === '' ? '❌ YES (Problem!)' : '✅ NO'}`);
});

console.log('\n' + '='.repeat(80));
console.log('\n✅ Slug generation test completed!');
