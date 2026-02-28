import React, { useMemo } from 'react';
import { MosqueRecord, MosqueInfo } from '../types.ts';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import { 
  Users, Utensils, BookOpen, Heart, Presentation, 
  UsersRound, Award, Droplets, ArrowUpRight, TrendingUp, MapPin
} from 'lucide-react';

interface TrusteeDashboardProps {
  records: MosqueRecord[];
  mosques: MosqueInfo[];
  onBack: () => void;
}

const COLORS = ['#003366', '#0054A6', '#C5A059', '#ad8949', '#5a7b9c', '#1e293b'];

const ImpactCard = ({ title, value, icon, color, subtitle }: { title: string, value: number, icon: React.ReactNode, color: string, subtitle: string }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
    <div className="absolute top-0 right-0 w-1.5 h-full" style={{ backgroundColor: color }}></div>
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="flex items-center gap-1 text-[#C5A059]">
        <ArrowUpRight className="w-4 h-4" />
        <span className="text-[10px] font-black uppercase tracking-widest">مباشر</span>
      </div>
    </div>
    <h4 className="text-3xl font-black tabular-nums text-slate-800">{value.toLocaleString('ar-SA')}</h4>
    <div className="mt-2">
      <span className="text-sm font-black text-slate-400">{title}</span>
      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">{subtitle}</p>
    </div>
  </div>
);

