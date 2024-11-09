import dynamic from 'next/dynamic'
import Layout from "@/components/Layout";
import Head from "next/head";
import AnimatedText from "@/components/AnimatedText";
import TransitionEffect from "@/components/TransitionEffect";




export default function Kinematics() {
  return (
    <>
      <Head>
        <title>Fullscreen Comrade| Kinematics</title>
        <meta name="description" content="Kinematics" />
      </Head>
      <TransitionEffect />
      <main
        className={`flex  w-full flex-col items-center justify-center dark:text-light`}
      >
        <Layout className="pt-16">
          <AnimatedText
            text="Kinematics"
            className="mb-16 !text-8xl !leading-tight lg:!text-7xl sm:!text-6xl xs:!text-4xl sm:mb-8"
          />

          <div className="mx-auto max-w-prose px-4 py-8">
          <article className="prose prose-lg prose-slate mx-auto text-justify">
              <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">
                Minimum Jerk Hypothesis 
              </h2>

              <p className="font-medium">
              Sprint running is an anaerobic process as breathing reduces performance, scrambles coordination and is something one has ample time to do at the finish line. The model 
              for a 400m sprinter equates the total energy expenditure or propulsive power to the sum of anaerobic and aerobic energy. Applying Newton's second law, the propulsive force and friction should vary linearly with velocity and a time constant of neural motor activation. On the straights, the objective function for the runner requires minimization of final time by optimisation of effort with the cost being sum of the total time and weighted duration of the neural motor control unit. For negotiating a curved path, the need for one to lean leads to variation in velocity proportional to the time with an anticipated and abrupt termination of the curve to running back in a straight line. 
              The optimal control problem is formulated as the minimization of final time by optimisation of effort, cost being the final time and penalty being variations in control of the neural motor control unit coupled with variations in the angle of lean. By applying Morpetuit and Langrage's principles of least action and considering the runner as 
              an agent perfoming mechanical movement, the average kinetic energy less than the average potential energy is as marginal as possible for the path from start to endpoint.
              Hogan and Flash (1984, 1985) formulated the minimum-jerk hypothesis based on prolonged observations of primates performing voluntary movements. In order for planar movements to adhere to the principle of least action, movements in primates should follow the trajectory with the smoothest path possible by ensuring that the mean-squared jerk across time of this movement is at its minimum. 
              </p>

       

              <section className="flex justify-center items-center h-full w-full">
                  <div className="flex justify-center items-center w-full">
                  </div>
                </section>

              <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline justify-center items-center' style={{ lineHeight: '1.7' }}>
              
              </p>
              <p className='font-medium mx-0 my-8 border-0 p-0 align-baseline' style={{ lineHeight: '1.7' }}>

              </p>

           


        

       

            </article>
        
          </div>

         
        </Layout>
      </main>
    </>
  );
}
