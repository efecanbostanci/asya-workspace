import json
import random
from flask import Blueprint, request, jsonify
from models import db, Task
from core.security import token_required
from services.ai_service import AIService

ai_chat_bp = Blueprint('ai_chat_bp', __name__)

@ai_chat_bp.route('/chat', methods=['POST'])
@token_required
def asya_chat_agent(current_user):
    data = request.json
    user_message = data.get('message', '')

    prompt = f"""
    Sen Asya adında profesyonel, zeki ve yardımsever bir kişisel asistansın.
    Görevin, kullanıcının girdiği metni analiz etmek ve SADECE aşağıdaki JSON formatında yanıt vermektir. Hiçbir ekstra açıklama, selamlama veya markdown işareti kullanma.

    1. Kullanıcı bir görev eklemek istiyorsa:
    {{"action": "add_task", "title": "Çıkarılan Görev Adı", "priority": "high", "reply": "Onay mesajı"}}

    2. Kullanıcı tüm görevleri silmek istiyorsa:
    {{"action": "clear_all", "reply": "Onay mesajı"}}

    3. Sadece sohbet ediyorsa:
    {{"action": "chat", "reply": "Doğal sohbet cevabı"}}

    Kullanıcı mesajı: "{user_message}"
    """

    try:
        raw_text = AIService.generate_response(prompt)
        clean_text = raw_text.replace('```json', '').replace('```', '').strip()
        intent = json.loads(clean_text)
        
        data_changed = False
        if intent.get("action") == "add_task":
            new_task = Task(user_id=current_user.id, title=intent.get("title", "Yeni Görev"), priority=intent.get("priority", "medium"), status='todo', checklist='[]')
            db.session.add(new_task)
            db.session.commit()
            data_changed = True
        elif intent.get("action") == "clear_all":
            Task.query.filter_by(user_id=current_user.id).delete()
            db.session.commit()
            data_changed = True

        return jsonify({"reply": intent.get("reply", "Tam anlayamadım."), "dataChanged": data_changed})

    except Exception as e:
        print(f"\n[!!!] ASYA CHAT HATASI: {str(e)}\n")
        return jsonify({"reply": "Şu an bağlantımda bir sorun var.", "dataChanged": False})

@ai_chat_bp.route('/api/health/chat', methods=['POST'])
@token_required
def health_chat(current_user):
    data = request.json
    user_msg = data.get('message', '')

    prompt = f"""
    Sen, sağlık okuryazarlığını artırmak ve hastanelerdeki gereksiz yoğunluğu azaltmak için geliştirilmiş yapay zeka destekli bir 'Sağlık Asistanısın'.
    
    GÖREVLERİN:
    1. Kullanıcının girdiği semptomları doğal dil işleme mantığıyla analiz et.
    2. Semptomların olası basit nedenleri hakkında güvenilir ve bilgilendirici genel sağlık bilgileri sun.
    3. Eğer belirtiler ciddi, şiddetli veya günlerdir sürüyorsa, kullanıcıyı HANGİ POLİKLİNİĞE (örn: Dahiliye, KBB, Nöroloji) gitmesi gerektiği konusunda uygun sağlık kurumlarına yönlendir.
    
    KURALLAR:
    - Kesinlikle "Senin şu hastalığın var" diyerek TIBBİ TEŞHİS KOYMA. 
    - Şefkatli, profesyonel ve kullanıcı dostu bir dil kullan.
    - JSON kullanma, doğrudan doğal ve okunaklı bir Türkçe paragraf ile yanıt ver.
    - Yanıtının en sonuna mutlaka şu yasal uyarıyı ekle: "Yasal Uyarı: Bu sistem tıbbi teşhis koymaz, sadece bilgilendirme ve yönlendirme amacı taşır. Lütfen kesin tanı için bir hekime başvurun."
    
    Kullanıcı mesajı: "{user_msg}"
    """

    try:
        reply = AIService.generate_response(prompt)
        return jsonify({"reply": reply})
    except Exception as e:
        print(f"\n[!!!] SAĞLIK CHAT HATASI: {str(e)}\n")
        return jsonify({"reply": "Üzgünüm, şu an analiz sistemime ulaşılamıyor. Acil bir durumunuz varsa lütfen en yakın sağlık kuruluşuna başvurun."})

@ai_chat_bp.route('/api/health/foods', methods=['GET'])
def search_foods():
    query = request.args.get('q', '').lower()
    
    food_db = [
        {"id": 1, "name": "Haşlanmış Yumurta", "unit": "1 Adet", "calories": 78},
        {"id": 2, "name": "Yulaf Ezmesi", "unit": "100 gr", "calories": 389},
        {"id": 3, "name": "Tam Buğday Ekmeği", "unit": "1 Dilim", "calories": 69},
        {"id": 4, "name": "Elma", "unit": "1 Orta Boy", "calories": 95},
        {"id": 5, "name": "Muz", "unit": "1 Orta Boy", "calories": 105},
        {"id": 6, "name": "Izgara Tavuk Göğsü", "unit": "100 gr", "calories": 165},
        {"id": 7, "name": "Pirinç Pilavı", "unit": "1 Porsiyon", "calories": 250},
        {"id": 8, "name": "Yoğurt (Tam Yağlı)", "unit": "1 Kase (200g)", "calories": 122},
        {"id": 9, "name": "Ceviz", "unit": "100 gr", "calories": 654},
        {"id": 10, "name": "Zeytinyağlı Salata", "unit": "1 Porsiyon", "calories": 150},
        {"id": 11, "name": "Mercimek Çorbası", "unit": "1 Kase", "calories": 137},
        {"id": 12, "name": "Makarna (Sade)", "unit": "1 Porsiyon", "calories": 220},
        {"id": 13, "name": "Süt (Yarım Yağlı)", "unit": "1 Bardak (200ml)", "calories": 94},
        {"id": 14, "name": "Filtre Kahve (Şekersiz)", "unit": "1 Fincan", "calories": 2},
        {"id": 15, "name": "Çikolata (Sütlü)", "unit": "100 gr", "calories": 535},
        {"id": 16, "name": "Ton Balığı (Konserve)", "unit": "100 gr", "calories": 132},
        {"id": 17, "name": "Badem", "unit": "1 Avuç (30 gr)", "calories": 173},
        {"id": 18, "name": "Beyaz Peynir", "unit": "1 Dilim (30 gr)", "calories": 93}
    ]
    
    if not query:
        return jsonify(food_db[:6])
        
    filtered_foods = [f for f in food_db if query in f['name'].lower()]
    return jsonify(filtered_foods)