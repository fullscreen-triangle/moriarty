import dynamic from 'next/dynamic'
import Layout from "@/components/Layout";
import Head from "next/head";
import AnimatedText from "@/components/AnimatedText";
import TransitionEffect from "@/components/TransitionEffect";

const SolarTerminator = dynamic(
  () => import('@/components/puchheim/SolarTerminator'),
  { ssr: false }
)
const MassDensityPlots = dynamic( () => import('@/components/athletes/MetricDensityPlots'), {ssr: false})


export default function Puchheim() {
  return (
    <>
      <Head>
        <title>Fullscreen Comrade| Puchheim</title>
        <meta name="description" content="Comparison and analysis of body segments parameters of 
        athletes and the general population." />
      </Head>
      <TransitionEffect />
      <main
        className={`flex  w-full flex-col items-center justify-center dark:text-light`}
      >
        <Layout className="pt-16">
          <AnimatedText
            text="Puchheim"
            className="mb-16 !text-8xl !leading-tight lg:!text-7xl sm:!text-6xl xs:!text-4xl sm:mb-8"
          />

          <div className="mx-auto max-w-prose px-4 py-8">
          <article className="prose prose-lg prose-slate mx-auto text-justify">
              <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">
                 
              </h2>

              <section className="flex justify-center items-center h-full w-full">
                  <div className="flex justify-center items-center w-full">
                    <SolarTerminator/>
                  </div>
                </section>

              <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline justify-center items-center' style={{ lineHeight: '1.7' }}>
              The distance between the track geometry that pleases sprinters the most and the geometry of tracks that actually exist is immeasurable, one could fit all the planets 
                in our solar system comfortabley within it. The optimal track for a sprinter should be longest at the straights and have curves so gentle, it would almost feel like 
                one is running in a straight line. The design of an athletic track is solely determined by issues that have no relation to speed and is solely focused on economics.
                Building a whole stadium just to have an athletic track is so untenable that it has never occured anywhere and athletic tracks only exist because something else 
                of higher importance should occupy the dead space inside the track, the likes of association football, gridiron football or rugby. The only notable "single use" stadium 
                would be the Melbourne Oval, which serves primarily as a cricket pitch, and on many occasions, a field for Australian Rules football.
              </p>
              <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline' style={{ lineHeight: '1.7' }}>
              In an analysis carried out on sprinters and normal population males in the US and Danemark, sprinters from both nations had the least variability in height, 
              an expected outcome. Excluding Usain Bolt, the fastest man is expected to have average proportions which would suggest the optimum height to be the height 
              of the average global human male, which is 180cm. Of all the men who have ever won the Olympic 100m Gold Medal, Usain Bolt is the only individual outside of 
              the normal distribution, which has 180cm as the average and all other champions within 3cm. This does not apply to hurdle events, which have a strict requirement 
              for one to be between 186cm-190cm. Optimal racing in hurdles requires one to take at best, 3 steps between the hurdles and any deviation from that will not suffice.
              </p>

              <section className="flex justify-center items-center h-full w-full">
                  <div className="flex justify-center items-center w-full">
                  
                  </div>
                </section>

              <p className="font-medium">
              The same study revealed patterns which less variability in mass, height and body mass index amoung sprinters more than the normal population. The normal populations 
              from both the US and Danemark exhibited significantly higher body masses which proves that any weight outside of the optimum is a limiting factor in sprint running. 
              This by no chance suggests that sprinters ought to have lower body masses, as muscles make up a large chunk of the body weight and are a crucial factor for any 
              professional sprinter as more muscle allows for generation of higher ground reaction forces, allowing the sprinter to move further faster, with each step. 
              </p>


              <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">
                Biometrics
              </h2>

           

              <p className="font-medium">
              The next relevant study, by Roelofs et al, compared the body composition and muscle characteristics of Division 1 athletes, the talent pool from which Olympic 
              Team USA is drawn from. Multiple body metrics were measured over the course of a year on athletes divided into six groups: sprinters, mid-distance runners, 
              multievent athletes(e.g decathlon), jumps, throws and pole related (pole vault and javelin). Body composition measurements for each event group were compared 
              and throwers were found to weigh signlificantly higher than athletes from all other event groups. Middle distance runners weighed the least, followed by jumpers,
              sprinters and decathlon athletes. Throwers ranked highest for average fat mass at 21.6kg,total body mass at 90kg and 23.6% fat as a percantage of body weight. 
              As for lean mass, throwers had significantly lower values of relative lean mass, an average of 0.25kg/leg which pales in comparison to the average leg lean mass of 0.30kg as recorded in al the other groups. Pole vault, javelin, discus and hammer-throw athletes had massively lower bone mineral content scores as compared to sprinters and mid distance runners and a year long evaluation only showed a significant increase in relative arm lean mass for all six groups, with marginal gains in the lower limbs. 
              </p>

              <p className="font-medium">
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

           

              <p className="font-medium">
              This suggests that a decrease in maximal power and force production capacity has a weak relation to any decrease in the efficiency of oxygen transfer processes. A comparison of athletes aged 42 and 62 found physical activity energy expenditure (4.7%) as a probable explanation for the differences in maximal unilateral and bilateral isometric force, muscle cross-sectional area and power output. The 42 year olds had on average, 48.2sqcm cross-sectional areas for their extensor muscles whilst the older gentleman had on average, 42.1sqcm. For both groups, serum hormone concentrations, specificaly, serum cortisol concentration, had a negative correlation with maximal isometric force. 
              </p>
              <p className="font-medium">
              Scaglioni et al designed a study to investigate the effect of ageing on the mechanical and electromyographic characteristics of the soleus motor units (MUs) activated by the maximal Hoffmann reflex(Hmax) and by the direct muscle compound action potential (Mmax). The structural and functional changes that occur during ageing can be quantitatively
              evaluated by applying electrical stimuli to the peripheral nerves of subjects and measuring the associated electromygraphic excitations and mechanical responses.
              </p>
          

              <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">
                Aging and Peak Performance
              </h2>

            <p className="font-medium">


            </p>

            </article>
        
          </div>

         
        </Layout>
      </main>
    </>
  );
}
