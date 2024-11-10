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


gsap.registerPlugin(ScrollTrigger);


const FourHundredAthletes = dynamic(
  () => import('@/components/maps/globes/FourHundredAthletes'),
  {  loading: () => <AnimatedLoader />,
    ssr: false }
)
const MassDensityPlots = dynamic( () => import('@/components/athletes/MetricDensityPlots'), {loading: () => <AnimatedLoader className="w-8 h-8 animate-pulse mx-auto mb-2" />,
  ssr: false })

const BiometricsCrossfilter = dynamic( () => import('@/components/athletes/brush/BiometricsCrossfilter'), {loading: () => <AnimatedLoader className="w-8 h-8 animate-pulse mx-auto mb-2" />,
  ssr: false })

const OlympicsDashboard = dynamic( () => import('@/components/athletes/OlympicsDashboard'), {loading: () => <AnimatedLoader className="w-8 h-8 animate-pulse mx-auto mb-2" />,
  ssr: false })


const MassHeatMap = dynamic( () => import('@/components/athletes/MassHeatMap'), {loading: () => <AnimatedLoader />,
  ssr: false })

const BodyMassSegments = dynamic( () => import('@/components/athletes/BodyMassSegments'), {loading: () => <AnimatedLoader />,
    ssr: false })

const AthleteDeckGLFilter = dynamic( () => import('@/components/maps/AthleteDeckGLFilter'), {loading: () => <AnimatedLoader />,
      ssr: false })

const Table2Chart = dynamic( () => import('@/components/tables/Table2Chart'), { ssr: false} )


const Table4Chart = dynamic( () => import('@/components/tables/Table4Chart'), { ssr: false} )




