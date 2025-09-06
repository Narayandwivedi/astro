import Sanscript from '@indic-transliteration/sanscript';

// Hindi transliteration utility class
export class HindiTransliterator {
  constructor() {
    // Common phonetic word mappings (like easyhindityping.com)
    this.phoneticWordMap = {
      // Verbs
      'karna': 'करना', 'karta': 'करता', 'karti': 'करती', 'karte': 'करते',
      'hona': 'होना', 'hota': 'होता', 'hoti': 'होती', 'hote': 'होते',
      'jana': 'जाना', 'jata': 'जाता', 'jati': 'जाती', 'jate': 'जाते',
      'aana': 'आना', 'ata': 'आता', 'ati': 'आती', 'ate': 'आते',
      'dena': 'देना', 'deta': 'देता', 'deti': 'देती', 'dete': 'देते',
      'lena': 'लेना', 'leta': 'लेता', 'leti': 'लेती', 'lete': 'लेते',
      'khana': 'खाना', 'khata': 'खाता', 'khati': 'खाती', 'khate': 'खाते',
      'peena': 'पीना', 'pita': 'पीता', 'piti': 'पीती', 'pite': 'पीते',
      'sona': 'सोना', 'sota': 'सोता', 'soti': 'सोती', 'sote': 'सोते',
      'padhna': 'पढ़ना', 'padhta': 'पढ़ता', 'padhti': 'पढ़ती', 'padhte': 'पढ़ते',
      'dekhna': 'देखना', 'dekhta': 'देखता', 'dekhti': 'देखती', 'dekhte': 'देखते',
      'sunna': 'सुनना', 'sunta': 'सुनता', 'sunti': 'सुनती', 'sunte': 'सुनते',
      
      // Common words  
      'aaj': 'आज', 'kal': 'कल', 'din': 'दिन', 'raat': 'रात', 'subah': 'सुबह',
      'dopahar': 'दोपहर', 'shaam': 'शाम', 'samay': 'समय', 'waqt': 'वक्त',
      'accha': 'अच्छा', 'achha': 'अच्छा', 'acha': 'अच्छा', 'acchi': 'अच्छी',
      'bura': 'बुरा', 'buri': 'बुरी', 'kharab': 'खराब',
      'bohot': 'बहुत', 'bahut': 'बहुत', 'bohat': 'बहुत', 'bhut': 'बहुत',
      'thoda': 'थोड़ा', 'thodi': 'थोड़ी', 'kam': 'कम', 'zyada': 'ज्यादा',
      'bada': 'बड़ा', 'badi': 'बड़ी', 'bare': 'बड़े', 'chota': 'छोटा', 'choti': 'छोटी',
      
      // Numbers and common short words
      'ek': 'एक', 'do': 'दो', 'teen': 'तीन', 'char': 'चार', 'paanch': 'पांच',
      'che': 'छे', 'saat': 'सात', 'aath': 'आठ', 'nau': 'नौ', 'das': 'दस',
      
      // Common particles and short words
      'bhi': 'भी', 'bhe': 'भे', 'to': 'तो', 'jo': 'जो', 'so': 'सो',
      'ab': 'अब', 'tab': 'तब', 'jab': 'जब', 'kab': 'कब',
      'yahan': 'यहां', 'wahan': 'वहां', 'kahan': 'कहां',
      'phir': 'फिर', 'fir': 'फिर',
      
      // Pronouns and common words
      'main': 'मैं', 'tu': 'तू', 'tum': 'तुम', 'aap': 'आप', 'hum': 'हम',
      'woh': 'वह', 'wo': 'वो', 'yah': 'यह', 'yeh': 'यह', 'ye': 'ये',
      'is': 'इस', 'us': 'उस', 'in': 'इन', 'un': 'उन',
      'iska': 'इसका', 'iski': 'इसकी', 'iske': 'इसके', 'isko': 'इसको', 'isme': 'इसमें', 'isse': 'इससे',
      'uska': 'उसका', 'uski': 'उसकी', 'uske': 'उसके', 'usko': 'उसको', 'usme': 'उसमें', 'usse': 'उससे',
      'mera': 'मेरा', 'meri': 'मेरी', 'mere': 'मेरे', 'mujhe': 'मुझे', 'mujhko': 'मुझको', 'mujhse': 'मुझसे',
      'tera': 'तेरा', 'teri': 'तेरी', 'tere': 'तेरे', 'tujhe': 'तुझे', 'tujhko': 'तुझको', 'tujhse': 'तुझसे',
      'tumhara': 'तुम्हारा', 'tumhari': 'तुम्हारी', 'tumhare': 'तुम्हारे', 'tumhe': 'तुम्हें', 'tumse': 'तुमसे',
      'hamara': 'हमारा', 'hamari': 'हमारी', 'hamare': 'हमारे', 'hame': 'हमें', 'hamse': 'हमसे',
      'aapka': 'आपका', 'aapki': 'आपकी', 'aapke': 'आपके', 'aapko': 'आपको', 'aapse': 'आपसे',
      'hai': 'है', 'hun': 'हूं', 'ho': 'हो', 'hain': 'हैं', 'the': 'थे', 'thi': 'थी',
      'ka': 'का', 'ki': 'की', 'ke': 'के', 'ko': 'को', 'se': 'से', 'me': 'में', 'pe': 'पे',
      'aur': 'और', 'ya': 'या', 'lekin': 'लेकिन', 'par': 'पर', 'kyunki': 'क्योंकि',
      'kya': 'क्या', 'kaun': 'कौन', 'kahan': 'कहां', 'kab': 'कब', 'kaise': 'कैसे', 'kyun': 'क्यों',
      
      // Family and relationships
      'maa': 'मां', 'mata': 'माता', 'papa': 'पापा', 'pita': 'पिता', 'pitaji': 'पिताजी',
      'bhai': 'भाई', 'behen': 'बहन', 'beta': 'बेटा', 'beti': 'बेटी',
      'dada': 'दादा', 'dadi': 'दादी', 'nana': 'नाना', 'nani': 'नानी',
      
      // Common objects and places
      'ghar': 'घर', 'school': 'स्कूल', 'college': 'कॉलेज', 'office': 'ऑफिस',
      'hospital': 'हॉस्पिताल', 'dukan': 'दुकान', 'market': 'मार्केट',
      'paani': 'पानी', 'pani': 'पानी', 'khana': 'खाना', 'roti': 'रोटी',
      'chawal': 'चावल', 'daal': 'दाल', 'sabzi': 'सब्जी', 'dudh': 'दूध',
      'chai': 'चाय', 'coffee': 'कॉफी', 'namak': 'नमक', 'shakkar': 'शक्कर',
      
      // Greetings and politeness
      'namaste': 'नमस्ते', 'namaskar': 'नमस्कार', 'pranam': 'प्रणाम',
      'dhanyawad': 'धन्यवाद', 'shukriya': 'शुक्रिया', 'maaf': 'माफ', 'kshama': 'क्षमा',
      'kripya': 'कृपया', 'kripa': 'कृपा',
      
      // Common adjectives
      'sundar': 'सुंदर', 'sundari': 'सुंदरी', 'khubsurat': 'खूबसूरत',
      'tez': 'तेज़', 'dhimi': 'धीमी', 'jaldi': 'जल्दी', 'deri': 'देरी',
      'sahi': 'सही', 'galat': 'गलत', 'theek': 'ठीक',
      'shubh': 'शुभ', 'ashubh': 'अशुभ', 'mangal': 'मंगल',
      'naya': 'नया', 'nayi': 'नयी', 'purana': 'पुराना', 'purani': 'पुरानी',
      'safed': 'सफ़ेद', 'kala': 'काला', 'kali': 'काली', 'lal': 'लाल', 'hara': 'हरा',
      'pila': 'पीला', 'neela': 'नीला', 'nili': 'नीली',
      
      // More verbs and common words
      'milna': 'मिलना', 'milta': 'मिलता', 'milti': 'मिलती', 'milte': 'मिलते',
      'bolna': 'बोलना', 'bolta': 'बोलता', 'bolti': 'बोलती', 'bolte': 'बोलते',
      'hasna': 'हंसना', 'hasta': 'हंसता', 'hasti': 'हंसती', 'haste': 'हंसते',
      'rona': 'रोना', 'rota': 'रोता', 'roti': 'रोती', 'rote': 'रोते',
      'chalana': 'चलाना', 'chalata': 'चलाता', 'chalati': 'चलाती', 'chalate': 'चलाते',
      'rukna': 'रुकना', 'rukta': 'रुकता', 'rukti': 'रुकती', 'rukte': 'रुकते',
      'uthna': 'उठना', 'uthta': 'उठता', 'uthti': 'उठती', 'uthte': 'उठते',
      'baithna': 'बैठना', 'baithta': 'बैठता', 'baithti': 'बैठती', 'baithte': 'बैठते',
      'khada': 'खड़ा', 'khadi': 'खड़ी', 'khade': 'खड़े',
      
      // Religious and cultural words
      'bhagwan': 'भगवान', 'ishwar': 'ईश्वर', 'prabhu': 'प्रभु', 'devta': 'देवता',
      'devi': 'देवी', 'mata': 'माता', 'pita': 'पिता',
      'mandir': 'मंदिर', 'gurdwara': 'गुरुद्वारा', 'masjid': 'मस्जिद',
      'puja': 'पूजा', 'aarti': 'आरती', 'prasad': 'प्रसाद',
      'tyohar': 'त्योहार', 'utsav': 'उत्सव', 'parv': 'पर्व',
      'diwali': 'दीवाली', 'holi': 'होली', 'dussehra': 'दशहरा',
      'rakhi': 'राखी', 'karwachauth': 'करवाचौथ',
      
      // Days and time
      'somwar': 'सोमवार', 'mangalwar': 'मंगलवार', 'budhwar': 'बुधवार',
      'gurwar': 'गुरुवार', 'shukrwar': 'शुक्रवार', 'shaniwar': 'शनिवार', 'raviwar': 'रविवार',
      'january': 'जनवरी', 'february': 'फरवरी', 'march': 'मार्च', 'april': 'अप्रैल',
      'may': 'मई', 'june': 'जून', 'july': 'जुलाई', 'august': 'अगस्त',
      'september': 'सितम्बर', 'october': 'अक्टूबर', 'november': 'नवम्बर', 'december': 'दिसम्बर',
      
      // Body parts
      'sir': 'सिर', 'aankh': 'आंख', 'aankhein': 'आंखें', 'naak': 'नाक', 'kaan': 'कान',
      'munh': 'मुंह', 'hath': 'हाथ', 'pair': 'पैर', 'pet': 'पेट', 'peeth': 'पीठ',
      
      // Animals
      'kutta': 'कुत्ता', 'kutti': 'कुत्ती', 'billi': 'बिल्ली', 'gaay': 'गाय',
      'bakra': 'बकरा', 'bakri': 'बकरी', 'ghoda': 'घोड़ा', 'ghodi': 'घोड़ी',
      'sher': 'शेर', 'hathi': 'हाथी', 'bandar': 'बंदर', 'chuha': 'चूहा',
      'murga': 'मुर्गा', 'murgi': 'मुर्गी', 'machli': 'मछली',
      
      // Nature and weather
      'suraj': 'सूरज', 'chand': 'चांद', 'tare': 'तारे', 'aasman': 'आसमान',
      'badal': 'बादल', 'barish': 'बारिश', 'dhoop': 'धूप', 'chaya': 'छाया',
      'hawa': 'हवा', 'aandhi': 'आंधी', 'toofan': 'तूफान',
      'ped': 'पेड़', 'patta': 'पत्ता', 'phal': 'फल', 'phool': 'फूल',
      'ghas': 'घास', 'mitti': 'मिट्टी', 'pathar': 'पत्थर',
      
      // Emotions and feelings
      'khush': 'खुश', 'khushi': 'खुशी', 'dukh': 'दुख', 'dukhi': 'दुखी',
      'gussa': 'गुस्सा', 'dar': 'डर', 'darta': 'डरता', 'darti': 'डरती',
      'pyar': 'प्यार', 'mohabbat': 'मोहब्बत', 'ishq': 'इश्क',
      'umang': 'उमंग', 'josh': 'जोश', 'himmat': 'हिम्मत', 'hausla': 'हौसला',
      
      // More common words
      'zindagi': 'जिंदगी', 'jindagi': 'जिंदगी', 'maut': 'मौत', 'duniya': 'दुनिया',
      'insaan': 'इंसान', 'aadmi': 'आदमी', 'aurat': 'औरत', 'ladka': 'लड़का', 'ladki': 'लड़की',
      'bachha': 'बच्चा', 'bacchi': 'बच्ची', 'bacche': 'बच्चे',
      'shadi': 'शादी', 'vivah': 'विवाह', 'dulha': 'दूल्हा', 'dulhan': 'दुल्हन',
      'mithai': 'मिठाई', 'namkeen': 'नमकीन', 'kheer': 'खीर', 'halwa': 'हलवा',
      'puri': 'पूरी', 'paratha': 'पराठा', 'idli': 'इडली', 'dosa': 'डोसा',
      'samosa': 'समोसा', 'kachori': 'कचौरी', 'jalebi': 'जलेबी',
      
      // Technology and modern words
      'mobile': 'मोबाइल', 'phone': 'फोन', 'computer': 'कंप्यूटर', 'internet': 'इंटरनेट',
      'website': 'वेबसाइट', 'email': 'ईमेल', 'password': 'पासवर्ड',
      'train': 'ट्रेन', 'bus': 'बस', 'car': 'कार', 'bike': 'बाइक', 'cycle': 'साइकिल',
      'ticket': 'टिकट', 'station': 'स्टेशन', 'platform': 'प्लेटफॉर्म',
      
      // Misc important words
      'shaayad': 'शायद', 'shayad': 'शायद', 'zaroor': 'जरूर', 'jarur': 'जरूर',
      'bilkul': 'बिल्कुल', 'hamesha': 'हमेशा', 'kabhi': 'कभी', 'koi': 'कोई',
      'sab': 'सब', 'sabko': 'सबको', 'sabse': 'सबसे', 'sabka': 'सबका',
      
      // Business and work words
      'kaam': 'काम', 'vyavasaya': 'व्यवसाय', 'naukri': 'नौकरी', 'malik': 'मालिक',
      'karmchari': 'कर्मचारी', 'adhikari': 'अधिकारी', 'mantri': 'मंत्री',
      'neta': 'नेता', 'sarkar': 'सरकार', 'rajya': 'राज्य', 'desh': 'देश',
      'videsh': 'विदेश', 'swadesh': 'स्वदेश', 'bharat': 'भारत', 'hindustan': 'हिंदुस्तान',
      
      // Education words
      'vidyalaya': 'विद्यालय', 'shikshak': 'शिक्षक', 'shikshaika': 'शिक्षिका',
      'vidyarthi': 'विद्यार्थी', 'chhatra': 'छात्र', 'chhatara': 'छात्रा',
      'pustak': 'पुस्तक', 'adhyay': 'अध्याय', 'paath': 'पाठ', 'shishya': 'शिष्य',
      'guru': 'गुरु', 'gyan': 'ज्ञान', 'vidya': 'विद्या', 'shiksha': 'शिक्षा',
      
      // Medical and health
      'swasthya': 'स्वास्थ्य', 'bimari': 'बीमारी', 'dawa': 'दवा', 'dawai': 'दवाई',
      'doctor': 'डॉक्टर', 'vaidya': 'वैद्य', 'aspatal': 'अस्पताल', 'clinic': 'क्लिनिक',
      'marij': 'मरीज', 'rogi': 'रोगी', 'upchar': 'उपचार', 'ilaaj': 'इलाज',
      'jukham': 'जुकाम', 'bukhar': 'बुखार', 'khasi': 'खांसी', 'dard': 'दर्द',
      
      // Shopping and market
      'bazaar': 'बाज़ार', 'kharidna': 'खरीदना', 'bechna': 'बेचना', 'khareedari': 'खरीदारी',
      'dukan': 'दुकान', 'dukandar': 'दुकानदार', 'grahak': 'ग्राहक', 'customer': 'कस्टमर',
      'daam': 'दाम', 'kimat': 'कीमत', 'mehnga': 'महंगा', 'sasta': 'सस्ता',
      'chutta': 'छुट्टा', 'wapsi': 'वापसी', 'bill': 'बिल', 'receipt': 'रसीद',
      
      // Clothing and accessories
      'kapde': 'कपड़े', 'shirt': 'शर्ट', 'pant': 'पैंट', 'kurta': 'कुर्ता',
      'dhoti': 'धोती', 'saree': 'साड़ी', 'lehnga': 'लहंगा', 'dupatta': 'दुपट्टा',
      'chaddar': 'चादर', 'bistar': 'बिस्तर', 'takiya': 'तकिया', 'razai': 'रजाई',
      'joota': 'जूता', 'chappal': 'चप्पल', 'sandal': 'सैंडल', 'mojje': 'मोजे',
      
      // Cooking and kitchen
      'rasoi': 'रसोई', 'pakana': 'पकाना', 'banana': 'बनाना', 'ubalna': 'उबालना',
      'talena': 'तलना', 'katatna': 'काटना', 'pishna': 'पीसना', 'misana': 'मिसाना',
      'chulha': 'चूल्हा', 'gas': 'गैस', 'tawa': 'तवा', 'kadhai': 'कढ़ाई',
      'bartan': 'बर्तन', 'plate': 'प्लेट', 'glass': 'गिलास', 'bowl': 'बाउल',
      'chamach': 'चम्मच', 'chaku': 'चाकू', 'kata': 'काटा', 'thali': 'थाली',
      
      // Weather and seasons
      'mausam': 'मौसम', 'garmi': 'गर्मी', 'sardi': 'सर्दी', 'thandi': 'ठंडी',
      'monsoon': 'मानसून', 'varsha': 'वर्षा', 'pavan': 'पवन', 'storm': 'स्टॉर्म',
      'dhoop': 'धूप', 'saya': 'साया', 'oola': 'ओला', 'barf': 'बर्फ',
      
      // Directions and locations
      'uttar': 'उत्तर', 'dakshin': 'दक्षिण', 'purva': 'पूर्व', 'paschim': 'पश्चिम',
      'upar': 'ऊपर', 'niche': 'नीचे', 'age': 'आगे', 'piche': 'पीछे',
      'bagal': 'बगल', 'samne': 'सामने', 'paas': 'पास', 'dur': 'दूर',
      'nazdeek': 'नजदीक', 'bich': 'बीच', 'kone': 'कोने', 'kinara': 'किनारा',
      
      // Actions and activities
      'khelna': 'खेलना', 'nachna': 'नाचना', 'gana': 'गाना', 'bajana': 'बजाना',
      'likhna': 'लिखना', 'padhna': 'पढ़ना', 'sikhaना': 'सिखाना', 'seekhna': 'सीखना',
      'kaam': 'काम', 'araam': 'आराम', 'vishram': 'विश्राम', 'nind': 'नींद',
      'sapna': 'सपना', 'khwab': 'ख्वाब', 'jagana': 'जगाना', 'uthana': 'उठाना',
      
      // Social relationships
      'rishta': 'रिश्ता', 'naata': 'नाता', 'sambandh': 'संबंध', 'milan': 'मिलन',
      'vichaar': 'विचार', 'salah': 'सलाह', 'sujhaav': 'सुझाव', 'madad': 'मदद',
      'sahaayata': 'सहायता', 'upkaar': 'उपकार', 'ehsan': 'एहसान', 'kripa': 'कृपा',
      
      // Abstract concepts
      'sachai': 'सचाई', 'jhooth': 'झूठ', 'sach': 'सच', 'satya': 'सत्य',
      'nyay': 'न्याय', 'anyay': 'अन्याय', 'dharma': 'धर्म', 'paap': 'पाप',
      'punya': 'पुण्य', 'karma': 'कर्म', 'bhagya': 'भाग्य', 'kismat': 'किस्मत',
      'taqdeer': 'तकदीर', 'naseeb': 'नसीब', 'mukaddar': 'मुकद्दर'
    };
  }

