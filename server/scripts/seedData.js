const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");
const Note = require("../models/Note");
const StudyGroup = require("../models/StudyGroup");
const connectDB = require("../config/database");

// Sample data
const sampleUsers = [
  {
    username: "priya_sharma",
    email: "priya@example.com",
    password: "password123",
    fullName: "Priya Sharma",
    college: "IIT Delhi",
    course: "B.Tech Computer Science",
    semester: "6th Semester",
    bio: "CS student passionate about algorithms and machine learning",
  },
  {
    username: "rahul_kumar",
    email: "rahul@example.com",
    password: "password123",
    fullName: "Rahul Kumar",
    college: "IIT Bombay",
    course: "B.Tech Electronics",
    semester: "4th Semester",
    bio: "Electronics enthusiast, love working with circuits",
  },
  {
    username: "anita_patel",
    email: "anita@example.com",
    password: "password123",
    fullName: "Anita Patel",
    college: "NIT Surathkal",
    course: "B.Tech Mechanical",
    semester: "5th Semester",
    bio: "Mechanical engineer interested in sustainable technology",
  },
  {
    username: "vikram_singh",
    email: "vikram@example.com",
    password: "password123",
    fullName: "Vikram Singh",
    college: "BITS Pilani",
    course: "B.Tech Information Technology",
    semester: "7th Semester",
    bio: "Full-stack developer and open source contributor",
  },
  {
    username: "sneha_gupta",
    email: "sneha@example.com",
    password: "password123",
    fullName: "Sneha Gupta",
    college: "Delhi University",
    course: "MCA",
    semester: "3rd Semester",
    bio: "MCA student specializing in data science",
  },
];

const sampleNotes = [
  {
    title: "Data Structures Complete Notes - Trees and Graphs",
    description:
      "Comprehensive notes covering binary trees, BST, AVL trees, graphs, DFS, BFS with examples and code.",
    subject: "Data Structures",
    semester: "4th Semester",
    course: "B.Tech Computer Science",
    college: "IIT Delhi",
    fileName: "data_structures_trees_graphs.pdf",
    fileType: "pdf",
    fileSize: 2500000,
    fileUrl: "https://example.com/sample1.pdf",
    cloudinaryId: "sample_1",
    tags: ["trees", "graphs", "algorithms", "programming"],
    topics: ["Binary Trees", "Graph Traversal", "Tree Algorithms"],
    quality: "high",
    isApproved: true,
    isVerified: true,
    views: 150,
    downloads: 85,
  },
  {
    title: "Machine Learning Algorithms - Supervised Learning",
    description:
      "Detailed explanation of supervised learning algorithms including linear regression, decision trees, SVM, and neural networks.",
    subject: "Machine Learning",
    semester: "6th Semester",
    course: "B.Tech Computer Science",
    college: "IIT Delhi",
    fileName: "ml_supervised_learning.pdf",
    fileType: "pdf",
    fileSize: 3200000,
    fileUrl: "https://example.com/sample2.pdf",
    cloudinaryId: "sample_2",
    tags: ["machine learning", "supervised learning", "algorithms"],
    topics: ["Linear Regression", "Decision Trees", "SVM", "Neural Networks"],
    quality: "premium",
    isPremium: true,
    price: 25,
    isApproved: true,
    isVerified: true,
    views: 200,
    downloads: 120,
  },
  {
    title: "Digital Electronics - Logic Gates and Circuits",
    description:
      "Fundamental concepts of digital electronics including Boolean algebra, logic gates, combinational and sequential circuits.",
    subject: "Digital Electronics",
    semester: "3rd Semester",
    course: "B.Tech Electronics",
    college: "IIT Bombay",
    fileName: "digital_electronics_basics.pdf",
    fileType: "pdf",
    fileSize: 1800000,
    fileUrl: "https://example.com/sample3.pdf",
    cloudinaryId: "sample_3",
    tags: ["digital electronics", "logic gates", "circuits"],
    topics: [
      "Boolean Algebra",
      "Combinational Circuits",
      "Sequential Circuits",
    ],
    quality: "high",
    isApproved: true,
    views: 95,
    downloads: 60,
  },
  {
    title: "Thermodynamics Laws and Applications",
    description:
      "Complete coverage of thermodynamics laws, heat engines, refrigeration cycles, and entropy.",
    subject: "Thermodynamics",
    semester: "4th Semester",
    course: "B.Tech Mechanical",
    college: "NIT Surathkal",
    fileName: "thermodynamics_complete.pdf",
    fileType: "pdf",
    fileSize: 2800000,
    fileUrl: "https://example.com/sample4.pdf",
    cloudinaryId: "sample_4",
    tags: ["thermodynamics", "heat engines", "entropy"],
    topics: ["First Law", "Second Law", "Heat Engines", "Refrigeration"],
    quality: "medium",
    isApproved: true,
    views: 75,
    downloads: 45,
  },
  {
    title: "Database Management Systems - SQL and NoSQL",
    description:
      "Comprehensive guide to DBMS concepts, SQL queries, normalization, and introduction to NoSQL databases.",
    subject: "Database Management",
    semester: "5th Semester",
    course: "B.Tech Information Technology",
    college: "BITS Pilani",
    fileName: "dbms_complete_guide.pdf",
    fileType: "pdf",
    fileSize: 2200000,
    fileUrl: "https://example.com/sample5.pdf",
    cloudinaryId: "sample_5",
    tags: ["database", "sql", "nosql", "normalization"],
    topics: ["SQL Queries", "Normalization", "Transactions", "NoSQL"],
    quality: "high",
    isApproved: true,
    views: 130,
    downloads: 90,
  },
];

