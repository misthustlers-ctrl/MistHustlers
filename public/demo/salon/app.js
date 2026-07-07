const {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} = React;
const {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView
} = window.Motion;
function useHash() {
  const [hash, setHash] = useState(window.location.hash || '#home');
  useEffect(() => {
    const h = () => {
      const newHash = window.location.hash || '#home';
      setHash(newHash);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);
  const nav = useCallback(h => {
    window.location.hash = h;
  }, []);
  return [hash || '#home', nav];
}
class AppErrorBoundary extends React.Component {
  constructor(p) {
    super(p);
    this.state = {
      err: null
    };
  }
  static getDerivedStateFromError(e) {
    return {
      err: e
    };
  }
  componentDidCatch(e, i) {
    console.error('Aurelle Error:', e.message);
  }
  render() {
    if (this.state.err) return React.createElement("div", {
      className: "flex items-center justify-center min-h-screen px-6 text-center"
    }, React.createElement("div", null, React.createElement("h2", {
      className: "font-heading italic text-3xl text-gold mb-4"
    }, "Something went wrong"), React.createElement("p", {
      className: "font-body text-sm text-stone mb-6"
    }, "Please refresh the page to continue."), React.createElement("button", {
      onClick: () => window.location.reload(),
      className: "gilded-glass-strong px-8 py-3 text-[11px] tracking-[.25em] uppercase text-gold rounded-full"
    }, "Refresh")));
    return this.props.children;
  }
}
function BlurText({
  text,
  as: Tag = 'p',
  className = '',
  stagger = 100,
  blurStart = 10,
  once = true
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once,
    amount: .3
  });
  const words = text.split(' ');
  return React.createElement(Tag, {
    ref: ref,
    className: className
  }, words.map((w, i) => React.createElement("span", {
    key: i,
    style: {
      display: 'inline-block',
      transition: `all ${600}ms cubic-bezier(.23,1,.32,1) ${i * stagger}ms`,
      filter: isInView ? `blur(0px)` : `blur(${blurStart}px)`,
      opacity: isInView ? 1 : .2,
      transform: isInView ? 'translateY(0)' : 'translateY(8px)'
    }
  }, w, "\xA0")));
}
function LuxuryHero() {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted) return;
    const hero = containerRef.current;
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    const video = videoRef.current;
    if (!hero || !wrapper || !content || !video) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    if (prefersReduced || isMobile) {
      wrapper.style.opacity = '1';
      wrapper.style.transform = 'none';
      wrapper.style.clipPath = 'none';
      return;
    }
    const ease = t => 1 - Math.pow(1 - t, 3);
    function updateOnScroll() {
      const rect = hero.getBoundingClientRect();
      const offset = -rect.top;
      const progress = Math.min(Math.max(offset / rect.height, 0), 1);
      if (progress <= 0) {
        wrapper.style.opacity = '1';
        wrapper.style.transform = 'scale(1)';
        wrapper.style.clipPath = 'inset(0%)';
        wrapper.style.filter = 'blur(0px)';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
        if (video) video.currentTime = 0;
        return;
      }
      let opacity, scale, clipInset, blur, cntOpacity;
      if (video && video.duration) {
        const videoProgress = Math.min(progress / 0.7, 1);
        video.currentTime = videoProgress * video.duration;
      }
      if (progress < 0.4) {
        const t = progress / 0.4;
        const e = ease(t);
        opacity = 0.5 + e * 0.5;
        scale = 0.85 + e * 0.15;
        clipInset = 20 - e * 20 + '%';
        blur = 0;
        cntOpacity = 0.5 + e * 0.5;
      } else if (progress < 0.7) {
        opacity = 1;
        scale = 1;
        clipInset = '0%';
        blur = 0;
        cntOpacity = 1;
      } else {
        const t = (progress - 0.7) / 0.3;
        const e = ease(t);
        opacity = 1 - e;
        scale = 1 - e * 0.1;
        clipInset = e * 15 + '%';
        blur = e * 6;
        cntOpacity = 1 - e;
      }
      wrapper.style.opacity = opacity;
      wrapper.style.transform = `scale(${scale})`;
      wrapper.style.clipPath = `inset(${clipInset})`;
      wrapper.style.filter = `blur(${blur}px)`;
      content.style.opacity = cntOpacity;
      content.style.transform = `translateY(${(1 - cntOpacity) * 40}px)`;
    }
    let ticking = false;
    const handler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          ticking = false;
          updateOnScroll();
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handler, {
      passive: true
    });
    updateOnScroll();
    return () => {
      window.removeEventListener('scroll', handler);
    };
  }, [mounted]);
  if (!mounted) {
    return React.createElement("div", {
      className: "absolute inset-0 w-full h-full",
      style: {
        background: '#0F0F10'
      }
    });
  }
  return React.createElement("div", {
    ref: containerRef,
    className: "relative h-screen overflow-hidden"
  }, React.createElement("div", {
    ref: wrapperRef,
    className: "absolute inset-0 w-full h-full overflow-hidden",
    style: {
      opacity: 0,
      transform: 'scale(0.85)',
      clipPath: 'inset(20%)'
    }
  }, React.createElement("video", {
    ref: videoRef,
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    poster: "/demo/salon/images/web-floral-ritual.jpg",
    preload: "auto",
    className: "w-full h-full object-cover"
  }, React.createElement("source", {
    media: "(max-width: 767px)",
    src: "./hero_mobile.mp4",
    type: "video/mp4"
  }), React.createElement("source", {
    src: "./hero.webm",
    type: "video/webm"
  }), React.createElement("source", {
    src: "./hero.mp4",
    type: "video/mp4"
  }))), React.createElement("div", {
    className: "absolute inset-0 z-[2] pointer-events-none",
    style: {
      background: 'linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,0.3) 40%, rgba(10,10,10,0.65) 70%, rgba(10,10,10,0.85) 100%)'
    }
  }, React.createElement("div", {
    className: "absolute inset-0",
    style: {
      background: 'radial-gradient(ellipse at center 30%, transparent 0%, rgba(10,10,10,0.4) 100%)'
    }
  })), React.createElement("div", {
    ref: contentRef,
    className: "absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
  }, React.createElement("p", {
    className: "font-body text-[11px] tracking-[.25em] uppercase text-orchid mb-6"
  }, "The Aurelle Experience"), React.createElement("h1", {
    className: "font-heading italic text-5xl md:text-7xl lg:text-[5.5rem] text-ivory leading-[.9] tracking-[-1px] text-center max-w-4xl px-4",
    style: {
      textShadow: '0 2px 40px rgba(0,0,0,0.5)'
    }
  }, "A Ritual, Not a Routine"), React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-4 mt-12"
  }, React.createElement("a", {
    href: "#book",
    onClick: e => {
      e.preventDefault();
      document.getElementById('book')?.scrollIntoView({
        behavior: 'smooth'
      });
    },
    className: "gilded-glass-strong px-8 py-4 font-body text-[11px] tracking-[.25em] uppercase text-orchid rounded-full hover:bg-orchid/15 hover:shadow-lg hover:shadow-orchid/10 transition-all duration-700 text-center cursor-pointer select-none"
  }, "Reserve Appointment"), React.createElement("a", {
    href: "#treatments",
    onClick: e => {
      e.preventDefault();
      document.getElementById('treatments')?.scrollIntoView({
        behavior: 'smooth'
      });
    },
    className: "px-8 py-4 font-body text-[11px] tracking-[.25em] uppercase text-ivory/80 rounded-full border border-ivory/20 hover:border-orchid/40 hover:text-orchid hover:bg-orchid/5 transition-all duration-700 text-center cursor-pointer select-none"
  }, "Explore Treatments"))), React.createElement("div", {
    className: "absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2",
    style: {
      opacity: 0,
      animation: 'fadeInUp 1s 1.5s forwards cubic-bezier(0.23,1,0.32,1)'
    }
  }, React.createElement("div", {
    className: "w-[22px] h-[34px] border-2 border-white/40 rounded-[12px] relative"
  }, React.createElement("div", {
    className: "absolute top-[6px] left-1/2 -translate-x-1/2 w-[3px] h-[8px] bg-white rounded-[3px]",
    style: {
      animation: 'scrollBounce 1.6s ease-in-out infinite'
    }
  })), React.createElement("span", {
    className: "text-[0.65rem] tracking-[.2em] uppercase text-white/50"
  }, "Scroll")));
}
function disposeScene(scene) {
  scene.traverse(object => {
    if (object.isMesh) {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    }
    if (object.isLight) {}
  });
}
function GoldOrb({
  size = 240,
  opacity = 1,
  parallax = true,
  className = ''
}) {
  const containerRef = useRef(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = size,
      h = size;
    let scene, camera, renderer, orb, mat, geo;
    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, w / h, .1, 100);
      camera.position.z = 3.2;
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
      });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      el.appendChild(renderer.domElement);
      geo = new THREE.IcosahedronGeometry(1.4, 6);
      mat = new THREE.MeshPhysicalMaterial({
        color: '#a855f7',
        metalness: .9,
        roughness: .25,
        clearcoat: .5,
        clearcoatRoughness: .4
      });
      orb = new THREE.Mesh(geo, mat);
      scene.add(orb);
      const l1 = new THREE.PointLight('#d8b4fe', .8, 8);
      l1.position.set(2, 2, 3);
      scene.add(l1);
      const l2 = new THREE.PointLight('#c084fc', .3, 8);
      l2.position.set(-2, -1, 2);
      scene.add(l2);
      const amb = new THREE.AmbientLight(0x442255, .3);
      scene.add(amb);
    } catch (e) {
      console.warn('Three.js init failed:', e.message);
      return;
    }
    let mouseX = 0,
      mouseY = 0,
      rmouseX = 0,
      rmouseY = 0;
    let mm = null;
    if (parallax) {
      mm = e => {
        const r = el.getBoundingClientRect();
        mouseX = ((e.clientX - r.left) / w - .5) * 2;
        mouseY = -((e.clientY - r.top) / h - .5) * 2;
      };
      document.addEventListener('mousemove', mm);
    }
    let running = true;
    const tick = () => {
      if (!running) return;
      rmouseX += (mouseX - rmouseX) * .05;
      rmouseY += (mouseY - rmouseY) * .05;
      orb.rotation.y += .0015;
      orb.rotation.x += rmouseY * .01;
      orb.rotation.z += rmouseX * .005;
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => {
      running = false;
      if (parallax && mm) document.removeEventListener('mousemove', mm);
      try {
        if (renderer && renderer.domElement && renderer.domElement.parentNode) el.removeChild(renderer.domElement);
        if (geo) geo.dispose();
        if (mat) mat.dispose();
        if (renderer) renderer.dispose();
      } catch (e) {}
    };
  }, [size, parallax]);
  return React.createElement("div", {
    ref: containerRef,
    className: className,
    style: {
      width: size,
      height: size,
      opacity
    }
  });
}
function Navbar({
  scrolled
}) {
  const links = [{
    label: 'Home',
    hash: '#home'
  }, {
    label: 'Treatments',
    hash: '#treatments'
  }, {
    label: 'Gallery',
    hash: '#gallery'
  }, {
    label: 'The Studio',
    hash: '#about'
  }];
  const [hash, _] = useHash();
  return React.createElement(motion.nav, {
    role: "navigation",
    "aria-label": "Main navigation",
    className: `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-onyx/95 gilded-glass' : 'bg-transparent'}`,
    style: scrolled ? {} : {
      borderBottom: '1px solid rgba(168,85,247,.15)'
    }
  }, React.createElement("div", {
    className: "max-w-7xl mx-auto px-6 h-20 flex items-center justify-between"
  }, React.createElement("a", {
    href: "#home",
    className: "font-heading italic text-2xl md:text-3xl text-orchid tracking-tight",
    onClick: e => {
      e.preventDefault();
      window.location.hash = '#home';
    },
    "aria-label": "Aurelle Home"
  }, "Aurelle"), React.createElement("div", {
    className: "hidden md:flex items-center gap-8"
  }, links.map(l => React.createElement("a", {
    key: l.hash,
    href: l.hash,
    className: `font-body text-[11px] tracking-[.25em] uppercase transition-colors duration-300 ${hash === l.hash ? 'text-orchid' : 'text-stone hover:text-ivory'}`,
    "aria-current": hash === l.hash ? 'page' : undefined
  }, l.label))), React.createElement("a", {
    href: "#book",
    className: "gilded-glass-strong px-6 py-2.5 text-[11px] tracking-[.25em] uppercase text-orchid rounded-full hover:bg-orchid/10 transition-all",
    onClick: e => {
      e.preventDefault();
      window.location.hash = '#book';
    }
  }, "Reserve")));
}
function Footer() {
  return React.createElement("footer", {
    className: "gilded-glass border-t-0 mt-0 py-16 px-6",
    role: "contentinfo"
  }, React.createElement("div", {
    className: "max-w-6xl mx-auto"
  }, React.createElement("div", {
    className: "orchid-hairline w-full mb-12"
  }), React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-12"
  }, React.createElement("div", null, React.createElement("h4", {
    className: "font-heading italic text-xl text-orchid mb-4"
  }, "Studio"), React.createElement("p", {
    className: "font-body text-sm text-stone leading-relaxed tracking-body"
  }, "42 Rosewood Lane", React.createElement("br", null), "New York, NY 10012"), React.createElement("p", {
    className: "font-body text-sm text-stone mt-3 tracking-body"
  }, "Mon\u2013Sat: 9am \u2013 8pm", React.createElement("br", null), "Sun: 10am \u2013 5pm")), React.createElement("div", null, React.createElement("h4", {
    className: "font-heading italic text-xl text-orchid mb-4"
  }, "Treatments"), React.createElement("ul", {
    className: "font-body text-sm text-stone space-y-2 tracking-body"
  }, React.createElement("li", null, React.createElement("a", {
    href: "#treatments",
    className: "hover:text-ivory transition-colors"
  }, "Facials")), React.createElement("li", null, React.createElement("a", {
    href: "#treatments",
    className: "hover:text-ivory transition-colors"
  }, "Massage")), React.createElement("li", null, React.createElement("a", {
    href: "#treatments",
    className: "hover:text-ivory transition-colors"
  }, "Body Treatments")), React.createElement("li", null, React.createElement("a", {
    href: "#treatments",
    className: "hover:text-ivory transition-colors"
  }, "Nail Care")))), React.createElement("div", null, React.createElement("h4", {
    className: "font-heading italic text-xl text-orchid mb-4"
  }, "Connect"), React.createElement("p", {
    className: "font-body text-sm text-stone tracking-body"
  }, "hello@aurelle.com", React.createElement("br", null), "+1 (212) 555-0189"), React.createElement("div", {
    className: "flex gap-4 mt-4"
  }, ['IG', 'FB', 'PT'].map(s => React.createElement("span", {
    key: s,
    className: "font-body text-[11px] tracking-[.2em] uppercase text-orchid border border-orchid/30 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-orchid/10 transition-all",
    role: "button",
    tabIndex: 0,
    "aria-label": s
  }, s))))), React.createElement("div", {
    className: "text-center mt-12 font-body text-[10px] tracking-[.25em] uppercase text-stone/50"
  }, "\xA9 2026 Aurelle \u2014 Private Salon & Spa")));
}
const CATEGORIES = [{
  name: 'Facials',
  image: '/demo/salon/images/web-facial-treatment.jpg',
  items: [{
    name: 'The Aurelle Facial',
    desc: 'Customized brightening facial with enzyme peel, LED therapy, and lymphatic drainage.',
    dur: '75 min',
    price: '$195'
  }, {
    name: 'Gold Collagen Lift',
    desc: '24K gold-infused sheet mask with micro-current lifting.',
    dur: '60 min',
    price: '$220'
  }, {
    name: 'CBD De-Stress Glow',
    desc: 'Calming CBD serum facial for sensitive, reactive skin.',
    dur: '60 min',
    price: '$175'
  }]
}, {
  name: 'Massage',
  image: '/demo/salon/images/web-hot-stone-ritual.jpg',
  items: [{
    name: 'Warm Stone Ritual',
    desc: 'Heated basalt stones with slow, deep-tissue release.',
    dur: '80 min',
    price: '$210'
  }, {
    name: 'Aromatherapy Pressure',
    desc: 'Essential oil blend tailored to your dosha.',
    dur: '60 min',
    price: '$180'
  }, {
    name: 'Sports Recovery',
    desc: 'Targeted myofascial release + percussion therapy.',
    dur: '75 min',
    price: '$200'
  }]
}, {
  name: 'Body',
  image: '/demo/salon/images/web-body-ritual.jpg',
  items: [{
    name: 'Sakura Salt Scrub',
    desc: 'Cherry-blossom salt exfoliation with warm oil cocoon.',
    dur: '45 min',
    price: '$145'
  }, {
    name: 'Detox Body Wrap',
    desc: 'Seaweed + clay wrap with scalp massage.',
    dur: '60 min',
    price: '$165'
  }]
}, {
  name: 'Nails',
  image: '/demo/salon/images/web-floral-ritual.jpg',
  items: [{
    name: 'Signature Manicure',
    desc: 'Sculpted shaping, cuticle work, and gold-foil accent.',
    dur: '45 min',
    price: '$75'
  }, {
    name: 'Gel Luxe',
    desc: 'Long-wear gel with champagne-tinted top coat.',
    dur: '60 min',
    price: '$85'
  }, {
    name: 'Paraffin Dip',
    desc: 'Warm paraffin immersion with vitamin-E cream wrap.',
    dur: '30 min',
    price: '$55'
  }]
}];
const GALLERY_IMGS = ['/demo/salon/images/web-floral-ritual.jpg', '/demo/salon/images/web-hot-stone-ritual.jpg', '/demo/salon/images/web-facial-treatment.jpg', '/demo/salon/images/web-body-ritual.jpg', '/demo/salon/images/web-essential-oil.jpg', '/demo/salon/images/web-salon-interior.jpg', '/demo/salon/images/facial1.jpg', '/demo/salon/images/massage1.jpg', '/demo/salon/images/body1.jpg', '/demo/salon/images/treatment-room.jpg', '/demo/salon/images/facials.jpg', '/demo/salon/images/nails.jpg'];
const TESTIMONIALS = [{
  name: 'Clara M.',
  img: '/demo/salon/images/testimonial0.jpg',
  text: 'I walked out feeling like I had been on a week-long retreat. Every detail — the linens, the music, the steam — was intentional.'
}, {
  name: 'David K.',
  img: '/demo/salon/images/testimonial1.jpg',
  text: 'The Gold Collagen Lift is transformative. My skin had never looked this even. I book my next session before I leave.'
}, {
  name: 'Sophie L.',
  img: '/demo/salon/images/testimonial2.jpg',
  text: 'Aurelle is not a spa. It is a practice. The therapists listen to your skin, not a script.'
}];
const TEAM = [{
  name: 'Elara Voss',
  role: 'Founder & Lead Esthetician',
  img: '/demo/salon/images/elara.jpg'
}, {
  name: 'Mira Chen',
  role: 'Senior Massage Therapist',
  img: '/demo/salon/images/mira.jpg'
}, {
  name: 'Sage Kim',
  role: 'Nail Artist & Formulation',
  img: '/demo/salon/images/sage.jpg'
}, {
  name: 'Theo Byrne',
  role: 'Bodywork Specialist',
  img: '/demo/salon/images/theo.jpg'
}];
const BEFORE_AFTER = [{
  before: '/demo/salon/images/before1.jpg',
  after: '/demo/salon/images/after1.jpg'
}, {
  before: '/demo/salon/images/before2.jpg',
  after: '/demo/salon/images/after2.jpg'
}, {
  before: '/demo/salon/images/before3.jpg',
  after: '/demo/salon/images/after3.jpg'
}, {
  before: '/demo/salon/images/before4.jpg',
  after: '/demo/salon/images/after4.jpg'
}];
function HomePage() {
  return React.createElement("div", null, React.createElement("section", {
    id: "home",
    className: "relative h-screen overflow-hidden"
  }, React.createElement(LuxuryHero, null)), React.createElement("section", {
    className: "max-w-3xl mx-auto px-6 py-28 md:py-40 text-center"
  }, React.createElement(BlurText, {
    text: "We believe true beauty is unhurried. Every treatment at Aurelle is a conversation between technique and stillness \u2014 a practice of presence, not productivity.",
    as: "p",
    className: "font-heading italic text-xl md:text-2xl text-ivory leading-relaxed",
    stagger: 120
  })), React.createElement("section", {
    className: "max-w-6xl mx-auto px-6 pb-28"
  }, React.createElement("h2", {
    className: "font-heading italic text-3xl md:text-4xl text-ivory text-center mb-16"
  }, "Signature Treatments"), React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-6"
  }, [{
    title: 'The Aurelle Facial',
    img: '/demo/salon/images/web-facial-treatment.jpg',
    price: '$195',
    dur: '75 min'
  }, {
    title: 'Warm Stone Ritual',
    img: '/demo/salon/images/web-hot-stone-ritual.jpg',
    price: '$210',
    dur: '80 min'
  }, {
    title: 'Gold Collagen Lift',
    img: '/demo/salon/images/web-essential-oil.jpg',
    price: '$220',
    dur: '60 min'
  }].map((t, i) => React.createElement(motion.div, {
    key: t.title,
    initial: {
      opacity: 0,
      y: 24
    },
    whileInView: {
      opacity: 1,
      y: 0
    },
    viewport: {
      once: true
    },
    transition: {
      delay: i * .1,
      duration: .6,
      ease: [.23, 1, .32, 1]
    },
    className: "corner-bracket p-[1px]"
  }, React.createElement("div", {
    className: "bg-warm-charcoal/80 overflow-hidden"
  }, React.createElement("img", {
    src: t.img,
    alt: t.title,
    className: "w-full aspect-[4/5] object-cover",
    loading: "lazy",
    width: "900",
    height: "1125"
  }), React.createElement("div", {
    className: "p-6"
  }, React.createElement("h3", {
    className: "font-heading italic text-xl text-ivory mb-1"
  }, t.title), React.createElement("p", {
    className: "font-body text-sm text-orchid tracking-body"
  }, t.dur, " \u2014 ", t.price))))))), React.createElement("section", {
    className: "py-20 flex flex-col items-center"
  }, React.createElement(GoldOrb, {
    size: 240,
    opacity: 1
  }), React.createElement("p", {
    className: "font-heading italic text-lg text-stone mt-6"
  }, "Crafted from orchid, gemstone, and time")), React.createElement("section", {
    className: "max-w-6xl mx-auto px-6 pb-28"
  }, React.createElement("h2", {
    className: "font-heading italic text-3xl md:text-4xl text-ivory text-center mb-16"
  }, "Real Transformations"), React.createElement("div", {
    className: "flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide",
    style: {
      scrollbarWidth: 'none'
    }
  }, BEFORE_AFTER.map((pair, i) => React.createElement(motion.div, {
    key: i,
    initial: {
      opacity: 0
    },
    whileInView: {
      opacity: 1
    },
    viewport: {
      once: true
    },
    className: "gilded-glass min-w-[340px] md:min-w-[400px] snap-center"
  }, React.createElement("div", {
    className: "ba-pair p-2"
  }, React.createElement("div", null, React.createElement("p", {
    className: "font-body text-[10px] tracking-[.2em] uppercase text-stone/60 text-center mb-1"
  }, "Before"), React.createElement("img", {
    src: pair.before,
    alt: "Before treatment",
    className: "w-full aspect-square object-cover",
    loading: "lazy",
    width: "700",
    height: "700"
  })), React.createElement("div", {
    className: "ba-divider"
  }), React.createElement("div", null, React.createElement("p", {
    className: "font-body text-[10px] tracking-[.2em] uppercase text-stone/60 text-center mb-1"
  }, "After"), React.createElement("img", {
    src: pair.after,
    alt: "After treatment",
    className: "w-full aspect-square object-cover",
    loading: "lazy",
    width: "700",
    height: "700"
  }))))))), React.createElement("section", {
    className: "max-w-5xl mx-auto px-6 pb-28"
  }, React.createElement("h2", {
    className: "font-heading italic text-3xl md:text-4xl text-ivory text-center mb-16"
  }, "What Our Guests Say"), React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-8"
  }, TESTIMONIALS.map((t, i) => React.createElement(motion.div, {
    key: t.name,
    initial: {
      opacity: 0,
      y: 20
    },
    whileInView: {
      opacity: 1,
      y: 0
    },
    viewport: {
      once: true
    },
    transition: {
      delay: i * .15,
      duration: .6
    },
    className: "text-center"
  }, React.createElement("div", {
    className: "w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden border border-orchid/30"
  }, React.createElement("img", {
    src: t.img,
    alt: t.name,
    className: "w-full h-full object-cover",
    loading: "lazy",
    width: "160",
    height: "160"
  })), React.createElement("p", {
    className: "font-heading italic text-base text-ivory/90 leading-relaxed mb-3"
  }, "\u201C", t.text, "\u201D"), React.createElement("p", {
    className: "font-body text-xs tracking-[.2em] uppercase text-orchid"
  }, t.name))))), React.createElement("section", {
    className: "gilded-glass-strong py-20 px-6 text-center relative overflow-hidden"
  }, React.createElement("div", {
    className: "absolute -right-20 -top-20 opacity-20"
  }, React.createElement(GoldOrb, {
    size: 300,
    parallax: false
  })), React.createElement("h2", {
    className: "font-heading italic text-4xl md:text-5xl text-ivory mb-6"
  }, "Begin Your Ritual"), React.createElement("p", {
    className: "font-body text-stone text-sm tracking-body max-w-md mx-auto mb-8"
  }, "Step away from the ordinary. Your treatment room awaits."), React.createElement("a", {
    href: "#book",
    className: "inline-block gilded-glass-strong px-10 py-3.5 font-body text-[11px] tracking-[.25em] uppercase text-orchid rounded-full hover:bg-orchid/10 transition-all",
    onClick: e => {
      e.preventDefault();
      window.location.hash = '#book';
    }
  }, "Reserve Your Visit")), React.createElement(Footer, null));
}
function TreatmentsPage() {
  return React.createElement("div", {
    className: "pt-20"
  }, React.createElement("section", {
    id: "treatments"
  }, React.createElement("div", {
    className: "max-w-6xl mx-auto px-6 py-16"
  }, React.createElement("h1", {
    className: "font-heading italic text-4xl md:text-5xl text-ivory text-center mb-4"
  }, "Treatments"), React.createElement("p", {
    className: "font-body text-sm text-stone text-center tracking-body max-w-xl mx-auto mb-16"
  }, "Every service is performed with intention, using pure ingredients and time-honored technique."))), CATEGORIES.map((cat, ci) => React.createElement("section", {
    key: cat.name,
    className: "mb-16"
  }, React.createElement("div", {
    className: "relative h-[300px] md:h-[400px] overflow-hidden mb-12"
  }, React.createElement("img", {
    src: cat.image,
    alt: cat.name,
    className: "w-full h-full object-cover",
    loading: "lazy",
    width: "1600",
    height: "500"
  }), React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-r from-onyx/80 to-transparent flex items-center"
  }, React.createElement("div", {
    className: "max-w-6xl mx-auto px-6 w-full"
  }, React.createElement("h2", {
    className: "font-heading italic text-5xl md:text-7xl text-ivory"
  }, cat.name)))), React.createElement("div", {
    className: "max-w-4xl mx-auto px-6"
  }, React.createElement("div", {
    className: "gilded-glass"
  }, cat.items.map((item, i) => React.createElement(motion.div, {
    key: item.name,
    initial: {
      opacity: 0,
      y: 16
    },
    whileInView: {
      opacity: 1,
      y: 0
    },
    viewport: {
      once: true
    },
    transition: {
      delay: i * .08,
      duration: .5
    },
    className: "flex items-center gap-6 px-6 py-6",
    style: i < cat.items.length - 1 ? {
      borderBottom: '1px solid rgba(168,85,247,.15)'
    } : {}
  }, React.createElement("div", {
    className: "w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex-shrink-0 border border-orchid/20"
  }, React.createElement("img", {
    src: `/demo/salon/images/treat${i % 6}.jpg`,
    alt: item.name,
    className: "w-full h-full object-cover",
    loading: "lazy",
    width: "500",
    height: "500"
  })), React.createElement("div", {
    className: "flex-1 min-w-0"
  }, React.createElement("h3", {
    className: "font-heading italic text-xl text-ivory"
  }, item.name), React.createElement("p", {
    className: "font-body text-xs text-stone mt-1 tracking-body"
  }, item.desc)), React.createElement("div", {
    className: "text-right flex-shrink-0"
  }, React.createElement("p", {
    className: "font-body text-sm text-orchid tracking-body"
  }, item.price), React.createElement("p", {
    className: "font-body text-[10px] tracking-[.2em] uppercase text-stone/60"
  }, item.dur)))))))), React.createElement(Footer, null));
}
function GalleryPage() {
  const [lightbox, setLightbox] = useState(null);
  return React.createElement("div", {
    className: "pt-20"
  }, React.createElement("section", {
    id: "gallery"
  }, React.createElement("div", {
    className: "max-w-6xl mx-auto px-6 py-16"
  }, React.createElement("h1", {
    className: "font-heading italic text-4xl md:text-5xl text-ivory text-center mb-4"
  }, "Gallery"), React.createElement("p", {
    className: "font-body text-sm text-stone text-center tracking-body max-w-xl mx-auto mb-16"
  }, "The spaces, the details, the light.")), React.createElement("div", {
    className: "max-w-7xl mx-auto px-4 columns-2 md:columns-3 gap-4 pb-24"
  }, GALLERY_IMGS.map((url, i) => React.createElement(motion.img, {
    key: i,
    src: url,
    alt: `Gallery image ${i + 1}`,
    initial: {
      opacity: 0
    },
    whileInView: {
      opacity: 1
    },
    viewport: {
      once: true
    },
    transition: {
      delay: .05 * (i % 6)
    },
    className: "w-full mb-4 cursor-pointer hover:opacity-80 transition-opacity duration-500",
    loading: "lazy",
    onClick: () => setLightbox(url),
    style: {
      breakInside: 'avoid'
    },
    width: "1000",
    height: "1250"
  })))), React.createElement(AnimatePresence, null, lightbox && React.createElement(motion.div, {
    key: "lb",
    className: "lightbox-overlay",
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1
    },
    exit: {
      opacity: 0
    },
    onClick: () => setLightbox(null),
    role: "dialog",
    "aria-label": "Image lightbox"
  }, React.createElement("img", {
    src: lightbox,
    alt: "Enlarged view",
    className: "max-h-[90vh] max-w-[90vw] object-contain"
  }), React.createElement("button", {
    className: "lightbox-close",
    onClick: e => {
      e.stopPropagation();
      setLightbox(null);
    },
    "aria-label": "Close lightbox"
  }, "\xD7"))), React.createElement(Footer, null));
}
function AboutPage() {
  const orbSize = useMemo(() => Math.min((window.innerWidth || 1200) * .6, 500), []);
  return React.createElement("div", {
    className: "pt-20"
  }, React.createElement("section", {
    id: "about",
    className: "relative min-h-[70vh] flex items-center justify-center overflow-hidden py-20"
  }, React.createElement("div", {
    className: "absolute inset-0 flex items-center justify-center pointer-events-none"
  }, React.createElement(GoldOrb, {
    size: orbSize,
    opacity: .6,
    parallax: false
  })), React.createElement("div", {
    className: "relative z-10 max-w-3xl mx-auto px-6 text-center"
  }, React.createElement(BlurText, {
    text: "We started Aurelle because luxury should not be loud. It should be felt in the quality of a touch, the weight of a linen, the patience of a therapist who listens.",
    as: "p",
    className: "font-heading italic text-xl md:text-2xl text-ivory leading-relaxed",
    stagger: 100
  }))), React.createElement("section", {
    className: "max-w-5xl mx-auto px-6 py-20"
  }, React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
  }, React.createElement("div", null, React.createElement("img", {
    src: TEAM[0].img,
    alt: TEAM[0].name,
    className: "w-full aspect-[4/5] object-cover",
    loading: "lazy",
    width: "800",
    height: "1000"
  })), React.createElement("div", null, React.createElement("h2", {
    className: "font-heading italic text-3xl text-ivory mb-2"
  }, TEAM[0].name), React.createElement("p", {
    className: "font-body text-[11px] tracking-[.25em] uppercase text-orchid mb-6"
  }, TEAM[0].role), React.createElement("p", {
    className: "font-body text-sm text-stone leading-relaxed tracking-body"
  }, "With over 15 years in luxury skincare and a diploma from the Institut de Beaut\xE9 in Paris, Elara founded Aurelle as a sanctuary for the senses. Every product on our shelves is chosen for purity \u2014 every technique, for efficacy.")))), React.createElement("section", {
    className: "max-w-6xl mx-auto px-6 pb-20"
  }, React.createElement("h2", {
    className: "font-heading italic text-3xl text-ivory text-center mb-16"
  }, "Our Therapists"), React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-8"
  }, TEAM.slice(1).map((t, i) => React.createElement(motion.div, {
    key: t.name,
    initial: {
      opacity: 0,
      y: 20
    },
    whileInView: {
      opacity: 1,
      y: 0
    },
    viewport: {
      once: true
    },
    transition: {
      delay: i * .1
    },
    className: "text-center"
  }, React.createElement("img", {
    src: t.img,
    alt: t.name,
    className: "w-full aspect-[4/5] object-cover mb-4",
    loading: "lazy",
    width: "800",
    height: "1000"
  }), React.createElement("h3", {
    className: "font-heading italic text-lg text-ivory"
  }, t.name), React.createElement("p", {
    className: "font-body text-[10px] tracking-[.25em] uppercase text-orchid mt-1"
  }, t.role))))), React.createElement("section", {
    className: "max-w-3xl mx-auto px-6 pb-28 text-center"
  }, React.createElement("div", {
    className: "orchid-hairline w-24 mb-8 mx-auto"
  }), React.createElement("p", {
    className: "font-heading italic text-2xl md:text-3xl text-ivory/80 leading-relaxed"
  }, "We do not believe in shortcuts to beauty. Every ingredient, every stroke, every silence \u2014 it all matters."), React.createElement("div", {
    className: "orchid-hairline w-24 mt-8 mx-auto"
  })), React.createElement(Footer, null));
}
const TREATMENT_ITEMS = [...CATEGORIES.flatMap(c => c.items.map(i => ({
  ...i,
  cat: c.name
})))];
const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
function BookingPage() {
  const saved = useMemo(() => {
    try {
      const d = sessionStorage.getItem('aurelle_booking');
      return d ? JSON.parse(d) : null;
    } catch (e) {
      return null;
    }
  }, []);
  const [step, setStep] = useState(saved?.step || 1);
  const [selected, setSelected] = useState(saved?.selected || null);
  const [date, setDate] = useState(saved?.date || '');
  const [time, setTime] = useState(saved?.time || '');
  const [form, setForm] = useState(saved?.form || {
    name: '',
    phone: '',
    email: ''
  });
  const [confirmed, setConfirmed] = useState(false);
  const direction = useRef(1);
  const slide = newStep => {
    direction.current = newStep > step ? 1 : -1;
    setStep(newStep);
  };
  useEffect(() => {
    if (!confirmed) {
      try {
        sessionStorage.setItem('aurelle_booking', JSON.stringify({
          step,
          selected,
          date,
          time,
          form
        }));
      } catch (e) {}
    }
  }, [step, selected, date, time, form, confirmed]);
  useEffect(() => {
    if (confirmed) sessionStorage.removeItem('aurelle_booking');
  }, [confirmed]);
  const variants = {
    enter: d => ({
      x: d * 40,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: d => ({
      x: -d * 40,
      opacity: 0
    })
  };
  const doConfirm = () => {
    if (selected && date && time && form.name && form.email) setConfirmed(true);
  };
  if (confirmed) return React.createElement("div", {
    className: "pt-20 min-h-screen flex items-center justify-center px-6"
  }, React.createElement("div", {
    className: "gilded-glass-strong max-w-lg w-full p-12 text-center"
  }, React.createElement("div", {
    className: "w-16 h-16 rounded-full border border-orchid/40 mx-auto mb-6 flex items-center justify-center"
  }, React.createElement("span", {
    className: "text-orchid text-2xl"
  }, "\u2713")), React.createElement("h2", {
    className: "font-heading italic text-3xl text-ivory mb-4"
  }, "Thank You"), React.createElement("p", {
    className: "font-body text-sm text-stone tracking-body"
  }, "Your appointment request has been received. We will confirm within 24 hours."), React.createElement("p", {
    className: "font-body text-xs text-orchid mt-4 tracking-body"
  }, selected?.name, " \xB7 ", date, " at ", time), React.createElement("a", {
    href: "#home",
    className: "inline-block mt-8 font-body text-[11px] tracking-[.25em] uppercase text-orchid hover:text-ivory transition-colors",
    onClick: e => {
      e.preventDefault();
      window.location.hash = '#home';
    }
  }, "Return Home")));
  return React.createElement("div", {
    className: "pt-20 min-h-screen px-6 py-16"
  }, React.createElement("section", {
    id: "book"
  }, React.createElement("div", {
    className: "max-w-5xl mx-auto"
  }, React.createElement("h1", {
    className: "font-heading italic text-4xl md:text-5xl text-ivory text-center mb-4"
  }, "Book an Appointment"), React.createElement("p", {
    className: "font-body text-sm text-stone text-center tracking-body mb-16"
  }, "Three simple steps to begin your ritual."), React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8"
  }, React.createElement("div", {
    className: "gilded-glass-strong p-8 md:p-10 relative overflow-hidden"
  }, React.createElement("div", {
    className: "flex gap-1 mb-8"
  }, [1, 2, 3].map(s => React.createElement("div", {
    key: s,
    className: `h-1 flex-1 rounded-full transition-colors duration-300 ${s <= step ? 'bg-gold' : 'bg-gold/15'}`,
    role: "progressbar",
    "aria-valuenow": step,
    "aria-valuemin": 1,
    "aria-valuemax": 3
  }))), React.createElement(AnimatePresence, {
    mode: "wait",
    custom: direction.current
  }, step === 1 && React.createElement(motion.div, {
    key: "s1",
    variants: variants,
    initial: "enter",
    animate: "center",
    exit: "exit",
    custom: direction.current
  }, React.createElement("h3", {
    className: "font-heading italic text-xl text-ivory mb-6"
  }, "Choose Your Treatment"), React.createElement("div", {
    className: "space-y-2 max-h-[400px] overflow-y-auto pr-2",
    role: "listbox",
    "aria-label": "Available treatments"
  }, TREATMENT_ITEMS.map(t => React.createElement("button", {
    key: t.name,
    onClick: () => {
      setSelected(t);
      setTimeout(() => slide(2), 300);
    },
    className: `w-full text-left px-5 py-4 rounded-full transition-all duration-300 font-body text-sm tracking-body ${selected?.name === t.name ? 'gilded-glass-strong text-orchid' : 'border border-orchid/15 text-stone hover:border-orchid/30 hover:text-ivory'}`,
    role: "option",
    "aria-selected": selected?.name === t.name
  }, React.createElement("span", {
    className: "font-heading italic text-base"
  }, t.name), React.createElement("span", {
    className: "float-right text-orchid text-xs"
  }, t.price))))), step === 2 && React.createElement(motion.div, {
    key: "s2",
    variants: variants,
    initial: "enter",
    animate: "center",
    exit: "exit",
    custom: direction.current
  }, React.createElement("h3", {
    className: "font-heading italic text-xl text-ivory mb-6"
  }, "Pick Date & Time"), React.createElement("input", {
    type: "date",
    value: date,
    onChange: e => setDate(e.target.value),
    className: "w-full bg-transparent border border-orchid/30 rounded-full px-5 py-3 text-ivory font-body text-sm tracking-body mb-6 focus:outline-none focus:border-orchid/60",
    min: new Date().toISOString().split('T')[0]
  }), React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6",
    role: "listbox",
    "aria-label": "Available times"
  }, TIME_SLOTS.map(t => React.createElement("button", {
    key: t,
    onClick: () => setTime(t),
    className: `px-3 py-2 rounded-full text-xs font-body tracking-body transition-all ${time === t ? 'gilded-glass-strong text-orchid' : 'border border-orchid/15 text-stone hover:border-orchid/30'}`,
    role: "option",
    "aria-selected": time === t
  }, t))), React.createElement("div", {
    className: "flex gap-3"
  }, React.createElement("button", {
    onClick: () => slide(1),
    className: "px-6 py-2.5 font-body text-[11px] tracking-[.25em] uppercase text-stone border border-orchid/20 rounded-full hover:text-ivory transition-all"
  }, "Back"), React.createElement("button", {
    onClick: () => slide(3),
    className: "px-6 py-2.5 font-body text-[11px] tracking-[.25em] uppercase text-orchid gilded-glass-strong rounded-full hover:bg-orchid/10 transition-all",
    disabled: !date || !time,
    style: {
      opacity: !date || !time ? 0.5 : 1
    }
  }, "Continue"))), step === 3 && React.createElement(motion.div, {
    key: "s3",
    variants: variants,
    initial: "enter",
    animate: "center",
    exit: "exit",
    custom: direction.current
  }, React.createElement("h3", {
    className: "font-heading italic text-xl text-ivory mb-6"
  }, "Your Details"), React.createElement("div", {
    className: "space-y-4"
  }, [{
    key: 'name',
    label: 'Full Name',
    type: 'text',
    required: true
  }, {
    key: 'phone',
    label: 'Phone',
    type: 'tel'
  }, {
    key: 'email',
    label: 'Email',
    type: 'email',
    required: true
  }].map(f => React.createElement("div", {
    key: f.key
  }, React.createElement("label", {
    className: "font-body text-[10px] tracking-[.25em] uppercase text-stone/80 block mb-1"
  }, f.label), React.createElement("input", {
    type: f.type,
    value: form[f.key],
    onChange: e => setForm(p => ({
      ...p,
      [f.key]: e.target.value
    })),
    className: "w-full bg-transparent border border-orchid/20 rounded-full px-5 py-3 text-ivory font-body text-sm tracking-body focus:outline-none focus:border-orchid/60",
    "aria-required": f.required || undefined
  })))), React.createElement("div", {
    className: "flex gap-3 mt-8"
  }, React.createElement("button", {
    onClick: () => slide(2),
    className: "px-6 py-2.5 font-body text-[11px] tracking-[.25em] uppercase text-stone border border-orchid/20 rounded-full hover:text-ivory transition-all"
  }, "Back"), React.createElement("button", {
    onClick: doConfirm,
    className: "px-6 py-2.5 font-body text-[11px] tracking-[.25em] uppercase text-orchid gilded-glass-strong rounded-full hover:bg-orchid/10 transition-all",
    disabled: !form.name || !form.email,
    style: {
      opacity: !form.name || !form.email ? 0.5 : 1
    }
  }, "Confirm Booking"))))), React.createElement("div", {
    className: "hidden md:block"
  }, React.createElement("div", {
    className: "gilded-glass overflow-hidden"
  }, React.createElement("img", {
    src: "/demo/salon/images/web-body-ritual.jpg",
    alt: "Treatment room",
    className: "w-full aspect-[3/4] object-cover",
    loading: "lazy",
    width: "900",
    height: "1200"
  }), React.createElement("div", {
    className: "p-6"
  }, React.createElement("p", {
    className: "font-body text-xs text-stone tracking-body"
  }, "42 Rosewood Lane, New York"), React.createElement("p", {
    className: "font-body text-xs text-stone mt-2 tracking-body"
  }, "Mon\u2013Sat: 9am\u20138pm", React.createElement("br", null), "Sun: 10am\u20135pm"))))))), React.createElement(Footer, null));
}
function App() {
  const [hash, nav] = useHash();
  const {
    scrollY
  } = useScroll();
  const [scrolled, setScrolled] = useState(hash !== '#home' || scrollY.get() > 80);
  useEffect(() => {
    const unsub = scrollY.on('change', v => {
      setScrolled(v > 80);
    });
    return unsub;
  }, [scrollY]);
  useEffect(() => {
    if (hash !== '#home') setScrolled(true);
  }, [hash]);
  const pages = {
    '#home': HomePage,
    '#treatments': TreatmentsPage,
    '#gallery': GalleryPage,
    '#about': AboutPage,
    '#book': BookingPage
  };
  const Page = pages[hash] || HomePage;
  return React.createElement("div", {
    className: "bg-onyx min-h-screen"
  }, React.createElement(AppErrorBoundary, null, React.createElement(Navbar, {
    scrolled: scrolled
  }), React.createElement(AnimatePresence, {
    mode: "wait"
  }, React.createElement(motion.div, {
    key: hash,
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1
    },
    exit: {
      opacity: 0
    },
    transition: {
      duration: .4
    }
  }, React.createElement(Page, null)))));
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App, null));
