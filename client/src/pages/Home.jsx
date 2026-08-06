import React from 'react';
import { Link } from 'react-router-dom';
import {
  Upload, FileCheck, Code, Zap, Cpu, CheckCircle2, Layers, Sparkles, ShieldCheck
} from 'lucide-react';
import { GradientShimmer } from '@/components/ui/gradient-shimmer';
import { HoverButton } from '@/components/ui/hover-glow-button';
import { RippleButton } from '@/components/ui/multi-type-ripple-buttons';
import { CoverflowCarousel } from '@/components/ui/coverflow-carousel';

export default function Home() {
  const featureSlides = [
    {
      icon: Cpu,
      title: 'Regex & Heuristic Engine',
      subtitle: 'High-Precision Pattern Matcher',
      description: 'Custom pattern matching for personal details, tech stacks, experience, and education.',
      tag: '01 / PARSER',
      image: '/assets/features/regex_engine.png'
    },
    {
      icon: Layers,
      title: 'Automatic Section Detection',
      subtitle: 'Layout-Agile Heading Classifier',
      description: 'Intelligently detects section headings regardless of formatting, column layouts, or font sizes.',
      tag: '02 / HEURISTICS',
      image: '/assets/features/section_detection.png'
    },
    {
      icon: Code,
      title: 'Categorized Tech Skills',
      subtitle: '6-Tiered Skill Classifier',
      description: 'Automatically sorts skills into Languages, Frameworks, Libraries, Databases, Tools, and Technologies.',
      tag: '03 / SKILLS',
      image: '/assets/features/tech_skills.png'
    },
    {
      icon: Zap,
      title: 'Instant JSON Export',
      subtitle: 'Standardized Payload Generator',
      description: 'Generates clean, standardized JSON objects ready for database insertion or REST API payload.',
      tag: '04 / API',
      image: '/assets/features/json_export.png'
    },
    {
      icon: Sparkles,
      title: 'Google Gemini AI Assessment',
      subtitle: 'ATS Scoring & Asset Evaluation',
      description: 'Calculates candidate ATS scores and asset status with live feedback using Gemini 1.5 Flash.',
      tag: '05 / AI ENGINE',
      image: '/assets/features/gemini_ai.png'
    },
    {
      icon: ShieldCheck,
      title: 'Multi-Engine PDF Extractor',
      subtitle: 'Fail-Safe PDF Stream Parser',
      description: 'Combines pdfjs-dist, pdf-parse, and pdf2json to ensure 100% extraction reliability.',
      tag: '06 / RELIABILITY',
      image: '/assets/features/pdf_extractor.png'
    }
  ];

  const supportedFields = [
    'Full Name & Location', 'Email & Phone Number', 'LinkedIn & GitHub Profiles', 'Portfolio / Personal Website',
    'Professional Summary', 'Categorized Skills', 'Work History & Titles', 'College & CGPA / Percentage',
    'Projects & Tech Stacks', 'Certifications & Licenses', 'Achievements & Awards'
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#445D48]/20 to-[#D6CC99]/20 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FDE5D4]/80 dark:bg-[#445D48]/40 border border-[#D6CC99] dark:border-[#445D48] text-[#445D48] dark:text-[#D6CC99] text-xs font-extrabold uppercase tracking-widest mb-6 shadow-sm hover:scale-105 transition-transform duration-200">
          <span>AI-Powered Intelligent Resume Parser</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          <GradientShimmer gradient="sunrise" className="font-extrabold">
            Extract Structured Data from Any Resume PDF in Seconds
          </GradientShimmer>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-[#001524]/80 dark:text-[#FDE5D4]/80 max-w-2xl mx-auto leading-relaxed font-medium">
          Parse complex PDF resumes into formatted, validated JSON objects with support for diverse layouts, skills categorization, and instant REST API integration.
        </p>

        {/* CTA Action Buttons with Dynamic Hover Animations */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link to="/upload" className="w-full sm:w-auto">
            <HoverButton
              glowColor="#D6CC99"
              backgroundColor="#445D48"
              textColor="#FDE5D4"
              hoverTextColor="#FFFFFF"
              className="w-full sm:w-auto shadow-xl shadow-[#445D48]/30"
            >
              <Upload className="w-5 h-5 shrink-0" />
              <span>Upload Resume PDF</span>
            </HoverButton>
          </Link>

          <Link to="/result" className="w-full sm:w-auto">
            <RippleButton
              variant="hoverborder"
              hoverBorderEffectColor="#D6CC99"
              hoverBorderEffectThickness="3px"
              className="w-full sm:w-auto text-[#001524] dark:text-[#FDE5D4] bg-white/80 dark:bg-[#071E2E]/80 border border-[#D6CC99] dark:border-[#445D48] shadow-md"
            >
              <FileCheck className="w-5 h-5 text-[#445D48] dark:text-[#D6CC99] shrink-0" />
              <span>View Sample Output</span>
            </RippleButton>
          </Link>
        </div>
      </section>

      {/* 3D Coverflow Carousel Section for Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold">
            <GradientShimmer gradient="peach" className="font-extrabold">
              Architected for Precision & Speed
            </GradientShimmer>
          </h2>
          <p className="text-[#001524]/70 dark:text-[#FDE5D4]/70 mt-2 font-medium">
            Swipe or use navigation controls to explore our feature extraction engine.
          </p>
        </div>

        {/* Coverflow Carousel Component */}
        <CoverflowCarousel
          slides={featureSlides}
          rotate={30}
          depth={0.4}
          cardWidth="clamp(240px, 72vw, 340px)"
          showCaption={true}
          showPagination={true}
          showNavigation={true}
          renderCard={(slide, isSelected) => {
            const Icon = slide.icon;
            return (
              <div className={`h-full w-full overflow-hidden flex flex-col justify-between transition-all duration-300 ${isSelected ? 'bg-[#FAF4ED] dark:bg-[#071E2E]' : 'bg-[#FDE5D4]/80 dark:bg-[#041624]'}`}>
                
                {/* Image Header */}
                <div className="relative h-36 w-full overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001524]/80 via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-[#445D48] text-[#FDE5D4] dark:bg-[#D6CC99] dark:text-[#001524] flex items-center justify-center shadow-lg border border-[#D6CC99]/40">
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="absolute top-3 right-3 text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full bg-[#001524]/80 text-[#FDE5D4] backdrop-blur-md border border-[#D6CC99]/40">
                    {slide.tag}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-base font-extrabold text-[#001524] dark:text-[#FDE5D4] leading-snug">
                      {slide.title}
                    </h3>
                    <p className="text-[11px] font-extrabold text-[#5E3023] dark:text-[#D6CC99] mt-0.5">
                      {slide.subtitle}
                    </p>
                    <p className="text-xs text-[#001524]/80 dark:text-[#FDE5D4]/80 leading-relaxed font-medium pt-2">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          }}
        />
      </section>

      {/* Supported Data Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-[#D6CC99]/60 dark:border-[#445D48]/50 shadow-xl hover:shadow-2xl hover:border-[#445D48] dark:hover:border-[#D6CC99] transition-all duration-300">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-extrabold mb-4">
              <GradientShimmer gradient="sunrise" className="font-extrabold">
                Comprehensive Resume Information Extraction
              </GradientShimmer>
            </h2>
            <p className="text-[#001524]/70 dark:text-[#FDE5D4]/70 mb-8 font-medium">
              Our parser automatically categorizes and normalizes every section into structured JSON fields.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {supportedFields.map((field, idx) => (
                <div key={idx} className="flex items-center gap-3 group">
                  <CheckCircle2 className="w-5 h-5 text-[#445D48] dark:text-[#D6CC99] shrink-0 group-hover:scale-125 transition-transform duration-200" />
                  <span className="text-sm font-extrabold text-[#001524] dark:text-[#FDE5D4] group-hover:translate-x-1 transition-transform duration-200">{field}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
