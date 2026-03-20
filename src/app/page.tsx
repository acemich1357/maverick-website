import Link from "next/link";
import { db } from "@/db";

export const dynamic = 'force-dynamic';
import { siteSettings, photos, projects, blogPosts, timelineEvents } from "@/db/schema";

async function getSiteData() {
  try {
    const [settings, allPhotos, allProjects, allPosts, allEvents] = await Promise.all([
      db.select().from(siteSettings),
      db.select().from(photos).orderBy(photos.slot),
      db.select().from(projects).orderBy(projects.order),
      db.select().from(blogPosts).orderBy(blogPosts.order),
      db.select().from(timelineEvents).orderBy(timelineEvents.order),
    ]);

    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return {
      settings: settingsMap,
      photos: allPhotos,
      projects: allProjects.map(p => ({
        ...p,
        tags: p.tags ? JSON.parse(p.tags) : [],
      })),
      posts: allPosts,
      events: allEvents,
    };
  } catch {
    return {
      settings: {},
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
        <div className="hidden md:flex gap-8">
          <NavLink href="#about">About</NavLink>
          <NavLink href="#journey">Journey</NavLink>
          <NavLink href="#projects">Projects</NavLink>
          <NavLink href="#blog">Insights</NavLink>
          <NavLink href="#contact">Connect</NavLink>
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

function HeroSection({ settings, photos }: { settings: Record<string, string>; photos: { slot: number; url: string; alt: string | null }[] }) {
  const hasPhoto = photos.some(p => p.slot === 1 && p.url);
  
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,61,0,0.15),_transparent_50%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff3d00]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff8c00]/10 rounded-full blur-3xl" />
      
      <div className="section text-center relative z-10">
        <p className="font-mono text-[#ff3d00] mb-6 tracking-widest uppercase text-sm">
          {settings.hero_subtitle || "Visionary Entrepreneur • Web3 Innovator • Builder"}
        </p>
        <h1 className="section-title mb-6">
          {(settings.hero_headline || "Not Your Ordinary Entrepreneur.\nDreamer. Revolutionary. Builder.").split("\n").map((line, i) => (
            <span key={i}>
              {i === 1 ? <span className="text-gradient">{line}</span> : line}
              {i === 0 && <br />}
            </span>
          ))}
        </h1>
        <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto mb-12 leading-relaxed">
          {settings.hero_intro || "Empowering the next generation of leaders and innovators through Web3. I am Ace Mich—someone who has walked the toughest paths, learned from the school of life, and emerged stronger, wiser, and ready to build the future."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#about" className="btn-primary text-center">Discover My Journey</a>
          <a href="#contact" className="btn-secondary text-center">Join the Movement</a>
        </div>
        
        <div className="mt-16 flex justify-center gap-6">
          <SocialIcon href={settings.twitter || "#"} label="Twitter">X</SocialIcon>
          <SocialIcon href={settings.linkedin || "#"} label="LinkedIn">in</SocialIcon>
          <SocialIcon href={settings.github || "#"} label="GitHub">GH</SocialIcon>
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
        <h2 className="section-title">{settings.about_title || "The Journey That Made Me Who I Am"}</h2>
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

function JourneySection({ settings, events }: { settings: Record<string, string>; events: { id: number; year: string; title: string; description: string; icon: string | null; order: number }[] }) {
  return (
    <section id="journey" className="section bg-[#0a0a0a]">
      <div className="text-center mb-16">
        <h2 className="section-title">{settings.journey_title || "From Trials to Triumph"}</h2>
        <p className="text-[#a0a0a0] max-w-2xl mx-auto mt-4">
          {settings.journey_subtitle || "Life is not a straight line. Mine has been filled with highs, lows, lessons, and breakthroughs. Here's a look at the moments that defined me:"}
        </p>
      </div>
      
      <div className="relative">
        <div className="timeline-line hidden md:block" />
        
        <div className="space-y-12">
          {events.length > 0 ? events.map((event, index) => (
            <TimelineItem key={event.id} event={event} index={index} />
          )) : (
            <DefaultTimeline />
          )}
        </div>
      </div>
      
      <div className="text-center mt-16">
        <a href="#projects" className="btn-primary">Learn More About My Vision</a>
      </div>
    </section>
  );
}

function DefaultTimeline() {
  const defaultEvents = [
    { year: "Rock Bottom", title: "Homelessness → Finding resilience in adversity", description: "The darkest chapter became the foundation of my strength.", icon: "🏕️" },
    { year: "The Crossing", title: "Crossing borders → Learning the world firsthand", description: "No papers, no problem. I learned that courage beats circumstance.", icon: "🌍" },
    { year: "First Win", title: "Startup launch & sale → Early entrepreneurship", description: "Proved the naysayers wrong with my first major win.", icon: "💡" },
    { year: "Deep Dive", title: "Mastering deep technologies → Hackathons and self-taught innovation", description: "1000 hours of code. No excuses, just execution.", icon: "⌨️" },
    { year: "Transformation", title: "Overcoming addiction → Transformation and growth", description: "The hardest battle was with myself. I won.", icon: "🧠" },
    { year: "Now", title: "Web3 ecosystem launch → Empowering future leaders", description: "Building the future I always envisioned.", icon: "⛓️" },
  ];

  return defaultEvents.map((event, index) => (
    <TimelineItem key={index} event={event} index={index} />
  ));
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
  return (
    <section id="projects" className="section bg-[#0a0a0a]">
      <div className="text-center mb-16">
        <h2 className="section-title">{settings.projects_title || "Building the Future, One Innovation at a Time"}</h2>
        <p className="text-[#a0a0a0] max-w-2xl mx-auto mt-4">
          {settings.projects_subtitle || "Web3 isn't just technology—it's an opportunity to create leaders, entrepreneurs, and second chances."}
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {projects.length > 0 ? projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        )) : (
          <DefaultProjects />
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
        <a href="#" className="btn-secondary text-center">Explore My Work</a>
        <a href="#contact" className="btn-primary text-center">Join My Ecosystem</a>
      </div>
    </section>
  );
}

function DefaultProjects() {
  const defaults = [
    { title: "Web3 Leadership Ecosystem", description: "Platform for creating visionary leaders and entrepreneurs.", tags: ["Web3", "Leadership", "Education"], icon: "👑", link: "#" },
    { title: "NFT Rental Agreements Platform", description: "Empowering users to leverage technology for financial freedom.", tags: ["NFT", "DeFi", "Platform"], icon: "🎫", link: "#" },
    { title: "Tech & Innovation Initiatives", description: "Training, mentorship, and community building for changemakers.", tags: ["Education", "Mentorship", "Community"], icon: "🛠️", link: "#" },
  ];

  return defaults.map((p, i) => (
    <ProjectCard key={i} project={{ id: i, ...p, order: i }} />
  ));
}

function ProjectCard({ project }: { project: any }) {
  return (
    <div className="card glow-effect h-full flex flex-col">
      <div className="text-5xl mb-6 animate-float">{project.icon}</div>
      <h3 className="text-xl font-bold text-white mb-4">{project.title}</h3>
      <p className="text-[#a0a0a0] flex-grow mb-6">{project.description}</p>
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag: string, index: number) => (
          <span key={index} className="px-3 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-xs text-[#a0a0a0]">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function BlogSection({ settings, posts }: { settings: Record<string, string>; posts: any[] }) {
  return (
    <section id="blog" className="section bg-[#0a0a0a]">
      <div className="text-center mb-16">
        <h2 className="section-title">{settings.blog_title || "Thoughts, Lessons, and Innovations"}</h2>
        <p className="text-[#a0a0a0] max-w-2xl mx-auto mt-4">
          {settings.blog_subtitle || "A space for insights on entrepreneurship, Web3, technology, and personal growth."}
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {posts.length > 0 ? posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        )) : (
          <DefaultPosts />
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
        <a href="#" className="btn-secondary text-center">Read More</a>
        <a href="#" className="btn-secondary text-center">Subscribe for Updates</a>
      </div>
    </section>
  );
}

function DefaultPosts() {
  const defaults = [
    { title: "Why Second Chances Matter in Web3", excerpt: "The decentralized future belongs to those who were told they didn't belong.", date: "March 2026", readTime: "5 min read" },
    { title: "From Homeless to Web3: My Blueprint", excerpt: "The exact steps I took to transform my life and build in the digital age.", date: "February 2026", readTime: "8 min read" },
    { title: "The Death of Traditional Entrepreneurship", excerpt: "Why Web3 is rewriting the rules of building and ownership.", date: "January 2026", readTime: "6 min read" },
  ];

  return defaults.map((p, i) => (
    <BlogCard key={i} post={{ id: i, ...p, link: "#", order: i }} />
  ));
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
          <h2 className="section-title">{settings.contact_title || "Let's Build Something Extraordinary"}</h2>
          <p className="text-[#a0a0a0] mt-4">
            {settings.contact_subtitle || "Whether you want to collaborate, invest, or learn from my journey, I'm ready to connect."}
          </p>
        </div>
        
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm text-[#a0a0a0] mb-2">Name</label>
              <input type="text" id="name" placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-[#a0a0a0] mb-2">Email</label>
              <input type="email" id="email" placeholder="your@email.com" />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm text-[#a0a0a0] mb-2">Message</label>
            <textarea id="message" rows={5} placeholder="Tell me about your project or inquiry..." />
          </div>
          <button type="submit" className="btn-primary w-full">Send Message</button>
        </form>
        
        <div className="flex justify-center gap-6 mt-12">
          {settings.twitter && <SocialLink href={settings.twitter} label="Twitter">Twitter</SocialLink>}
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
        <h2 className="section-title">{settings.cta_title || "The Sky Is Never the Limit"}</h2>
        <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto mt-4 mb-12">
          {settings.cta_subtitle || "I believe in pushing boundaries, creating opportunities, and empowering the next generation. Join me and reach for the galaxy."}
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
        <div className="flex justify-center gap-6 mb-8">
          <a href={settings.twitter || "#"} className="text-[#a0a0a0] hover:text-[#ff3d00] transition-colors">Twitter</a>
          <a href={settings.linkedin || "#"} className="text-[#a0a0a0] hover:text-[#ff3d00] transition-colors">LinkedIn</a>
          <a href={settings.github || "#"} className="text-[#a0a0a0] hover:text-[#ff3d00] transition-colors">GitHub</a>
        </div>
        <p className="text-[#a0a0a0] text-sm">© {new Date().getFullYear()} Ace Mich. All rights reserved.</p>
      </div>
    </footer>
  );
}
