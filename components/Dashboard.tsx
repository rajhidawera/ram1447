
import React, { useState } from 'react';
import { MosqueRecord, MosqueInfo, DayInfo, PhotoRecord } from '../types.ts';
import ImageSlider from './ImageSlider.tsx';
import { ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  records: MosqueRecord[];
  mosques: MosqueInfo[];
  days: DayInfo[];
  photos: PhotoRecord[];
  onNavigateToTrustee: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ records, mosques, days, photos, onNavigateToTrustee }) => {
    const totalWorshippers = records.reduce((sum, r) => {
    const men = parseInt(String(r.عدد_المصلين_رجال), 10) || 0;
    const women = parseInt(String(r.عدد_المصلين_نساء), 10) || 0;
    return sum + men + women;
  }, 0);
    const totalIftarMeals = records.reduce((sum, r) => {
    const meals = parseInt(String(r.عدد_وجبات_الافطار_فعلي), 10) || 0;
    return sum + meals;
  }, 0);
    const totalStudents = records.reduce((sum, r) => {
    const maleStudents = parseInt(String(r.عدد_طلاب_الحلقات), 10) || 0;
    const femaleStudents = parseInt(String(r.عدد_طالبات_الحلقات), 10) || 0;
    return sum + maleStudents + femaleStudents;
  }, 0);

  return (
    <div className="space-y-10 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-[#003366]">مرحباً بك 🌙</h2>
          <p className="text-[#5a7b9c] font-bold mt-2">بوابة الميدان - مؤسسة عبدالله الراجحي الخيرية</p>
        </div>

        <div className="bg-white p-5 rounded-[2.5rem] shadow-2xl border-2 border-[#C5A059]/10 flex flex-col items-center gap-3 hover:scale-105 transition-all duration-300 group">
          <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center overflow-hidden border-2 border-slate-50 shadow-inner relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#003366]/5 to-transparent pointer-events-none"></div>
            <img 
              src="https://res.cloudinary.com/domimvikq/image/upload/v1771792001/Qq2mkLQtzasD479_ryol7f.png" 
              alt="QR Code" 
              className="w-full h-full object-contain relative z-10 p-1"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-[#003366] uppercase tracking-[0.2em]">الوصول السريع</span>
            <div className="h-1 w-8 bg-[#C5A059] rounded-full mt-1 group-hover:w-12 transition-all"></div>
          </div>
        </div>
      </div>

      <ImageSlider photos={photos} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button onClick={onNavigateToTrustee} className="md:col-span-3 bg-[#003366] p-10 rounded-[3rem] shadow-2xl shadow-[#003366]/20 text-white flex flex-col md:flex-row items-center justify-between gap-8 group hover:scale-[1.02] transition-all border-b-8 border-[#C5A059]">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center text-4xl group-hover:rotate-12 transition-transform">🏛️</div>
            <div className="text-right">
              <h3 className="text-2xl font-black">عرض مجلس الأمناء</h3>
              <p className="text-white/60 font-bold mt-1">تقارير استراتيجية، مؤشرات الأداء، وحجم الأثر الميداني</p>
            </div>
          </div>
          <div className="px-8 py-4 bg-[#C5A059] rounded-2xl font-black shadow-lg group-hover:px-10 transition-all flex items-center gap-2">
            <span>دخول العرض الاستراتيجي</span>
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </button>
        <StatCard label="إجمالي المصلين" value={totalWorshippers} color="#0054A6" icon="👥" />
        <StatCard label="وجبات الإفطار" value={totalIftarMeals} color="#C5A059" icon="🍱" />
        <StatCard label="طلاب الحلقات" value={totalStudents} color="#003366" icon="📖" />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color, icon }: { label: string, value: number, color: string, icon: string }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className="absolute top-0 right-0 w-2 h-full" style={{ backgroundColor: color }}></div>
    <div className="flex items-center justify-between mb-4">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</span>
      <span className="text-xl">{icon}</span>
    </div>
    <h4 className="text-4xl font-black tabular-nums" style={{ color }}>{value.toLocaleString('ar-SA')}</h4>
  </div>
);

export default Dashboard;
