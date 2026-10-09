'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Heart, 
  ShieldCheck, 
  SunMedium, 
  Users, 
  CheckCircle2, 
  Share2, 
  Compass, 
  Quote
} from 'lucide-react';

interface Choice {
  title: string;
  badge: string;
  text: string;
  reflection: string;
  somaliProverb?: string;
  scores: {
    nuur: number;
    geesinimo: number;
    walaalnimo: number;
  };
}

interface Chapter {
  id: number;
  timeTag: string;
  topic: string;
  title: string;
  somaliTitle: string;
  scenario: string;
  contextNote: string;
  choices: [Choice, Choice];
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    timeTag: '6:30 AM — The Awakening',
    topic: 'Boundaries & Sacred Stillness',
    title: 'The Weight of the Morning',
    somaliTitle: 'Culaabta Waaberiga',
    scenario:
      'The morning sun filters softly through your window, but your chest feels heavy before your feet even touch the floor. Your phone is already humming with family obligations, messages, and endless demands. Everyone needs a piece of your spirit today.',
    contextNote: 'Before the world demands your labor, who gets your first breath?',
    choices: [
      {
        title: 'The Solitary Burden',
        badge: 'Conditioned Reflex',
        text: 'Swallow the exhaustion, grab your phone, and immediately jump into fixing everyone else’s needs. You tell yourself you’ll rest "once everything is handled".',
        reflection:
          'For generations, we were taught that a woman’s devotion is measured by how much pain she silently absorbs. But an empty cup pours nothing. Burning yourself out does not save the ones you love—it only leaves you depleted.',
        somaliProverb: 'Far keliya fool ma dhaqdo — One finger alone cannot wash the entire face.',
        scores: { nuur: 10, geesinimo: 10, walaalnimo: 10 },
      },
      {
        title: 'The Sacred Pause',
        badge: 'Intentional Living',
        text: 'Leave your phone face down. Brew a warm cup, open your journal, breathe deeply, and give yourself 15 minutes of uninterrupted quiet to listen to your own soul.',
        reflection:
          'Claiming your morning is an act of quiet revolution. You are establishing that before you are a daughter, sister, mother, or worker, you are a living soul who deserves to be nourished first.',
        somaliProverb: 'Nabadda naftaada ayaa horseedda nabadda guriga — The peace of your own soul leads the peace of your home.',
        scores: { nuur: 35, geesinimo: 25, walaalnimo: 20 },
      },
    ],
  },
  {
    id: 2,
    timeTag: '2:15 PM — The Crossroads',
    topic: 'Voice & The Imposter Trap',
    title: 'The Silent Ambition',
    somaliTitle: 'Hamiga Qarsoon',
    scenario:
      'You are sitting in a room or scrolling through creative ventures. An opportunity arises to pitch your dream, launch a business, or speak up. Your heart races. An ancient critic inside whispers: "Who are you to do this? What if people laugh or whisper?"',
    contextNote: 'Silence can feel safe, but it quietly suffocates your purpose.',
    choices: [
      {
        title: 'The Safe Shadow',
        badge: 'The Retreat',
        text: 'Smile politely, keep your thoughts tucked inside, and close your notebook. You tell yourself: "I’ll wait until I am more qualified and more certain."',
        reflection:
          'Playing small protects you from criticism, but it deprives the world of your gifts. Perfection is a mirage invented to keep ambitious women frozen in waiting rooms.',
        somaliProverb: 'Nin dharbaaxo quudheed dugsaday, dhiif ma yeesho — She who accepts small shadows will never know her true light.',
        scores: { nuur: 15, geesinimo: 10, walaalnimo: 15 },
      },
      {
        title: 'The Trembling Truth',
        badge: 'Bold Awakening',
        text: 'Acknowledge the tremor in your hands, plant your feet firmly on the ground, and share your vision with unshakable grace and honesty.',
        reflection:
          'Geesinimo (Courage) is not fearlessness—it is speaking your truth while your heart pounds in your throat. When one woman steps into her power, ten other women in the room secretly gain permission to rise.',
        somaliProverb: 'Geed walba mirihiisa ayaa lagu gartaa — Every tree is known by the fruit it dares to grow.',
        scores: { nuur: 25, geesinimo: 40, walaalnimo: 25 },
      },
    ],
  },
  {
    id: 3,
    timeTag: '7:45 PM — The Twilight',
    topic: 'Vulnerability vs. Hyper-Independence',
    title: 'The Heavy Evening',
    somaliTitle: 'Galabta Culus',
    scenario:
      'The day took a steep emotional toll on you. A stinging disappointment, exhaustion, or grief is sitting heavy on your shoulders. You enter your room, stare at the ceiling, and feel an ache of deep isolation.',
    contextNote: 'Strong women were never meant to carry earthquakes alone.',
    choices: [
      {
        title: 'The Stone Fortress',
        badge: 'Hyper-Independence',
        text: 'Lock the door, pull up your armor, and repeat: "I don’t need anyone. Strong women handle things on their own without burdening friends."',
        reflection:
          'Hyper-independence is often a survival mechanism wearing the crown of strength. Carrying the storm alone does not prove your greatness; it only guarantees emotional isolation.',
        somaliProverb: 'Gacmo wadajir bay wax ku gooyaan — Hands united can overcome the hardest task.',
        scores: { nuur: 10, geesinimo: 15, walaalnimo: 5 },
      },
      {
        title: 'The Honest Reaching Hand',
        badge: 'Sacred Vulnerability',
        text: 'Drop the armor. Send a raw, honest voice note to a trusted sister: "Today felt heavy, and I need a listening ear. Can we talk for 10 minutes?"',
        reflection:
          'Walaalnimo (Sisterhood) begins the exact moment you let someone see your unfinished edges. Real sisters don’t ask you to be unbreakable—they bring warmth, tea, and silence to sit beside you.',
        somaliProverb: 'Walaal la’aan waa guri albaab la’aan ah — Without a sister, a house has no protective door.',
        scores: { nuur: 25, geesinimo: 25, walaalnimo: 40 },
      },
    ],
  },
  {
    id: 4,
    timeTag: 'The Threshold — Sunday Gathering',
    topic: 'Sisterhood & Belonging',
    title: 'The Circle of Naag Nool',
    somaliTitle: 'Goobada Naag Nool',
    scenario:
      'An invitation arrives at your door. A circle of Somali and African women are gathering under Naag Nool UP to write, reflect, build ventures, and hold space for each other. You stand at the threshold of the room, looking at the warm light inside.',
    contextNote: 'The door is unlocked. The circle is waiting for you.',
    choices: [
      {
        title: 'The Hesitant Spectator',
        badge: 'Fear of Not Belonging',
        text: 'Hesitate on the steps. A voice whispers: "They probably have everything together. Maybe I’ll join once I’m further along in my own life."',
        reflection:
          'You never need to have your life "figured out" before claiming a seat at the table. Sisterhood is not a prize for having arrived; it is the fertile soil that allows you to bloom.',
        somaliProverb: 'Socodka kalinimada waxaad ku gaartaa dhow, wadajirka waxaad ku gaartaa fog — Alone you walk fast; together we go far.',
        scores: { nuur: 15, geesinimo: 15, walaalnimo: 20 },
      },
      {
        title: 'Claiming Your Seat',
        badge: 'Entering the Circle',
        text: 'Push the door open. Walk in, look your sisters in the eye, smile, and pull up a chair. You say: "I am here. And I am ready to grow with you."',
        reflection:
          'This is what it means to be Naag Nool—a woman fully alive, unafraid of connection, and supported by a circle of women who will never let her fall. Welcome home, sister.',
        somaliProverb: 'Dumar waa dhismaha adduunka — Women are the foundation and builders of the world.',
        scores: { nuur: 35, geesinimo: 35, walaalnimo: 45 },
      },
    ],
  },
];

