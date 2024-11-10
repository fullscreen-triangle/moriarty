import dynamic from "next/dynamic";
import { useEffect, useState, Suspense } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatedSection } from '@/components/AnimatedSection';
import { AnimatedLoader } from '@/components/AnimatedLoader';
import Layout from "@/components/Layout";
import Head from "next/head";
import AnimatedText from "@/components/AnimatedText";
import TransitionEffect from "@/components/TransitionEffect";
import Image from "next/image";
import { LazyVideoPlayer } from '@/components/LazyVideoPlayer';
import { videos } from '@/lib/videoData.js';




const Combinedbrush = dynamic(
  () => import('@/components/athletes/brush/Combinedbrush'),
  {loading: () => <AnimatedLoader className="w-8 h-8 animate-pulse mx-auto mb-2" />, ssr: false }
)



const StrategyAnalysis = dynamic(
  () => import('@/components/championship/StrategyAnalysis'),
  { ssr: false }
)


export default function Equilibrium() {
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
        <title>Fullscreen Comrade| Equilibrium</title>
        <meta name="description" content="Application of Nash Equilibrium and Game Theory." />
      </Head>
      <TransitionEffect />
      <main
        className={`flex  w-full flex-col items-center justify-center dark:text-light`}
      >
        <Layout className="pt-16">
          <AnimatedText
            text="Equilibrium"
            className="mb-16 !text-8xl !leading-tight lg:!text-7xl sm:!text-6xl xs:!text-4xl sm:mb-8"
          />

          <div className="grid w-full grid-cols-8 gap-16 sm:gap-8">
            <div className="col-span-3 flex flex-col items-start justify-start xl:col-span-4 md:order-2 
            md:col-span-8">
              <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">
                Tournaments 
              </h2>

              <AnimatedSection 
                  animation="fadeIn" 
                  duration={1.2} 
                  className="py-12"
                >

                  <div className="my-8 xl:mb-16 xl:mt-12">
                    <Image
                      className="hidden w-full dark:block"
                      src={"/images/technical/synchronization.png"}
                      alt="synchronization"
                      width={800}
                      height={700}
                      priority={true}
                    />
                  </div>

              <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline justify-center items-center' style={{ lineHeight: '1.7' }}>
                The one time nationality correlated with any sprint event was the glorious Jamaican golden age that saw an excess of 
                top-of-the-shelf sprinters, equal only in age and supreme in their specialities. One can imagine how unashemadely unfair 
                it was to compete against team Jamaica's senior men's 4x100m relay team. So hot were the seats, that, all 8 shortlisted athletes
                had confirmed multiple sub 10s, Asafa Powell having 99, and were all listed in the top 20 fastest men to have ever existed. 
                Yohan Blake, Usain Bolt and Asafa Powell also happened to have the three fastest times ever recorded, had played hot potato  
                with the world record for all distances, metric and imperial. This should however, not distract us from the fact that Jamaica 
                did not win any track gold medal at the Paris 2024 Olympics.
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
                      <section className="flex justify-center items-center h-full w-full">
                      <LazyVideoPlayer 
                          videoSources={videos.introVideo.sources}
                          title={videos.introVideo.title}
                        />                      </section>
                      </Suspense>
                    </AnimatedSection>

                   
                  </>
                )}

                <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline justify-center items-center' style={{ lineHeight: '1.7' }}>
                  For a few years, the Kingston Championship was a blue ribbon event and rightfully so. This was an anomaly and the chances 
                  of ever experiencing such are gone. There is no correlation between national population or GDP estimates with success at the 
                  400m event. A nation like Botswana has the same likelihood of producing a star as the United States or Barbados. Like most 
                  Olympic sports, there was always some initial domination by team USA simply due to logistics. With excess dollars in reserves, 
                  the US was able to field athletes at every tournament and its no surprise why all the earliest records belonged to the US. 
                  The reality has completely changed and the economies of scale and global interactions have now made it manageable for 
                  concerned parties to field track athletes.        
                </p>

                <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline justify-center items-center' style={{ lineHeight: '1.7' }}>
                  As pointed out before, the 400m race is the only event that does not involve brut force, and is dependent on strategy. 
                  The involvement of complex anxieties, mental focus, social facilitation and other aspects of competition play a role in 
                  facilitating the variability in peak performance in athletes. There is an undeniable phenomenon of behavioral synchronisation
                  of movements by individuals coupling their perceptual information. Kinship mimicry is an evolutionary strategy that has worked 
                  wonders for humans as that allowed for faster and more efficient ways of propergating information. Individuals still have 
                  their own preferred or optimum movements whose difference should be minimal enough for compensation through perception coupling. 
                  Usain Bolt is an individual who had trained for almost every race imaginable and would not be expected to fall prey to synchronisation
                  with other athletes when focusing on self seems to be most practical. Synchronisation of steps with an individual running towards 
                  a 9.71s, is by no means dense. 
                  </p>

                  <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline justify-center items-center' style={{ lineHeight: '1.7' }}>
                    Locked synchronisation is a very rare occasion but was considered regardless to explain a phenomenon that happened. 
                    It should come as no suprise to anyone, that one summer night in Berlin 2009, the night Usain Bolt gave birth to himself for the first time, he was 
                    standing on the shoulders of giants. In Lane 1, was Michael Frater, 5th fastest human ever, in third lane was Bolt, in fourth 
                    was Tyson Gay and in fifth, was Asafa Powell. All three had delivered sub 10 performances in every heat, all the way to the final.
                    Using frame-by-frame vidoe analysis, Richardson and Varlet extracted all the frames with ground contact for all heats and semi-finals,
                    using all the other races as control synchronisation, that is, controling for the apparent synchronisations that might arise 
                    simply due to both athletes doing the same thing at the same time. The computed relative phases showed high synchronisation with a 0 degree 
                    difference in 24% of the instances.The continous drift in the relative phases is evidence for the constrains to synchronisation, especially 
                    step frequency. Usain Bolt towers above every other sprinter with his height of 196cm and this gives him a 20% increase in distance convered 
                    with each step. 
                  </p>



                {isClient && (
                  <>
                    <AnimatedSection 
                      animation="slideIn" 
                      duration={1} 
                      className="py-12"
                    >
                      <Suspense fallback={<AnimatedLoader />}>
                      <section className="flex justify-center items-center h-full w-full">
                      <LazyVideoPlayer 
                          videoSources={videos.processVideo.sources}
                          title={videos.processVideo.title}
                        />                      </section>
                      </Suspense>
                    </AnimatedSection>

                   
                  </>
                )}

                  <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline justify-center items-center' style={{ lineHeight: '1.7' }}>
                    What followed next is what we call a miracle. It so happened, that Usain Bolt, has a stance phase time imbalance asymmetry, which sees his left leg cover 30% more 
                    in distance than his right leg. Before that event, only two human beings had ever managed to run below 9.71s, with these events 
                    seperated by 30 years. To the IAAF, the first one is null due to the fact that, Ben Johnson, tested positive for a substance, that was 
                    not classified as illegal, and ran 9.71s at the Olympics. What would FIFA do if say, Lionel Messi had scored 10 goals in the Qatar 2022 World 
                    Cup Final ? The then record was 9.95s, and Ben Johnson delivered 9.71s. Something had to be done, this was just unacceptable as it would give 
                    youths the wrong idea that, performance enhancers work, which they do. For the first time in his life and for the true accredited first time in 
                    human history, someone else was going below 9.71s. By the time athletes reached the 60m mark, the relative phase difference between the step frequencies 
                    from the two was bordering zero degrees. The asymmetry allowed Bolt to synchronise his right foot with the pace required for diving below 9.71s, 
                    and his left leg to progresively increase distance covered cumulating in a respectable sum of 41 steps.
                    </p>


                    <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline justify-center items-center' style={{ lineHeight: '1.7' }}>
                      Other than the one time mentioned before, nothing of significance happens at most tournaments, even more for 400m. In an event where 
                      brut force is the only good, it happens that only the best performing athletes are invited to tournaments and only the best show men 
                      are accordingly awarded. The 400m race is longer than the maximum limit one can maintain supramaximal velocities and a pace strategy 
                      does not suffice for giving a master performance. As pointed out in other sections,lanes introduce variability by tasking athletes 
                      with extra coordination effort and energy required in negotiating a curve. Staggered starts, which place athletes at different starting 
                      points on the curve do not sufficiently compensate for the variability in tactics employed for a given lane. Every athlete is required to 
                      lean inwards, towards the center of the semi-circle at an angle dependent on their mass, height and the radius of the curve. If the additional 
                      external factors such as wind speed, wind direction, altitude, barometric pressure and temperature are to be included, it quickly becomes 
                      apparent that most races are a disservice to the best performing athletes and a more sophisticated approach is required when drafting the 
                      invitation list and in allocating the lanes. How can one ensure that a 400m tournament can have and reward the most deserving athletes ? 
                      How can one recreate the Miracle in Berlin in the context of 400m ?    
                    </p>

                    {isClient && (
                  <>
                    <AnimatedSection 
                      animation="slideIn" 
                      duration={1} 
                      className="py-12"
                    >
                      <Suspense fallback={<AnimatedLoader />}>
                      <section className="flex justify-center items-center h-full w-full">
                       <Combinedbrush/></section>
                      </Suspense>
                    </AnimatedSection>

                   
                  </>
                )}

                      <section  className="container mx-auto items-center justify-center">
                      </section>
           
                        <p className="font-medium ">
                        Given a heterogenous mixture of athletes, what is the most optimal arrangement or grouping method, that ensures that, only the best performing athletes are rewarded and given access to the final race ? What is the most optimal way to introduce incentive mechanisms that reward performance in a promotion tournament like the Bundesliga or of specific overachieving salesmen in a company as big as Coca Cola ? An additional constraint to this optimization problem comes from the need to be optimal all the way to the specific lanes used at every stage. The closest athletics has ever been to an optimally designed rank-order tournament happened to be in Berlin 2009, the WCA Senior Mens 100m final, where Usain Bolt, Tyson Gay and Asafa Powell occupied lanes 3,4 and 5 respectively. The trio had played hot potato with the World Record in the preceeding years and happened to also have been the only living beings  at the time, who had ever posted below 9.71s. Usain Bolt has a known asymmetry in his step balance which manifests itself as a 40% 
                        increase in unit distance covered by his left leg per cycle. What would Bolt be in our memories, if it were not Gay and Powell ? Due to a deeply entranched primal instict, humans subconsiously synchronise their movements when performing group activities. The synchronisation of step frequency amoung the three, that is, the fastest possible number of steps/minute is what laid the red carpet for Bolt to reach 9.58s. Bolt has a massive height advantage, which rewards him with a 53cm lead over his average height fellows. If one is that tall and is stepping that fast, no one should be surprised if they happen to break a world record. That was the last time Usain Bolt ever ran below 9.71s.
                        </p>

                          <p className="my-4 font-medium">
                          Lazar and Rosen were the first to formalise the properties of rank-order tournaments using first order approaches which substitute incentive constraints with the orders for the contestants maximazation problems. Literature on the topic does not deliver sufficient conditions for operation of the first order approach since the objective function 
                          attributed to each contestant is only relevant dependant on endogenously determined prizes by the tournament designer. The objective function depends on the choice of the prize by the contestant. Lets consider a tournament organised between risk-neutral and zero reservation agents. In the first round, the principal decides on the prizes for the winner and loser. In the second round, the potential wins are observed by the agents before the competition. When an agent chooses to exert an exact amount of effort/ouput, the output accrues to the principal. For the principal, the objective is to maximise profit, which is realised only when the agent with the highest output is declared winner of the tournament and so the principal has to regard the incentive constraint for agents with the ability to choose, that is, win the tournament.  
                          </p>


                        <p className="my-4 font-medium">
                        The most crucial aspect of any rating system requires the fundamental condition that it consist of n-players, for a two player ranking game is a subclass of zero-sum games 
                        where no relationships hold for ranking. Any tournament with a constant payoff in all outcomes transforms into a constant-sum game with the inclusion of an additional player to absorb stray payoffs. Finding common solutions for ranking games through computation of Nash equilibriums is untenable and use of comparitive ratios based on the von-Neumann-Morgensten utility theorem which support the idea that when agents make rational choices in uncertain conditions, all decisions made are pointed at maximising the expected value of some cardinal utility function. The (TRP, Tournament Performance Rating) Elo rating system, which would be the most obvious choice for dating apps, assigns initial numerical ratings and updates them based on performance over a time period. Every time an agent scores against an opponent, their rating increases by the difference between the expected Elo rating score and the actual score. The cumulative nature of the ratings does not fully represent an agent's current performance level and would remain unchanged despite any spectacular performance by an agent.  
                        </p>

                        <p className="my-4 font-medium">
                        Ranking athletes in a tournament can be defined as n-agent normal-form ranking game with expected wins that outbid individual rankings to von-Neumann-Morgenstein cardinal utility. Shoham et al, provided matching upper and lower bounds for three comperative ratios, relating to the following solutions: the price of cautiousness, mediation values and enforcement value. An agent is expected to optimise the ratio between the minimum payoff in a Nash equilibrium and their security levels, the ratio between the obtainable rudimentary gains and the best Nash equilibrium and the ratio between the said gains and best correlated equilibrium.
                        </p>

                        <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">
                          Single Sprinter Model
                        </h2>

  






              <section  className="container mx-auto items-center justify-center">
              <div className="columns-2 mx-auto items-center justify-center">
                
              </div>
              </section>

           



          
              <p className="font-medium">
              </p>
            </div>
        
          </div>

         
        </Layout>
      </main>
    </>
  );
}
