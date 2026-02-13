import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// 
import Index from "./pages/index";
import Register from "./assets/pages/html10/Register";
import Login from "./assets/pages/html10/Login.jsx";
import CodeVerify from "./assets/pages/html10/Code";
// ____________________________________________________________



// ________________pages__________________

import TheLastOfUs from "./pages/lastofus.jsx";
import EldenRing from "./pages/eldenring.jsx";
import Cyberpunk2077 from "./pages/2077.jsx";
import GodOfWar from "./pages/godw.jsx";
import GTAV from "./pages/gta.jsx";
import RedDeadRedemption from "./pages/rd.jsx";
import AboutUs from "./pages/aboutus.jsx";

// _____________________________________________

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: false,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    //  اتصال   
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Code" element={<CodeVerify />} />

          {/* Game Pages */}
          <Route path="/games/last-of-us" element={<TheLastOfUs />} />
          <Route path="/games/elden-ring" element={<EldenRing />} />
          <Route path="/games/cyberpunk-2077" element={<Cyberpunk2077 />} />
          <Route path="/games/god-of-war" element={<GodOfWar />} />
          <Route path="/games/gta-v" element={<GTAV />} />
          <Route path="/games/red-dead" element={<RedDeadRedemption />} />

          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
