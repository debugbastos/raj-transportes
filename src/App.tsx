import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import { Header } from "./components/Header";
import { GalleryProvider } from "./components/Lightbox";
import { PrivacyProvider } from "./context/PrivacyContext";
import { QuoteProvider } from "./context/QuoteContext";
import { ToastProvider } from "./context/ToastContext";
import { About } from "./sections/About";
import { Contact } from "./sections/Contact";
import { Faq } from "./sections/Faq";
import { Fleet } from "./sections/Fleet";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { HowItWorks } from "./sections/HowItWorks";
import { Location } from "./sections/Location";
import { Quote } from "./sections/Quote";
import { Services } from "./sections/Services";
import { WhyChoose } from "./sections/WhyChoose";

export default function App() {
  return (
    <ToastProvider>
      <PrivacyProvider>
        <QuoteProvider>
          <GalleryProvider>
            <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
            <Header />
            <main id="conteudo">
              <Hero />
              <WhyChoose />
              <About />
              <Services />
              <HowItWorks />
              <Fleet />
              <Location />
              <Quote />
              <Faq />
              <Contact />
            </main>
            <Footer />
            <FloatingWhatsApp />
          </GalleryProvider>
        </QuoteProvider>
      </PrivacyProvider>
    </ToastProvider>
  );
}
