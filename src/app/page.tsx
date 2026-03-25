import Link from "next/link";
import { siteSettings, photos, projects, blogPosts, timelineEvents } from "@/db/schema";

const defaultSettings = {
  hero_subtitle: "Visionary Entrepreneur • Web3 Innovator • Builder",
  hero_headline: "Not Your Ordinary Entrepreneur.\nDreamer. Revolutionary. Builder.",
  hero_intro: "Empowering the next generation of leaders and innovators through Web3. I am Ace Mich—someone who has walked the toughest paths, learned from the school of life, and emerged stronger, wiser, and ready to build the future.",
  about_title: "The Journey That Made Me Who I Am",
  journey_title: "From Trials to Triumph",
  journey_subtitle: "Life is not a straight line. Mine has been filled with highs, lows, lessons, and breakthroughs. Here's a look at the moments that defined me:",
  projects_title: "Building the Future, One Innovation at a Time",
  projects_subtitle: "Web3 isn't just technology—it's an opportunity to create leaders, entrepreneurs, and second chances.",
  blog_title: "Thoughts, Lessons, and Innovations",
  blog_subtitle: "A space for insights on entrepreneurship, Web3, technology, and personal growth.",
  contact_title: "Let's Build Something Extraordinary",
  contact_subtitle: "Whether you want to collaborate, invest, or learn from my journey, I'm ready to connect.",
  cta_title: "The Sky Is Never the Limit",
  cta_subtitle: "I believe in pushing boundaries, creating opportunities, and empowering the next generation. Join me and reach for the galaxy.",
  email: "acemichel0@gmail.com",
  phone: "+254700757159",
  twitter: "",
  discord: "",
  linkedin: "",
  github: "",
};

async function getSiteData() {
  try {
    const { db } = await import("@/db");
    const [settings, allPhotos, allProjects, allPosts, allEvents] = await Promise.all([
      db.select().from(siteSettings),
      db.select().from(photos).orderBy(photos.slot),
      db.select().from(projects).orderBy(projects.order),
      db.select().from(blogPosts).orderBy(blogPosts.order),
      db.select().from(timelineEvents).orderBy(timelineEvents.order),
    ]);

    const settingsMap: Record<string, string> = { ...defaultSettings };
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return {
      settings: settingsMap,
      photos: allPhotos,
      projects: allProjects.map((p: any) => ({
        ...p,
        tags: p.tags ? JSON.parse(p.tags) : [],
      })),
      posts: allPosts,
      events: allEvents,
    };
  } catch {
    return {
      settings: defaultSettings,
      photos: [],
      projects: [],
      posts: [],
      events: [],
    };
  }
}

export default async function Home() {
  const { settings, photos, projects, posts, events } = await getSiteData();

  return (
    <main className="min-h-screen">
      <NavBar settings={settings} />
      <HeroSection settings={settings} photos={photos} />
      <AboutSection settings={settings} />
      <JourneySection settings={settings} events={events} />
      <ResumeSection />
      <ProjectsSection settings={settings} projects={projects} />
      <BlogSection settings={settings} posts={posts} />
      <ContactSection settings={settings} />
      <FinalCTASection settings={settings} />
      <Footer settings={settings} />
    </main>
  );
}

function NavBar({ settings }: { settings: Record<string, string> }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#2a2a2a]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gradient">
          ACE MICH
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          <NavLink href="#about">About</NavLink>
          <NavLink href="#journey">Journey</NavLink>
          <NavLink href="#resume">Resume</NavLink>
          <NavLink href="#projects">Projects</NavLink>
          <NavLink href="#blog">Insights</NavLink>
          <NavLink href="#contact">Connect</NavLink>
          <Link href="/admin/login" className="text-sm text-[#666] hover:text-[#ff3d00] transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-[#a0a0a0] hover:text-[#ff3d00] transition-colors font-medium">
      {children}
    </a>
  );
}

