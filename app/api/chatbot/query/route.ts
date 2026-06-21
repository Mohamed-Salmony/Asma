import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
};

const SYSTEM_INSTRUCTIONS = `
You are the official AI Customer Support Assistant for ASMA Advanced Technology (AAT), a customized digital agency based in Riyadh (CR 7003024853).
Your job is to answer all client questions accurately and concisely using our official website details provided below. Keep answers professional, exciting, and extremely polite.
Respond in the user's input language (Arabic or English).

OFFICIAL AAT REVELATIONS & CONTEXT:
- Establishment: Riyadh in 2009. Registered CR No. 7003024853. Partners of Saudi Digital Vision 2030 excellence.
- Address Headquarters: Office 106, Al Khaleejiah Center, Izdhar District, Riyadh, Saudi Arabia.
- Agency Mission: We transform ideas into highly rapid, beautiful, cloud-scale, and secure digital realities.

CORE COMPETE SERVICES:
1. Web Development Platforms: Headless SEO, custom e-commerce clients, secure react/next rendering.
2. Mobile iOS & Android Apps: Native single-velocity Flutter interfaces, biometric locks, offline state managers.
3. Desktop & ERP Software Systems: WPF / .NET stack warehouse management, localized digital invoicing and tax reporting in Saudi Arabia.
4. AI Integration & CRM Automation: Custom LLMs, workflow agents, Power BI business dashboards.
5. Marketing Strategy: Maps SEO, targeted paid PPC loops, conversion copywriting.
6. Industrial Design & Motion Branding: Elegant style guidelines, corporate animated explainer videos.

BUDGET PLANS:
- Starter Package (10,000 - 18,000 SAR): 1-5 landing page responsive website, bespoke CMS panel, 3 months upkeep support.
- Growth Package (30,000 - 55,000 SAR): Flutter iOS/Android app, customized admin reporting portal, 12 months premium prioritization support.
- Enterprise Custom (60,000+ SAR): Relay databases, cloud scalability, sophisticated AI pipelines, legacy ERP syncing systems.

PORTFOLIO & TRACK RECORD:
- Riyadh Logistics Grid (atomic state tracking hub, 45% latency reduction).
- Al-Ma'aly Financial Client (highly secure biometrics investment tracking application in Flutter).
- Sovereign Industrial ERP (synchronized multi-warehouse desktop console).
- Saudi Medical Extraction AI (patient clinical PDF summaries scanner).
- Tamkeen E-Academy Portal (bilingual academy course dispatcher with 10K+ parallel logs).
- Desert Bloom Digital Engine (Riyadh localized PPC trend tracker scheduler).

RULES OF RETRIEVAL:
- Only answer with authentic company details. Do NOT invent values, team members, or options.
- If you don't know the answer, politely tell them to submit a project inquiry using our "Contact" form or click "WhatsApp Support" for direct humans chat.
- Frame yourself as an integrated agent of ASMA Advanced Technology (AAT).
`;

export async function POST(req: NextRequest) {
  try {
    const { message, language } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing required message field" }, { status: 400 });
    }

    console.log(`Received chat request in lang=${language || "en"}: "${message.substring(0, 100)}"`);

    const ai = getGeminiClient();
    if (!ai) {
      console.warn("GEMINI_API_KEY environment variable is not defined - executing pre-programmed offline knowledge base.");
      
      let simulatedAnswer = "";
      const lowerMsg = message.toLowerCase();

      if (lowerMsg.includes("service") || lowerMsg.includes("offer") || lowerMsg.includes("services") || lowerMsg.includes("خدمات")) {
        simulatedAnswer = language === "ar" 
          ? "نحن نقدم باقة من الخدمات الاحترافية: 1. تطوير المنصات والمواقع الإلكترونية، 2. تطبيقات الهواتف الذكية (Flutter)، 3. أنظمة الشركات والـ ERP (.NET)، 4. حلول الذكاء الاصطناعي والأتمتة، 5. التسويق الرقمي والسماح بظهور المواقع، 6. الهوية البصرية والموشن جرافيكس."
          : "We design premium digital solutions: 1. Web Development, 2. Cross-platform Mobile Apps (Flutter), 3. Desktop & ERP Systems (.NET), 4. AI & Automations, 5. Digital Marketing, 6. Motion Graphics & Branding.";
      } else if (lowerMsg.includes("price") || lowerMsg.includes("package") || lowerMsg.includes("cost") || lowerMsg.includes("سعر") || lowerMsg.includes("باقة")) {
        simulatedAnswer = language === "ar"
          ? "باقاتنا الاستثمارية تتوزع كالتالي: الباقة القياسية (Starter) تبدأ من 10k-18k ريال، باقة النمو (Growth) تبدأ من 30k-55k ريال، أما الباقة المخصصة للمؤسسات (Enterprise) فتبدأ من 60k ريال وتتكامل مع قواعد البيانات الضخمة وأنظمة الـ ERP."
          : "Our investment tiers are: Starter Package (10K - 18K SAR), Growth Package (30K - 55K SAR), and Enterprise Custom (60K+ SAR) with advanced DB and legacy systems integration.";
      } else if (lowerMsg.includes("contact") || lowerMsg.includes("address") || lowerMsg.includes("where") || lowerMsg.includes("مكان") || lowerMsg.includes("عنوان")) {
        simulatedAnswer = language === "ar"
          ? "مقرنا الرئيسي يقع في مدينة الرياض: مكتب 106، مركز الخليجية، حي الازدهار، الرياض، المملكة العربية السعودية. الترخيص التجاري رقم 7003024853."
          : "Our premium Riyadh headquarters is located at Office 106, Al Khaleejiah Center, Izdhar District, Riyadh, Saudi Arabia (CR No. 7003024853).";
      } else {
        simulatedAnswer = language === "ar"
          ? "شكراً لتواصلك مع آية (AAT AI). نحن شركة تقنية رائدة بالرياض متخصصة في التحول الرقمي وفق رؤية 2030. هل ترغب بالشرح المفصل لأحد خدماتنا أو ترغب في بدء مشروع جديد؟"
          : "Thank you for reaching out to ASMA Advanced Technology (AAT). We are a leading Riyadh-based tech agency driving Saudi Vision 2030 transformations. What specific services, packages, or portfolio projects can I guide you through today?";
      }

      return NextResponse.json({ answer: simulatedAnswer, isSimulated: true });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        temperature: 0.7,
        topP: 0.95
      }
    });

    const reply = response.text || "I was unable to synthesize a proper answer at this moment. Please reach out to our manual contact support.";
    return NextResponse.json({ answer: reply, isSimulated: false });

  } catch (err: any) {
    console.error("Gemini chatbot routine error:", err);
    return NextResponse.json({ error: err.message || "Internal server generative failure" }, { status: 500 });
  }
}
