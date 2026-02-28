
import React, { useState, useEffect } from 'react';
import { mosqueApi } from './services/api.ts';
import { MosqueRecord, MaintenanceRecord, PhotoRecord, MosqueInfo, DayInfo, FastEvalRecord, VisitRecord } from './types.ts';
import Dashboard from './components/Dashboard.tsx';
import WelcomePage from './components/WelcomePage.tsx';
import { TrendingUp, TrendingDown, Minus, BarChart3, MapPin, Calendar, LayoutGrid, Lock, Unlock } from 'lucide-react';
import ActivityReports from './components/ActivityReports.tsx';
import TrusteeDashboard from './components/TrusteeDashboard.tsx';

type ViewState = 'dashboard' | 'reports' | 'trustee_dashboard';

const App: React.FC = () => {
  const [isPlatformEntered, setIsPlatformEntered] = useState(false);
  const [view, setView] = useState<ViewState>('dashboard');
  const [records, setRecords] = useState<MosqueRecord[]>([]);
  const [photosList, setPhotosList] = useState<PhotoRecord[]>([]);
  const [mosquesList, setMosquesList] = useState<MosqueInfo[]>([]);
  const [daysList, setDaysList] = useState<DayInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await mosqueApi.getAll();
      if (response && response.success && response.sheets) {
        setRecords(response.sheets.daily_mosque_report || []);
        setPhotosList(response.sheets.photo || []);
        setMosquesList(response.sheets.mosque || []);
        setDaysList(response.sheets.Dayd || []);
      }
    } catch (error) {
      showNotification('خطأ في تحميل البيانات', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPlatformEntered) {
      fetchData();
    }
  }, [isPlatformEntered]);

  useEffect(() => {
    (window as any).setView = setView;
  }, []);

  const handleAdminLogin = () => {
    if (adminPassInput === 'admin123') {
      setIsAdmin(true);
      setShowAdminModal(false);
      setAdminPassInput('');
      showNotification('تم تسجيل دخول المسؤول بنجاح', 'success');
    } else {
      showNotification('كلمة المرور غير صحيحة', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = async (data: any) => {
    setLoading(true);
    try {
      let payload = { ...data };
      // Only add 'الاعتماد' for specific sheets if the user is not an admin.
      // Other sheets like 'Visit' and 'Fast_eval' do not have this field.
      if (!isAdmin && (data.sheet === 'daily_mosque_report' || data.sheet === 'Maintenance_Report')) {
        payload.الاعتماد = 'قيد المراجعة';
      }

      const result = await mosqueApi.save(payload);
      if (result.success) {
        showNotification('تم المزامنة بنجاح', 'success');
        setView('dashboard');
        setTimeout(async () => { await fetchData(); }, 1500);
      } else {
        throw new Error('API returned success: false');
      }
    } catch (error) {
      showNotification('فشل في الاتصال بالقاعدة أو تحديث الحالة', 'error');
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    setView('dashboard');
  };

    const approvedRecords = records.filter(r => r.الاعتماد === 'يعتمد' || r.الاعتماد === 'معتمد');

  if (!isPlatformEntered) {
    return <WelcomePage onEnter={() => setIsPlatformEntered(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-['Tajawal'] text-right" dir="rtl">
      {showAdminModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#003366]/60 backdrop-blur-sm" onClick={() => setShowAdminModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in">
            <div className="text-center space-y-4 mb-8">
              <div className="w-16 h-16 bg-[#C5A059]/10 text-[#C5A059] rounded-2xl flex items-center justify-center text-3xl mx-auto">🔐</div>
              <h2 className="text-2xl font-black text-[#003366]">دخول المسؤول</h2>
              <p className="text-slate-500 text-sm font-bold">يرجى إدخال كلمة المرور للوصول لصلاحيات الاعتماد</p>
            </div>
            <input 
              type="password" 
              value={adminPassInput}
              onChange={(e) => setAdminPassInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              placeholder="كلمة المرور"
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl mb-6 outline-none focus:border-[#0054A6] text-center font-black tracking-widest"
              autoFocus
            />
            <div className="flex gap-4">
              <button onClick={handleAdminLogin} className="flex-1 bg-[#0054A6] text-white py-4 rounded-2xl font-black shadow-lg hover:bg-[#003366] transition-all">دخول</button>
              <button onClick={() => setShowAdminModal(false)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black">إلغاء</button>
            </div>
          </div>
        </div>
      )}

            <header className="bg-[#003366] text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-white p-1 rounded shadow-sm">
              <img src="https://next.rajhifoundation.org/files/52c533df-1.png" alt="شعار الراجحي" className="h-6 md:h-8" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-black text-sm md:text-base leading-none">رمضان 1447هـ</h1>
              <p className="text-[7px] text-[#C5A059] uppercase tracking-tighter font-black mt-0.5">مؤسسة الراجحي الخيرية</p>
            </div>
          </div>

          <nav className="flex items-center bg-white/10 rounded-xl p-0.5 gap-0.5 border border-white/5 overflow-x-auto no-scrollbar">
            <button onClick={() => setView('dashboard')} className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${view === 'dashboard' ? 'bg-[#0054A6] text-white shadow-md' : 'text-white/60 hover:text-white'}`}>الرئيسية</button>
            <button onClick={() => setView('reports')} className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${view === 'reports' ? 'bg-[#0054A6] text-white shadow-md' : 'text-white/60 hover:text-white'}`}>التقارير</button>
            <button onClick={() => setView('trustee_dashboard')} className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${view === 'trustee_dashboard' ? 'bg-[#C5A059] text-white shadow-md' : 'text-white/60 hover:text-white'}`}>مجلس الأمناء</button>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <div className="relative group">
              {!isAdmin ? (
                <button 
                  onClick={() => setShowAdminModal(true)} 
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all border border-white/5"
                >
                  <Lock className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={() => setIsAdmin(false)} 
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-all border border-red-500/20"
                >
                  <Unlock className="w-4 h-4" />
                </button>
              )}
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-800 text-white text-[8px] font-black rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60]">
                {!isAdmin ? 'دخول المسؤول' : 'خروج المسؤول'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {notification && (
        <div className={`fixed top-28 left-1/2 transform -translate-x-1/2 z-[60] px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-3 animate-in ${notification.type === 'success' ? 'bg-[#0054A6] text-white' : 'bg-red-600 text-white'}`}>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            {notification.type === 'success' ? '✓' : '!'}
          </div>
          <span className="font-bold">{notification.message}</span>
        </div>
      )}

      {loading && isPlatformEntered && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-xl z-[90] flex flex-col items-center justify-center text-center">
          <div className="relative bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 mb-4">
             <div className="w-16 h-16 border-4 border-[#C5A059] border-t-[#0054A6] rounded-full animate-spin"></div>
          </div>
          <p className="text-[#003366] text-xl font-black">جاري المعالجة...</p>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8 animate-in">
        {view === 'dashboard' && (
          <Dashboard 
            records={approvedRecords} 
            mosques={mosquesList} 
            days={daysList} 
            photos={photosList}
            onNavigateToTrustee={() => setView('trustee_dashboard')}
          />
        )}
        {view === 'reports' && (
          <ActivityReports
            records={approvedRecords}
            mosques={mosquesList}
            days={daysList}
            onBack={() => setView('dashboard')}
          />
        )}
        {view === 'trustee_dashboard' && (
          <TrusteeDashboard
            records={approvedRecords}
            mosques={mosquesList}
            onBack={() => setView('dashboard')}
          />
        )}
      </main>
    </div>
  );
};

export default App;