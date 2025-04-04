import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Rocket, Map, Gamepad2, Sparkles, Lightbulb } from 'lucide-react';

const AboutPage: React.FC = () => {
  // Decorative shape component
  const LowPolyShape = () => (
    <div className="absolute">
      <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <polygon points="0,0 200,100 100,200 50,50" fill="currentColor" className="opacity-80" />
      </svg>
    </div>
  );

  // Core features of the platform
  const features = [
    {
      icon: <Globe className="h-8 w-8 text-white" />,
      title: "Global Explorer",
      description: "Discover fascinating facts about countries around the world!",
      color: "bg-blue-500"
    },
    {
      icon: <Map className="h-8 w-8 text-white" />,
      title: "Interactive Maps",
      description: "Explore politics and geography through colorful visuals.",
      color: "bg-green-500"
    },
    {
      icon: <Rocket className="h-8 w-8 text-white" />,
      title: "Learn by Doing",
      description: "Fun challenges that make complex ideas simple and exciting!",
      color: "bg-purple-500"
    }
  ];
  
  // Educational approach cards
  const educationalCards = [
    {
      icon: <Gamepad2 className="h-16 w-16 text-white" />,
      title: "Learn Through Play",
      description: "Our interactive elements make politics fun to explore!",
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: <Sparkles className="h-16 w-16 text-white" />,
      title: "Visual Learning", 
      description: "Colorful graphics help you understand complex ideas instantly.",
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: <Lightbulb className="h-16 w-16 text-white" />,
      title: "Explore & Discover",
      description: "The more you explore, the more connections you'll discover.",
      color: "from-green-500 to-teal-500"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 transform rotate-12">
            <LowPolyShape />
          </div>
          <div className="absolute bottom-0 right-0 w-96 h-96 transform -rotate-12">
            <LowPolyShape />
          </div>
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
              WorldPolitics makes learning about countries and governments fun and easy to understand - designed especially for students like you!
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


        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Makes Us <span className="text-primary">Special</span>
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our platform is designed to make learning about global politics fun and exciting!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center transform rotate-3 mb-6 shadow-md`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Approach Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Learning That <span className="text-primary">Inspires</span>
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our unique educational approach makes complex political concepts easy to understand.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {educationalCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className={`h-32 bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  {card.icon}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <p className="text-gray-600">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Globe Section - Original Content */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-primary-light/20 to-primary/10 overflow-hidden">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Explore the <span className="text-primary">World</span>
            </h2>
            <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
              Discover how politics shapes our global community
            </p>
          </motion.div>
          
          <div className="flex flex-col md:flex-row flex-wrap items-center gap-8 md:gap-12 lg:gap-16 max-w-6xl mx-auto">
            {/* Mobile/Tablet View - Stats on top, Globe below */}
            <div className="w-full md:w-1/2 lg:w-2/5 order-2 md:order-1">
              {/* Animated Globe */}
              <motion.div 
                className="relative mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ maxWidth: "min(100%, 380px)" }}
              >
                <div className="aspect-square w-full relative">
                  {/* The globe */}
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-xl p-3 md:p-4">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-300 to-cyan-500 relative overflow-hidden">
                      {/* Continents (stylized) */}
                      <motion.div 
                        className="absolute inset-0"
                        animate={{ rotate: 360 }}
                        transition={{ 
                          duration: 120, 
                          repeat: Infinity, 
                          ease: "linear" 
                        }}
                      >
                        {/* Africa */}
                        <div className="absolute bg-green-400/90 rounded-tl-[90%] rounded-tr-[50%] rounded-bl-[40%] rounded-br-[70%]" 
                          style={{ width: '28%', height: '36%', left: '45%', top: '40%' }}></div>
                        
                        {/* Europe */}
                        <div className="absolute bg-amber-400/90 rounded-tl-[40%] rounded-tr-[70%] rounded-bl-[60%] rounded-br-[50%]" 
                          style={{ width: '20%', height: '20%', left: '48%', top: '20%' }}></div>
                        
                        {/* Asia */}
                        <div className="absolute bg-red-400/90 rounded-tl-[60%] rounded-tr-[40%] rounded-bl-[50%] rounded-br-[70%]" 
                          style={{ width: '38%', height: '36%', left: '60%', top: '22%' }}></div>
                        
                        {/* North America */}
                        <div className="absolute bg-blue-400/90 rounded-tl-[50%] rounded-tr-[60%] rounded-bl-[40%] rounded-br-[70%]" 
                          style={{ width: '30%', height: '28%', left: '12%', top: '18%' }}></div>
                        
                        {/* South America */}
                        <div className="absolute bg-purple-400/90 rounded-tl-[40%] rounded-tr-[70%] rounded-bl-[30%] rounded-br-[60%]" 
                          style={{ width: '18%', height: '28%', left: '25%', top: '50%' }}></div>
                        
                        {/* Australia */}
                        <div className="absolute bg-orange-400/90 rounded-tl-[60%] rounded-tr-[50%] rounded-bl-[40%] rounded-br-[60%]" 
                          style={{ width: '18%', height: '18%', left: '75%', top: '65%' }}></div>
                      </motion.div>
                      
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[95%] h-[95%] border-2 border-white/20 rounded-full"></div>
                        <div className="absolute w-full h-[1px] bg-white/20 top-1/2 left-0"></div>
                        <div className="absolute w-[1px] h-full bg-white/20 top-0 left-1/2"></div>
                      </div>
                      
                      {/* Glowing effect */}
                      <div className="absolute top-1/4 right-1/4 w-[15%] h-[15%] rounded-full bg-white/30 blur-xl"></div>
                    </div>
                  </div>
                  
                  {/* Animated orbit */}
                  <motion.div 
                    className="absolute h-[110%] w-[110%] rounded-full border-2 border-dashed border-blue-300/30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={{ rotate: 360 }}
                    transition={{ 
                      duration: 30, 
                      repeat: Infinity, 
                      ease: "linear"
                    }}
                  ></motion.div>
                  
                  {/* Location pins with pulse animation */}
                  {[
                    { name: "New York", left: "22%", top: "30%", delay: 0, show: true },
                    { name: "London", left: "47%", top: "25%", delay: 1.2, show: true },
                    { name: "Tokyo", left: "80%", top: "32%", delay: 0.6, show: true },
                    { name: "Sydney", left: "83%", top: "70%", delay: 1.8, show: true },
                    { name: "Rio", left: "30%", top: "65%", delay: 2.4, show: true },
                  ].filter(pin => pin.show).map((pin, i) => (
                    <div key={i} className="absolute" style={{ left: pin.left, top: pin.top }}>
                      <motion.div 
                        className="relative"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.15 }}
                      >
                        <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-red-500 rounded-full relative z-10"></div>
                        <motion.div 
                          className="absolute w-5 h-5 md:w-6 md:h-6 rounded-full bg-red-500/60 -top-[6px] -left-[6px] md:-top-[7px] md:-left-[7px]"
                          animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.6, 0, 0.6] }}
                          transition={{ 
                            duration: 2, 
                            delay: pin.delay,
                            repeat: Infinity,
                            repeatType: "loop"
                          }}
                        ></motion.div>
                      </motion.div>
                    </div>
                  ))}
                </div>
                
                {/* Mobile labels */}
                <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs text-gray-600 md:hidden">
                  <div className="px-2 py-1 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                    <span className="w-2 h-2 inline-block bg-green-400 rounded-full mr-1.5 align-middle"></span>
                    Africa
                  </div>
                  <div className="px-2 py-1 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                    <span className="w-2 h-2 inline-block bg-amber-400 rounded-full mr-1.5 align-middle"></span>
                    Europe
                  </div>
                  <div className="px-2 py-1 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                    <span className="w-2 h-2 inline-block bg-red-400 rounded-full mr-1.5 align-middle"></span>
                    Asia
                  </div>
                  <div className="px-2 py-1 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                    <span className="w-2 h-2 inline-block bg-blue-400 rounded-full mr-1.5 align-middle"></span>
                    North America
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Interactive Stats */}
            <div className="w-full md:w-1/2 lg:w-3/5 order-1 md:order-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-lg p-5 md:p-6 lg:p-8"
              >
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Key Insights From Our Platform</h3>
                
                <div className="space-y-4 md:space-y-6">
                  {[
                    { 
                      title: "Democracy Index", 
                      value: "Global coverage", 
                      icon: <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                        </svg>
                      </div>,
                      description: "Track democratic progress in every country with our comprehensive index"
                    },
                    { 
                      title: "Interactive Political Maps", 
                      value: "6 continents", 
                      icon: <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                          <line x1="8" y1="2" x2="8" y2="18"></line>
                          <line x1="16" y1="6" x2="16" y2="22"></line>
                        </svg>
                      </div>,
                      description: "Visualize global political data with stunning interactive maps"
                    },
                    { 
                      title: "Historical Timeline", 
                      value: "500+ years of data", 
                      icon: <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      </div>,
                      description: "Explore how political systems have evolved through centuries"
                    }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-start gap-3 md:gap-4 p-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    >
                      {item.icon}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between flex-wrap gap-1">
                          <h4 className="text-base md:text-lg font-bold text-gray-900">{item.title}</h4>
                          <span className="text-xs md:text-sm font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded-full">
                            {item.value}
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs md:text-sm mt-1">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6 md:mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
                  <motion.a
                    href="/"
                    className="py-2.5 px-5 md:py-3 md:px-6 bg-primary text-white rounded-xl shadow-md hover:shadow-lg transition-all font-bold text-sm md:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Exploring
                  </motion.a>
                  
                  <motion.a
                    href="/"
                    className="py-2.5 px-5 md:py-3 md:px-6 bg-white border border-gray-200 text-gray-700 rounded-xl shadow-sm hover:shadow transition-all font-medium text-sm md:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Learn More
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 px-4 bg-white text-center">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Explore the World?
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Start your journey through global politics and discover fascinating facts about countries around the world.
            </p>
            <motion.a
              href="/"
              className="inline-block py-3 px-8 bg-primary text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-bold text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Begin Your Adventure
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;