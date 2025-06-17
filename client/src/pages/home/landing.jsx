import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  BookOpen,
  Users,
  Download,
  Star,
  Search,
  Upload,
  MessageCircle,
  Shield,
  Trophy,
  Zap,
  Globe,
  ChevronRight,
  Play,
  Heart,
  Award,
  TrendingUp,
  UserCheck,
  FileText,
  Coffee,
  Sparkles,
  Calendar,
  Bookmark,
  Lightbulb,
  Target,
  PieChart,
  Clock,
} from "lucide-react";

const NoteNexLanding = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  // Monthly color palette - soft, professional colors
  const monthlyColors = [
    "from-blue-400 to-blue-500", // January - Cool Blue
    "from-purple-400 to-purple-500", // February - Soft Purple
    "from-green-400 to-green-500", // March - Fresh Green
    "from-pink-400 to-pink-500", // April - Gentle Pink
    "from-indigo-400 to-indigo-500", // May - Deep Indigo
    "from-teal-400 to-teal-500", // June - Ocean Teal
    "from-orange-400 to-orange-500", // July - Warm Orange
    "from-cyan-400 to-cyan-500", // August - Sky Cyan
    "from-violet-400 to-violet-500", // September - Rich Violet
    "from-emerald-400 to-emerald-500", // October - Emerald
    "from-rose-400 to-rose-500", // November - Rose
    "from-amber-400 to-amber-500", // December - Golden Amber
  ];

  const currentMonth = new Date().getMonth();
  const primaryGradient = monthlyColors[currentMonth];

  // Animated counter hook
  const useCounter = (end, duration = 2) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
      if (!hasStarted) return;

      let start = 0;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);

      return () => clearInterval(timer);
    }, [end, duration, hasStarted]);

    return [count, () => setHasStarted(true)];
  };

  // Section component with intersection observer
  const Section = ({ children, className = "" }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.section>
    );
  };

  // Subtle floating animation
  const FloatingElement = ({ children, delay = 0 }) => (
    <motion.div
      animate={{
        y: [0, -8, 0],
        scale: [1, 1.02, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );

  // Subtle background elements
  const BackgroundElements = () => {
    const elements = Array.from({ length: 12 }, (_, i) => i);

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {elements.map((i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gray-300/30 rounded-full"
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800 overflow-hidden">
      <BackgroundElements />

      {/* Section 1: Hero Section */}
      <Section className="relative min-h-screen flex items-center justify-center px-6">
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50"
        />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div
              className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${primaryGradient} rounded-2xl mb-6 shadow-lg`}
            >
              <BookOpen className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r ${primaryGradient} bg-clip-text text-transparent`}
          >
            NoteNex
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            The ultimate platform for students to share, discover, and
            collaborate on study materials. Join thousands of learners building
            a knowledge community.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className={`px-8 py-4 bg-gradient-to-r ${primaryGradient} text-white rounded-full font-semibold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <Play className="w-5 h-5" />
              Get Started Free
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
            >
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Subtle Floating Icons */}
          <div className="absolute top-20 left-10 hidden md:block">
            <FloatingElement delay={0}>
              <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm border border-gray-200/50">
                <Upload className="w-6 h-6 text-blue-500" />
              </div>
            </FloatingElement>
          </div>

          <div className="absolute top-32 right-16 hidden md:block">
            <FloatingElement delay={1}>
              <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm border border-gray-200/50">
                <Heart className="w-5 h-5 text-pink-500" />
              </div>
            </FloatingElement>
          </div>

          <div className="absolute bottom-20 left-20 hidden md:block">
            <FloatingElement delay={2}>
              <div className="w-14 h-14 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm border border-gray-200/50">
                <Star className="w-7 h-7 text-yellow-500" />
              </div>
            </FloatingElement>
          </div>

          <div className="absolute top-16 right-32 hidden lg:block">
            <FloatingElement delay={0.5}>
              <div className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm border border-gray-200/50">
                <Calendar className="w-4 h-4 text-green-500" />
              </div>
            </FloatingElement>
          </div>

          <div className="absolute bottom-32 right-10 hidden md:block">
            <FloatingElement delay={1.5}>
              <div className="w-11 h-11 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm border border-gray-200/50">
                <Bookmark className="w-5 h-5 text-purple-500" />
              </div>
            </FloatingElement>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronRight className="w-6 h-6 text-gray-400 rotate-90" />
        </motion.div>
      </Section>

      {/* Section 2: Features & Capabilities */}
      <Section className="py-20 px-6 relative bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2
              className={`text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r ${primaryGradient} bg-clip-text text-transparent`}
            >
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to excel in your academic journey, all in one
              platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Upload className="w-8 h-8" />,
                title: "Smart Upload System",
                desc: "Upload PDFs, documents, and images with automatic categorization and quality verification",
                color: "from-blue-400 to-blue-500",
              },
              {
                icon: <Search className="w-8 h-8" />,
                title: "Advanced Search",
                desc: "Find exactly what you need with AI-powered search across subjects, colleges, and topics",
                color: "from-purple-400 to-purple-500",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Study Groups",
                desc: "Create and join collaborative study groups with real-time discussions and file sharing",
                color: "from-green-400 to-green-500",
              },
              {
                icon: <Trophy className="w-8 h-8" />,
                title: "Contributor System",
                desc: "Earn points, badges, and trust rankings as you contribute valuable content to the community",
                color: "from-orange-400 to-orange-500",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Quality Control",
                desc: "Admin-moderated content ensures high-quality, relevant study materials for everyone",
                color: "from-red-400 to-red-500",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Real-time Analytics",
                desc: "Track your progress, downloads, and engagement with comprehensive analytics dashboard",
                color: "from-indigo-400 to-indigo-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="group"
              >
                <div className="relative p-8 bg-white rounded-2xl border border-gray-200/50 hover:border-gray-300 transition-all duration-300 h-full shadow-sm hover:shadow-md">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 group-hover:scale-105 transition-transform duration-300 shadow-sm`}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 3: Community Stats */}
      <Section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={`text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r ${primaryGradient} bg-clip-text text-transparent`}
          >
            Thriving Community
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto"
          >
            Join thousands of students who are already benefiting from our
            collaborative learning platform
          </motion.p>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                number: 15000,
                label: "Active Students",
                suffix: "+",
                color: "text-blue-500",
              },
              {
                icon: <FileText className="w-8 h-8" />,
                number: 45000,
                label: "Study Materials",
                suffix: "+",
                color: "text-green-500",
              },
              {
                icon: <Download className="w-8 h-8" />,
                number: 120000,
                label: "Downloads",
                suffix: "+",
                color: "text-purple-500",
              },
              {
                icon: <Coffee className="w-8 h-8" />,
                number: 500,
                label: "Colleges",
                suffix: "+",
                color: "text-orange-500",
              },
            ].map((stat, index) => {
              const [count, startCounter] = useCounter(stat.number);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                    transition: { delay: index * 0.1 },
                  }}
                  onViewportEnter={startCounter}
                  className="group"
                >
                  <div className="p-8 bg-white rounded-2xl border border-gray-200/50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl mb-4 ${stat.color} group-hover:bg-gray-100 transition-colors duration-300`}
                    >
                      {stat.icon}
                    </motion.div>
                    <motion.div
                      className="text-4xl md:text-5xl font-bold text-gray-800 mb-2"
                      key={count}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 0.3 }}
                    >
                      {count.toLocaleString()}
                      {stat.suffix}
                    </motion.div>
                    <div className="text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Testimonial Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                college: "IIT Delhi",
                text: "NoteNex transformed my study routine. Found amazing notes and connected with brilliant minds!",
                rating: 5,
              },
              {
                name: "Arjun Patel",
                college: "NIT Trichy",
                text: "The quality of materials here is incredible. Helped me ace my Machine Learning course!",
                rating: 5,
              },
              {
                name: "Sneha Kumar",
                college: "BITS Pilani",
                text: "Love the study groups feature. Collaborative learning has never been this engaging!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="p-6 bg-white rounded-2xl border border-gray-200/50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="text-gray-800 font-semibold">
                  {testimonial.name}
                </div>
                <div className="text-gray-500 text-sm">
                  {testimonial.college}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 4: How It Works */}
      <Section className="py-20 px-6 relative bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2
              className={`text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r ${primaryGradient} bg-clip-text text-transparent`}
            >
              How NoteNex Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes and unlock a world of collaborative
              learning
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection Line */}
            <div
              className={`hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r ${primaryGradient} rounded-full transform -translate-y-1/2 z-0 opacity-20`}
            />

            <div className="grid lg:grid-cols-4 gap-8 relative z-10">
              {[
                {
                  step: "01",
                  title: "Sign Up",
                  desc: "Create your account with college details and join your academic community",
                  icon: <UserCheck className="w-8 h-8" />,
                  color: "from-blue-400 to-blue-500",
                },
                {
                  step: "02",
                  title: "Upload & Share",
                  desc: "Share your study materials and notes to help fellow students learn",
                  icon: <Upload className="w-8 h-8" />,
                  color: "from-purple-400 to-purple-500",
                },
                {
                  step: "03",
                  title: "Discover & Download",
                  desc: "Browse and download high-quality study materials from peers",
                  icon: <Download className="w-8 h-8" />,
                  color: "from-green-400 to-green-500",
                },
                {
                  step: "04",
                  title: "Collaborate",
                  desc: "Join study groups, discuss topics, and build lasting academic connections",
                  icon: <MessageCircle className="w-8 h-8" />,
                  color: "from-orange-400 to-orange-500",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group text-center"
                >
                  {/* Step Number */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-white border-2 border-gray-200 rounded-full mb-6 group-hover:border-gray-300 transition-all duration-300 shadow-sm"
                  >
                    <span className="text-2xl font-bold text-gray-700">
                      {step.step}
                    </span>
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl mb-6 shadow-sm`}
                  >
                    <div className="text-white">{step.icon}</div>
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Section 5: Call to Action */}
      <Section className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <FloatingElement>
              <Sparkles className="w-16 h-16 mx-auto text-yellow-500 mb-6" />
            </FloatingElement>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r ${primaryGradient} bg-clip-text text-transparent`}
          >
            Ready to Transform Your Learning?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed"
          >
            Join thousands of students who are already experiencing the future
            of collaborative education. Start your journey today and unlock
            unlimited learning potential.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className={`px-10 py-5 bg-gradient-to-r ${primaryGradient} text-white rounded-full font-bold text-xl flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <Play className="w-6 h-6" />
              Start Learning Now
              <ChevronRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-5 border-2 border-gray-300 text-gray-700 rounded-full font-bold text-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
            >
              Learn More
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap justify-center items-center gap-6 text-gray-500"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span>100% Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              <span>Global Community</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span>Quality Assured</span>
            </div>
          </motion.div>

          {/* Additional Floating Elements */}
          <div className="absolute -top-5 -left-10 hidden md:block">
            <FloatingElement delay={0}>
              <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-gray-200/50">
                <Lightbulb className="w-8 h-8 text-yellow-500" />
              </div>
            </FloatingElement>
          </div>

          <div className="absolute top-0 -right-12 hidden md:block">
            <FloatingElement delay={1}>
              <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-gray-200/50">
                <Target className="w-6 h-6 text-red-500" />
              </div>
            </FloatingElement>
          </div>

          <div className="absolute -bottom-8 -left-8 hidden lg:block">
            <FloatingElement delay={0.5}>
              <div className="w-14 h-14 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-gray-200/50">
                <PieChart className="w-7 h-7 text-blue-500" />
              </div>
            </FloatingElement>
          </div>

          <div className="absolute -bottom-5 -right-10 hidden md:block">
            <FloatingElement delay={1.5}>
              <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-gray-200/50">
                <Clock className="w-5 h-5 text-purple-500" />
              </div>
            </FloatingElement>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default NoteNexLanding;
