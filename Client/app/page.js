

import Header from "@/components/layout/Header";
import Hero from "@/components/landing/Hero";
import Stat from "@/components/landing/Stat";
import PriceSection from "@/components/landing/PriceSection";
import Middle from "@/components/landing/Middle";
import Footer from "@/components/layout/Footer";

export default function Home() {
  
  return (
    <div className=" min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Hero/>
      {/*STATS SECTION*/}
      <Stat/>

      {/* Pricing Section */}
      <PriceSection/>

      {/* CTA Section */}
      <Middle/>

      {/* Footer */}
      <Footer/>
    </div>
  );
}
