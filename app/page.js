import { personalData } from "@/utils/data/personal-data";
import { getAllPosts } from "@/lib/blog";
import AboutSection from "./components/homepage/about";
import Blog from "./components/homepage/blog";
import ContactSection from "./components/homepage/contact";
import Education from "./components/homepage/education";
import Experience from "./components/homepage/experience";
import HeroSection from "./components/homepage/hero-section";
import Projects from "./components/homepage/projects";
import Skills from "./components/homepage/skills";

async function getDevToBlogs() {
  try {
    const res = await fetch(
      `https://dev.to/api/articles?username=${personalData.devUsername}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getData() {
  const [localPosts, devToPosts] = await Promise.all([
    Promise.resolve(getAllPosts()),
    getDevToBlogs(),
  ]);

  const localWithSource = localPosts.map((post) => ({
    ...post,
    source: 'local',
    url: `/blog/${post.slug}`,
    reading_time_minutes: parseInt(post.read_time) || 5,
  }));

  const devToWithSource = (devToPosts || [])
    .filter((post) => post.cover_image)
    .map((post) => ({ ...post, source: 'devto' }));

  // Combine and shuffle
  const combined = [...localWithSource, ...devToWithSource];
  return combined.sort(() => Math.random() - 0.5);
}

export default async function Home() {
  const blogs = await getData();

  return (
    <div suppressHydrationWarning >
      <HeroSection />
      <AboutSection />
      <Experience />
      <Skills />
      <Projects />
      <Education />
      <Blog blogs={blogs} />
      <ContactSection />
    </div>
  )
};