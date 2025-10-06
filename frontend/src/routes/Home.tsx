import { Helmet } from 'react-helmet-async';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Benefits from '@/components/Benefits';
import TrustBar from '@/components/TrustBar';
import FAQ from '@/components/FAQ';

const Home = () => (
  <div>
    <Helmet>
      <title>RedHat Funding — Flexible Business Capital</title>
      <meta
        name="description"
        content="Secure flexible business funding in under two minutes with RedHat Funding's streamlined application."
      />
    </Helmet>
    <Hero />
    <TrustBar />
    <HowItWorks />
    <Benefits />
    <FAQ />
  </div>
);

export default Home;
