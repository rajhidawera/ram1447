
import { GoogleGenAI } from "@google/genai";
import { MosqueRecord } from "../types.ts";

export const analyzeFieldData = async (records: MosqueRecord[]) => {
  if (!records || records.length === 0) return "لا توجد بيانات كافية للتحليل حالياً.";
  
  const dataSummary = records.map(r => ({
    mosque: r.المسجد,
    attendance: (Number(r.عدد_المصلين_رجال || 0) + Number(r.عدد_المصلين_نساء || 0)),
    meals: r.عدد_وجبات_الافطار_فعلي,
    notes: r.ملاحظات,
    status: r.الاعتماد
  }));

  const prompt = `
    أنت محلل بيانات ذكي لمشاريع رمضان. حلل البيانات التالية لعدد من المساجد وقدم تقريراً تنفيذياً باللغة العربية:
    - لخص الحالة العامة للميدان.
    - استخرج أي مشاكل أو ملاحظات سلبية تتكرر في المساجد (مثل نقص المياه، ازدحام، ملاحظات صيانة).
    - قدم 3 توصيات ذكية للمشرفين لتحسين التجربة غداً.
    
    البيانات: ${JSON.stringify(dataSummary)}
  `;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return "تنبيه: مفتاح API الخاص بـ Gemini غير متوفر. يرجى التأكد من إعداد البيئة بشكل صحيح.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "أنت مساعد إداري ذكي لمؤسسة عبدالله الراجحي الخيرية. كن دقيقاً، مهنياً، ومختصراً في نقاط واضحة.",
        temperature: 0.7,
      },
    });

    return response.text ?? "";
  } catch (error) {
    console.error("AI Error:", error);
    return "حدث خطأ أثناء محاولة تحليل البيانات ذكياً. يرجى مراجعة التقارير يدوياً.";
  }
};

export const analyzeTrends = async (chartData: any[], type: 'iftar' | 'worshippers') => {
  if (!chartData || chartData.length === 0) return "لا توجد بيانات كافية لتحليل الاتجاهات.";

  const prompt = `
    أنت خبير تحليل بيانات. حلل اتجاهات النمو التالية لـ ${type === 'iftar' ? 'وجبات الإفطار' : 'أعداد المصلين'} في مساجد مؤسسة الراجحي:
    - صف نمط النمو (تصاعدي، متذبذب، مستقر).
    - حدد أيام الذروة وأيام الانخفاض.
    - توقع الاحتياجات للأيام القادمة بناءً على هذا النمط.
    - قدم نصيحة استراتيجية واحدة لتحسين الكفاءة.

    البيانات: ${JSON.stringify(chartData)}
  `;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return "مفتاح API غير متوفر.";

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "أنت محلل استراتيجي لمؤسسة خيرية. قدم تحليلاً بيانياً عميقاً ومفيداً باللغة العربية.",
        temperature: 0.5,
      },
    });

    return response.text ?? "";
  } catch (error) {
    console.error("AI Trend Error:", error);
    return "فشل في تحليل الاتجاهات ذكياً.";
  }
};
