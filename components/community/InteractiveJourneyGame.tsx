'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  RotateCcw, 
  Sparkles,
  Check,
  ChevronRight,
  HeartHandshake
} from 'lucide-react';

interface ChoiceOption {
  id: string;
  text: string;
  reflection: string;
  prompt: string;
}

interface Moment {
  id: number;
  momentLabel: string;
  question: string;
  options: ChoiceOption[];
}

const MOMENTS: Moment[] = [
  {
    id: 1,
    momentLabel: 'YOUR MOMENT · 01 OF 05',
    question: 'You’ve had a difficult week. Everyone needs something from you, but you feel exhausted. What do you choose?',
    options: [
      {
        id: 'rest',
        text: 'Give myself permission to rest.',
        reflection: 'Rest is not a reward you have to earn; it is the foundation that keeps your spirit alive. Stepping back allows you to return to your loved ones whole.',
        prompt: 'What is one small thing you can do for yourself today to recharge?',
      },
      {
        id: 'support',
        text: 'Ask someone I trust for support.',
        reflection: 'Reaching out is an act of courage, not weakness. Allowing someone to hold space for you invites real depth and trust into your relationships.',
        prompt: 'Who is one person in your circle you feel safe being vulnerable with?',
      },
      {
        id: 'boundary',
        text: 'Set a boundary and protect my time.',
        reflection: 'A boundary is a quiet declaration that your peace matters. Saying "no" to an external demand is often saying "yes" to your own well-being.',
        prompt: 'Where in your life can you gently say "no" this week without feeling guilty?',
      },
      {
        id: 'unsure',
        text: 'I’m not sure yet, and that’s okay.',
        reflection: 'You do not always have to know the answer right away. Sitting in the quiet space of not knowing gives your mind room to breathe and settle.',
        prompt: 'Can you offer yourself patience as you navigate how you truly feel?',
      },
    ],
  },
  {
    id: 2,
    momentLabel: 'YOUR MOMENT · 02 OF 05',
    question: 'An opportunity arrives to share your idea or take the lead, but self-doubt begins to whisper. What do you choose?',
    options: [
      {
        id: 'speak',
        text: 'Speak up, even if my hands tremble.',
        reflection: 'Bravery is not the absence of fear—it is honoring your voice while your heart beats fast. When you speak, you give other women permission to rise.',
        prompt: 'What is one truth or idea you have been holding back that deserves to be heard?',
      },
      {
        id: 'listen',
        text: 'Observe first and prepare my thoughts.',
        reflection: 'Patience and discernment are superpowers. Taking time to gather your energy ensures your contribution is grounded and meaningful.',
        prompt: 'How can you validate your insight before sharing it with others?',
      },
      {
        id: 'partner',
        text: 'Invite a collaborator to share the moment.',
        reflection: 'Community thrives when we walk together. Sharing the journey turns fear into mutual strength and multiplies the impact of your vision.',
        prompt: 'Who brings complementary energy and kindness to your ideas?',
      },
      {
        id: 'reflect',
        text: 'Pause and ask if this truly aligns with me.',
        reflection: 'Not every opportunity is your assignment. Choosing where to invest your precious energy is the highest form of self-awareness.',
        prompt: 'Does this opportunity light up your soul or just satisfy an expectation?',
      },
    ],
  },
  {
    id: 3,
    momentLabel: 'YOUR MOMENT · 03 OF 05',
    question: 'You notice yourself comparing your timeline to someone else’s milestones. What do you choose?',
    options: [
      {
        id: 'anchor',
        text: 'Remember my path is uniquely my own.',
        reflection: 'Every flower blooms in its own season. The depth of your roots matters far more than the speed at which you surface.',
        prompt: 'What is one victory in your journey that you have forgotten to celebrate?',
      },
      {
        id: 'unplug',
        text: 'Step away from the noise and social feeds.',
        reflection: 'Silence restores clarity. When you quiet external feeds, you can finally hear the gentle rhythm of your own intuition.',
        prompt: 'What simple offline activity brings you back into your body?',
      },
      {
        id: 'celebrate',
        text: 'Celebrate her while holding faith in mine.',
        reflection: 'Another woman’s success does not mean you are lacking. There is room for all of us to shine brightly under the same sun.',
        prompt: 'How can genuine celebration of a sister liberate your own peace?',
      },
      {
        id: 'feel',
        text: 'Acknowledge the ache without judging myself.',
        reflection: 'Envy and longing are simply arrows pointing toward what you value. Treat the feeling with tenderness rather than self-reproach.',
        prompt: 'What longing is trying to gently reveal itself to you right now?',
      },
    ],
  },
  {
    id: 4,
    momentLabel: 'YOUR MOMENT · 04 OF 05',
    question: 'A close friendship or family dynamic is shifting and feels tense. What do you choose?',
    options: [
      {
        id: 'honest',
        text: 'Initiate a gentle, honest conversation.',
        reflection: 'True connection can endure honest conversations spoken with love. Cleansing the air creates space for deeper, healthier closeness.',
        prompt: 'What kind words can you open with to set a safe, caring tone?',
      },
      {
        id: 'grace',
        text: 'Give space and assume positive intent.',
        reflection: 'Space is sometimes the most loving gift you can offer. It allows unresolved emotions to cool down into genuine clarity.',
        prompt: 'How can you hold love for someone from a peaceful distance?',
      },
      {
        id: 'letgo',
        text: 'Release the need to control the outcome.',
        reflection: 'Relationships evolve through seasons. Holding loosely allows people to grow without breaking the sacred bond you share.',
        prompt: 'What expectations can you loosen your grip on today?',
      },
      {
        id: 'seek',
        text: 'Reflect on what this relationship reflects back to me.',
        reflection: 'Every tension is a mirror reflecting where we seek safety, validation, or growth. Learning from it is wisdom.',
        prompt: 'What lesson about your own heart is this moment offering?',
      },
    ],
  },
  {
    id: 5,
    momentLabel: 'YOUR MOMENT · 05 OF 05',
    question: 'As you look ahead to tomorrow, what intention do you want to carry forward with you?',
    options: [
      {
        id: 'grace-self',
        text: 'To be gentler and kinder with myself.',
        reflection: 'Self-compassion is the foundation of genuine resilience. You are doing the best you can with what you have, and that is enough.',
        prompt: 'How will you speak to yourself when things don’t go perfectly tomorrow?',
      },
      {
        id: 'presence',
        text: 'To be fully present in each moment.',
        reflection: 'The present moment is where life happens. When you let go of future anxieties, you uncover unexpected peace in the ordinary.',
        prompt: 'What is one moment tomorrow where you will take a deep breath and simply be?',
      },
      {
        id: 'sisterhood',
        text: 'To deepen my connection with community.',
        reflection: 'We are never meant to journey alone. Walking shoulder to shoulder with other women turns private struggles into shared light.',
        prompt: 'How will you invite another sister into your circle this week?',
      },
      {
        id: 'courage',
        text: 'To trust my own inner wisdom.',
        reflection: 'You carry generations of strength, intuition, and grace within you. Trust the quiet voice that knows who you are.',
        prompt: 'What is your intuition asking you to step forward into?',
      },
    ],
  },
];

