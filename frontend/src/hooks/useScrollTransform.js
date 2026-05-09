import { useScroll, useTransform } from 'framer-motion';

export const useScrollTransform = () => {
  const { scrollYProgress } = useScroll();

  // Hero (0% -> 20%)
  const cameraZ = useTransform(scrollYProgress, [0, 0.2, 0.75, 0.9], [4, 6, 6, 3.5]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.1, 0.3, 0.7, 0.9], [1, 1, 0.2, 0.2, 0.8]);
  const sphereScale = useTransform(scrollYProgress, [0, 0.2, 0.5], [1, 0.7, 0.8]);
  const sceneRotationY = useTransform(scrollYProgress, [0, 0.2], [0, Math.PI * 0.25]);

  // Mid section rings expand
  const ringScale = useTransform(scrollYProgress, [0.2, 0.5], [1, 1.4]);
  
  // Feature section: Color shift and flattening
  const sphereEmissive = useTransform(
    scrollYProgress,
    [0.4, 0.6, 0.8, 1],
    ['#300808', '#050a15', '#050a15', '#e63a2e']
  );

  return {
    scrollYProgress,
    cameraZ,
    sceneOpacity,
    sphereScale,
    sceneRotationY,
    ringScale,
    sphereEmissive,
  };
};