function HeroSection({ settings, photos }: { settings: Record<string, string>; photos: any[] }) {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,61,0,0.15),_transparent_50%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff3d00]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff8c00]/10 rounded-full blur-3xl" />
      
      <div className="section text-center relative z-10">
        <p className="font-mono text-[#ff3d00] mb-6 tracking-widest uppercase text-sm">
          {settings.hero_subtitle}
        </p>
        <h1 className="section-title mb-6">
          {(settings.hero_headline || "").split("\n").map((line, i) => (
            <span key={i}>
              {i === 1 ? <span className="text-gradient">{line}</span> : line}
              {i === 0 && <br />}
            </span>
          ))}
        </h1>
        <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto mb-12 leading-relaxed">
          {settings.hero_intro}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#about" className="btn-primary text-center">Discover My Journey</a>
          <a href="#contact" className="btn-secondary text-center">Join the Movement</a>
        </div>
        
        <div className="mt-16 flex justify-center gap-6">
          {settings.twitter && <SocialIcon href={settings.twitter} label="Twitter">X</SocialIcon>}
          {settings.discord && <SocialIcon href={settings.discord} label="Discord">D</SocialIcon>}
          {settings.linkedin && <SocialIcon href={settings.linkedin} label="LinkedIn">in</SocialIcon>}
          {settings.github && <SocialIcon href={settings.github} label="GitHub">GH</SocialIcon>}
        </div>
      </div>
    </section>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} aria-label={label} className="w-12 h-12 border border-[#2a2a2a] rounded-lg flex items-center justify-center text-[#a0a0a0] hover:border-[#ff3d00] hover:text-[#ff3d00] transition-all">
      {children}
    </a>
  );
}

function AboutSection({ settings }: { settings: Record<string, string> }) {
  return (
    <section id="about" className="section bg-[#0a0a0a]">
      <div className="text-center mb-16">
        <h2 className="section-title">{settings.about_title}</h2>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <AboutCard
          icon="🌱"
          title="Early Life & Education"
          description="Raised to think freely and compete at the highest level, I explored religions, philosophies, and ways of life beyond what was familiar. I quickly realized that society often constrains the curious and the revolutionary."
        />
        <AboutCard
          icon="🔥"
          title="Trials & Lessons"
          description="Rejection, exile, depression, and addiction shaped me. I was homeless, crossed borders without papers, and learned from experiences most only read about. Every challenge was a lesson; every setback, a step forward."
        />
        <AboutCard
          icon="🚀"
          title="Vision & Today"
          description="Today, I build a Web3 ecosystem that creates leaders, entrepreneurs, and second chances. I empower others to take bold steps, embrace technology, and make a difference. I am not ordinary—I am extraordinary."
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
        <a href="#journey" className="btn-secondary text-center">See My Journey</a>
        <a href="#projects" className="btn-secondary text-center">Explore My Projects</a>
      </div>
    </section>
  );
}

function AboutCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="card text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-[#a0a0a0] leading-relaxed">{description}</p>
    </div>
  );
}

function JourneySection({ settings, events }: { settings: Record<string, string>; events: any[] }) {
  const defaultEvents = [
    { year: "Rock Bottom", title: "Homelessness → Finding resilience in adversity", description: "The darkest chapter became the foundation of my strength.", icon: "🏕️" },
    { year: "The Crossing", title: "Crossing borders → Learning the world firsthand", description: "No papers, no problem. I learned that courage beats circumstance.", icon: "🌍" },
    { year: "First Win", title: "Startup launch & sale → Early entrepreneurship", description: "Proved the naysayers wrong with my first major win.", icon: "💡" },
    { year: "Deep Dive", title: "Mastering deep technologies → Hackathons and self-taught innovation", description: "1000 hours of code. No excuses, just execution.", icon: "⌨️" },
    { year: "Transformation", title: "Overcoming addiction → Transformation and growth", description: "The hardest battle was with myself. I won.", icon: "🧠" },
    { year: "Now", title: "Web3 ecosystem launch → Empowering future leaders", description: "Building the future I always envisioned.", icon: "⛓️" },
  ];

  const displayEvents = events.length > 0 ? events : defaultEvents;

  return (
    <section id="journey" className="section bg-[#0a0a0a]">
      <div className="text-center mb-16">
        <h2 className="section-title">{settings.journey_title}</h2>
        <p className="text-[#a0a0a0] max-w-2xl mx-auto mt-4">
          {settings.journey_subtitle}
        </p>
      </div>
      
      <div className="relative">
        <div className="timeline-line hidden md:block" />
        
        <div className="space-y-12">
          {displayEvents.map((event: any, index: number) => (
            <TimelineItem key={index} event={event} index={index} />
          ))}
        </div>
      </div>
      
      <div className="text-center mt-16">
        <a href="#projects" className="btn-primary">Learn More About My Vision</a>
      </div>
    </section>
  );
}