export function InteractiveJourneyGame() {
  const [currentMomentIndex, setCurrentMomentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const currentMoment = MOMENTS[currentMomentIndex];
  const selectedOption = currentMoment.options.find((opt) => opt.id === selectedOptionId);

  const handleSelect = (optionId: string) => {
    setSelectedOptionId(optionId);
  };

  const handleReveal = () => {
    if (!selectedOptionId) return;
    setIsRevealed(true);
  };

  const handleNext = () => {
    if (currentMomentIndex < MOMENTS.length - 1) {
      setCurrentMomentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsRevealed(false);
    } else {
      // Completed all 5 moments: loop back or restart
      setCurrentMomentIndex(0);
      setSelectedOptionId(null);
      setIsRevealed(false);
    }
  };

  const handleRestart = () => {
    setCurrentMomentIndex(0);
    setSelectedOptionId(null);
    setIsRevealed(false);
  };

  return (
    <section className="relative w-full bg-[#FAF7F2] text-[#1E1C1A] py-16 sm:py-24 lg:py-28 overflow-hidden border-b border-[#EBE6DC]/80">
      {/* Background Decorative Motifs: Natural organic curves & delicate botanicals */}
      <div className="absolute top-12 left-6 lg:left-16 w-48 sm:w-64 h-48 sm:h-64 opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#2D5A43]">
          <path d="M40,160 Q100,20 160,160 T40,160" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      </div>
      <div className="absolute -bottom-10 right-8 lg:right-20 w-64 h-64 opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#B85233]">
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1.5" />
          <path d="M20,100 Q100,40 180,100" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =========================================================================
            A. SECTION INTRODUCTION
        ========================================================================= */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-10 sm:mb-14">
          <p className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.26em] text-[#D49B4B]">
            THE COMMUNITY EXPERIENCE
          </p>

          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[2.85rem] font-normal text-[#1E1C1A] leading-[1.15] tracking-tight">
            A moment for you.
          </h2>

          <p className="font-sans text-xs sm:text-sm lg:text-[14.5px] text-[#6B655B] leading-[1.75] font-normal">
            Life asks us to make choices every day. Take a moment to explore yours, discover a new perspective, and reconnect with what matters to you.
          </p>

          {/* Minimalist Botanical Accent Line */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="w-8 h-px bg-[#D5C9B3]" />
            <Sparkles className="w-3.5 h-3.5 text-[#D49B4B]" />
            <span className="w-8 h-px bg-[#D5C9B3]" />
          </div>
        </div>

        {/* =========================================================================
            B & C. CENTRAL INTERACTIVE GAME CARD
        ========================================================================= */}
        <div className="max-w-2xl mx-auto">
          <div className="relative bg-white rounded-[24px] sm:rounded-[28px] border border-[#2D5A43]/20 shadow-[0_12px_40px_-15px_rgba(45,90,67,0.08)] overflow-hidden transition-all duration-300">
            
            {/* Top Subtle Sage Accent Band */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#2D5A43] via-[#D49B4B] to-[#B85233]" />

            {!isRevealed ? (
              /* ===================================================================
                 STATE 1: QUESTION & CHOICE OPTIONS
              =================================================================== */
              <div className="p-6 sm:p-9 space-y-6 sm:space-y-7 animate-in fade-in duration-200">
                
                {/* Moment Progress Label */}
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2D5A43]">
                    {currentMoment.momentLabel}
                  </span>
                  <span className="text-[11px] text-[#8C8477] font-medium">
                    Self-Reflection Journey
                  </span>
                </div>

                {/* Main Scenario Question */}
                <div className="space-y-2">
                  <h3 className="font-playfair text-xl sm:text-2xl lg:text-[1.65rem] font-normal text-[#1E1C1A] leading-[1.3] tracking-tight">
                    {currentMoment.question}
                  </h3>
                  <p className="font-sans text-xs text-[#8C8477]">
                    Select the response that resonates most with where your heart is right now:
                  </p>
                </div>

                {/* 4 Interactive Choice Cards */}
                <div className="space-y-3">
                  {currentMoment.options.map((option, idx) => {
                    const isSelected = selectedOptionId === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelect(option.id)}
                        className={`w-full text-start p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-4 group ${
                          isSelected
                            ? 'border-[#B85233] bg-[#B85233]/5 ring-2 ring-[#B85233]/20 shadow-xs'
                            : 'border-[#EBE6DC] bg-[#FAF8F5]/60 hover:bg-white hover:border-[#2D5A43]/50 text-[#1E1C1A]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          {/* Number Indicator */}
                          <span
                            className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-[#B85233] text-white'
                                : 'bg-white border border-[#E0D8CB] text-[#7A7367] group-hover:border-[#2D5A43] group-hover:text-[#2D5A43]'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span
                            className={`font-sans text-xs sm:text-[13.5px] leading-snug transition-colors ${
                              isSelected ? 'font-semibold text-[#1E1C1A]' : 'font-normal text-[#4A453E]'
                            }`}
                          >
                            {option.text}
                          </span>
                        </div>

                        {/* Selection Check Circle */}
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                            isSelected
                              ? 'border-[#B85233] bg-[#B85233] text-white'
                              : 'border-[#D5C9B3] bg-white group-hover:border-[#2D5A43]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Primary Action Button (Enabled only when choice selected) */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleReveal}
                    disabled={!selectedOptionId}
                    className={`w-full py-4 rounded-full font-sans text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2.5 ${
                      selectedOptionId
                        ? 'bg-[#B85233] hover:bg-[#A34327] text-white shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer'
                        : 'bg-[#EAE4D8] text-[#9E978B] cursor-not-allowed opacity-75'
                    }`}
                  >
                    <span>Reveal my reflection</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="font-sans text-[11px] text-center text-[#8C8477] mt-3">
                    Every answer is welcomed without judgment. Take your time.
                  </p>
                </div>

              </div>
            ) : (
              /* ===================================================================
                 STATE 2: REVEALED REFLECTION STATE
              =================================================================== */
              <div className="p-6 sm:p-9 space-y-6 sm:space-y-7 animate-in fade-in zoom-in-95 duration-200">
                
                {/* Reflection Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
                  <div className="flex items-center gap-2 text-[#2D5A43]">
                    <HeartHandshake className="w-4 h-4 text-[#D49B4B]" />
                    <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em]">
                      A gentle reminder
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8C8477]">
                    Moment {currentMomentIndex + 1} of {MOMENTS.length}
                  </span>
                </div>

                {/* Core Affirming Reflection Narrative */}
                <div className="space-y-3">
                  <h3 className="font-playfair text-2xl sm:text-3xl font-normal text-[#1E1C1A] leading-[1.25]">
                    There is no single right answer.
                  </h3>
                  <p className="font-sans text-xs sm:text-sm lg:text-[14.5px] text-[#4A453E] leading-[1.8]">
                    {selectedOption?.reflection || 'Your needs matter, too. You can care for others without abandoning yourself.'}
                  </p>
                </div>

                {/* Reflection Prompt Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5DFC0] space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D49B4B] block">
                    PAUSE &amp; CONSIDER
                  </span>
                  <p className="font-playfair text-sm sm:text-base text-[#1E1C1A] italic leading-relaxed">
                    &ldquo;{selectedOption?.prompt || 'What is one small thing you can do for yourself today?'}&rdquo;
                  </p>
                </div>

                {/* Two Contextual Actions */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-[#B85233] hover:bg-[#A34327] text-white py-3.5 sm:py-4 rounded-full font-sans text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    <span>
                      {currentMomentIndex < MOMENTS.length - 1
                        ? 'Continue to the next choice'
                        : 'Complete this journey'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleRestart}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7A7367] hover:text-[#2D5A43] transition-colors py-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Start again</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* =========================================================================
            D. COMMUNITY INVITATION
        ========================================================================= */}
        <div className="mt-12 sm:mt-16 text-center max-w-xl mx-auto space-y-3 sm:space-y-4 pt-6 border-t border-[#E8E2D5]/70">
          <h3 className="font-playfair text-2xl sm:text-3xl text-[#1E1C1A] font-normal">
            Your story belongs here.
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#6B655B] leading-relaxed">
            Different journeys. Different perspectives. One community where every woman deserves to feel seen, respected, and valued.
          </p>
          <div className="pt-1">
            <Link
              href="#join-form"
              className="group inline-flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-[#2D5A43] hover:text-[#193A2A] tracking-wider uppercase transition-colors"
            >
              <span>Explore our community</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
