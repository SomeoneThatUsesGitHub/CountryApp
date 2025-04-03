import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  TrendingUp, 
  Radio, 
  Award, 
  PieChart, 
  Clock, 
  Eye,
  Users,
  Target,
  Zap,
  BarChart2,
  BookOpen
} from 'lucide-react';

const AboutPage: React.FC = () => {
  // Features of the platform
  const features = [
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "Global Coverage",
      description: "Explore detailed political and economic information for every country in the world."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Data Visualization",
      description: "Interactive charts and graphs make complex data easy to understand."
    },
    {
      icon: <Radio className="h-8 w-8 text-primary" />,
      title: "International Relations",
      description: "Discover how countries interact with each other on the global stage."
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Political Systems",
      description: "Learn about different forms of government and political structures."
    },
    {
      icon: <PieChart className="h-8 w-8 text-primary" />,
      title: "Economic Data",
      description: "Access key economic indicators and development statistics."
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Historical Timeline",
      description: "Explore major political events throughout a country's history."
    }
  ];

  // Team members - using placeholder data
  const teamMembers = [
    {
      name: "Education Team",
      role: "Research & Content",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "Our dedicated education specialists ensure all content is accurate, engaging, and appropriate for young learners."
    },
    {
      name: "Design Team",
      role: "User Experience",
      image: "https://images.unsplash.com/photo-1638696149120-12afd0683ac7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "Our designers create the intuitive, visually appealing interfaces that make learning about global politics fun and accessible."
    },
    {
      name: "Technical Team",
      role: "Development",
      image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "Our developers build and maintain the platform, constantly improving features and performance."
    }
  ];

  const valueProps = [
    {
      icon: <Eye className="h-6 w-6 text-primary" />,
      title: "Seeing Beyond Borders",
      description: "We help students see the world as an interconnected system of governments and societies."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Inclusive Education",
      description: "Our platform is designed to be accessible to all students, regardless of background or ability."
    },
    {
      icon: <Target className="h-6 w-6 text-primary" />,
      title: "Clarity Through Complexity",
      description: "We simplify complex political systems without oversimplifying their importance."
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Engaging Interactions",
      description: "Interactive elements keep students engaged while learning about global politics."
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-primary" />,
      title: "Data-Driven Insights",
      description: "We use real-world data to provide accurate and up-to-date information."
    },
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: "Educational Focus",
      description: "Every feature is designed with educational outcomes in mind."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Bringing Global Politics to <span className="text-primary">Young Minds</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              WorldPolitics is an educational platform designed to make understanding global political systems engaging and accessible for students and educators.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/" 
                className="py-3 px-6 bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 transition-colors"
              >
                Explore Countries
              </a>
              <a 
                href="/admin" 
                className="py-3 px-6 bg-white text-primary border border-primary rounded-lg hover:bg-gray-50 transition-colors"
              >
                Access Admin Panel
              </a>
            </div>
          </motion.div>
        </div>
        <div className="absolute inset-0 z-[-1] opacity-10">
          <div className="absolute w-64 h-64 rounded-full top-10 left-10 bg-primary"></div>
          <div className="absolute w-48 h-48 rounded-full bottom-10 right-10 bg-blue-500"></div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600">
              We believe that understanding global politics is essential for today's students to become tomorrow's informed citizens. Our mission is to transform complex political information into engaging, accessible content that sparks curiosity and promotes global awareness.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {valueProps.map((prop, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  {prop.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{prop.title}</h3>
                <p className="text-gray-600">{prop.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform combines comprehensive data with interactive visualizations to create a powerful educational tool.
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
                className="bg-gray-50 border border-gray-100 p-6 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              WorldPolitics is built by a dedicated team of educators, designers, and developers committed to creating exceptional educational resources.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="mb-4 rounded-lg overflow-hidden aspect-[4/3]">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">Start Exploring Global Politics Today</h2>
            <p className="text-xl mb-8">
              Join students and educators worldwide who are using WorldPolitics to better understand our global community.
            </p>
            <a 
              href="/" 
              className="inline-block py-3 px-8 bg-white text-primary font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors"
            >
              Explore Countries
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-bold">WorldPolitics</h3>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">© {new Date().getFullYear()} WorldPolitics. All rights reserved.</p>
              <p className="text-gray-400 text-sm mt-1">An educational platform for global political insights</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;