interface Archetype {
  name: string;
  somaliName: string;
  tagline: string;
  description: string;
  superpower: string;
  growthEdge: string;
  affirmation: string;
  accentColor: string;
}

export function InteractiveJourneyGame() {
  const [stage, setStage] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [scores, setScores] = useState({ nuur: 0, geesinimo: 0, walaalnimo: 0 });
  const [copiedAffirmation, setCopiedAffirmation] = useState(false);

  const currentChapter = CHAPTERS[currentChapterIndex];

  // Handle starting the game
  const handleStartGame = () => {
    setStage('playing');
    setCurrentChapterIndex(0);
    setSelectedChoiceIndex(null);
    setShowReflection(false);
    setAnswers([]);
    setScores({ nuur: 0, geesinimo: 0, walaalnimo: 0 });
  };

  // Handle choice selection
  const handleSelectChoice = (index: number) => {
    if (selectedChoiceIndex !== null) return;
    setSelectedChoiceIndex(index);
    setShowReflection(true);

    const chosen = currentChapter.choices[index];
    setScores((prev) => ({
      nuur: prev.nuur + chosen.scores.nuur,
      geesinimo: prev.geesinimo + chosen.scores.geesinimo,
      walaalnimo: prev.walaalnimo + chosen.scores.walaalnimo,
    }));
    setAnswers((prev) => [...prev, index]);
  };

  // Advance to next chapter or result
  const handleNextStep = () => {
    if (currentChapterIndex < CHAPTERS.length - 1) {
      setCurrentChapterIndex((prev) => prev + 1);
      setSelectedChoiceIndex(null);
      setShowReflection(false);
    } else {
      setStage('result');
    }
  };

  // Determine Archetype
  const getArchetype = (): Archetype => {
    const { nuur, geesinimo, walaalnimo } = scores;

    if (geesinimo >= nuur && geesinimo >= walaalnimo) {
      return {
        name: 'The Resilient Trailblazer',
        somaliName: 'Horseedka Geesinimada',
        tagline: 'Fierce in ambition, learning that shared strength surpasses solitary battles.',
        description:
          'You carry a fiery, unstoppable spirit. You have walked through challenges by building your own shelter. Your next level of power will not come from carrying more weight alone—it will come from leaning into sisters who are ready to run alongside you.',
        superpower: 'Uncompromising courage and catalytic momentum.',
        growthEdge: 'Putting down the armor and allowing yourself to be held and supported.',
        affirmation:
          'My strength does not require isolation. When I link arms with my sisters, my power multiplies ten-fold.',
        accentColor: '#B85233',
      };
    } else if (walaalnimo >= nuur && walaalnimo >= geesinimo) {
      return {
        name: 'The Pillar of Sisterhood',
        somaliName: 'Tiirka Walaalnimada',
        tagline: 'A sanctuary of warmth, holding space and lifting every woman who enters your orbit.',
        description:
          'You understand the sacred bond of community. Your intuition tells you when someone is hurting, and your presence brings calm to anxious spaces. In the Naag Nool circle, you are the hearth where stories are shared and wounds are healed.',
        superpower: 'Empathetic leadership and unifying grace.',
        growthEdge: 'Remembering to receive just as generously as you give to others.',
        affirmation:
          'I am worthy of the deep love, listening, and care that I so effortlessly offer the world.',
        accentColor: '#4D5844',
      };
    } else {
      return {
        name: 'The Radiant Seeker',
        somaliName: 'Quruxda Nuurka',
        tagline: 'Anchored in quiet clarity, turning reflection into generational wisdom.',
        description:
          'You crave depth, honest conversations, and intentional living. You know that surface-level chatter drains your soul. When you align your boundaries with your journal and your spirit, you become an unshakeable lighthouse for women finding their way.',
        superpower: 'Deep inner discernment and grounded clarity.',
        growthEdge: 'Trusting your voice enough to speak in rooms that need your wisdom.',
        affirmation:
          'My quiet reflection is my superpower. I bring clarity and light everywhere I step.',
        accentColor: '#D49B4B',
      };
    }
  };

  const archetype = getArchetype();

  const handleCopyAffirmation = () => {
    navigator.clipboard.writeText(
      `"${archetype.affirmation}" — My Naag Nool Archetype is ${archetype.name}. Join the circle at naagnoolup.com/community`
    );
    setCopiedAffirmation(true);
    setTimeout(() => setCopiedAffirmation(false), 2800);
  };

  return (
    <section className="relative w-full py-16 sm:py-24 bg-gradient-to-b from-[#F5EFE6] via-[#FAF8F5] to-[#F5EFE6] text-[#1E1C1A] overflow-hidden border-y border-[#E5DFC0]/70">
      {/* Decorative ambient background accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#B85233]/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#4D5844]/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 sm:px-10">
        {/* =========================================================================
            STAGE 1: INTRO PROLOGUE
        ========================================================================= */}
        {stage === 'intro' && (
          <div className="text-center space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B85233]/10 border border-[#B85233]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#B85233]" />
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-[#B85233]">
                Interactive Experience
              </span>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h2 className="font-playfair text-3xl sm:text-5xl lg:text-6xl font-normal text-[#1E1C1A] leading-[1.12] tracking-tight">
                The Path of <span className="font-cormorant italic text-[#B85233]">Naag Nool</span>
              </h2>
              <p className="font-cormorant italic text-xl sm:text-2xl text-[#6B655B]">
                Socdaalka Naag Nool: From Solitude to Sisterhood
              </p>
            </div>

            {/* Narrative description */}
            <p className="font-sans text-xs sm:text-sm lg:text-base text-[#5A5248] max-w-2xl mx-auto leading-relaxed">
              Every woman stands at a daily crossroads: carry the world’s weight in silence, or step into the sacred circle of women who rise together. Walk through 4 defining moments of your day and discover where you stand today.
            </p>

            {/* Features pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-xl mx-auto text-start">
              <div className="p-3 rounded-xl bg-white/80 border border-[#E5DFC0] flex items-center gap-3 shadow-xs">
                <SunMedium className="w-5 h-5 text-[#D49B4B] shrink-0" />
                <div>
                  <p className="font-sans text-xs font-semibold text-[#1E1C1A]">Nuur</p>
                  <p className="font-sans text-[11px] text-[#7A7268]">Inner Clarity & Boundaries</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/80 border border-[#E5DFC0] flex items-center gap-3 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-[#B85233] shrink-0" />
                <div>
                  <p className="font-sans text-xs font-semibold text-[#1E1C1A]">Geesinimo</p>
                  <p className="font-sans text-[11px] text-[#7A7268]">Courage to Speak Your Truth</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/80 border border-[#E5DFC0] flex items-center gap-3 shadow-xs">
                <Users className="w-5 h-5 text-[#4D5844] shrink-0" />
                <div>
                  <p className="font-sans text-xs font-semibold text-[#1E1C1A]">Walaalnimo</p>
                  <p className="font-sans text-[11px] text-[#7A7268]">Sisterhood & Vulnerability</p>
                </div>
              </div>
            </div>

            {/* Begin Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleStartGame}
                className="inline-flex items-center gap-2.5 bg-[#B85233] hover:bg-[#A34327] text-white px-8 py-3.5 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
              >
                <span>Begin Your Journey</span>
                <Compass className="w-4 h-4" />
              </button>
              <p className="font-sans text-[11px] text-[#8C8275] mt-2.5">
                Takes ~2 minutes • Fully private & reflective
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 2: ACTIVE CHAPTER CHOICES
        ========================================================================= */}
        {stage === 'playing' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            {/* Top Navigation & Meter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DFC0]">
              <div>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B85233]">
                  Chapter {currentChapter.id} of {CHAPTERS.length}
                </p>
                <h3 className="font-playfair text-xl sm:text-2xl font-normal text-[#1E1C1A]">
                  {currentChapter.title}
                </h3>
              </div>

              {/* Progress Steps Indicators */}
              <div className="flex items-center gap-2">
                {CHAPTERS.map((ch, idx) => (
                  <div
                    key={ch.id}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentChapterIndex
                        ? 'w-8 bg-[#B85233]'
                        : idx < currentChapterIndex
                        ? 'w-3 bg-[#4D5844]'
                        : 'w-3 bg-[#DDD5C5]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Scenario Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5DFC0] shadow-sm relative space-y-4">
              <div className="flex items-center gap-2 text-[#7A7268] text-xs font-sans">
                <span className="w-2 h-2 rounded-full bg-[#B85233]" />
                <span className="font-medium">{currentChapter.timeTag}</span>
                <span>•</span>
                <span className="italic">{currentChapter.somaliTitle}</span>
              </div>

              <p className="font-serif text-base sm:text-lg text-[#2A2622] leading-relaxed">
                &ldquo;{currentChapter.scenario}&rdquo;
              </p>

              <div className="p-3 bg-[#FAF8F5] rounded-xl border-l-3 border-[#B85233] text-xs font-sans text-[#6B6155] italic">
                {currentChapter.contextNote}
              </div>
            </div>

            {/* Two Choices Grid */}
            <div className="space-y-3 sm:space-y-4">
              <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#7A7268]">
                What do you choose in this moment?
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChapter.choices.map((choice, idx) => {
                  const isSelected = selectedChoiceIndex === idx;
                  const isOtherSelected = selectedChoiceIndex !== null && !isSelected;

                  return (
                    <button
                      key={choice.title}
                      type="button"
                      disabled={selectedChoiceIndex !== null}
                      onClick={() => handleSelectChoice(idx)}
                      className={`text-start p-5 sm:p-6 rounded-2xl transition-all duration-200 border relative cursor-pointer ${
                        isSelected
                          ? 'bg-[#FBF6EE] border-[#B85233] ring-2 ring-[#B85233]/20 shadow-md'
                          : isOtherSelected
                          ? 'bg-white/50 border-[#E5DFC0] opacity-50 cursor-not-allowed'
                          : 'bg-white border-[#E5DFC0] hover:border-[#B85233]/50 hover:shadow-sm active:scale-[0.99]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            idx === 0
                              ? 'bg-[#EAE4D8] text-[#5A5248]'
                              : 'bg-[#B85233]/10 text-[#B85233]'
                          }`}
                        >
                          {choice.badge}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#B85233] shrink-0" />
                        )}
                      </div>

                      <h4 className="font-playfair text-base sm:text-lg text-[#1E1C1A] font-medium mb-1.5">
                        {choice.title}
                      </h4>

                      <p className="font-sans text-xs sm:text-[13px] text-[#5A5248] leading-relaxed">
                        {choice.text}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reflection Reveal Card */}
            {showReflection && selectedChoiceIndex !== null && (
              <div className="bg-[#FAF6F0] rounded-2xl p-6 sm:p-7 border border-[#B85233]/30 shadow-sm space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2 text-[#B85233]">
                  <Quote className="w-4 h-4" />
                  <span className="font-sans text-xs font-semibold uppercase tracking-widest">
                    Soul Reflection
                  </span>
                </div>

                <p className="font-sans text-xs sm:text-sm text-[#443D36] leading-relaxed">
                  {currentChapter.choices[selectedChoiceIndex].reflection}
                </p>

                {currentChapter.choices[selectedChoiceIndex].somaliProverb && (
                  <div className="pt-2 border-t border-[#E5DFC0]/70">
                    <p className="font-cormorant italic text-sm sm:text-base text-[#B85233]">
                      &ldquo;{currentChapter.choices[selectedChoiceIndex].somaliProverb}&rdquo;
                    </p>
                  </div>
                )}

                {/* Continue Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 bg-[#B85233] hover:bg-[#A34327] text-white px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                  >
                    <span>
                      {currentChapterIndex < CHAPTERS.length - 1
                        ? 'Next Crossroads'
                        : 'Unveil Your Archetype'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            STAGE 3: REVEAL ARCHETYPE & INVITATION TO SISTERHOOD
        ========================================================================= */}
        {stage === 'result' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4D5844]/10 border border-[#4D5844]/20 text-[#4D5844]">
                <Heart className="w-3.5 h-3.5 text-[#4D5844]" />
                <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em]">
                  Your Soul Archetype Revealed
                </span>
              </div>

              <h2 className="font-playfair text-3xl sm:text-5xl font-normal text-[#1E1C1A]">
                {archetype.name}
              </h2>
              <p className="font-cormorant italic text-xl sm:text-2xl text-[#B85233]">
                {archetype.somaliName}
              </p>
              <p className="font-sans text-[11px] uppercase tracking-widest text-[#7A7268]">
                {answers.length} of 4 Crossroads Navigated
              </p>
            </div>

            {/* Archetype Master Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DFC0] shadow-md space-y-6 sm:space-y-8">
              {/* Essence Tagline */}
              <div className="text-center max-w-xl mx-auto">
                <p className="font-serif italic text-lg sm:text-xl text-[#2B2621] leading-relaxed">
                  &ldquo;{archetype.tagline}&rdquo;
                </p>
              </div>

              <div className="h-[1px] bg-[#E5DFC0]" />

              {/* Description Body */}
              <div className="space-y-4 text-start font-sans text-xs sm:text-sm text-[#4E473F] leading-relaxed">
                <p>{archetype.description}</p>
              </div>

              {/* Grid: Superpower + Growth Edge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFC0]/70 space-y-1">
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#4D5844]">
                    Your Sacred Gift
                  </p>
                  <p className="font-sans text-xs sm:text-sm font-medium text-[#1E1C1A]">
                    {archetype.superpower}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFC0]/70 space-y-1">
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#B85233]">
                    Your Sisterhood Growth
                  </p>
                  <p className="font-sans text-xs sm:text-sm font-medium text-[#1E1C1A]">
                    {archetype.growthEdge}
                  </p>
                </div>
              </div>

              {/* Affirmation Plaque */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#F7F2EA] to-[#F5EFE6] border border-[#DDD5C5] text-center space-y-3">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-[#7A7268]">
                  Your Daily Affirmation
                </p>
                <p className="font-cormorant italic text-lg sm:text-2xl text-[#1E1C1A] font-normal leading-snug">
                  &ldquo;{archetype.affirmation}&rdquo;
                </p>

                <div className="pt-1 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyAffirmation}
                    className="inline-flex items-center gap-1.5 text-xs font-sans text-[#B85233] hover:text-[#9C3C20] transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedAffirmation ? 'Copied to Clipboard!' : 'Share Your Affirmation'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Conversion: The Final Invitation to Join the Sisterhood */}
            <div className="bg-[#4D5844] text-white rounded-3xl p-6 sm:p-10 shadow-lg text-center space-y-6 relative overflow-hidden">
              <div className="relative z-10 max-w-xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-medium tracking-wide">
                  <Sparkles className="w-3 h-3 text-[#D49B4B]" />
                  <span>The Circle is Complete With You</span>
                </div>

                <h3 className="font-playfair text-2xl sm:text-4xl font-normal leading-tight">
                  You Were Never Meant to Walk Alone.
                </h3>

                <p className="font-sans text-xs sm:text-sm text-white/85 leading-relaxed">
                  Now that you’ve seen the path, take the real step. Join hundreds of intentional Somali & African women in the Naag Nool UP circle—where we share journals, hold workshops, and rise together.
                </p>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href="#join-form"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#B85233] hover:bg-[#A64426] text-white px-7 py-3.5 rounded-lg text-sm font-medium transition-all shadow-md active:scale-[0.98]"
                  >
                    <span>Claim Your Seat in the Community</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={handleStartGame}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Walk Another Path</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
