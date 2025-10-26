import { Helmet } from 'react-helmet-async';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Benefits from '@/components/Benefits';
import TrustBar from '@/components/TrustBar';
import FAQ from '@/components/FAQ';
import { buildPageMetadata, businessStructuredData } from '@/lib/seo';

const metadata = buildPageMetadata({
  title: 'Flexible Business Capital',
  description: "Secure flexible business funding in under two minutes with RedHat Funding's streamlined application.",
  path: '/',
});

const Home = () => (
  <div>
    <Helmet>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="keywords" content={metadata.keywords.join(', ')} />
      <link rel="canonical" href={metadata.url} />
      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={metadata.url} />
      <meta property="og:image" content={metadata.image} />
      <meta property="og:site_name" content={metadata.siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description} />
      <meta name="twitter:image" content={metadata.image} />
      <script type="application/ld+json">{JSON.stringify(businessStructuredData)}</script>
    </Helmet>
    <Hero />
    <TrustBar />
    <HowItWorks />
    <Benefits />
    <FAQ />
  </div>
);

export default Home;
