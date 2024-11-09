import dynamic from 'next/dynamic'
import Layout from "@/components/Layout";
import Head from "next/head";
import AnimatedText from "@/components/AnimatedText";
import TransitionEffect from "@/components/TransitionEffect";


const Brain = dynamic( () => import('@/components/three-dim-models/Brain'), {ssr: false})


export default function Gait() {
  return (
    <>
      <Head>
        <title>Fullscreen Comrade| Gait</title>
        <meta name="description" content="Gait" />
      </Head>
      <TransitionEffect />
      <main
        className={`flex  w-full flex-col items-center justify-center dark:text-light`}
      >
        <Layout className="pt-16">
          <AnimatedText
            text="Gait Analysis"
            className="mb-16 !text-8xl !leading-tight lg:!text-7xl sm:!text-6xl xs:!text-4xl sm:mb-8"
          />

          <div className="mx-auto max-w-prose px-4 py-8">
          <article className="prose prose-lg prose-slate mx-auto text-justify">
              <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">
                Midbrain Circuits 
              </h2>

              <section className="flex justify-center items-center h-full w-full">
                  <div className="flex justify-center items-center w-full">
                    <Brain/>
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
