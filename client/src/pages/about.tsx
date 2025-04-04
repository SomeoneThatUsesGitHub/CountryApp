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
            <div className="flex justify-center">
              <motion.a 
                href="/" 
                className="py-3 px-8 bg-white text-primary rounded-xl shadow-lg hover:shadow-xl transition-all font-bold text-lg"
                whileHover={{ scale: 1.05, rotate: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Exploring!
              </motion.a>
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

      {/* Fun Facts Counter Section with Interactive Map */}
      <section className="py-12 px-4 bg-white relative overflow-hidden">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* World Map Visualization */}
            <motion.div 
              className="relative order-2 lg:order-1"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-video bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl overflow-hidden shadow-lg">
                {/* Stylized Low-Poly World Map */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 1000 500" className="w-full h-full opacity-70">
                    {/* Africa */}
                    <polygon points="500,280 530,260 560,300 540,350 510,400 480,380 460,320" fill="#FFEB3B" />
                    {/* Europe */}
                    <polygon points="480,200 520,180 550,210 530,240 490,250" fill="#4CAF50" />
                    {/* Asia */}
                    <polygon points="550,210 600,180 650,220 630,280 580,310 550,290 530,240" fill="#FF9800" />
                    {/* North America */}
                    <polygon points="300,180 350,150 400,170 380,230 320,260 280,230" fill="#E91E63" />
                    {/* South America */}
                    <polygon points="380,300 400,270 430,310 410,370 370,390 350,350" fill="#9C27B0" />
                    {/* Australia */}
                    <polygon points="650,350 690,330 720,360 700,390 660,380" fill="#F44336" />
                  </svg>
                  
                  {/* Pulsing dots for major cities/capitals */}
                  {[
                    { x: 485, y: 205, delay: 0 },    // Europe
                    { x: 580, y: 220, delay: 1.1 },  // Asia
                    { x: 320, y: 200, delay: 0.3 },  // North America
                    { x: 390, y: 320, delay: 0.6 },  // South America
                    { x: 520, y: 320, delay: 0.9 },  // Africa
                    { x: 680, y: 360, delay: 1.5 },  // Australia
                  ].map((dot, i) => (
                    <motion.div 
                      key={i}
                      className="absolute w-4 h-4 bg-white rounded-full shadow-md"
                      style={{ left: `${dot.x}px`, top: `${dot.y}px`, transform: 'translate(-50%, -50%)' }}
                      initial={{ scale: 0.5, opacity: 0.2 }}
                      animate={{ 
                        scale: [0.5, 1.2, 0.5],
                        opacity: [0.2, 0.8, 0.2]
                      }}
                      transition={{
                        duration: 3,
                        delay: dot.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
                
                {/* Continent Labels */}
                <div className="absolute inset-0">
                  <div className="absolute text-white font-bold text-xs md:text-sm" style={{ left: '32%', top: '30%' }}>North America</div>
                  <div className="absolute text-white font-bold text-xs md:text-sm" style={{ left: '38%', top: '60%' }}>South America</div>
                  <div className="absolute text-white font-bold text-xs md:text-sm" style={{ left: '50%', top: '25%' }}>Europe</div>
                  <div className="absolute text-white font-bold text-xs md:text-sm" style={{ left: '52%', top: '65%' }}>Africa</div>
                  <div className="absolute text-white font-bold text-xs md:text-sm" style={{ left: '60%', top: '30%' }}>Asia</div>
                  <div className="absolute text-white font-bold text-xs md:text-sm" style={{ left: '69%', top: '65%' }}>Australia</div>
                </div>
                
                {/* Overlay with slogan */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-blue-900/70 to-transparent">
                  <div className="text-center px-4">
                    <h3 className="text-white text-xl md:text-3xl font-bold drop-shadow-lg">
                      Explore The Entire World
                    </h3>
                    <p className="text-white/90 text-sm md:text-lg mt-2 max-w-md mx-auto">
                      One adventure at a time!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Fun Facts */}
            <div className="order-1 lg:order-2">
              <motion.h2
                className="text-2xl md:text-3xl font-bold mb-6 text-gray-900"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Awesome Facts About Our Platform
              </motion.h2>
              
              {funFacts.map((fact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="flex items-center mb-6 group"
                >
                  <div className={`w-16 h-16 ${fact.color} rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-all shadow-md`}>
                    <fact.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">{fact.title}</h3>
                    <p className="text-gray-600">{fact.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Students Love Us - Interactive Zigzag Section */}
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

          {/* Zigzag layout alternating image and text */}
          <div className="space-y-12">
            {coolFeatures.slice(0, 3).map((feature, index) => (
              <motion.div 
                key={index}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Feature Image/Visual Side */}
                <div className="w-full md:w-1/2">
                  <div className={`bg-gradient-to-br ${feature.color} p-8 rounded-2xl shadow-lg transform rotate-1 relative overflow-hidden h-64 flex items-center justify-center`}>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-10 -translate-y-10"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full transform -translate-x-5 translate-y-5"></div>
                    
                    {/* Main icon */}
                    <div className="relative z-10 transform transition-transform hover:scale-110 hover:rotate-3">
                      <feature.icon className="h-24 w-24 text-white drop-shadow-lg" />
                    </div>
                    
                    {/* Text label */}
                    <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
                      <span className="text-white font-bold">{index + 1}/3</span>
                    </div>
                  </div>
                </div>
                
                {/* Feature Text Side */}
                <div className="w-full md:w-1/2">
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-700 text-lg mb-4">{feature.description}</p>
                  
                  {/* Example detail points with checkmarks */}
                  <ul className="space-y-2">
                    {[
                      "Perfect for school projects",
                      "Easy to understand explanations",
                      "Colorful interactive elements"
                    ].map((point, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + i * 0.1 + 0.3 }}
                      >
                        <div className="text-green-500 rounded-full bg-green-100 p-1">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span>{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Horizontal Feature Strip */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            {coolFeatures.slice(3, 5).map((feature, index) => (
              <motion.div
                key={index + 3}
                className="flex bg-white rounded-xl overflow-hidden shadow-md border-2 border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <div className={`w-3 bg-gradient-to-b ${feature.color}`}></div>
                <div className="p-6 flex items-center gap-4">
                  <div className="shrink-0">
                    <PolygonIcon Icon={feature.icon} gradientColors={feature.color} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Super Cool Features - Interactive Circular Layout */}
      <section className="py-20 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="0,0 100,0 100,20 0,50" fill="#4338ca" />
            <polygon points="0,50 100,20 100,80 0,100" fill="#3b82f6" />
            <polygon points="0,100 100,80 100,100 0,100" fill="#0ea5e9" />
          </svg>
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Super Cool <span className="text-primary">Features</span>
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Explore our interactive tools designed to make learning about world politics exciting!
            </p>
          </motion.div>

          {/* Main feature in center */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-16">
            {/* Central circular feature */}
            <motion.div 
              className="lg:order-2 relative"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-xl">
                <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50"></div>
                  <div className="relative z-10 text-center p-6">
                    <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center mb-4">
                      <Globe className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Interactive World Explorer</h3>
                    <p className="text-gray-600 text-sm">Discover the world through fun, interactive features</p>
                  </div>
                </div>
                
                {/* Orbital circles */}
                {[0, 1, 2].map((i) => (
                  <motion.div 
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-white/30"
                    initial={{ rotate: i * 30 }}
                    animate={{ rotate: 360 + i * 30 }}
                    transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
                  ></motion.div>
                ))}
                
                {/* Orbiting features */}
                {features.slice(0, 5).map((feature, index) => {
                  const angle = (index * (360 / 5)) * (Math.PI / 180);
                  const radius = 150;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  
                  return (
                    <motion.div
                      key={index}
                      className={`absolute w-16 h-16 ${feature.color} rounded-full shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2`}
                      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                      initial={{ scale: 0, x: 0, y: 0 }}
                      whileInView={{ 
                        scale: 1,
                        x: x * 0.3,
                        y: y * 0.3,
                      }}
                      whileHover={{ scale: 1.2, zIndex: 20 }}
                      viewport={{ once: true }}
                      transition={{ 
                        type: "spring",
                        duration: 0.8, 
                        delay: 0.2 + index * 0.1
                      }}
                    >
                      {feature.icon}
                      <motion.div 
                        className="absolute whitespace-nowrap bg-white px-3 py-1 rounded-lg shadow-lg text-sm font-bold text-gray-800 pointer-events-none"
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        whileHover={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {feature.title}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
            
            {/* Feature description side */}
            <div className="lg:order-1 lg:w-1/3">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-2xl font-bold mb-4">Explore Countries Like Never Before</h3>
                <p className="text-gray-700 mb-6">Our platform makes it super fun to learn about different countries, their governments, and how they work together on the world stage.</p>
                <ul className="space-y-3">
                  {features.slice(0, 3).map((feature, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    >
                      <div className={`mt-1 w-6 h-6 ${feature.color} rounded-md flex items-center justify-center flex-shrink-0`}>
                        <feature.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
            
            {/* Second feature description side */}
            <div className="lg:order-3 lg:w-1/3">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-2xl font-bold mb-4">Learn Politics The Fun Way</h3>
                <p className="text-gray-700 mb-6">Politics doesn't have to be boring! Our colorful visuals and interactive elements make learning about global politics an exciting adventure.</p>
                <ul className="space-y-3">
                  {features.slice(3, 6).map((feature, index) => (
                    <motion.li 
                      key={index+3} 
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    >
                      <div className={`mt-1 w-6 h-6 ${feature.color} rounded-md flex items-center justify-center flex-shrink-0`}>
                        <feature.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Exciting Call to Action With Game-like Elements */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-primary to-blue-500 text-white relative overflow-hidden">
        {/* Abstract geometric shapes */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute w-64 h-64 rounded-3xl bg-white/10 transform rotate-12"
            style={{ top: '10%', left: '5%' }}
            animate={{ 
              rotate: [12, 20, 12],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
          <motion.div 
            className="absolute w-96 h-96 rounded-full bg-white/5 transform"
            style={{ bottom: '-20%', right: '-10%' }}
            animate={{ 
              y: [0, -20, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
          <motion.div 
            className="absolute w-32 h-32 bg-white/10 transform rotate-45"
            style={{ top: '60%', right: '20%' }}
            animate={{ 
              rotate: [45, 90, 45],
              scale: [1, 0.9, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
                Ready to Begin Your <span className="text-yellow-300">Adventure?</span>
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of students around the world who are discovering global politics in a whole new way!
              </p>
            </motion.div>
            
            {/* Game-like start button */}
            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="relative">
                {/* Pulsing ring effects */}
                {[1, 2, 3].map((i) => (
                  <motion.div 
                    key={i}
                    className="absolute inset-0 rounded-2xl border-2 border-white/30"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1 + (i * 0.15), opacity: 0 }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 0.5,
                      ease: "easeOut" 
                    }}
                  ></motion.div>
                ))}
                
                {/* Main button */}
                <motion.a
                  href="/"
                  className="relative block py-5 px-12 bg-white text-primary font-bold text-xl rounded-2xl shadow-xl"
                  whileHover={{ scale: 1.05, rotate: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Exploring Now!
                </motion.a>
              </div>
            </motion.div>
            
            {/* Decorative elements */}
            <div className="mt-16 flex justify-center">
              <motion.div 
                className="flex items-center gap-3 text-sm opacity-80"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 0.8, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Zap className="h-4 w-4" />
                <span>Join over 1,000 schools worldwide using our platform</span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;