export default function Anthropometry() {
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
        <title>Fullscreen Comrade| Anthropometry</title>
        <meta name="description" content="Comparison and analysis of body segments parameters of 
        athletes and the general population." />
      </Head>
      <TransitionEffect />
      <main
        className={`flex  w-full flex-col items-center justify-center dark:text-light`}
      >
        <Layout className="pt-16">
          <AnimatedText
            text="Anthropometry"
            className="mb-16 !text-8xl !leading-tight lg:!text-7xl sm:!text-6xl xs:!text-4xl sm:mb-8"
          />

          <div className="mx-auto max-w-prose px-4 py-8">
          <article className="prose prose-lg prose-slate mx-auto text-justify">
              <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">
                Four Hundred Sprinters 
              </h2>

              <AnimatedSection 
                  animation="fadeIn" 
                  duration={1.2} 
                  className="py-12"
                >

                  <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline justify-center items-center' style={{ lineHeight: '1.7' }}>
                Sprint running is a form of bipedal terrestrial locomotion manifested in a gait cycle with a double float time, that is, 
                a period when both feet are off the ground with ground contact occuring only with foot section between the toes and the rest 
                of the foot. Only one strategy exists in sprint running, which is to go out and leave no stone unturned. Keller introduced 
                a formal representation of the idea in his splendind equations on the rate of mechanical power loss and internal 
                physiological resistance in straight line sprinting. Sprint running is an anaerobic exercise and requires sprinters 
                to focus on running and deal with breathing at the finish line. The fastest top speed ever recorded by an athlete was that 
                one time in Manchester, when Usain Bolt practically gave birth to himself, and left everyone perplexed. He ran 14.36s for 150m.
                Usain Bolt set the 100m, 150m, 200m and 300m records, all of which will remain unmatched, except for the 300m, which was 
                twice vanquished, by two other outstanding athletes, Wayde van Niekerk and Letsile Tebogo. So out of touch with reality are these 
                two gentleman, that they form the complete list of individuals who have posted a sub 10s, sub 20s, sub 31s and sub 44s.
                Keller's equations determine the limit of the aforementioned strategy to be 291m and the consensus with physiologists places 
                30s as the upper limit for continous full sprinting. If the models are accurate, a sub 30s is energetically untenable, and 
                Tebogo or van Niekerk use another strategy. Any distance after 291m has to involve some non-tangible psychological strategy,
                which involves machinations and processes not directly involved in locomotion. It then becomes apparent, that 400m race is 
                where power meets purpose, where you cross the finish line blind, where the end justifies the means.
                 
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
                        <FourHundredAthletes dataUrl={'/json/senior/senior_men_400_hundred_indices.json'} />
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
                The average 400m sprinter weighs around 78kg and is around 180cm tall giving them the same height as a 100m or 200m sprinter and around 4kg lighter. 
                There are two primary strategies in the 400m sprint, the Keller's strategy and the Negative Split. 
                According to Keller, the optimal solution involves a gradual acceleration that ends at around the 300m mark followed by managed decay till completion of race.
                 Negative split, the more conservative strategy involves maintainance of an even pace and a breakout phase in the last 100m of the race, making the last 200m faster than the first 200m.
                  It was only in 2016 at the Rio Olympics that the first recorded use of the negative-split occured, when Wayde van Niekerk posted 43.03s and threw a wrench into the system and made theory, a reality. 
                  The physiological attributes are important and the foundation for any consideration of an athlete but shy away from exclusivity on their influence on the final result. 
                </p>
                </AnimatedSection>

                <AnimatedSection 
                  animation="fadeIn" 
                  duration={1.2} 
                  className="py-12"
                >

                  <div className="grid grid-cols-2 gap-4">
                          <div className="aspect-video bg-black rounded-lg">
                            <MassHeatMap dataUrl={'/json/senior/senior_men_four_hundred_indices.json'}/>
                          </div>
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Segmentation</h2>
                        <p className="text-white">
                          These are approximations of body segment parameters using methods introduced 
                          by Winter, Dempster and Zatsiorsky based on several imaging and scanning
                          experiments involving living and deceased subjects of all ages. The values from 
                          the initial experiments were adjusted by Leva in 1996 and have become relatively 
                          accurate in their predictions of mass, center of mass, radius of gyration and moment 
                          of inertia of body segments. More complex mathematical methods have been developed 
                          for the determination of personalized body segment inertia parameter values. The 
                          Yeadon human inertia geometric models the body as consisting of 40 geometric solids 
                          coupled to 95 anthropometric parameters and its application here would be unnecessary.                
                        </p>
                      </div>
                 </div>

                </AnimatedSection> 


                <AnimatedSection 
                  animation="fadeIn" 
                  duration={1.2} 
                  className="py-12"
                >
              <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline justify-center items-center' style={{ lineHeight: '1.7' }}>
                The ability to sprint, that is, optimal limb coordination and maintanance of supramaximal velocities develops non-linearly during childhood and adolescence.
                The fundamental dealianating factor for sprinters and non sprinters lies in the capacity of the ground reaction force generating mechanisms. In a published 
                study by Nagahara, Salo and Colyer, on the effect of biological maturity on production of GRF forces on 153 Japanese boys and girls, children were determined 
                to go through six-year-long maturation groups before attaining peak high velocity. The more mature groups had the highest maximum velocities and this was 
                primarily attributed to the more mature participants exerting higher antero-posterior ground reaction forces across marginally shorter ground contact times. 
                It comes as no suprise that, up to now, no individual under the age of 18 has ever managed to run 100m in under 10s, and the same should be expected for 
                olympians or professional athletes.
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
                        <AthleteDeckGLFilter data={'/json/senior/senior_men_400_hundred_indices.json'} />
                      </section>
                      </Suspense>
                    </AnimatedSection>

                   
                  </>
                )}

                    <AnimatedSection 
                          animation="slideIn" 
                          duration={1} 
                          className="py-12"
                        >

                  <section className="flex justify-center items-center h-full w-full">
                      <div className="flex justify-center items-center w-full">
                        <MassDensityPlots/>
                      </div>
                    </section>

                  </AnimatedSection>


                  <AnimatedSection 
                      animation="slideIn" 
                      duration={1} 
                      className="py-12"
                    >

                          <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">
                              Biometrics
                            </h2>


                    <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline' style={{ lineHeight: '1.7' }}>
                    In an analysis carried out on sprinters and normal population males in the US and Danemark, sprinters from both nations had the least variability in height, 
                    an expected outcome. Excluding Usain Bolt, the fastest man is expected to have average proportions which would suggest the optimum height to be the height 
                    of the average global human male, which is 180cm. Of all the men who have ever won the Olympic 100m Gold Medal, Usain Bolt is the only individual outside of 
                    the normal distribution, which has 180cm as the average and all other champions within 3cm. This does not apply to hurdle events, which have a strict requirement 
                    for one to be between 186cm-190cm. Optimal racing in hurdles requires one to take at best, 3 steps between the hurdles and any deviation from that will not suffice.
                    </p>

                    <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline' style={{ lineHeight: '1.7' }}>
                    The same study revealed patterns which less variability in mass, height and body mass index amoung sprinters more than the normal population. The normal populations 
                    from both the US and Danemark exhibited significantly higher body masses which proves that any weight outside of the optimum is a limiting factor in sprint running. 
                    This by no chance suggests that sprinters ought to have lower body masses, as muscles make up a large chunk of the body weight and are a crucial factor for any 
                    professional sprinter as more muscle allows for generation of higher ground reaction forces, allowing the sprinter to move further faster, with each step. 
                    </p>

                    <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline' style={{ lineHeight: '1.7' }}>
                    The next relevant study, by Roelofs et al, compared the body composition and muscle characteristics of Division 1 athletes, the talent pool from which Olympic 
                    Team USA is drawn from. Multiple body metrics were measured over the course of a year on athletes divided into six groups: sprinters, mid-distance runners, 
                    multievent athletes(e.g decathlon), jumps, throws and pole related (pole vault and javelin). Body composition measurements for each event group were compared 
                    and throwers were found to weigh signlificantly higher than athletes from all other event groups. Middle distance runners weighed the least, followed by jumpers,
                    sprinters and decathlon athletes. Throwers ranked highest for average fat mass at 21.6kg,total body mass at 90kg and 23.6% fat as a percantage of body weight. 
                    As for lean mass, throwers had significantly lower values of relative lean mass, an average of 0.25kg/leg which pales in comparison to the average leg lean mass of 0.30kg as recorded in all the other groups. 
                    Pole vault, javelin, discus and hammer-throw athletes had massively lower bone mineral content scores as compared to sprinters and mid distance runners and a year long evaluation only showed a significant increase in relative arm lean mass for all six groups, with marginal gains in the lower limbs. 
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
                            <BiometricsCrossfilter/>
                            </section>
                            </Suspense>
                          </AnimatedSection>

                        
                        </>
                      )}

                          <AnimatedSection 
                            animation="slideIn" 
                            duration={1} 
                            className="py-12"
                          >

                            <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">Age and Peak Performance</h2>

                            <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline' style={{ lineHeight: '1.7' }}>
                              Masters Athletics is a little-known and mostly ignored class of high performance athletics that caters to all professionals over the age of 35.
                              Like most threshold figures used by the IAAF, it also appeared on a table one day, out of thin air. At the 2019 Prefontaine Classic, 
                              Justin Gatlin, aged 37 at the time, blitzed past the finish line after only 9.87s, faster than all winning times of the last two Olympics.
                              With the M35 (for athletes between 35 and 40) being 9.87s, how fast is M40 ? 9.93s, which is much faster than 90% of all current world class sprinters. 
                            </p>

                              <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline' style={{ lineHeight: '1.7' }}> 
                              Sport ontogenesis is the study of systematic changes in the development and performance of athletes in the course of their careear, from growth, stabilization, and gradual decay.
                              The first stage, sports maturation, spans from the moment one takes interest in a specific discipline, idea internalization, achievement of best possible result and gradual decline. 
                              This stage has a bell-shaped curve, almost symmetrical as 11 years-old athletes achieve around 80% of the record, which is mirrored by the performance of a 60 year-old athlete.
                              The same symmetry can be found in 6-years and 80-years old pairs, in 7 and 75 year-olds, 8 and 70 year olds and in 9 and 65 year olds who both can score 77% of the world record. 
                              Several studies in sport ontogenesis agree that the magnitudes and scales of speed development up to the age of 14 are virtually similar to the rate of decline exerienced by an athlete after the age of 35 years. 
                              Comparing all ages from 6-90 years in the 100m, the differences in athletes show up way earlier (before age of 10), the mangitude of differences is larger and persists way longer till the age of around 75 years. 
                              The same analysis on the 400m distance only shows differences in athletes after the age of 16, with performance progressing up to the age of around 22 years, followed by a stationary phase where gains are mild and terminates around age 29.
                              For any hopeful 400m champion, the window of glory happens to be the shortest for all sprint events, further making any dedication to the discipline to be a non-optimal solution.
                              Linford Christie of Great Britain shocked the whole world in 1992 when he clinched the Gold medal in the 100m final at the ripe old age of 32 years, and would have repeated the same at the 1996 Atlanta Olympics 100m final, had he not been too eager to run to the point of catching to false starts. 
                              Usain Bolt's win at the Rio 2016 Olympics 100m final at age 33 was a cause for revision of the expected peak age for sprinters from 27 to 31 years. 
                              </p>

                        </AnimatedSection>



                        <AnimatedSection animation="slideIn" duration={1} className="py-12">

                          <section className='justify-center items-center h-full w-full'>
                                <div className="grid grid-cols-2 gap-4">
                                
                                  <div>
                                    <Table2Chart/>
                                  </div>

                                  {/* Right side - Text */}
                                  <div>
                                    <h2 className="text-xl font-semibold mb-4">Progression</h2>
                                    <p className="text-white justify-center items-center">
                                      A 100m sprinter see returns in their efforts at a younger age than 
                                      a 400m sprinter. 100m Sprinters start being a cause for concern at 
                                      around age 19 where they post times that give them automatic Olympic 
                                      qualification. Breaking the 10s physiological barrier has become 
                                      so common that, the average professional sprinter is expected by law, 
                                      to keep delivering sub 10s till they turn 33. The window for mere 
                                      Olympic qualification is open for only four years for the average 
                                      400m. Sub 44s is so unateneable that a study involving elite athletes
                                      is guaranteed to be made up of individuals who are of no cause for 
                                      concern. 
                                    </p>
                                  </div>
                                </div>
                          </section>

                          </AnimatedSection>
         

                          <AnimatedSection animation="slideIn" duration={1} className="py-12">
                                <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline' style={{ lineHeight: '1.7' }}>
                                Gorostiaga et al,in their study on functional capacity of the neuromuscular,cardiovascular,and respiratory systems,revealed that, on average, the aforementioned systems 
                                decline in efficiency at a rate between 0.5-3.3% per year, which obviously translates to collateral losses in maximal strength, explosive stength, and maximal aerobic power.
                                The initial values greatly affect the rate of decline, meaning, taller or bigger individuals experience a disproportionately larger rate of decline due to the law of proportions. An individual almost 2m tall should experience a higher rate of decline as there is more length of neurons present. The most prominent factor associated 
                                with reduction in maximal strength is loss of muscle mass and alterations in maximal voluntary neural activation of the agonist muscles and/or changes in the degree of agonist/antagonist coactivation, or more specificaly, the deterioraton of ion channels on neural membranes responsible for polarization and depolarization of the membranes.
                                The inability of the human body to scavange all excess electrons leaking from the electron-transport chain which initiate the formation of high volumes of radicals which desperately seek reduction leading to slow but continous destruction of membranes. The decline in maximal oxygen carrying capacity, aerobic power is primarily associated 
                                with reduction in maximal cardiac output. The most undeniable piece of evidence comes from the gradual decrease in the maximum possible heart rate, which can calculated 
                                using an informal method of subtracting an individual's age from 220. One would be hard pressed to find any 30 year old individual who can post heart rates higher than 200, 
                                even on high grade narcotics from South America. A decrease in the heart rate ceiling, for the same body, leads to a reduction in stroke volume, which is coupled to 
                                an increase in the cholesterol deposits lining blood vessels which comes with age, leading to a reduction in the flexibility of the vessels and prepares fertile grounds 
                                for vessels rapturing. Since the thorax and mouth remain the same size, the rate of oxygen supply to the lungs remains ubundant and any decrease in arteriovenous oxygen concentration and pressure are minimal due to the steady supply of haemoglobin and the intrinsic nature of the oxygenation process. The normal oxygen concentration ratio of 21% is extremely toxic to the cells and the respiratory systems is a mechanism of reducing the concentration to around 5%, levels that are more tolerable for the cells. 
                                </p>

                                <section className='justify-center items-center h-full w-full'>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Table4Chart/>
                                      </div>

                                      {/* Right side - Text */}
                                      <div>
                                        <h2 className="text-xl font-semibold mb-4">Progression</h2>
                                        <p className="text-white justify-center items-center">
                                          The average peak best performance for 100m sprinters is 9.86s, with an almost non existent deviation of 
                                          0.07 which is faster than the last two gold winning senior men's 100m performances. 400m sprinters have 
                                          an expected personal best of 44.06 ± 0.32, a number still far away from the world record of 43.03s and 
                                          with a sizeable deviation showing that, 400m sprinters have it rough and it has nothing to do with society. 
                                        </p>
                                      </div>
                                    </div>
                                </section>

                            
                                <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline' style={{ lineHeight: '1.7' }}>
                                This suggests that a decrease in maximal power and force production capacity has a weak relation to any decrease in the efficiency of oxygen transfer processes. 
                                A comparison of athletes aged 42 and 62 found physical activity energy expenditure (4.7%) as a probable explanation for the differences in maximal unilateral and bilateral isometric force, muscle cross-sectional area and power output. 
                                The 42 year olds had on average, 48.2sqcm cross-sectional areas for their extensor muscles whilst the older gentleman had on average, 42.1sqcm. For both groups, serum hormone concentrations, specificaly, serum cortisol concentration, had a negative correlation with maximal isometric force. 
                                </p>
                                <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline' style={{ lineHeight: '1.7' }}>
                                Scaglioni et al designed a study to investigate the effect of ageing on the mechanical and electromyographic characteristics of the soleus motor units (MUs) activated by the maximal Hoffmann reflex(Hmax) and by the direct muscle compound action potential (Mmax). 
                                The structural and functional changes that occur during ageing can be quantitatively
                                evaluated by applying electrical stimuli to the peripheral nerves of subjects and measuring the associated electromygraphic excitations and mechanical responses.
                                </p>

                                <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline' style={{ lineHeight: '1.7' }}>
                                In a study by Lentini et al, athletes ranging from ages 14 to 52.8 years, in four groups of sport disciplines in men and five in women, regression tree analysis was used to try and approximate the age of peak performance.
                                Athletics, like any other sport, requires a long term training plan that covers an extended period of time, spanning a decade at least. 
                                If sport performance was solely determined by the length of practise, the set of gold medal winners would only be made up of senior athletes approaching the dusk of their carrears. 
                                The medal winners happen to be the ones which deliver an optimal performance which is influenced by a myriad of physical, technical, psychological, tactical, envrironmental, economomic, geopolitical, cognitive and coordinative abilities. 
                                The relevance and integration of each of these factors varies substantially and are manifested in as the broad range of ages of peak performance in the top Olympic athletes. 
                                </p>

                          </AnimatedSection>

                              <AnimatedSection animation="slideIn" duration={1} className="py-12">

                                  <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">Olympics</h2>


                                  <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline' style={{ lineHeight: '1.7' }}> 
                                  Without the Olympics, the 400m race would not exist. The event was not even part of the Archaic Olympic games in 
                                  ancient Greece as there was no part of the track that was curved. For the first 13 years, the Olympics consisted solely 
                                  of one event, the Stadion, which was a straight path foot race parallel to the stands where observers would seat.
                                  As consolation prize for waiting 4 years just to see the fastest bearded man within the realms of Greece, the Dualos,
                                  the closest equivalent to the modern 400m race was introduced. In the same manner that swimmers turn and race in the 
                                  reverse direction, ancient athletes simply had to turn around a pole at the end of the track. 

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
                                        <OlympicsDashboard/>
                                        </section>
                                        </Suspense>
                                      </AnimatedSection>

                                    
                                    </>
                                  )}

                   


                        <AnimatedSection animation="slideIn" duration={1} className="py-12">

                        <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">Optimal Athlete</h2>


                        <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline' style={{ lineHeight: '1.7' }}>
                          This whole exercise would only be complete if there was potential in extracting any value from this information. 
                          What are the most optimal anthropometric features for being successful at the 400m sprint? The solution to this 
                          question should account for the differences in performance dependent on the lanes used for races, the altitude, 
                          the barometric pressure, the relative wind speed and ambient temperature. The objective function for the most 
                          optimal 400m sprinter has physiological and physical constraints which renders all optima found to be local and 
                          not global. The optimal 400m sprinter does not exist as a singular entity but as a weighted sum of averages of the 
                          optimal 400m sprinters for each given lane, for a given curve radius, height, altitude, presssure and so on. 
                          
                          
                           </p>


                          
                          </AnimatedSection>


            </article>
        
          </div>

         
        </Layout>
      </main>
    </>
  );
}
