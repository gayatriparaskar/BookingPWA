import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Eye, Heart, Star, Filter, Grid3X3, 
  Scissors, Sparkles, Users, Award, Calendar,
  ZoomIn, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GalleryImage {
  id: number;
  url: string;
  title: string;
  category: string;
  description: string;
  beforeAfter?: boolean;
}

const galleryCategories = [
  { id: 'all', name: 'All Work', icon: Grid3X3, color: 'from-purple-500 to-indigo-600' },
  { id: 'hair', name: 'Hair Services', icon: Scissors, color: 'from-rose-500 to-pink-600' },
  { id: 'spa', name: 'Spa Treatments', icon: Sparkles, color: 'from-emerald-500 to-teal-600' },
  { id: 'nails', name: 'Nail Art', icon: Star, color: 'from-orange-500 to-red-600' },
  { id: 'makeup', name: 'Makeup Artistry', icon: Heart, color: 'from-pink-500 to-purple-600' },
  { id: 'skincare', name: 'Skincare', icon: Users, color: 'from-blue-500 to-cyan-600' }
];

const galleryImages: GalleryImage[] = [
  // Hair Services
  {
    id: 1,
    url: 'https://images.pexels.com/photos/8834095/pexels-photo-8834095.jpeg',
    title: 'Professional Hair Transformation',
    category: 'hair',
    description: 'Modern haircut and styling in our luxury salon environment',
    beforeAfter: true
  },
  {
    id: 2,
    url: 'https://images.pexels.com/photos/8468125/pexels-photo-8468125.jpeg',
    title: 'Hair Coloring Expertise',
    category: 'hair',
    description: 'Professional hair coloring with foil technique and precision'
  },
  {
    id: 3,
    url: 'https://images.pexels.com/photos/8467963/pexels-photo-8467963.jpeg',
    title: 'Hair Care Products',
    category: 'hair',
    description: 'Premium hair care products and styling tools'
  },
  {
    id: 4,
    url: 'https://images.pexels.com/photos/8468129/pexels-photo-8468129.jpeg',
    title: 'Professional Hair Tools',
    category: 'hair',
    description: 'High-quality hairdressing tools and equipment'
  },
  {
    id: 5,
    url: 'https://images.pexels.com/photos/7755511/pexels-photo-7755511.jpeg',
    title: 'Color Consultation',
    category: 'hair',
    description: 'Expert color consultation and selection process'
  },
  
  // Spa Treatments
  {
    id: 6,
    url: 'https://images.pexels.com/photos/6663371/pexels-photo-6663371.jpeg',
    title: 'Relaxing Head Massage',
    category: 'spa',
    description: 'Serene spa experience with professional massage therapy'
  },
  {
    id: 7,
    url: 'https://images.pexels.com/photos/6187645/pexels-photo-6187645.jpeg',
    title: 'Hot Stone Therapy',
    category: 'spa',
    description: 'Soothing hot stone massage for ultimate relaxation'
  },
  {
    id: 8,
    url: 'https://images.pexels.com/photos/161477/treatment-finger-keep-hand-161477.jpeg',
    title: 'Hand Massage Therapy',
    category: 'spa',
    description: 'Gentle hand massage and care treatment'
  },
  
  // Skincare
  {
    id: 9,
    url: 'https://images.pexels.com/photos/5240817/pexels-photo-5240817.jpeg',
    title: 'Facial Treatment Session',
    category: 'skincare',
    description: 'Professional facial treatment for healthy, glowing skin'
  },
  {
    id: 10,
    url: 'https://images.pexels.com/photos/5128220/pexels-photo-5128220.jpeg',
    title: 'Eyelash Extensions',
    category: 'skincare',
    description: 'Precision eyelash extension application'
  },
  
  // Nail Art
  {
    id: 11,
    url: 'https://images.pexels.com/photos/6045539/pexels-photo-6045539.jpeg',
    title: 'Acrylic Nail Application',
    category: 'nails',
    description: 'Professional acrylic nail art and design'
  },
  {
    id: 12,
    url: 'https://images.pexels.com/photos/6830805/pexels-photo-6830805.jpeg',
    title: 'Artistic Nail Design',
    category: 'nails',
    description: 'Creative jellyfish nail art on pastel base'
  },
  {
    id: 13,
    url: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg',
    title: 'Nail Polish Selection',
    category: 'nails',
    description: 'Wide range of premium nail polish colors'
  },
  
  // Makeup
  {
    id: 14,
    url: 'https://images.pexels.com/photos/20717928/pexels-photo-20717928.jpeg',
    title: 'Professional Makeup Artistry',
    category: 'makeup',
    description: 'Expert makeup application and transformation'
  },
  {
    id: 15,
    url: 'https://images.pexels.com/photos/7984976/pexels-photo-7984976.jpeg',
    title: 'Beauty Makeup Session',
    category: 'makeup',
    description: 'Professional makeup application in modern salon'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function Gallery() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(galleryImages);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredImages(galleryImages);
    } else {
      setFilteredImages(galleryImages.filter(img => img.category === selectedCategory));
    }
  }, [selectedCategory]);

  const openImageModal = (image: GalleryImage) => {
    setSelectedImage(image);
    setCurrentImageIndex(filteredImages.findIndex(img => img.id === image.id));
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % filteredImages.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(filteredImages[prevIndex]);
  };

  const currentCategory = galleryCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-gray-200/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/" className="flex items-center text-gray-600 hover:text-rose-600 transition-colors duration-300">
                  <ArrowLeft className="h-5 w-5 mr-3" />
                  <span className="font-medium">Back to Home</span>
                </Link>
              </motion.div>
              
              <div className="h-8 w-px bg-gray-300 mx-4"></div>
              
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Our Gallery
                </h1>
                <p className="text-sm text-gray-500">Showcasing our finest work</p>
              </div>
            </div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Eye className="h-4 w-4" />
                <span>{filteredImages.length} photos</span>
              </div>
              
              <Link to="/booking">
                <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {currentCategory && (
            <motion.div 
              className={`inline-flex items-center space-x-3 bg-gradient-to-r ${currentCategory.color} text-white px-8 py-4 rounded-2xl shadow-2xl mb-6`}
              whileHover={{ scale: 1.05 }}
            >
              <currentCategory.icon className="h-8 w-8" />
              <span className="text-2xl font-bold">{currentCategory.name}</span>
            </motion.div>
          )}
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {selectedCategory === 'all' ? 'Complete Portfolio' : currentCategory?.name}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {selectedCategory === 'all' 
              ? 'Explore our complete collection of professional beauty work and transformations'
              : `Discover our expertise in ${currentCategory?.name.toLowerCase()} with these stunning results`
            }
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {galleryCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link to={`/gallery?category=${category.id}`}>
                <Button
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    selectedCategory === category.id 
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105` 
                      : 'hover:scale-105 hover:shadow-md'
                  }`}
                >
                  <category.icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            {filteredImages.map((image, index) => (
              <motion.div
                key={`${selectedCategory}-${image.id}`}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => openImageModal(image)}
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 h-full">
                  <div className="relative h-64 overflow-hidden">
                    <motion.img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      variants={imageVariants}
                      whileHover={{ scale: 1.05 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="font-bold text-lg">{image.title}</h3>
                        <p className="text-sm text-gray-200">{image.description}</p>
                      </div>
                      <div className="absolute top-4 right-4">
                        <motion.div 
                          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                        >
                          <ZoomIn className="h-5 w-5 text-white" />
                        </motion.div>
                      </div>
                      {image.beforeAfter && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-green-500 text-white border-0">
                            Before/After
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-rose-600 transition-colors duration-300">
                      {image.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{image.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
              onClick={closeImageModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative max-w-5xl max-h-[90vh] m-4"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full h-full object-contain rounded-2xl shadow-2xl"
                />
                
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeImageModal}
                  className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <X className="h-6 w-6" />
                </motion.button>
                
                {/* Navigation Buttons */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </motion.button>
                
                {/* Image Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedImage.title}</h3>
                  <p className="text-gray-600 mb-2">{selectedImage.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-rose-100 text-rose-800">
                      {galleryCategories.find(cat => cat.id === selectedImage.category)?.name}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {currentImageIndex + 1} of {filteredImages.length}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16 py-16 bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Create Your Own 
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent"> Transformation?</span>
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Book your appointment today and let our expert team create stunning results just like these!
          </p>
          <Link to="/booking">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Transformation
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
