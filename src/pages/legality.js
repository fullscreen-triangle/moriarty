import dynamic from 'next/dynamic'
import Layout from "@/components/Layout";
import Head from "next/head";
import AnimatedText from "@/components/AnimatedText";
import TransitionEffect from "@/components/TransitionEffect";

const Clouds = dynamic(
  () => import('@/components/maps/globes/Clouds'),
  { ssr: false }
)
const WindPatterns = dynamic( () => import('@/components/correction/WindPatterns'), {ssr: false})
const ElevationMap = dynamic( () => import('@/components/correction/ElevationMap'), {ssr: false})

const WeatherPerformanceDashboard = dynamic(
  () => import('@/components/athletes/crossfilters/WeatherPerformance'),
  { ssr: false }
)



export default function Legality() {
  return (
    <>
      <Head>
        <title>Fullscreen Comrade| Legality</title>
        <meta name="description" content="Legality." />
      </Head>
      <TransitionEffect />
      <main
        className={`flex  w-full flex-col items-center justify-center dark:text-light`}
      >
        <Layout className="pt-16">
          <AnimatedText
            text="Legality"
            className="mb-16 !text-8xl !leading-tight lg:!text-7xl sm:!text-6xl xs:!text-4xl sm:mb-8"
          />

          <div className="mx-auto max-w-prose px-4 py-8">
          <article className="prose prose-lg prose-slate mx-auto text-justify">
              <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">
                 Permission To Sprint
              </h2>

              <section className="flex justify-center items-center h-full w-full">
                  <div className="flex justify-center items-center w-full">
                    <Clouds/>
                  </div>
                </section>

              <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline justify-center items-center' style={{ lineHeight: '1.7' }}>
                For the sake of an example, imagine a situation in which some unknown gentleman, somewhere on the planet, stumbled 
                upon an athletic track, a willing individual with a stop watch and Cindirella level snuggle fitting pair of spikes 
                accompanied by a speed suit and titanium grade start blocks. If this individual truly ran sub 10s for the 100m, would 
                any athletics board notify the achievement ? There is no inch of ground available for them to even give this event any attention 
                because it is, in all regards, illegal. The most basic requirement is a start pass, an identification form that details 
                the right one has to compete, meaning, they have to be an entry in the athletics database confirming one's existance. 
                The right to participate comes with the responsibility of ensuring one is most importantly, clean from any prohibited 
                performance enhancers, using a track spike with maximum 8 screweable spikes with no carbon plates and zero heel drop, 
                clothing without vectors and strict adherence to zero communication with coaches when on the track. 
              </p>
              <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline' style={{ lineHeight: '1.7' }}>
                The Single Strike Rule, applies to all athletes at all tournament levels, meaning, a single false start or reaction faster 
                than 100ms is grounds for terminating participation. The false start threshold is not based on any scientific study and  
                was simply adopted, after having been pulled out of thin air. The mechanism for false start detection does not stratify 
                the array of components that make up the action opting for gross simplification.Humans react differently to different 
                situations and sounds and an encompassing threshold avoids such distinctions. Secondly, due to variation in height, 
                signal transmission varies due to the differences in nerve length and condition. Lastly, the reaction time includes 
                the time taken by the false start detection system to measure, process and report and infringement, a delay time 
                that is not deducted from the recorded time. In order for an event to be ratified, the Omega Rectangle closed circuit 
                system has to be in use.            
              </p>

              <section className="flex justify-center items-center h-full w-full">
                  <div className="flex justify-center items-center w-full">
                    <ElevationMap/>
                  </div>
                </section>

              <p className="font-medium">
                Any sprint event that occurs at altitude above 1000m is accepted by the IAAF but will not be ratified and is instead, 
                noted with an A, denoting altitude assistance. The amount of air available at any point on earth is dependent on the 
                altitude. The highest pressure is experienced at sea level and withers off as one gains height. If one would imagine 
                land as the bottom of a sea of air, the differences in pressure with height become self-evident. Higher altitude and  
                lower pressure lead to a lower total volume of air for athletes to traverse in, lowering the air resistance. The 1968 
                Olympics in Mexico City were the first and last to be held at an altitude above 1000m and are remembered as the games 
                that recorded the first sub 10s performance, the longest long jump, the first time the Flosbury flop was used and the 
                first time athletes wore Nike shoes. The reduction in oxygen concentration and lower air pressure is irrelevant for 
                sprinters, especially 100m runners, who consider breathing as a suggestion and consider their effort optimal if they 
                do not breathe at all for their first 7 steps, or 10 when its their day. There is no condition in which a sprinter can 
                sufficiently breathe during their business and use the finish line primarily to catch their breathe. There is no time 
                to breathe and doing so unnecessarily, will ruin one's coordination and see them lose a race.
              </p>

              <section className="flex justify-center items-center h-full w-full">
                  <div className="flex justify-center items-center w-full">
                  <WindPatterns/>
                  </div>
                </section>

              <p className="font-medium">
               If an event occurs at wind speeds greater than 2m/s, as headwinds or tailwinds, it will be regarded as void, and will not 
               be ratified or recorded. The effect of wind should not be undermined as aeroplanes are able to fly based on the same principle.
               Determining the effect of wind speed on the 100m race is straightforward and tenable and numerous correction methods have 
               been established. Doing the same for events that include curves is a serious affair with no concrete consensus on the 
               acceptable methods for time correction.The most widely used approximations in literature based on statistical and theoretical models predict a 2/ms or 0.10-0.12s advantage at sea level. In windless conditions, 
               an athlete gains approximately 0.03-0.04s for every kilometer gained in height. For races that include a curve, the wind-gauge is only read when the first athlete leaves a curve and there is no consideration at all for the crosswinds. Sprint running at altitudes higher than 1000m with the legal maximum tailwind of 2m/s will afford an athlete an almost 60% guaranteed improvement in time compared to the sea-level equivalent race.  
              </p>

              <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">
                Supreme Time  
              </h2>




              <section className="flex justify-center items-center h-full w-full">
                  <div className="flex justify-center items-center w-full">
                  
                  </div>
                </section>

       


           

           

   
          

            

            <p className="font-medium">


            </p>

            </article>
        
          </div>

         
        </Layout>
      </main>
    </>
  );
}
