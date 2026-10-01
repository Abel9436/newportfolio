import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Testimonials } from "@/components/sections/Testimonials";
import { Toolkit } from "@/components/sections/Toolkit";
import { Training } from "@/components/sections/Training";
import { Work } from "@/components/sections/Work";
import { IntroProvider } from "@/components/providers/Intro";
import { ReachProvider } from "@/components/providers/Reach";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ThemeProvider } from "@/components/providers/Theme";
import { Stage } from "@/components/three/StageCanvas";
import { Cursor, Grain } from "@/components/ui/Cursor";
import { GridLines } from "@/components/ui/GridLines";
import { Nav } from "@/components/ui/Nav";
import { Preloader } from "@/components/ui/Preloader";
import { Nudge } from "@/components/ui/Nudge";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { TalkBadge } from "@/components/ui/TalkBadge";

export default function Home() {
  return (
    <ThemeProvider>
      <IntroProvider>
        <SmoothScroll>
          <ReachProvider>
            <Preloader />
            <GridLines />
            <Stage />
            <Nav />
            <SectionIndex />
            <main>
              <Hero />
              <About />
              <Marquee />
              <Work />
              <Testimonials />
              <Experience />
              <Training />
              <Toolkit />
              <Contact />
            </main>
            <TalkBadge />
            <Nudge />
            <Grain />
            <Cursor />
          </ReachProvider>
        </SmoothScroll>
      </IntroProvider>
    </ThemeProvider>
  );
}
