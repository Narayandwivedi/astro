const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/astro-satya', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    const Blog = mongoose.model('Blog', new mongoose.Schema({}, { strict: false }));

    // Find blogs with malformed slugs (empty, just dashes, or very short)
    const malformedBlogs = await Blog.find({
      $or: [
        { slug: { $regex: /^-+$/ } }, // Only dashes
        { slug: { $regex: /^-.*-$/ } }, // Starts and ends with dash
        { slug: '' }, // Empty slug
        { slug: null }, // Null slug
      ]
    });

    console.log(`\nFound ${malformedBlogs.length} blog(s) with malformed slugs:`);

    malformedBlogs.forEach((blog, index) => {
      console.log(`${index + 1}. ID: ${blog._id}, Title: "${blog.title}", Slug: "${blog.slug}"`);
    });

    if (malformedBlogs.length > 0) {
      console.log('\n--- Deleting malformed blogs ---');

      for (const blog of malformedBlogs) {
        await Blog.deleteOne({ _id: blog._id });
        console.log(`Deleted blog: "${blog.title}" (ID: ${blog._id}, Slug: "${blog.slug}")`);
      }

      console.log(`\n✓ Successfully deleted ${malformedBlogs.length} malformed blog(s)`);
    } else {
      console.log('\n✓ No malformed blogs found!');
    }

    // Find and list all unique slugs to check for other issues
    console.log('\n--- Checking for duplicate slugs ---');
    const duplicates = await Blog.aggregate([
      {
        $group: {
          _id: '$slug',
          count: { $sum: 1 },
          ids: { $push: '$_id' },
          titles: { $push: '$title' }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    if (duplicates.length > 0) {
      console.log(`Found ${duplicates.length} duplicate slug(s):`);
      duplicates.forEach((dup, index) => {
        console.log(`${index + 1}. Slug: "${dup._id}" (${dup.count} times)`);
        console.log(`   Titles: ${dup.titles.join(', ')}`);
      });
    } else {
      console.log('✓ No duplicate slugs found!');
    }

  } catch (error) {
    console.error('Error cleaning up blogs:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
});
