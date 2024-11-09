import { motion } from 'framer-motion';
import Logo from './Logo';

const AnimatedLoader = () => {
  return (
    <motion.div 
      className="flex justify-center items-center w-full h-64"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Replace this with your SVG logo */}
      <Logo />
    </motion.div>
  );
};

export default AnimatedLoader;