function ResumeSection() {
  const jobs = [
    {
      company: "TGIAM",
      location: "Nairobi, Kenya",
      title: "Founder and CEO",
      period: "01/2018 - Present",
      highlights: [
        "Freelance web developer, marketing expert, business development expert, content creator and community developer at Superteam earn, Circle USDC, Monad network, Somnia network, Hackernoon, Bitbadges, Polygon network, Worldcoin network, BNB network, chaingpt, Chainlink and Solana network.",
        "Freelance content creator and mentor, SolMinds podcast and partner in psychology and spiritual communities (Asktheexpert, Psychology Today).",
        "Volunteer fundraising and business development executive at PLANE Uganda and Gangways initiative Germany.",
        "Consulting developer at Agi.ai and Catoffgaming.xyz.",
        "Co-Founder Cheza World International and business development partner at Cheza World Kenya, Wotekwa Wote Kenya.",
        "Founder and developer Degen Disruptive HCD: A next generation Human centered Design course.",
      ],
    },
    {
      company: "Dreadmor Games",
      location: "New York, USA",
      title: "Community Manager",
      period: "05/2025 - 12/2025",
      highlights: [
        "Moderated and supported online community channels to foster positive engagement and growth.",
        "Assisted players with questions, feedback, and onboarding to enhance community experience.",
        "Maintained active discussions and ensured adherence to community guidelines.",
        "Highlighted game updates and events to keep players informed and involved.",
      ],
    },
    {
      company: "Superteam Earn",
      location: "Mumbai, India",
      title: "Freelance Researcher",
      period: "02/2023 - 02/2025",
      highlights: [
        "Moderated and supported Web3 community channels, ensuring positive engagement.",
        "Assisted new contributors by answering questions and clarifying bounty requirements.",
        "Created original Web3 content including educational posts and ecosystem updates.",
        "Amplified hackathons, bounties, and project launches through crypto-native communication.",
      ],
    },
    {
      company: "Catoff Games",
      location: "Mumbai, India",
      title: "Business Development Manager",
      period: "05/2024 - 11/2024",
      highlights: [
        "Web3 gaming platform enabling peer-to-peer challenges and wagers with smart-contract-based payouts.",
        "Identified and developed strategic partnerships to drive platform growth and adoption.",
        "Led outreach to ecosystem partners, creators, and communities within Web3 and gaming.",
        "Supported go-to-market strategy and expansion initiatives.",
      ],
    },
    {
      company: "Afex",
      location: "Ibadan, Nigeria",
      title: "Software Engineer",
      period: "01/2022 - 11/2022",
      highlights: [
        "Streamlined CI/CD pipelines for faster and more reliable code deployments.",
        "Analyzed system requirements to make informed technology stack decisions.",
        "Ensured code quality and maintainability by enforcing SOLID principles.",
      ],
    },
    {
      company: "Nanjing Manyuan Tech",
      location: "Nanjing, China",
      title: "Software Engineer",
      period: "01/2021 - 12/2021",
      highlights: [
        "Modified and extended existing software to fix defects and add new features.",
        "Assisted with integration of cross-functional technology and business solutions.",
        "Provided guidance related to upgrade cycle, end of life support and operational risks.",
      ],
    },
    {
      company: "John Snow Inc",
      location: "Washington, DC",
      title: "Software Test Engineer",
      period: "01/2020 - 05/2021",
      highlights: [
        "Provided strategic planning and vision to promote quality assurance technical initiatives.",
        "Troubleshot issues and bugs discovered in testing to determine root cause.",
        "Worked with developers to determine testing coverage needs and provide feedback.",
      ],
    },
    {
      company: "Illustrate Digital",
      location: "Manchester, UK",
      title: "Marketing Coordinator",
      period: "01/2017 - 05/2020",
      highlights: [
        "Developed and maintained relationships with external vendors.",
        "Monitored and analyzed social media metrics to guide strategy adjustments.",
        "Evaluated effectiveness of marketing initiatives, providing actionable insights.",
      ],
    },
    {
      company: "Medecins Du Monde",
      location: "Paris, France",
      title: "Psychologist, Private Practice",
      period: "11/2014 - 05/2017",
      highlights: [
        "Conducted research on human behavior.",
        "Assisted in training.",
        "Worked with individuals after trauma and in gender-based recovery.",
      ],
    },
  ];

  const skills = [
    "Business Development",
    "Customer Service",
    "Communication Skills",
    "Computer Literacy",
    "Time Management",
    "Strategic Thinking",
    "Business Planning",
    "Strategy Implementation",
    "Revenue Development",
    "Financial Management",
    "Goal Setting",
    "Visionary Leadership",
    "Volunteer Recruitment",
    "Fundraising Expertise",
    "Social Media Management",
    "Event Organizing",
    "Cross Cultural Sensitivity",
  ];

  return (
    <section id="resume" className="section bg-[#0a0a0a]">
      <div className="text-center mb-16">
        <h2 className="section-title">Professional Experience</h2>
        <p className="text-[#a0a0a0] max-w-2xl mx-auto mt-4">
          A proven track record of building, leading, and scaling across multiple industries and continents.
        </p>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        {jobs.map((job, index) => (
          <div key={index} className="card">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{job.title}</h3>
                <p className="text-[#ff3d00] font-medium">{job.company}</p>
                <p className="text-[#666] text-sm">{job.location}</p>
              </div>
              <span className="font-mono text-[#666] text-sm mt-2 md:mt-0">{job.period}</span>
            </div>
            <ul className="space-y-2">
              {job.highlights.map((highlight, hIndex) => (
                <li key={hIndex} className="text-[#a0a0a0] text-sm leading-relaxed flex gap-2">
                  <span className="text-[#ff3d00]">•</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">Skills</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-[#a0a0a0] text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="text-center mt-16">
        <a href="#projects" className="btn-primary">View My Projects</a>
      </div>
    </section>
  );
}

function TimelineItem({ event, index }: { event: any; index: number }) {
  const isLeft = index % 2 === 0;
  
  return (
    <div className={`flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 relative`}>
      <div className="flex-1 md:text-right">
        <div className={`card ${isLeft ? 'md:mr-8' : 'md:ml-8'}`}>
          <span className="font-mono text-[#ff3d00] text-sm">{event.year}</span>
          <h3 className="text-xl font-bold text-white mt-1 mb-2">{event.title}</h3>
          <p className="text-[#a0a0a0]">{event.description}</p>
        </div>
      </div>
      <div className="hidden md:flex w-16 h-16 bg-[#141414] border-2 border-[#ff3d00] rounded-full items-center justify-center text-2xl absolute left-1/2 transform -translate-x-1/2 z-10">
        {event.icon}
      </div>
      <div className="flex-1" />
    </div>
  );
}

function ProjectsSection({ settings, projects }: { settings: Record<string, string>; projects: any[] }) {
  const defaultProjects = [
    { title: "Web3 Leadership Ecosystem", description: "Platform for creating visionary leaders and entrepreneurs.", tags: ["Web3", "Leadership", "Education"], icon: "👑" },
    { title: "NFT Rental Agreements Platform", description: "Empowering users to leverage technology for financial freedom.", tags: ["NFT", "DeFi", "Platform"], icon: "🎫" },
    { title: "Tech & Innovation Initiatives", description: "Training, mentorship, and community building for changemakers.", tags: ["Education", "Mentorship", "Community"], icon: "🛠️" },
  ];

  const displayProjects = projects.length > 0 ? projects : defaultProjects;

  return (
    <section id="projects" className="section bg-[#0a0a0a]">
      <div className="text-center mb-16">
        <h2 className="section-title">{settings.projects_title}</h2>
        <p className="text-[#a0a0a0] max-w-2xl mx-auto mt-4">
          {settings.projects_subtitle}
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {displayProjects.map((project: any, i: number) => (
          <ProjectCard key={i} project={project} />
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
        <a href="#" className="btn-secondary text-center">Explore My Work</a>
        <a href="#contact" className="btn-primary text-center">Join My Ecosystem</a>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: any }) {
  return (
    <div className="card glow-effect h-full flex flex-col">
      <div className="text-5xl mb-6 animate-float">{project.icon}</div>
      <h3 className="text-xl font-bold text-white mb-4">{project.title}</h3>
      <p className="text-[#a0a0a0] flex-grow mb-6">{project.description}</p>
      <div className="flex flex-wrap gap-2">
        {(project.tags || []).map((tag: string, index: number) => (
          <span key={index} className="px-3 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-xs text-[#a0a0a0]">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function BlogSection({ settings, posts }: { settings: Record<string, string>; posts: any[] }) {
  const defaultPosts = [
    { title: "Why Second Chances Matter in Web3", excerpt: "The decentralized future belongs to those who were told they didn't belong.", date: "March 2026", readTime: "5 min read" },
    { title: "From Homeless to Web3: My Blueprint", excerpt: "The exact steps I took to transform my life and build in the digital age.", date: "February 2026", readTime: "8 min read" },
    { title: "The Death of Traditional Entrepreneurship", excerpt: "Why Web3 is rewriting the rules of building and ownership.", date: "January 2026", readTime: "6 min read" },
  ];

  const displayPosts = posts.length > 0 ? posts : defaultPosts;

  return (
    <section id="blog" className="section bg-[#0a0a0a]">
      <div className="text-center mb-16">
        <h2 className="section-title">{settings.blog_title}</h2>
        <p className="text-[#a0a0a0] max-w-2xl mx-auto mt-4">
          {settings.blog_subtitle}
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {displayPosts.map((post: any, i: number) => (
          <BlogCard key={i} post={post} />
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
        <a href="#" className="btn-secondary text-center">Read More</a>
        <a href="#" className="btn-secondary text-center">Subscribe for Updates</a>
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: any }) {
  return (
    <div className="card cursor-pointer">
      <div className="flex gap-4 text-xs text-[#a0a0a0] mb-4 font-mono">
        <span>{post.date}</span>
        <span>•</span>
        <span>{post.readTime}</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-3 hover:text-[#ff3d00] transition-colors">{post.title}</h3>
      <p className="text-[#a0a0a0]">{post.excerpt}</p>
    </div>
  );
}

function ContactSection({ settings }: { settings: Record<string, string> }) {
  return (
    <section id="contact" className="section bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-title">{settings.contact_title}</h2>
          <p className="text-[#a0a0a0] mt-4">
            {settings.contact_subtitle}
          </p>
        </div>
        
        <div className="mb-8">
          <a 
            href="https://cal.id/acemichel0-gmail" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Schedule a Meeting
          </a>
        </div>
        
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#2a2a2a]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#0a0a0a] text-[#666]">Or send a message</span>
          </div>
        </div>
        
        <form className="space-y-6" action="/api/connections" method="POST">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm text-[#a0a0a0] mb-2">Name</label>
              <input type="text" id="name" name="name" placeholder="Your name" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-[#a0a0a0] mb-2">Email</label>
              <input type="email" id="email" name="email" placeholder="your@email.com" required />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="linkedin" className="block text-sm text-[#a0a0a0] mb-2">LinkedIn (optional)</label>
              <input type="url" id="linkedin" name="linkedin" placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <label htmlFor="twitter" className="block text-sm text-[#a0a0a0] mb-2">Twitter (optional)</label>
              <input type="text" id="twitter" name="twitter" placeholder="@username" />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm text-[#a0a0a0] mb-2">Message</label>
            <textarea id="message" name="message" rows={5} placeholder="Tell me about your project or inquiry..." />
          </div>
          <button type="submit" className="btn-primary w-full">Send Message</button>
        </form>
        
        <div className="mt-12 space-y-4">
          {settings.email && (
            <a href={`mailto:${settings.email}`} className="flex items-center justify-center gap-3 text-[#a0a0a0] hover:text-[#ff3d00] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {settings.email}
            </a>
          )}
          {settings.phone && (
            <a href={`tel:${settings.phone}`} className="flex items-center justify-center gap-3 text-[#a0a0a0] hover:text-[#ff3d00] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {settings.phone}
            </a>
          )}
        </div>
        
        <div className="flex justify-center gap-6 mt-8">
          {settings.twitter && <SocialLink href={settings.twitter} label="Twitter">Twitter</SocialLink>}
          {settings.discord && <SocialLink href={settings.discord} label="Discord">Discord</SocialLink>}
          {settings.linkedin && <SocialLink href={settings.linkedin} label="LinkedIn">LinkedIn</SocialLink>}
          {settings.github && <SocialLink href={settings.github} label="GitHub">GitHub</SocialLink>}
        </div>
      </div>
    </section>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-[#a0a0a0] hover:text-[#ff3d00] transition-colors flex items-center gap-2">
      <span className="w-2 h-2 bg-[#ff3d00] rounded-full" />
      {children}
    </a>
  );
}

function FinalCTASection({ settings }: { settings: Record<string, string> }) {
  return (
    <section className="section bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,61,0,0.2),_transparent_70%)]" />
      <div className="text-center relative z-10">
        <h2 className="section-title">{settings.cta_title}</h2>
        <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto mt-4 mb-12">
          {settings.cta_subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#contact" className="btn-primary animate-pulse-glow">Join the Movement</a>
          <a href="#projects" className="btn-secondary">Explore My Work</a>
        </div>
      </div>
    </section>
  );
}

function Footer({ settings }: { settings: Record<string, string> }) {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#2a2a2a] py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-2xl font-bold text-gradient mb-4">ACE MICH</p>
        <p className="text-[#a0a0a0] mb-6">Empowering the next generation of leaders and innovators.</p>
        
        <div className="flex flex-col items-center gap-3 mb-6">
          {settings.email && (
            <a href={`mailto:${settings.email}`} className="text-[#a0a0a0] hover:text-[#ff3d00] transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {settings.email}
            </a>
          )}
          {settings.phone && (
            <a href={`tel:${settings.phone}`} className="text-[#a0a0a0] hover:text-[#ff3d00] transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {settings.phone}
            </a>
          )}
        </div>
        
        <div className="flex justify-center gap-6 mb-8">
          {settings.twitter && <a href={settings.twitter} className="text-[#a0a0a0] hover:text-[#ff3d00] transition-colors">Twitter</a>}
          {settings.discord && <a href={settings.discord} className="text-[#a0a0a0] hover:text-[#ff3d00] transition-colors">Discord</a>}
          {settings.linkedin && <a href={settings.linkedin} className="text-[#a0a0a0] hover:text-[#ff3d00] transition-colors">LinkedIn</a>}
          {settings.github && <a href={settings.github} className="text-[#a0a0a0] hover:text-[#ff3d00] transition-colors">GitHub</a>}
        </div>
        <p className="text-[#a0a0a0] text-sm">© {new Date().getFullYear()} Ace Mich. All rights reserved.</p>
      </div>
    </footer>
  );
}
