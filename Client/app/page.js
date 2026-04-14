

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stat from "@/components/Stat";
import PriceSection from "@/components/PriceSection";
import Middle from "@/components/Middle";
import Footer from "@/components/Footer";

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