  // Main transliteration method
  transliterate(word) {
    const lowercaseWord = word.toLowerCase();
    
    // First check our phonetic word map
    if (this.phoneticWordMap[lowercaseWord]) {
      return this.phoneticWordMap[lowercaseWord];
    }

    try {
      // Fall back to Sanscript with better handling
      let transliterated = Sanscript.t(word, 'itrans', 'devanagari');
      
      // Fix common vowel issues
      const originalWord = word.toLowerCase();
      
      // Fix words ending with 'a' sound
      if (originalWord.endsWith('a') && !transliterated.endsWith('ा') && !transliterated.endsWith('अ')) {
        transliterated += 'ा';
      }
      
      // Fix words ending with 'i' sound (like "bhi" should be "भी")
      if (originalWord.endsWith('i') && transliterated.endsWith('ि')) {
        transliterated = transliterated.slice(0, -1) + 'ी';
      }
      
      // Fix words ending with 'u' sound
      if (originalWord.endsWith('u') && transliterated.endsWith('ु')) {
        transliterated = transliterated.slice(0, -1) + 'ू';
      }
      
      // Special cases for standalone vowels at word end
      if (originalWord === 'e' || originalWord.endsWith('e')) {
        if (originalWord.length <= 2) {
          return 'ए';
        }
      }
      
      return transliterated;
    } catch (error) {
      console.warn('Transliteration error:', error);
      return word;
    }
  }

  // Add new word mapping
  addWordMapping(english, hindi) {
    this.phoneticWordMap[english.toLowerCase()] = hindi;
  }

  // Get all supported words
  getSupportedWords() {
    return Object.keys(this.phoneticWordMap);
  }
}

// Export singleton instance
export const hindiTransliterator = new HindiTransliterator();