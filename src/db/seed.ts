import { db } from "./index";
import { admin, siteSettings, photos, projects, blogPosts, timelineEvents } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  const passwordHash = await bcrypt.hash("admin123", 10);
  
  await db.insert(admin).values({
    username: "admin",
    passwordHash,
  });

  const settings = [
    { key: "hero_subtitle", value: "Visionary Entrepreneur • Web3 Innovator • Builder" },
    { key: "hero_headline", value: "Not Your Ordinary Entrepreneur.\nDreamer. Revolutionary. Builder." },
    { key: "hero_intro", value: "Empowering the next generation of leaders and innovators through Web3. I am Ace Mich—someone who has walked the toughest paths, learned from the school of life, and emerged stronger, wiser, and ready to build the future." },
    { key: "about_title", value: "The Journey That Made Me Who I Am" },
    { key: "journey_title", value: "From Trials to Triumph" },
    { key: "journey_subtitle", value: "Life is not a straight line. Mine has been filled with highs, lows, lessons, and breakthroughs. Here&apos;s a look at the moments that defined me:" },
    { key: "projects_title", value: "Building the Future, One Innovation at a Time" },
    { key: "projects_subtitle", value: "Web3 isn&apos;t just technology—it&apos;s an opportunity to create leaders, entrepreneurs, and second chances." },
    { key: "blog_title", value: "Thoughts, Lessons, and Innovations" },
    { key: "blog_subtitle", value: "A space for insights on entrepreneurship, Web3, technology, and personal growth." },
    { key: "contact_title", value: "Let&apos;s Build Something Extraordinary" },
    { key: "contact_subtitle", value: "Whether you want to collaborate, invest, or learn from my journey, I&apos;m ready to connect." },
    { key: "cta_title", value: "The Sky Is Never the Limit" },
    { key: "cta_subtitle", value: "I believe in pushing boundaries, creating opportunities, and empowering the next generation. Join me and reach for the galaxy." },
    { key: "email", value: "acemichel0@gmail.com" },
    { key: "phone", value: "+254700757159" },
    { key: "twitter", value: "" },
    { key: "discord", value: "" },
    { key: "linkedin", value: "" },
    { key: "github", value: "" },
  ];

  for (const setting of settings) {
    await db.insert(siteSettings).values(setting);
  }

  await db.insert(photos).values([
    { slot: 1, url: "", alt: "Photo 1" },
    { slot: 2, url: "", alt: "Photo 2" },
    { slot: 3, url: "", alt: "Photo 3" },
  ]);

  await db.insert(projects).values([
    {
      title: "Web3 Leadership Ecosystem",
      description: "Platform for creating visionary leaders and entrepreneurs. A complete ecosystem for the next generation of changemakers.",
      icon: "👑",
      tags: JSON.stringify(["Web3", "Leadership", "Education"]),
      link: "#",
      order: 1,
    },
    {
      title: "NFT Rental Agreements Platform",
      description: "Empowering users to leverage technology for financial freedom. Making NFT utility accessible to everyone.",
      icon: "🎫",
      tags: JSON.stringify(["NFT", "DeFi", "Platform"]),
      link: "#",
      order: 2,
    },
    {
      title: "Tech & Innovation Initiatives",
      description: "Training, mentorship, and community building for changemakers ready to make their mark.",
      icon: "🛠️",
      tags: JSON.stringify(["Education", "Mentorship", "Community"]),
      link: "#",
      order: 3,
    },
  ]);

  await db.insert(blogPosts).values([
    {
      title: "Why Second Chances Matter in Web3",
      excerpt: "The decentralized future belongs to those who were told they didn't belong.",
      date: "March 2026",
      readTime: "5 min read",
      link: "#",
      order: 1,
    },
    {
      title: "From Homeless to Web3: My Blueprint",
      excerpt: "The exact steps I took to transform my life and build in the digital age.",
      date: "February 2026",
      readTime: "8 min read",
      link: "#",
      order: 2,
    },
    {
      title: "The Death of Traditional Entrepreneurship",
      excerpt: "Why Web3 is rewriting the rules of building and ownership.",
      date: "January 2026",
      readTime: "6 min read",
      link: "#",
      order: 3,
    },
  ]);

  await db.insert(timelineEvents).values([
    {
      year: "Rock Bottom",
      title: "Homelessness → Finding resilience in adversity",
      description: "The darkest chapter became the foundation of my strength.",
      icon: "🏕️",
      order: 1,
    },
    {
      year: "The Crossing",
      title: "Crossing borders → Learning the world firsthand",
      description: "No papers, no problem. I learned that courage beats circumstance.",
      icon: "🌍",
      order: 2,
    },
    {
      year: "First Win",
      title: "Startup launch & sale → Early entrepreneurship",
      description: "Proved the naysayers wrong with my first major win.",
      icon: "💡",
      order: 3,
    },
    {
      year: "Deep Dive",
      title: "Mastering deep technologies → Hackathons and self-taught innovation",
      description: "1000 hours of code. No excuses, just execution.",
      icon: "⌨️",
      order: 4,
    },
    {
      year: "Transformation",
      title: "Overcoming addiction → Transformation and growth",
      description: "The hardest battle was with myself. I won.",
      icon: "🧠",
      order: 5,
    },
    {
      year: "Now",
      title: "Web3 ecosystem launch → Empowering future leaders",
      description: "Building the future I always envisioned.",
      icon: "⛓️",
      order: 6,
    },
  ]);

  console.log("Database seeded successfully!");
}

seed().catch(console.error);
