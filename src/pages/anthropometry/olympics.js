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

const ParisSankey = dynamic( () => import('@/components/olympics/ParisSankey'), {loading: () => <AnimatedLoader className="w-8 h-8 animate-pulse mx-auto mb-2" />,
  ssr: false })


export default function Olympics() {
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
                qualify for the Olympics ?The answer is proof that,the Olympics are not the supreme theather for athletics, but are the televised 
                legitimate theater of the event, serving is the furthest point one can realistically attain. In literature, most attempts at explaining
                Olympic medal distribution have been targeted at emloying only the explanatory variables that intuively make sense. Regression analysis
                based on population sizes, wealth distribution, welface indicators, climatic indicators and many others have at best, been well adjusted 
                at partially explaining trends and poor at forecasting whilst still heavily focused on understanding the causal relationships between the
                dependent variables and regressors.
                </p>
                </AnimatedSection>

                <AnimatedSection 
                  animation="fadeIn" 
                  duration={1.2} 
                  className="py-12"
                >
                <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline justify-center items-center' style={{ lineHeight: '1.7' }}>
                The Economic Growth Model,with its choice of regressors, happens to encompass the most critical dependent variables without 
                explaining any causal effects.The model elevates the role played by economic growth differences amoung nations as the key 
                driver in the transformation of knowledge into useful combined outputs. Growth in economic output is proportional to the size
                of the population and the population fraction invested in production of new technologies. The link to population size is weak 
                and is subordinate to the idea of population fraction involved in research and development as some of the best performing nations
                at the Olympics have small populations but massive technological industries. A larger total population means a larger pool of potential
                athletes and a larger support population of individuals who can contribute directly or otherwise towards winning medals leading 
                to the expectation for populous countries to win medals. Countries with larger talent pools are more likely to have hopeful Olympic
                athletes selected solely due to their merits simply due to the large number of athletes that show up to trials. The correlation 
                between population size and economic growth is not comprehensive in its explanations or predictions of obtainable medals for small
                but magnificently rich nations such as Switzerland, Norway or Qatar. A higher GDP per capita plays no role in enhancing a country's
                prospects at the Olympics if none of the national gains are used in fostering activities related with winning medals. The Vatican, 
                Monaco, Bahrain, Brunei, Lichtenstein and others form a long list of countries with extremely high standards of living, enough money
                to invest in sports but no medals. The last variable in the theory is best summed up in the word "permeability", that is, how open and
                accessible a nation is. This defination encompasses geographical and political factors that represent just how easy it is, for 
                information and cultural exchanges to occur. An athlete in any of the Western European nations requires the least of effort for them
                to not only compete with champions from other nations, but has the ability to connect and train with the myriad of coaches around 
                allowing them to effectively receive the best opportunities. 
                </p>
                </AnimatedSection>





                <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">Paris 2024</h2>

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
                                <ParisSankey />
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
