import React, { useState, useMemo } from 'react';
import { MosqueInfo, PhotoRecord } from '../types.ts';
import { 
  Image as ImageIcon, 
  ChevronRight, 
  Search, 
  MapPin, 
  Maximize2, 
  X,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PhotoGalleryProps {
  mosques: MosqueInfo[];
  photos: PhotoRecord[];
  onBack: () => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ mosques, photos, onBack }) => {
  const [selectedMosqueCode, setSelectedMosqueCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredMosques = useMemo(() => {
    return mosques.filter(m => 
      m.المسجد.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mosque_code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [mosques, searchQuery]);

  const mosquePhotos = useMemo(() => {
    if (!selectedMosqueCode) return [];
    return photos.filter(p => p.tags === selectedMosqueCode);
  }, [photos, selectedMosqueCode]);

  const selectedMosqueName = useMemo(() => {
    return mosques.find(m => m.mosque_code === selectedMosqueCode)?.المسجد || '';
  }, [mosques, selectedMosqueCode]);

  const handleMosqueClick = (code: string) => {
    setSelectedMosqueCode(code);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedMosqueCode(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-right" dir="rtl">
      {/* Header Section */}
      <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#003366]/10 rounded-2xl flex items-center justify-center text-[#003366]">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#003366]">معرض الصور الميداني 📸</h2>
            <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">توثيق بصري لجميع الأنشطة والخدمات في المواقع</p>
          </div>
        </div>
        <button 
          onClick={selectedMosqueCode ? handleBackToList : onBack}
          className="w-full md:w-auto px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
        >
          {selectedMosqueCode ? <ArrowRight className="w-4 h-4" /> : null}
          <span>{selectedMosqueCode ? 'العودة لقائمة المساجد' : 'العودة للرئيسية'}</span>
        </button>
      </div>

      {!selectedMosqueCode ? (
        /* Mosque List View */
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto md:mx-0">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="ابحث عن اسم الجامع أو المسجد..." 
              className="w-full pr-12 pl-4 py-4 rounded-2xl border border-slate-200 focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/10 outline-none font-bold transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMosques.map((mosque) => {
              const photoCount = photos.filter(p => p.tags === mosque.mosque_code).length;
              return (
                <motion.div
                  key={mosque.mosque_code}
                  whileHover={{ y: -5 }}
                  onClick={() => handleMosqueClick(mosque.mosque_code)}
                  className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 cursor-pointer group hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#C5A059]/10 group-hover:text-[#C5A059] transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      {mosque.mosque_code}
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-[#003366] mb-2 group-hover:text-[#C5A059] transition-colors">
                    {mosque.المسجد}
                  </h3>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                      <ImageIcon className="w-4 h-4" />
                      <span>{photoCount} صورة</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-[-5px] transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredMosques.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <ImageIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-black text-slate-400">لا توجد نتائج للبحث</h3>
              <p className="text-slate-300 font-bold mt-2">جرب البحث بكلمات أخرى</p>
            </div>
          )}
        </div>
      ) : (
        /* Photos Grid View */
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-2 h-8 bg-[#C5A059] rounded-full"></div>
            <h3 className="text-2xl font-black text-[#003366]">صور {selectedMosqueName}</h3>
          </div>

          {mosquePhotos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {mosquePhotos.map((photo, idx) => (
                <motion.div
                  key={photo.public_id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative aspect-square rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all"
                  onClick={() => setSelectedPhoto(photo.secure_url)}
                >
                  <img 
                    src={photo.secure_url} 
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="text-white w-8 h-8" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <ImageIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-black text-slate-400">لا توجد صور متوفرة حالياً</h3>
              <p className="text-slate-300 font-bold mt-2">سيتم تحديث المعرض فور رفع الصور من الميدان</p>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedPhoto(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="w-10 h-10" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedPhoto}
              alt="Full view"
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              referrerPolicy="no-referrer"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotoGallery;
