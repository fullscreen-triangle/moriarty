import dynamic from 'next/dynamic'
import Layout from "@/components/Layout";
import Head from "next/head";
import AnimatedText from "@/components/AnimatedText";
import TransitionEffect from "@/components/TransitionEffect";

const OlympicStadium = dynamic(
  () => import('@/components/maps/london/OlympicStadium'),
  { ssr: false }
)

const TrackSpecifications = dynamic( () => import('@/components/puchheim/puchheim-story/TrackSpecifications'), {ssr: false})


const WeatherDeviationLondon = dynamic( () => import('@/components/maps/london/WeatherDeviationLondon'), {ssr: false})


export default function Dimensions() {
  return (
    <>
      <Head>
        <title>Fullscreen Comrade| Dimensions</title>
        <meta name="description" content="Dimensions" />
      </Head>
      <TransitionEffect />
      <main
        className={`flex  w-full flex-col items-center justify-center dark:text-light`}
      >
        <Layout className="pt-16">
          <AnimatedText
            text="Dimensions"
            className="mb-16 !text-8xl !leading-tight lg:!text-7xl sm:!text-6xl xs:!text-4xl sm:mb-8"
          />

          <div className="mx-auto max-w-prose px-4 py-8">
          <article className="prose prose-lg prose-slate mx-auto text-justify">
              <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">
                Specified Geometry
              </h2>

              <section className="flex justify-center items-center h-full w-full">
                  <div className="flex justify-center items-center w-full">
                    <TrackSpecifications />
                  </div>
                </section>

            <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline' style={{ lineHeight: '1.7' }}>
              The IAAF governs the specifications for dimensions for all athletic tracks used in certified tournaments. The standard track measures exactly 400m when measured along the innermost line for Lane one, with the straight sections measuring 84.4m long and the curves measuring 115.6m long. It should be self evident that no sprinter actually 
              runs 400m and with staggering, the total distance covered by sprinters ranges from 401m at the least and 420m at the maximum. That means, 57.8% of the 400m occurs on 
              curved paths, much larger than the distance on the straights. The recorded speed for runners is always lowest in the curves and fastest on the straights and athletes 
              experience difference conditions and maximum velocity depending on their given lane and prevelant wind conditions. For a runner to negotiate a curve, they are required 
              to constantly turn left whilst running in a straight line, a feat that can only be achieved if one leans in a direction perpendicular to the ground towards the center 
              of the radius of their bend. The unavoidable steps for running at an angle of lean are the need to for one to shorten the apparent length of their inner leg and the 
              decision to either twist their ankle before the left foot lands or by rotating their foot about their toe during ground contact time. There is also a psychological 
              aspect to running in different lanes. The 400m record, posted by Wayde Van Niekerk of RSA, at the 2016 Rio Olympic games, was the first time an individual won with 
              a negative split strategy. Lane 8 placement meant that van Nierkek spent the least amount of time running in the first curve, which gave him ample opportunity to 
              drive up and deliver a sub 10s performance for the second 100m. By the 200m mark, Wayde had already received his medal for all he had to do was ensure that he would 
              always keep ahead of anyone to his left.  Greene's equation provides a real root as the solution to a polynomial cubic equation that accounts for the radius of a curve 
              and, gravitational forces and the centrifugal forces experienced by the runner. 
              </p>

              <section className="flex justify-center items-center h-full w-full">
                  <div className="flex justify-center items-center w-full">
                    <OlympicStadium />
                  </div>
                </section>

              <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline justify-center items-center' style={{ lineHeight: '1.7' }}>
                The 2012 Olympics where the 3rd time that the event had ever been hosted in London and being the second time the event was 
                held in the London Olympic Stadium. The construction of the stadium was in no way necessary as the Wembley Stadium, the home 
                of British Sport, could have easily met the requirements for hosting the highest level of athleticism. It so happened that 
                the UK was hosting its second Olympics under the reign of Queen Elizabeth II, who had broken every known royal record with 
                regards to longevity in power, and no other situation would have been best suited for a whole nation to honour, applaud 
                and immortalise, an unelected head of state who has prerogative rights to all the all-white, orange-beaked swans in 
                all bodies of water, inland and within 10km from the entire British coast.
                
              </p>


              <section className="flex justify-center items-center h-full w-full">
                  <WeatherDeviationLondon/>
                </section>

              <p className="font-medium">
              There are three other less known track geometries that include : the two types of double-bend tracks, which share the quality of having straights of equal length and curves of different radii smaller than the outside radius than the standard track, the equal quandrant track which has bends and straights that are all exactly 100m and finally, the clothroid track or non-equal quandrant track  with two curved ends of equal radius and two straights equal in length but longer or shorter than the bends. This gives a two pronged optimisation problem, the first problem involves optimising the geometry and dimensions of the track and the second, involves a sprinter optimising their ouput effort dependent on the environmental conditions and the lane. The smaller radii used in the clothroid or double bend tracks give rise to higher centrifugal forces which in turn, require the athletes to lean further into the curve, decrease the apparent length of their inner lower limb which lead to lower velocities. If one where to consider the optimal geometry with respect to spectactors, the clothroid track reigns supreme as the standard geometry for horse and greyhound races, where the space inside the track has no utility at all and places spectactors at the best vantage point.
              </p>


              <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">
                Surface
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