const ProgressItem = ({ label, value, target, color }: { label: string, value: number, target: number, color: string }) => {
  const percentage = Math.min(Math.round((value / target) * 100), 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-black text-[#003366]">{label}</span>
        <span className="font-bold text-slate-400">{value.toLocaleString('ar-SA')} / {target.toLocaleString('ar-SA')}</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-1000 ease-out" 
          style={{ width: `${percentage}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
};

const MetricBox = ({ title, value, unit, beneficiaries, icon, color, beneficiaryLabel = "مستفيد" }: any) => (
  <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col gap-6">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
        {icon}
      </div>
      <h4 className="text-lg font-black text-[#003366]">{title}</h4>
    </div>
    <div className="flex items-end justify-between">
      <div>
        <div className="text-3xl font-black text-slate-800">{value.toLocaleString('ar-SA')}</div>
        <div className="text-xs font-bold text-slate-400">{unit}</div>
      </div>
      <div className="text-left">
        <div className="text-xl font-black" style={{ color }}>{beneficiaries.toLocaleString('ar-SA')}</div>
        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{beneficiaryLabel}</div>
      </div>
    </div>
  </div>
);

const LayoutGrid = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
);

const TrusteeDashboard: React.FC<TrusteeDashboardProps> = ({ records, mosques, onBack }) => {
  
  const stats = useMemo(() => {
    return records.reduce((acc, r) => {
      acc.totalWorshippers += (Number(r.عدد_المصلين_رجال) || 0) + (Number(r.عدد_المصلين_نساء) || 0);
      acc.totalMeals += (Number(r.عدد_وجبات_الافطار_فعلي) || 0);
      acc.totalWater += (Number(r.عدد_كراتين_ماء) || 0);
      acc.totalStudents += (Number(r.عدد_طلاب_الحلقات) || 0) + (Number(r.عدد_طالبات_الحلقات) || 0);
      acc.totalQuranPages += (Number(r.عدد_الاوجه_طلاب) || 0) + (Number(r.عدد_الاوجه_طالبات) || 0);
      acc.totalVolunteers += (Number(r.عدد_المتطوعين) || 0);
      acc.totalSupervisors += (Number(r["عدد المشرفين"]) || 0);
      acc.totalLectures += (Number(r.عدد_الكلمات_الرجالية) || 0) + (Number(r.عدد_الكلمات_النسائية) || 0);
      acc.totalLectureBeneficiaries += (Number(r.عدد_مستفيدي_الكلمات) || 0);
      acc.totalCommunityBeneficiaries += (Number(r.عدد_المستفيدين) || 0);
      return acc;
    }, {
      totalWorshippers: 0,
      totalMeals: 0,
      totalWater: 0,
      totalStudents: 0,
      totalQuranPages: 0,
      totalVolunteers: 0,
      totalSupervisors: 0,
      totalLectures: 0,
      totalLectureBeneficiaries: 0,
      totalCommunityBeneficiaries: 0
    });
  }, [records]);

  const mosqueDistribution = useMemo(() => {
    const data: { [key: string]: number } = {};
    records.forEach(r => {
      data[r.المسجد] = (data[r.المسجد] || 0) + (Number(r.عدد_وجبات_الافطار_فعلي) || 0);
    });
    return Object.entries(data)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [records]);

  const dailyGrowth = useMemo(() => {
    const data: { [key: string]: any } = {};
    records.forEach(r => {
      const day = r.label_day || 'غير محدد';
      if (!data[day]) {
        data[day] = { name: day, worshippers: 0, meals: 0, lectures: 0, lectureBeneficiaries: 0 };
      }
      data[day].worshippers += (Number(r.عدد_المصلين_رجال) || 0) + (Number(r.عدد_المصلين_نساء) || 0);
      data[day].meals += (Number(r.عدد_وجبات_الافطار_فعلي) || 0);
      data[day].lectures += (Number(r.عدد_الكلمات_الرجالية) || 0) + (Number(r.عدد_الكلمات_النسائية) || 0);
      data[day].lectureBeneficiaries += (Number(r.عدد_مستفيدي_الكلمات) || 0);
    });
    return Object.values(data);
  }, [records]);

  return (
    <div className="space-y-8 animate-in fade-in text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <h2 className="text-3xl font-black text-[#003366]">تقرير مجلس الأمناء 🏛️</h2>
          <p className="text-slate-500 font-bold mt-1">عرض استراتيجي لحجم الأثر والعمل الميداني - رمضان 1447هـ</p>
        </div>
        <button 
          onClick={onBack}
          className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black hover:bg-slate-200 transition-all flex items-center gap-2"
        >
          <span>العودة للرئيسية</span>
        </button>
      </div>

      {/* High Level Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ImpactCard 
          title="إجمالي المستفيدين" 
          value={stats.totalWorshippers + stats.totalCommunityBeneficiaries + stats.totalLectureBeneficiaries} 
          icon={<Users className="w-6 h-6" />} 
          color="#003366"
          subtitle="أثر مجتمعي مباشر"
        />
        <ImpactCard 
          title="وجبات الإفطار" 
          value={stats.totalMeals} 
          icon={<Utensils className="w-6 h-6" />} 
          color="#C5A059"
          subtitle="إطعام صائم"
        />
        <ImpactCard 
          title="أوجه القرآن المنجزة" 
          value={stats.totalQuranPages} 
          icon={<BookOpen className="w-6 h-6" />} 
          color="#0054A6"
          subtitle="حلقات التحفيظ"
        />
        <ImpactCard 
          title="القوى البشرية" 
          value={stats.totalVolunteers + stats.totalSupervisors} 
          icon={<UsersRound className="w-6 h-6" />} 
          color="#5a7b9c"
          subtitle="متطوع ومشرف"
        />
      </div>

      {/* Strategic Meal Distribution - Highlighted Section */}
      <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#003366] via-[#C5A059] to-[#003366]"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#C5A059]/10 rounded-2xl flex items-center justify-center text-[#C5A059]">
              <Utensils className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#003366]">التوزيع الاستراتيجي لوجبات الإفطار</h3>
              <p className="text-slate-400 font-bold">تحليل حصص التوزيع لأعلى 10 مواقع ميدانية</p>
            </div>
          </div>
          <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
            <span className="text-sm font-bold text-slate-500 ml-2">إجمالي الوجبات الموزعة:</span>
            <span className="text-2xl font-black text-[#C5A059]">{stats.totalMeals.toLocaleString('ar-SA')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-3 h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mosqueDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={110}
                  outerRadius={160}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  className="outline-none"
                >
                  {mosqueDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      className="transition-all duration-300 hover:opacity-80 cursor-pointer outline-none"
                      style={{ outline: 'none' }}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const total = stats.totalMeals;
                      const percentage = ((data.value / total) * 100).toFixed(1);
                      return (
                        <div className="bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].color }}></div>
                            <span className="font-black text-[#003366] text-lg">{data.name}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between gap-8">
                              <span className="text-slate-400 font-bold text-sm">عدد الوجبات:</span>
                              <span className="font-black text-[#003366]">{data.value.toLocaleString('ar-SA')}</span>
                            </div>
                            <div className="flex justify-between gap-8">
                              <span className="text-slate-400 font-bold text-sm">النسبة من الإجمالي:</span>
                              <span className="font-black text-[#C5A059]">{percentage}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-lg font-black text-[#003366] mb-6 border-r-4 border-[#C5A059] pr-4">قائمة الصدارة (Top 10)</h4>
            {mosqueDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-xs font-black text-[#003366] border border-slate-100">
                    {index + 1}
                  </span>
                  <span className="font-bold text-slate-700 text-sm">{item.name}</span>
                </div>
                <div className="text-left">
                  <div className="font-black text-[#003366]">{item.value.toLocaleString('ar-SA')}</div>
                  <div className="text-[10px] font-bold text-[#C5A059] uppercase tracking-tighter">وجبة</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 1 - Daily Growth Only */}
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#003366]/10 rounded-xl flex items-center justify-center text-[#003366]">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-[#003366]">نمو الأثر اليومي</h3>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyGrowth}>
                <defs>
                  <linearGradient id="colorWorshippers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#003366" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#003366" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMeals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="top" align="right" height={36}/>
                <Area type="monotone" dataKey="worshippers" name="المصلين" stroke="#003366" strokeWidth={3} fillOpacity={1} fill="url(#colorWorshippers)" />
                <Area type="monotone" dataKey="meals" name="الوجبات" stroke="#C5A059" strokeWidth={3} fillOpacity={1} fill="url(#colorMeals)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Human Capital & Educational Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#0054A6]/10 rounded-xl flex items-center justify-center text-[#0054A6]">
              <UsersRound className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-[#003366]">القوى البشرية الميدانية</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'المتطوعين', value: stats.totalVolunteers, color: '#0054A6' },
                { name: 'المشرفين', value: stats.totalSupervisors, color: '#C5A059' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  <Cell fill="#0054A6" />
                  <Cell fill="#C5A059" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#C5A059]/10 rounded-xl flex items-center justify-center text-[#C5A059]">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-[#003366]">تقدم الحلقات القرآنية</h3>
          </div>
          <div className="space-y-6">
            <ProgressItem label="إجمالي الطلاب والطالبات" value={stats.totalStudents} target={5000} color="#003366" />
            <ProgressItem label="الأوجه المنجزة" value={stats.totalQuranPages} target={10000} color="#C5A059" />
            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">متوسط الإنجاز لكل طالب</span>
                <span className="text-lg font-black text-[#003366]">
                  {stats.totalStudents > 0 ? (stats.totalQuranPages / stats.totalStudents).toFixed(1) : 0} وجه
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricBox 
          title="البرامج الدعوية" 
          value={stats.totalLectures} 
          unit="محاضرة"
          beneficiaries={stats.totalLectureBeneficiaries}
          icon={<Presentation className="w-5 h-5" />}
          color="#0054A6"
        />
        <MetricBox 
          title="الخدمات اللوجستية" 
          value={stats.totalWater} 
          unit="كرتون ماء"
          beneficiaries={stats.totalWater * 40} // Approx bottles
          beneficiaryLabel="عبوة ماء"
          icon={<Droplets className="w-5 h-5" />}
          color="#C5A059"
        />
        <MetricBox 
          title="البرامج المجتمعية" 
          value={records.filter(r => r.البرنامج_المجتمعي).length} 
          unit="برنامج"
          beneficiaries={stats.totalCommunityBeneficiaries}
          icon={<Heart className="w-5 h-5" />}
          color="#003366"
        />
      </div>

      {/* Mosque Performance Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#003366]/10 rounded-xl flex items-center justify-center text-[#003366]">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-[#003366]">توزيع الأداء حسب المواقع</h3>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mosqueDistribution} layout="vertical" margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#003366', fontWeight: 900, fontSize: 12}} width={150} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" name="الوجبات" radius={[0, 10, 10, 0]}>
                  {mosqueDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#0054A6]/10 rounded-xl flex items-center justify-center text-[#0054A6]">
              <Presentation className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-[#003366]">الأثر الدعوي (المحاضرات)</h3>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyGrowth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700}} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="lectures" name="المحاضرات" stroke="#0054A6" strokeWidth={4} dot={{ r: 6, fill: '#0054A6' }} />
                <Line type="monotone" dataKey="lectureBeneficiaries" name="المستفيدين" stroke="#C5A059" strokeWidth={4} dot={{ r: 6, fill: '#C5A059' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="bg-[#003366] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-40 h-40 border-8 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 border-8 border-white rounded-full"></div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4">
            <h4 className="text-2xl font-black">ملخص الأداء الاستراتيجي</h4>
            <p className="text-white/70 font-medium max-w-xl">
              تعكس هذه الأرقام التزام المؤسسة بتقديم أفضل الخدمات لضيوف الرحمن والمستفيدين خلال شهر رمضان المبارك، مع التركيز على الجودة والأثر المستدام.
            </p>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-4xl font-black text-[#C5A059]">{mosques.length}</div>
              <div className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1">موقع ميداني</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-[#C5A059]">{stats.totalSupervisors}</div>
              <div className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1">مشرف معتمد</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrusteeDashboard;
