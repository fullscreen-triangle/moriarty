import dynamic from 'next/dynamic'
import Layout from "@/components/Layout";
import Head from "next/head";
import { useEffect, useState, Suspense } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap/dist/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import AnimatedSection from '@/components/AnimatedSection';
import AnimatedLoader from '@/components/AnimatedLoader';
import AnimatedText from "@/components/AnimatedText";
import TransitionEffect from "@/components/TransitionEffect";
import ResponsiveGlobeContainer from '@/components/maps/ResponsiveGlobeContainer';



gsap.registerPlugin(ScrollTrigger);


const FourHundredAthletes = dynamic(
  () => import('@/components/maps/globes/FourHundredAthletes'),
  {  loading: () => <AnimatedLoader />,
    ssr: false }
)

const AgeHeightWeightCorrelogram = dynamic( () => import('@/components/olympics/Correlogram/AgeHeightWeightCorrelogram'), {loading: () => <AnimatedLoader className="w-8 h-8 animate-pulse mx-auto mb-2" />,
  ssr: false })



export default function OptimalAthlete() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2
    });

    // Connect GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    setIsClient(true);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return (
    <>
      <Head>
        <title>Fullscreen Comrade| Anthropometry | Olympics</title>
        <meta name="description" content="Olympics" />
      </Head>
      <TransitionEffect />
      <main
        className={`flex  w-full flex-col items-center justify-center dark:text-light`}
      >
        <Layout className="pt-16">
          <AnimatedText
            text="Olympics"
            className="mb-16 !text-8xl !leading-tight lg:!text-7xl sm:!text-6xl xs:!text-4xl sm:mb-8"
          />

          <div className="mx-auto max-w-prose px-4 py-8">
          <article className="prose prose-lg prose-slate mx-auto text-justify">
              <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">
                Olympics
              </h2>

              <AnimatedSection 
                  animation="fadeIn" 
                  duration={1.2} 
                  className="py-12"
                >

                  <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline justify-center items-center' style={{ lineHeight: '1.7' }}>
                    The Paris 2024 senior men's 400m final was a certified Night of Speed as, for the first time in history, 4 athletes 
                    managed to run sub 44s, in a single race. Quincy Hall clinched Gold, followed by Matthew Hudson-Smith of team Great Britain,
                    who simultaneosly set the new UK national record, a feat managed by bronze champion, Muzala Samukonga of Zambia. 
                     </p>
      
              </AnimatedSection>

              {isClient && (
                  <>
                    <AnimatedSection 
                      animation="slideIn" 
                      duration={1} 
                      className="py-12"
                    >
                       <Suspense fallback={<AnimatedLoader />}>
                            <section className="flex justify-center items-center w-full">
                            <ResponsiveGlobeContainer>
                                <FourHundredAthletes />
                            </ResponsiveGlobeContainer>
                            </section>
                        </Suspense>
                    </AnimatedSection>

                  </>
                )}

                <AnimatedSection 
                  animation="fadeIn" 
                  duration={1.2} 
                  className="py-12"
                >
                <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline justify-center items-center' style={{ lineHeight: '1.7' }}>
                 The average 400m sprinter weighs around 78kg and is around 180cm tall giving them the same height as a 100m or 200m sprinter 
                 and around 4kg lighter.There are two primary strategies in the 400m sprint,the Keller's strategy and the Negative Split. 
                 According to Keller, the optimal solution involves a gradual acceleration that ends at around the 300m mark followed by managed 
                 decay till completion of race. Negative split, the more conservative strategy involves maintainance of an even pace and a breakout 
                 phase in the last 100m of the race, making the last 200m faster than the first 200m. It was only in 2016 at the Rio Olympics that 
                 the first recorded use of the negative-split occured, when Wayde van Niekerk posted 43.03s and threw a wrench into the system and 
                 made theory, a reality. The physiological attributes are important and the foundation for any consideration of an athlete but shy away from exclusivity on their influence on the final result. 
                </p>
                </AnimatedSection>

                {isClient && (
                  <>
                    <AnimatedSection 
                      animation="slideIn" 
                      duration={1} 
                      className="py-12"
                    >
                       <Suspense fallback={<AnimatedLoader />}>
                            <section className="flex justify-center items-center w-full">
                            <ResponsiveGlobeContainer>
                                <AgeHeightWeightCorrelogram />
                            </ResponsiveGlobeContainer>
                            </section>
                        </Suspense>
                    </AnimatedSection>

                  </>
                )}




    
    
            </article>
        
          </div>

         
        </Layout>
      </main>
    </>
  );
}
