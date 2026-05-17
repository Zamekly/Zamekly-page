import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import WhyZamekly from "@/components/WhyZamekly";
import Models from "@/components/Models";
import WhereWeInstall from "@/components/WhereWeInstall";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <WhyZamekly />
        <Models />
        <WhereWeInstall />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
