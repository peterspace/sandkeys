import { useEffect, useState } from 'react';
import { motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion';
import './home.css';


// Components
import Banner from './Banner';
import Loader from './Loader';

import IndexPage from '../../pages/IndexPage';



export default function Home(props) {
  const { language } = props;
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loading
      ? document.querySelector('body').classList.add('loading')
      : document.querySelector('body').classList.remove('loading');
  }, [loading]);

  return (
    <AnimateSharedLayout type="crossfade">
      <AnimatePresence>
        {loading ? (
          <motion.div key="loader">
            <Loader setLoading={setLoading} />
          </motion.div>
        ) : (
          <>
            <Banner language={language} />

            {!loading && <IndexPage language={language} />}
          </>
        )}
      </AnimatePresence>
    </AnimateSharedLayout>
  );
}