const sampleStudyGroups = [
  {
    name: "DSA Problem Solving Group",
    description:
      "Daily practice of data structures and algorithms problems. Share solutions and discuss approaches.",
    subject: "Data Structures",
    college: "IIT Delhi",
    semester: "4th Semester",
    course: "B.Tech Computer Science",
    isPrivate: false,
    maxMembers: 50,
    tags: ["dsa", "algorithms", "coding", "practice"],
  },
  {
    name: "ML Research Discussion",
    description:
      "Discuss latest research papers in machine learning and AI. Weekly paper reviews and implementation discussions.",
    subject: "Machine Learning",
    college: "IIT Delhi",
    semester: "6th Semester",
    course: "B.Tech Computer Science",
    isPrivate: false,
    maxMembers: 30,
    tags: ["machine learning", "research", "ai", "papers"],
  },
  {
    name: "Electronics Project Hub",
    description:
      "Share electronics projects, circuit designs, and troubleshooting help.",
    subject: "Electronics",
    college: "IIT Bombay",
    semester: "4th Semester",
    course: "B.Tech Electronics",
    isPrivate: false,
    maxMembers: 40,
    tags: ["electronics", "projects", "circuits", "diy"],
  },
];

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({ role: "student" }); // Keep admin users
    await Note.deleteMany({});
    await StudyGroup.deleteMany({});

    // Create users
    console.log("👤 Creating sample users...");
    const createdUsers = [];

    for (const userData of sampleUsers) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const user = new User({
        ...userData,
        password: hashedPassword,
        isVerified: true,
        contributorScore: Math.floor(Math.random() * 100) + 10,
      });

      user.updateContributorScore();
      await user.save();
      createdUsers.push(user);
    }

    console.log(`✅ Created ${createdUsers.length} users`);

    // Create notes
    console.log("📝 Creating sample notes...");
    const createdNotes = [];

    for (let i = 0; i < sampleNotes.length; i++) {
      const noteData = sampleNotes[i];
      const randomUser = createdUsers[i % createdUsers.length];

      const note = new Note({
        ...noteData,
        uploadedBy: randomUser._id,
        authorName: randomUser.fullName,
      });

      // Add some likes and comments
      const likeCount = Math.floor(Math.random() * 20) + 5;
      for (let j = 0; j < likeCount; j++) {
        const randomLiker =
          createdUsers[Math.floor(Math.random() * createdUsers.length)];
        if (
          !note.likes.some(
            (like) => like.user.toString() === randomLiker._id.toString()
          )
        ) {
          note.likes.push({ user: randomLiker._id });
        }
      }

      // Add some comments
      const commentCount = Math.floor(Math.random() * 8) + 2;
      for (let j = 0; j < commentCount; j++) {
        const randomCommenter =
          createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const comments = [
          "Great notes! Very helpful for exam preparation.",
          "Clear explanations and good examples.",
          "Thanks for sharing, saved me a lot of time.",
          "Could you add more practice problems?",
          "Excellent work, very comprehensive.",
          "This helped me understand the concepts better.",
          "Well organized and easy to follow.",
          "Perfect for last-minute revision!",
        ];

        note.comments.push({
          user: randomCommenter._id,
          username: randomCommenter.username,
          comment: comments[Math.floor(Math.random() * comments.length)],
        });
      }

      await note.save();
      createdNotes.push(note);

      // Update user's upload count
      randomUser.uploadedNotes.push(note._id);
      randomUser.totalUploads += 1;
      randomUser.updateContributorScore();
      await randomUser.save();
    }

    console.log(`✅ Created ${createdNotes.length} notes`);

    // Create study groups
    console.log("👥 Creating sample study groups...");
    const createdGroups = [];

    for (let i = 0; i < sampleStudyGroups.length; i++) {
      const groupData = sampleStudyGroups[i];
      const creator = createdUsers[i % createdUsers.length];

      const group = new StudyGroup({
        ...groupData,
        createdBy: creator._id,
      });

      // Add creator as admin member
      group.members.push({
        user: creator._id,
        role: "admin",
      });

      // Add some random members
      const memberCount = Math.floor(Math.random() * 15) + 5;
      for (let j = 0; j < memberCount; j++) {
        const randomMember =
          createdUsers[Math.floor(Math.random() * createdUsers.length)];
        if (
          !group.members.some(
            (member) => member.user.toString() === randomMember._id.toString()
          )
        ) {
          group.members.push({
            user: randomMember._id,
            role: "member",
          });
        }
      }

      // Add some sample posts
      const postCount = Math.floor(Math.random() * 10) + 3;
      const samplePosts = [
        "Hey everyone! Let's start with today's problem solving session.",
        "Can someone help me with dynamic programming concepts?",
        "Sharing a great resource I found online.",
        "Who's joining the study session tomorrow?",
        "Just solved a tricky algorithm problem, happy to explain!",
        "Any recommendations for good practice websites?",
        "Let's discuss the latest assignment requirements.",
        "Found an interesting research paper, sharing the link.",
        "Quick doubt - can someone explain time complexity?",
        "Great session today, thanks everyone!",
      ];

      for (let j = 0; j < postCount; j++) {
        const randomMember =
          group.members[Math.floor(Math.random() * group.members.length)];
        const memberUser = createdUsers.find(
          (u) => u._id.toString() === randomMember.user.toString()
        );

        group.posts.push({
          author: memberUser._id,
          authorName: memberUser.fullName,
          content: samplePosts[Math.floor(Math.random() * samplePosts.length)],
          createdAt: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
          ), // Random time in last 7 days
        });
      }

      group.totalPosts = group.posts.length;
      group.lastActivity = new Date();

      await group.save();
      createdGroups.push(group);
    }

    console.log(`✅ Created ${createdGroups.length} study groups`);

    // Add some bookmarks and download history to users
    console.log("🔖 Adding bookmarks and download history...");

    for (const user of createdUsers) {
      // Random bookmarks
      const bookmarkCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < bookmarkCount; i++) {
        const randomNote =
          createdNotes[Math.floor(Math.random() * createdNotes.length)];
        if (!user.bookmarkedNotes.includes(randomNote._id)) {
          user.bookmarkedNotes.push(randomNote._id);
        }
      }

      // Random download history
      const downloadCount = Math.floor(Math.random() * 5) + 2;
      for (let i = 0; i < downloadCount; i++) {
        const randomNote =
          createdNotes[Math.floor(Math.random() * createdNotes.length)];
        if (
          !user.downloadHistory.some(
            (d) => d.noteId.toString() === randomNote._id.toString()
          )
        ) {
          user.downloadHistory.push({
            noteId: randomNote._id,
            downloadedAt: new Date(
              Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
            ),
          });
          user.totalDownloads += 1;
        }
      }

      user.updateContributorScore();
      await user.save();
    }

    console.log("✅ Added bookmarks and download history");

    // Summary
    console.log("\n🎉 Database seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   👤 Users: ${createdUsers.length}`);
    console.log(`   📝 Notes: ${createdNotes.length}`);
    console.log(`   👥 Study Groups: ${createdGroups.length}`);
    console.log(`\n💡 You can now login with any of these test accounts:`);

    createdUsers.forEach((user, index) => {
      console.log(
        `   ${index + 1}. Email: ${user.email} | Password: password123`
      );
    });

    console.log(`\n🔑 Admin credentials:`);
    console.log(`   Username: ${process.env.ADMIN_USERNAME || "admin"}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || "admin123"}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
