import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Rocket, 
  Zap, 
  Trophy,
  PieChart, 
  Map,
  Target,
  Users,
  Gamepad2,
  Sparkles,
  Lightbulb,
  Brain,
  MessageCircle,
  LucideIcon,
  Star
} from 'lucide-react';

const AboutPage: React.FC = () => {
  // Low-poly style shapes component
  const LowPolyShape = ({ className }: { className?: string }) => (
    <div className={`absolute ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <polygon points="0,0 200,100 100,200 50,50" fill="currentColor" className="opacity-80" />
      </svg>
    </div>
  );

  // Features of the platform with youth-friendly descriptions
  const features = [
    {
      icon: <Globe className="h-8 w-8 text-white" />,
      title: "Global Adventure",
      description: "Explore awesome facts about every country on Earth – like a world tour from your device!",
      color: "bg-blue-500"
    },
    {
      icon: <Rocket className="h-8 w-8 text-white" />,
      title: "Interactive Missions",
      description: "Fun challenges and interactive graphics that make learning about politics actually exciting!",
      color: "bg-purple-500"
    },
    {
      icon: <Map className="h-8 w-8 text-white" />,
      title: "World Relations",
      description: "See how countries connect with cool visuals showing alliances, conflicts, and partnerships.",
      color: "bg-green-500"
    },
    {
      icon: <Trophy className="h-8 w-8 text-white" />,
      title: "Government Explorer",
      description: "Discover how different countries are run in a way that's super easy to understand.",
      color: "bg-amber-500"
    },
    {
      icon: <PieChart className="h-8 w-8 text-white" />,
      title: "Economy Visualized",
      description: "See money and trade data transform into colorful charts that tell amazing stories.",
      color: "bg-red-500"
    },
    {
      icon: <Zap className="h-8 w-8 text-white" />,
      title: "Time Travel",
      description: "Jump through history with interactive timelines showing key moments for each country.",
      color: "bg-cyan-500"
    }
  ];

  // Fun facts with polygonal icons
  const funFacts = [
    {
      icon: Star,
      title: "5,000+ Facts",
      description: "Our database has thousands of interesting facts about countries around the world.",
      color: "bg-indigo-400"
    },
    {
      icon: Target,
      title: "200+ Countries",
      description: "Explore detailed profiles of every recognized country on the planet.",
      color: "bg-emerald-400"
    },
    {
      icon: Users,
      title: "For All Ages",
      description: "Designed for students from elementary school through high school.",
      color: "bg-rose-400"
    }
  ];

  // Cool features for young learners
  const coolFeatures = [
    {
      icon: Gamepad2,
      title: "Learn Through Play",
      description: "Politics doesn't have to be boring! Our interactive elements make learning fun.",
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: Sparkles,
      title: "Visual Learning",
      description: "Colorful graphics and animations help you understand complex ideas instantly.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Lightbulb,
      title: "Curiosity Rewarded",
      description: "The more you explore, the more interesting connections you'll discover.",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Brain,
      title: "Knowledge Power",
      description: "Become the expert among your friends on global politics and geography.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: MessageCircle,
      title: "Easy to Explain",
      description: "Learn concepts that you can easily share and discuss with friends and family.",
      color: "from-blue-500 to-indigo-500"
    }
  ];

  // Render icon with animated polygon background
  const PolygonIcon = ({ 
    Icon, 
    gradientColors
  }: { 
    Icon: LucideIcon, 
    gradientColors: string 
  }) => (
    <div className={`relative w-16 h-16 flex items-center justify-center bg-gradient-to-br ${gradientColors} transform rotate-3 rounded-xl overflow-hidden`}>
      <div className="absolute w-5 h-5 bg-white/20 rounded-sm top-0 right-0 transform rotate-12" />
      <div className="absolute w-3 h-3 bg-white/20 rounded-sm bottom-2 left-2 transform -rotate-12" />
      <Icon className="h-8 w-8 text-white relative z-10" />
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen overflow-hidden">
      {/* Hero Section with low-poly elements */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <LowPolyShape className="text-white top-0 left-0 w-64 h-64 transform rotate-12" />
          <LowPolyShape className="text-white bottom-0 right-0 w-96 h-96 transform -rotate-12" />
          <LowPolyShape className="text-white top-1/4 right-1/4 w-48 h-48 transform rotate-45" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Politics Made <span className="text-yellow-300">Awesome!</span>
            </h1>
            <p className="text-xl text-white/90 mb-8">
              WorldPolitics makes learning about countries and governments super fun and easy to understand - designed especially for students like you!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/" 
                className="py-3 px-6 bg-white text-primary rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 font-bold text-lg"
              >
                Start Exploring!
              </a>
              <a 
                href="/admin" 
                className="py-3 px-6 bg-black/20 backdrop-blur-sm text-white border-2 border-white/50 rounded-xl hover:bg-black/30 transition-colors text-lg"
              >
                Admin Portal
              </a>
            </div>
          </motion.div>

          {/* Floating elements animation */}
          <div className="hidden md:block absolute top-0 left-0 w-full h-full pointer-events-none">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div 
                key={i}
                className="absolute rounded-lg bg-white/10 backdrop-blur-sm"
                style={{
                  width: Math.random() * 60 + 20,
                  height: Math.random() * 60 + 20,
                  left: `${Math.random() * 90}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, Math.random() * 20, 0],
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Fun Facts Counter Section */}
      <section className="py-12 px-4 bg-white relative">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {funFacts.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-100 flex items-center space-x-4"
              >
                <div className={`w-16 h-16 ${fact.color} rounded-xl flex items-center justify-center transform rotate-3`}>
                  <fact.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{fact.title}</h3>
                  <p className="text-gray-600">{fact.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cool Features Section - Low Poly Style */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <LowPolyShape className="text-primary top-0 right-0 w-80 h-80" />
          <LowPolyShape className="text-blue-500 bottom-0 left-0 w-60 h-60 transform rotate-45" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Students <span className="text-primary">Love Us</span>
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Learning about global politics is an adventure with these awesome features!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coolFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <PolygonIcon Icon={feature.icon} gradientColors={feature.color} />
                <h3 className="text-xl font-bold mt-5 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Hexagon Cards */}
      <section className="py-16 px-4 bg-white relative">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Super Cool Features
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Explore our interactive tools designed to make learning about world politics exciting!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-white p-6 rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all border-2 border-gray-100"
              >
                {/* Background polygon shape */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${feature.color} transform translate-x-10 -translate-y-10 rotate-12 opacity-90 rounded-2xl group-hover:scale-110 transition-transform duration-300`}></div>
                
                {/* Feature content */}
                <div className="relative z-10">
                  <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-4 transform rotate-3 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary to-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <LowPolyShape className="text-white top-0 left-0 w-72 h-72" />
          <LowPolyShape className="text-white bottom-0 right-0 w-96 h-96 transform rotate-180" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for an Adventure?</h2>
            <p className="text-xl mb-8">
              Join thousands of students exploring the awesome world of global politics!
            </p>
            <motion.a 
              href="/" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block py-4 px-8 bg-white text-primary font-bold rounded-xl shadow-lg text-lg hover:shadow-xl transition-all"
            >
              Let's Go!
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;