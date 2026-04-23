import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Smartphone, Zap, Cloud, Check, ShieldCheck, CalendarDays, Gem,
  Wifi, FileSpreadsheet, Clock, ArrowRight, Star, ChevronDown, ChevronUp
} from 'lucide-react';
import { useAuthStore } from './Mocks/AuthStore';
import { redirectToCheckout } from './Mocks/StripeMock';
import { ContactForm } from './Components/ContactForm';
import { Loader2, AlertCircle } from 'lucide-react';

// ── Utilitaire d'animation scroll ────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Plans tarifaires ──────────────────────────────────────────────────────────
const LANDING_PLANS = [
  {
    id: 'hybrid-starter',
    icon: <CalendarDays className="w-5 h-5" />,
    label: 'Starter (Solo)',
    price: '19',
    priceSuffix: '€/mois',
    usage: '1 accès, Inventaire, Exports',
    highlight: false,
    badge: null,
    priceId: 'starter_mock',
    planType: 'starter',
  },
  {
    id: 'hybrid-pro',
    icon: <Gem className="w-5 h-5" />,
    label: 'Business (Multi)',
    price: '39',
    priceSuffix: '€/mois',
    usage: '5 accès, Gestion des stocks, Dashboard',
    highlight: true,
    badge: 'Populaire',
    priceId: 'business_mock',
    planType: 'business',
  },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQ = [
  {
    q: "Puis-je encaisser si mon Wi-Fi tombe en panne ?",
    a: "Oui, c'est la raison d'être d'Heryze. Les ventes sont enregistrées localement dans votre navigateur (IndexedDB). Dès que la connexion revient, tout se synchronise automatiquement dans le Cloud, sans que vous fassiez quoi que ce soit."
  },
  {
    q: "J'ai une douchette code-barre, est-ce compatible ?",
    a: "Oui, les douchettes USB et Bluetooth fonctionnent comme un clavier. Mais avec Heryze, vous n'en avez plus besoin — la caméra de votre smartphone fait exactement le même travail, sans câble et sans achat."
  },
  // ... more faq as needed
];

// ── Page principale ───────────────────────────────────────────────────────────
export default function CaisseLandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [checkingOutPlanId, setCheckingOutPlanId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 80);
      }
    }
  }, [location.hash]);

  const handleSelectPlan = async (priceId: string, planType: string) => {
    console.log('Select plan:', priceId, planType);
    redirectToCheckout({ priceId });
  };

  return (
    <div className="relative w-full overflow-x-hidden bg-[#f8f9fa] font-sans text-gray-900">

      {/* Décor fond */}
      <div className="absolute top-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-8%] left-[15%] w-[55%] h-[45%] bg-gradient-to-br from-[#00f2ff]/15 to-[#0055ff]/8 rounded-full blur-[130px]" />
        <div className="absolute top-[25%] right-[-8%] w-[38%] h-[38%] bg-gradient-to-br from-blue-200/15 to-indigo-200/15 rounded-full blur-[120px]" />
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-6 pb-16 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
          className="flex flex-col items-center max-w-6xl"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black tracking-[0.2em] uppercase mb-8 shadow-sm border border-blue-100/50">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            CONÇU POUR LA CONFORMITÉ NF525
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[5.5rem] font-black tracking-[-0.04em] mb-10 leading-[1.1] text-gray-900">
            <span className="block md:whitespace-nowrap">Encaissez sans internet.</span>
            <span className="bg-gradient-to-br from-[#00f2ff] to-[#0055ff] bg-clip-text text-transparent block md:whitespace-nowrap">
              Votre comptable dit merci.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mt-3 font-medium leading-relaxed">
            Heryze est le seul logiciel qui encaisse vos clients <strong className="text-gray-700">sans internet</strong>, et envoie la comptabilité à votre expert-comptable <strong className="text-gray-700">sans que vous touchiez à rien</strong>.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-7">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-semibold shadow-sm">
              <Smartphone className="w-4 h-4 text-blue-500" />
              Zéro douchette à acheter
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-semibold shadow-sm">
              <Wifi className="w-4 h-4 text-purple-500" />
              Offline-first garanti
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-semibold shadow-sm">
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              Export FEC pour votre comptable
            </span>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="bg-[#0055ff] text-white px-8 py-4 rounded-full font-bold tracking-wider uppercase text-sm shadow-xl shadow-blue-500/30 hover:bg-[#0044cc] hover:-translate-y-1 transition-all text-center">
              Inscription
            </button>
            <a href="#pricing" className="text-gray-400 px-4 py-4 rounded-full font-bold tracking-wider uppercase text-xs hover:text-gray-600 transition-all text-center">
              Voir les tarifs
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── 3 PILLIERS ────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 bg-white border-y border-gray-100 relative z-20">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Trois forces. Un seul outil.
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Wifi className="w-8 h-8 text-purple-600" />,
                title: 'Caisse Offline-First',
                desc: "Votre box tombe en panne ? Votre 4G lâche en plein service ? Heryze encaisse quand même.",
                color: 'from-purple-50 to-pink-50',
                border: 'border-purple-100',
              },
              {
                icon: <Smartphone className="w-8 h-8 text-blue-600" />,
                title: 'Scanner Zéro Achat',
                desc: "L'appareil photo de n'importe quel smartphone devient un scanner de code-barre sans fil.",
                color: 'from-blue-50 to-cyan-50',
                border: 'border-blue-100',
              },
              {
                icon: <FileSpreadsheet className="w-8 h-8 text-emerald-600" />,
                title: 'Compta Sans Effort',
                desc: "Heryze calcule votre TVA, génère votre Z-caisse, et prépare l'export FEC.",
                color: 'from-emerald-50 to-teal-50',
                border: 'border-emerald-100',
              },
            ].map((c, i) => (
              <FadeIn key={c.title} delay={i * 0.12}>
                <div className={`rounded-3xl p-8 bg-gradient-to-br ${c.color} border ${c.border} h-full shadow-sm hover:shadow-md transition-shadow flex flex-col`}>
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-5 shadow-sm border border-black/5">{c.icon}</div>
                  <h3 className="font-bold text-gray-900 text-xl mb-3 tracking-tight">{c.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm font-medium flex-1">{c.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION PRICING ───────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 bg-[#f8f9fa] relative z-20">
        <style>{`
          @keyframes border-sweep {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to   { transform: translate(-50%, -50%) rotate(360deg); }
          }
          .card-pro-wrapper:hover .card-sweep-ray {
            animation: border-sweep 1.2s cubic-bezier(0.4, 0, 0.2, 1) 1 forwards;
          }
        `}</style>
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Testez à fond.
              <br />
              <span className="text-gray-400">Abonnez-vous si ça marche.</span>
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto items-center">
            {LANDING_PLANS.map((plan, i) => (
              <FadeIn key={plan.id} delay={i * 0.1}>
                {plan.highlight ? (
                  <div className="relative pt-5">
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                      <span className="bg-[#0099ff] text-white text-[11px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
                        {plan.badge}
                      </span>
                    </div>
                    <div className="card-pro-wrapper relative rounded-2xl overflow-hidden p-[2px] group transition-shadow duration-300 hover:shadow-[0_0_60px_rgba(0,153,255,0.4)]" style={{ background: '#0099ff' }}>
                      <div className="card-sweep-ray pointer-events-none absolute left-1/2 top-1/2 w-[300%] h-[300%]" style={{ background: 'conic-gradient(from 0deg, transparent 0%, transparent 38%, rgba(255,255,255,0.92) 46%, white 50%, rgba(255,255,255,0.92) 54%, transparent 62%, transparent 100%)', transform: 'translate(-50%, -50%) rotate(0deg)' }} />
                      <div className="relative z-10 rounded-[14px] bg-white p-7">
                        <div className="flex items-center gap-2 mb-5">
                          <span className="text-[#0099ff]">{plan.icon}</span>
                          <span className="text-base font-bold text-gray-900">{plan.label}</span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-5xl font-black tracking-tighter text-gray-900">{plan.price}</span>
                          <span className="text-gray-500 font-medium text-sm">{plan.priceSuffix}</span>
                        </div>
                        <hr className="my-5 border-gray-100" />
                        <button onClick={() => handleSelectPlan(plan.priceId, plan.planType)} className="w-full font-bold py-3 rounded-xl text-sm uppercase tracking-wider bg-[#0099ff] hover:bg-[#007acc] text-white shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                          Choisir ce plan
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 p-7">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="text-gray-500">{plan.icon}</span>
                      <span className="text-base font-bold text-gray-900">{plan.label}</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-5xl font-black tracking-tighter text-gray-900">{plan.price}</span>
                      <span className="text-gray-500 font-medium text-sm">{plan.priceSuffix}</span>
                    </div>
                    <hr className="my-5 border-gray-100" />
                    <button onClick={() => handleSelectPlan(plan.priceId, plan.planType)} className="w-full font-bold py-3 rounded-xl text-sm uppercase tracking-wider bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 transition-all flex items-center justify-center gap-2">
                      Choisir ce plan
                    </button>
                  </div>
                )}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT SECTION ────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white shrink-0" id="contact">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                Une question ? Nous sommes là.
              </h2>
            </div>
            <ContactForm />
          </FadeIn>
        </div>
      </section>

      <footer className="py-28 px-6 bg-gradient-to-br from-[#0055ff] to-[#00c4ff] relative overflow-hidden z-20">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn>
             <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-5 leading-tight">
              Commence maintenant.
            </h2>
            <button className="bg-white text-[#0055ff] px-9 py-4 rounded-full font-black tracking-wider uppercase text-sm shadow-2xl hover:-translate-y-1 transition-all text-center">
              Inscription
            </button>
          </FadeIn>
        </div>
      </footer>

    </div>
  );
}
