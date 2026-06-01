1. Proje Başlığı ve Tanımı
Projenin adı, logosu ve kısa bir özet vizyon cümlesiyle başlar. ASYA (Yyapay Zeka Destekli Akıllı Sağlık Asistanı ve Modern Workspace) uygulamasının; takımların günlük mühendislik görevlerini yönettikleri bir Kanban panosu ile bireysel sağlık, beslenme ve portföy yönetimlerini entegre eden merkezi bir ekosistem olduğu belirtilir.

2. Temel Özellikler (Core Features)
Uygulamanın sunduğu fonksiyonel yetenekler kullanıcı odaklı bir dille listelenmiştir:

Kanban Board: Sürükle-bırak destekli görev takip mekanizması, önceliklendirme ve gelişmiş filtreleme.

Yapay Zeka Destekli Sohbet: Google Gemini altyapısıyla günlük yol haritası (roadmap) planlama ve genel asistanlık çözümleri.

Sağlık ve Beslenme Modülü: Tıbbi danışmanlık yönlendirmeleri, semptom analizi ve kalori takibi.

Yatırım ve Portföy: Varlık yönetimi, kar/zarar analizi ve finansal bakiye simülasyonu.

3. Kullanılan Teknolojiler (Tech Stack)
Backend: Python 3.10+, Flask Web Framework, Flask-SQLAlchemy (SQLite), Flask-CORS, PyJWT (Kimlik Doğrulama), python-dotenv.

Frontend: Vanilla JavaScript (Modüler MVC Mimari Yapısı), CSS3 (Flexbox & Grid Yapısı), HTML5.

AI Engine: Google Gemini Pro Api (google-genai kütüphanesi).

4. Adım Adım Kurulum ve Çalıştırma Talimatları
Projenin yerel ortamda (localhost) sorunsuz ayağa kaldırılabilmesi için mimari ayrımı gözetilerek hazırlanan adımlar:

Backend Kurulumu:


# 1. Projenin klonlanması
git clone https://github.com/efecanbostanci/asya-workspace.git
cd asya-workspace/backend

# 2. Sanal ortamın (Virtual Environment) oluşturulması ve aktifleştirilmesi
python -m venv venv
source venv/Scripts/activate  # Windows için: venv\Scripts\activate

# 3. Bağımlılıkların yüklenmesi
pip install -r requirements.txt

# 4. Ortam değişkenlerinin yapılandırılması (.env dosyası oluşturulması)
# backend/ dizini altında .env dosyası açılarak aşağıdaki anahtar eklenir:
GEMINI_API_KEY=your_google_gemini_api_key_here

# 5. Sunucunun başlatılması
python app.py
Frontend Çalıştırma:
Uygulama Tek Sayfa Uygulama (SPA) mimarisinde olduğu için frontend dizinindeki index.html dosyasının herhangi bir modern tarayıcıda (Chrome, Edge, Firefox) açılmasının veya bir Live Server eklentisiyle (port 5500) çalıştırılmasının yeterli olduğu bilgisi eklenmiştir.

5. Ekip Üyeleri ve Rol Dağılımı
Geliştirme sürecindeki roller açıkça tanımlanmıştır:

Efe Can BOSTANCI: Proje Yöneticisi & Full-Stack Geliştirici (Sağlık ve Yatırım Modülleri, JS Core Mimarisi).

Veysel BİNGÖL: Arka Plan (Backend) ve Yapay Zeka Mimarı (API Entegrasyonları, Veritabanı İlişkileri).

Enes DİNÇASLAN: Ön Yüz (Frontend) & UI/UX Geliştirici (Dashboard İstatistikleri, Arayüz Bileşenleri).
