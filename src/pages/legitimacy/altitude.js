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





export default function Altitude() {
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
                  The senior men's 400m sprint race is the most unusual of all the sprint events. 
                  For some reason, peak 400m athletes exclusively perform their best at the Summer Olympics, so much so that, all the races 
                  contributing to the progression of the record occured at some Olympic stadium.
                  Of the 48 athletes to qualify by running under 45.0s at a WCA sanctioned event, the USA, 
                  Jamaica and Belgium had the highest number of entry contastants, tied at 2 athletes for each nation. 
                  The final went down in history as the anticipated 400m version of the Night of Speed. 
                  This was the first time in the history of event that 5 individuals, 
                  three more than the previous record of 2, posted sub 44s in a single race, with the 0.04s winning margin being the narrowest ever recorded.
                   Mere participation in this final was grounds for one to be drafted into the top 15 fastest ever recorded times in the entire history of 400m. 
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
                Even though the event strictly involves individual participation, it would be absurd for one to claim that, the best performing 
                and most deserving athletes get to be the champions. The Olympics are political statement dressed up in athlete gear, it is an 
                event that includes sports, amoung a lot of other items. Even worse, is the tonnes of weight in hopes and dreams that athletes
                competing in individual events have to bear, for the blame for any underwhelming performances is placed on a single individual, 
                not a football team of 11 players. Is it possible to isolate individual performance from the various social, economic and geopolitical
                factors that influence the likelihood of participation and victory ? Can any male on the planet who somehow runs below 45s for the 400m 
                qualify for the Olympics ? The answer is proof that, the Olympics are not the supreme theather for athletics, but are the televised 
                legitimate theater of the event, serving is the furthest point one can realistically attain. In literature, most attempts at explaining
                 Olympic medal distribution have been targeted at emloying only the explanatory variables that intuively make sense. Regression analysis
                based on population sizes, wealth distribution, welface indicators, climatic indicators and many others have at best, been well adjusted 
                at partially explaining trends and poor at forecasting whilst still heavily focused on understanding the causal relationships between the
                dependent variables and regressors.
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
