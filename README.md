# منصة Kholasa - التلخيص الذكي

منصة احترافية لتلخيص المحاضرات باستخدام Gemini AI

## الخطوات السريعة:

### 1. ارفع على GitHub
- Repository جديد: `educational-platform`
- ارفع كل الملفات

### 2. انشر على Vercel
- Import من GitHub
- Framework: **Other**
- Output Directory: **public**
- Deploy

### 3. أضف المفتاح
- Settings → Environment Variables
- Name: `GEMINI_API_KEY`
- Value: `AIzaSyAcU27f5CeEMJ8i4LZw_onxMIQ3V9GglXw`
- اختر Production ✅
- Save → Redeploy

### 4. حدّث API_ENDPOINT
- في `public/index.html`
- غيّر: `const API_ENDPOINT='/api/analyze';`
- إلى: `const API_ENDPOINT='https://رابط-موقعك.vercel.app/api/analyze';`

## خلاص! موقعك جاهز 🎉

الميزات:
✅ تصميم احترافي نظيف
✅ دعم 3 مستويات تلخيص
✅ 5 نصائح دراسية
✅ 5 أسئلة تفاعلية
✅ كشف تلقائي للغة (عربي/إنجليزي)
✅ Gemini API مجاني وسريع
