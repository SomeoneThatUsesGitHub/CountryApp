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

          {/* Floating elements animation */}
          <div className="hidden md:block absolute top-0 left-0 w-full h-full pointer-events-none">
            {[1, 2, 3].map((i) => (
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