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

      {/* Random Political Facts Section */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-primary-light/20 to-primary/10 overflow-hidden">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="text-primary">Fascinating</span> Political Facts
            </h2>
            <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
              Discover intriguing facts about global politics and governance systems
            </p>
          </motion.div>
          
          {/* Political Facts Cards - Only 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                title: "World's Oldest Democracy",
                fact: "San Marino, founded in 301 CE, claims to be the world's oldest constitutional republic with a constitution dating back to 1600.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                    <circle cx="12" cy="5" r="2"></circle>
                    <path d="M12 7v4"></path>
                    <line x1="8" y1="16" x2="8" y2="16"></line>
                    <line x1="16" y1="16" x2="16" y2="16"></line>
                  </svg>
                ),
                color: "bg-blue-500"
              },
              {
                title: "Women in Parliament",
                fact: "Rwanda has the highest percentage of women in parliament globally, with over 60% of seats in its lower house held by women.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                ),
                color: "bg-pink-500"
              },
              {
                title: "Unique Electoral Systems",
                fact: "Bolivia's election process includes an unusual system that allows voters to choose 'None of the Above' as a legitimate election option.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 7.5h20v9H2z"></path>
                    <path d="M5 7.5V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3.5"></path>
                    <path d="M4 12h.01"></path>
                    <rect x="6" y="10" width="12" height="4" rx="1"></rect>
                  </svg>
                ),
                color: "bg-green-500"
              }
            ].map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative overflow-hidden rounded-xl shadow-md bg-white hover:shadow-lg transition-all duration-300 flex flex-col h-full"
              >
                <div className={`h-2 ${fact.color}`}></div>
                <div className="p-5 md:p-6 flex-grow">
                  <div className="flex items-center mb-3 gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      fact.color === "bg-blue-500" ? "bg-blue-100 text-blue-500" :
                      fact.color === "bg-pink-500" ? "bg-pink-100 text-pink-500" :
                      fact.color === "bg-green-500" ? "bg-green-100 text-green-500" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {fact.icon}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800">{fact.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm md:text-base">{fact.fact}</p>
                </div>
                
                <motion.div 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ rotate: 15 }}
                >
                  <div className="w-20 h-20 text-gray-100 opacity-10 -rotate-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9.5 3v4.5H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9.5a2 2 0 0 0-2-2H19V3h-2v4.5h-5.5V3h-2z"></path>
                    </svg>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10 md:mt-12">
            <motion.a
              href="/"
              className="inline-block py-3 px-6 md:px-8 bg-primary text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-bold text-base md:text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore More Facts
            </motion.a>
          </div>
        </div>
      </section>
      

    </div>
  );
};

export default AboutPage;