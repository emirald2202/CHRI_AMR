import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "language": "Language", "dashboard": "Dashboard", "leaderboard": "Leaderboard", "findPharmacies": "Find Pharmacies",
      "searchPlaceholder": "Search for pharmacies near you...", "searchBtn": "Search", "searchingLoc": "Searching within 10km of your location",
      "guest": "Guest User", "pts": "pts", "accountSettings": "Account Settings", "disposalHistory": "Disposal History",
      "pointsBadges": "Points & Badges", "logout": "Logout", "welcomeBack": "Welcome Back", "signInSubtitle": "Sign in to continue your mission against AMR",
      "createAccount": "Create an Account", "signUpSubtitle": "Join the movement against antimicrobial resistance", "iamA": "I am a",
      "user": "User", "pharmacy": "Pharmacy", "loginTab": "Login", "signupTab": "Sign Up", "password": "Password", "otp": "OTP",
      "fullName": "Full Name", "phone": "Phone Number", "email": "Email", "enterName": "Enter your name", "enterPhone": "Enter your phone number",
      "enterEmail": "Enter your email", "enterPassword": "Enter your password", "forgotPassword": "Forgot password?", "sendOtp": "Send OTP",
      "verifyOtp": "Verify OTP", "signInBtn": "Sign In", "signUpBtn": "Sign Up", "pharmacyName": "Pharmacy Name", "enterPharmacy": "Enter pharmacy name",
      "didYouKnow": "👋 Did you know?", "tutorialBody": "We show pharmacies registered on our platform below. But if you can't find one near you, don't worry!",
      "tutorialClick": "Click the ", "tutorialButton": "Find Pharmacies", "tutorialEnd": " button in the menu to discover ANY pharmacy within 10km of your location using live search.",
      "gotIt": "Got it ✓", "mapsTitle": "Find Nearby Pharmacies", "mapsSub": "Locate pharmacies for safe medicine disposal",
      "trackerTitle": "Disposal Actions & Tracker", "trackerSub": "Scheduling button and active requests tracker",
      "googleMapsIntegration": "Google Maps Integration",
      "riskTitle": "Environmental Risk Calculator", "riskSub": "Chart.js visualizations and impact math",
      "lbTitle": "AMR Defenders Leaderboard", "lbDesc": "See who is making the biggest impact in the fight against antimicrobial resistance through safe medicine disposal.",
      "topUsers": "Top Users", "topPharmacies": "Top Pharmacies", "rank": "Rank", "heroName": "Hero Name", "safeDisposals": "Safe Disposals",
      "totalPoints": "Total Points", "pharmacyNameLb": "Pharmacy Name", "medsCollected": "Medicines Collected", "rating": "Rating",
      "partScore": "Participation Score", "you": "You"
    }
  },
  hi: {
    translation: {
      "language": "भाषा", "dashboard": "डैशबोर्ड", "leaderboard": "लीडरबोर्ड", "findPharmacies": "फार्मेसी खोजें",
      "searchPlaceholder": "अपने आस-पास फार्मेसी खोजें...", "searchBtn": "खोज", "searchingLoc": "आपके स्थान के 10 किमी के भीतर खोज रहे हैं",
      "guest": "अतिथि", "pts": "अंक", "accountSettings": "खाता सेटिंग्स", "disposalHistory": "निपटान इतिहास",
      "pointsBadges": "अंक और बैज", "logout": "लॉग आउट", "welcomeBack": "वापसी पर स्वागत है", "signInSubtitle": "एएमआर के खिलाफ अपना मिशन जारी रखने के लिए साइन इन करें",
      "createAccount": "खाता बनाएं", "signUpSubtitle": "रोगाणुरोधी प्रतिरोध के खिलाफ आंदोलन में शामिल हों", "iamA": "मैं एक हूँ",
      "user": "उपयोगकर्ता", "pharmacy": "फार्मेसी", "loginTab": "लॉग इन", "signupTab": "साइन अप", "password": "पासवर्ड", "otp": "ओटीपी",
      "fullName": "पूरा नाम", "phone": "फ़ोन नंबर", "email": "ईमेल", "enterName": "अपना नाम दर्ज करें", "enterPhone": "अपना फ़ोन नंबर दर्ज करें",
      "enterEmail": "अपना ईमेल दर्ज करें", "enterPassword": "अपना पासवर्ड दर्ज करें", "forgotPassword": "पासवर्ड भूल गए?", "sendOtp": "ओटीपी भेजें",
      "verifyOtp": "ओटीपी सत्यापित करें", "signInBtn": "साइन इन", "signUpBtn": "साइन अप", "pharmacyName": "फार्मेसी का नाम", "enterPharmacy": "फार्मेसी का नाम दर्ज करें",
      "didYouKnow": "👋 क्या आप जानते हैं?", "tutorialBody": "हम नीचे हमारे प्लेटफ़ॉर्म पर पंजीकृत फ़ार्मेसियों को दिखाते हैं। लेकिन अगर आपको अपने आस-पास कोई नहीं मिलती, चिंता न करें!",
      "tutorialClick": "लाइव खोज का उपयोग कर 10 किमी के भीतर कोई भी फार्मेसी खोजने के लिए मेनू में ", "tutorialButton": "फार्मेसी खोजें", "tutorialEnd": " बटन पर क्लिक करें।",
      "gotIt": "समझ गया ✓", "mapsTitle": "नजदीकी फार्मेसी खोजें", "mapsSub": "सुरक्षित दवा निपटान के लिए फार्मेसी का पता लगाएं", "trackerTitle": "निपटान क्रियाएँ", "trackerSub": "निर्धारण बटन और सक्रिय अनुरोध ट्रैकर",
      "googleMapsIntegration": "गूगल मैप्स एकीकरण",
      "riskTitle": "पर्यावरण जोखिम कैलक्यूलेटर", "riskSub": "चार्ट और प्रभाव गणित",
      "lbTitle": "एएमआर रक्षक लीडरबोर्ड", "lbDesc": "देखें कि सुरक्षित दवा निपटान के माध्यम से रोगाणुरोधी प्रतिरोध के खिलाफ लड़ाई में कौन सबसे बड़ा प्रभाव डाल रहा है।",
      "topUsers": "शीर्ष उपयोगकर्ता", "topPharmacies": "शीर्ष फार्मेसियां", "rank": "रैंक", "heroName": "हीरो का नाम", "safeDisposals": "सुरक्षित निपटान",
      "totalPoints": "कुल अंक", "pharmacyNameLb": "फार्मेसी का नाम", "medsCollected": "एकत्रित दवाएं", "rating": "रेटिंग", "partScore": "भागीदारी स्कोर", "you": "आप"
    }
  },
  mr: {
    translation: {
      "language": "भाषा", "dashboard": "डॅशबोर्ड", "leaderboard": "लीडरबोर्ड", "findPharmacies": "फार्मसी शोधा",
      "searchPlaceholder": "तुमच्या जवळील फार्मसी शोधा...", "searchBtn": "शोधा", "searchingLoc": "तुमच्या स्थानापासून 10 किमी च्या आत शोधत आहे",
      "guest": "अतिथी", "pts": "गुण", "accountSettings": "खाते सेटिंग्ज", "disposalHistory": "विल्हेवाट इतिहास", "pointsBadges": "गुण आणि टॅग",
      "logout": "लॉगआउट करा", "welcomeBack": "पुन्हा स्वागत आहे", "signInSubtitle": "सामने साइन इन करा", "createAccount": "नवीन खाते तयार करा",
      "signUpSubtitle": "अँटीमाइक्रोबियल प्रतिरोधाविरूद्ध सामील व्हा", "iamA": "मी एक आहे", "user": "वापरकर्ता", "pharmacy": "फार्मेसी",
      "loginTab": "लॉगिन", "signupTab": "साइन अप", "password": "पासवर्ड", "otp": "ओटीपी", "fullName": "पूर्ण नाव", "phone": "फोन नंबर",
      "email": "ईमेल", "enterName": "तुमचे नाव प्रविष्ट करा", "enterPhone": "फोन नंबर प्रविष्ट करा", "enterEmail": "ईमेल प्रविष्ट करा",
      "enterPassword": "पासवर्ड प्रविष्ट करा", "forgotPassword": "पासवर्ड विसरलात?", "sendOtp": "ओटीपी पाठवा", "verifyOtp": "ओटीपी पडताळा",
      "signInBtn": "लॉगिन करा", "signUpBtn": "साइन अप करा", "pharmacyName": "फार्मसीचे नाव", "enterPharmacy": "फार्मसीचे नाव प्रविष्ट करा",
      "didYouKnow": "👋 तुम्हाला माहीत आहे का?", "tutorialBody": "आम्ही खाली नोंदणीकृत फार्मसी दाखवतो. परंतु तुम्हाला जवळ कोणी न आढळल्यास घाबरू नका!",
      "tutorialClick": "थेट शोध वापरून 10 किमी च्या आत कोणतीही फार्मसी शोधण्यासाठी ", "tutorialButton": "फार्मसी शोधा", "tutorialEnd": " बटणावर क्लिक करा.",
      "gotIt": "समजले ✓", "mapsTitle": "जवळच्या फार्मसी शोधा", "mapsSub": "सुरक्षित औषध विल्हेवाटीसाठी फार्मसी शोधा", "trackerTitle": "विल्हेवाट कृती", "trackerSub": "शेड्युलिंग आणि ट्रॅकर",
      "riskTitle": "पर्यावरण जोखीम कॅल्क्युलेटर", "riskSub": "प्रभाव गणित", "lbTitle": "एएमआर रक्षक लीडरबोर्ड", "lbDesc": "सुरक्षित औषध विल्हेवाटीद्वारे सर्वात मोठा प्रभाव पहा.",
      "topUsers": "शीर्ष वापरकर्ते", "topPharmacies": "शीर्ष फार्मसी", "rank": "रँक", "heroName": "हिरोचे नाव", "safeDisposals": "सुरक्षित विल्हेवाट", "totalPoints": "एकूण गुण",
      "pharmacyNameLb": "फार्मसीचे नाव", "medsCollected": "गोळा केलेली औषधे", "rating": "रेटिंग", "partScore": "सहभाग स्कोअर", "you": "तुम्ही"
    }
  },
  bn: {
    translation: {
      "language": "ভাষা", "dashboard": "ড্যাশবোর্ড", "leaderboard": "লিডারবোর্ড", "findPharmacies": "ফার্মেসি খুঁজুন",
      "searchPlaceholder": "আপনার কাছাকাছি ফার্মেসি খুঁজুন...", "searchBtn": "অনুসন্ধান", "searchingLoc": "10 কিমির মধ্যে অনুসন্ধান করা হচ্ছে",
      "guest": "অতিথি", "pts": "পয়েন্ট", "accountSettings": "অ্যাকাউন্ট সেটিংস", "disposalHistory": "নিষ্পত্তির ইতিহাস", "pointsBadges": "পয়েন্ট এবং ব্যাজ",
      "logout": "লগআউট", "welcomeBack": "স্বাগতম", "signInSubtitle": "AMR এর বিরুদ্ধে মিশন চালিয়ে যেতে সাইন ইন করুন", "createAccount": "একটি অ্যাকাউন্ট তৈরি করুন",
      "signUpSubtitle": "অ্যান্টিমাইক্রোবিয়াল প্রতিরোধের বিরুদ্ধে আন্দোলনে যোগ দিন", "iamA": "আমি একজন", "user": "ব্যবহারকারী", "pharmacy": "ফার্মেসি",
      "loginTab": "লগইন", "signupTab": "সাইন আপ", "password": "পাসওয়ার্ড", "otp": "ওটিপি", "fullName": "পূর্ণ নাম", "phone": "ফোন নম্বর", "email": "ইমেইল",
      "enterName": "আপনার নাম লিখুন", "enterPhone": "ফোন নম্বর লিখুন", "enterEmail": "ইমেইল লিখুন", "enterPassword": "পাসওয়ার্ড লিখুন",
      "forgotPassword": "পাসওয়ার্ড ভুলে গেছেন?", "sendOtp": "OTP পাঠান", "verifyOtp": "OTP যাচাই করুন", "signInBtn": "সাইন ইন", "signUpBtn": "সাইন আপ",
      "pharmacyName": "ফার্মেসির নাম", "enterPharmacy": "ফার্মেসির নাম লিখুন", "didYouKnow": "👋 আপনি কি জানেন?",
      "tutorialBody": "নিবন্ধিত ফার্মেসিগুলি দেখাচ্ছি। তবে কাছাকাছি কোনোটি না পান, চিন্তা করবেন না!",
      "tutorialClick": "লাইভ সার্চ ব্যবহার করে 10 কিমির মধ্যে ফার্মেসি আবিষ্কার করতে ", "tutorialButton": "ফার্মেসি খুঁজুন", "tutorialEnd": " বোতামে ক্লিক করুন।",
      "gotIt": "বুঝেছি ✓", "mapsTitle": "গুগল ম্যাপস", "mapsSub": "ম্যাপ এখানে প্রদর্শিত হবে", "trackerTitle": "নিষ্পত্তি ট্র্যাকার", "trackerSub": "ট্র্যাকার",
      "riskTitle": "পরিবেশগত ঝুঁকি ক্যালকুলেটর", "riskSub": "চার্ট এবং প্রভাব", "lbTitle": "এএমআর ডিফেন্ডারস লিডারবোর্ড",
      "lbDesc": "নিরাপদ ওষুধ নিষ্পত্তির মাধ্যমে কে সবচেয়ে বড় প্রভাব ফেলছে তা দেখুন।", "topUsers": "শীর্ষ ব্যবহারকারী", "topPharmacies": "শীর্ষ ফার্মেসি",
      "rank": "র‍্যাঙ্ক", "heroName": "হিরোর নাম", "safeDisposals": "নিরাপদ নিষ্পত্তি", "totalPoints": "মোট পয়েন্ট", "pharmacyNameLb": "ফার্মেসির নাম",
      "medsCollected": "গৃহীত ওষুধ", "rating": "রেটিং", "partScore": "অংশগ্রহণ স্কোর", "you": "আপনি"
    }
  },
  ta: {
    translation: {
      "language": "மொழி", "dashboard": "செயல்பாட்டு பலகை", "leaderboard": "முன்னிலைப்பலகை", "findPharmacies": "மருந்தகங்களைக் கண்டுபிடி",
      "searchPlaceholder": "அருகிலுள்ள மருந்தகங்களைத் தேடுங்கள்...", "searchBtn": "தேடு", "searchingLoc": "10 கிமீக்குள் தேடப்படுகிறது",
      "guest": "விருந்தினர்", "pts": "புள்ளிகள்", "accountSettings": "கணக்கு அமைப்புகள்", "disposalHistory": "அகற்றும் வரலாறு", "pointsBadges": "புள்ளிகள் & பேட்ஜ்கள்",
      "logout": "வெளியேறு", "welcomeBack": "மீண்டும் வருக", "signInSubtitle": "AMR எதிர்ப்பு பயணத்தைத் தொடர உள்நுழையவும்", "createAccount": "கணக்கை உருவாக்கவும்",
      "signUpSubtitle": "நுண்ணுயிர் எதிர்ப்பு பிரச்சாரத்தில் இணையவும்", "iamA": "நான் ஒரு", "user": "பயனர்", "pharmacy": "மருந்தகம்",
      "loginTab": "உள்நுழை", "signupTab": "பதிவு செய்", "password": "கடவுச்சொல்", "otp": "OTP", "fullName": "முழு பெயர்", "phone": "தொலைபேசி எண்",
      "email": "மின்னஞ்சல்", "enterName": "பெயரை உள்ளிடவும்", "enterPhone": "எண்ணை உள்ளிடவும்", "enterEmail": "மின்னஞ்சலை உள்ளிடவும்",
      "enterPassword": "கடவுச்சொல்லை உள்ளிடவும்", "forgotPassword": "கடவுச்சொல் மறந்துவிட்டதா?", "sendOtp": "OTP அனுப்பு", "verifyOtp": "OTP சரிபார்",
      "signInBtn": "உள்நுழை", "signUpBtn": "பதிவு செய்", "pharmacyName": "மருந்தகத்தின் பெயர்", "enterPharmacy": "பெயரை உள்ளிடவும்",
      "didYouKnow": "👋 உங்களுக்குத் தெரியுமா?", "tutorialBody": "மருந்தகங்களை கீழே காட்டுகிறோம். அருகில் ஒன்றும் இல்லையென்றால் கவலைப்பட வேண்டாம்!",
      "tutorialClick": "நேரடி தேடல் மூலம் எந்த மருந்தகத்தையும் கண்டுபிடிக்க ", "tutorialButton": "மருந்தகங்களைக் கண்டுபிடி", "tutorialEnd": " பொத்தானைக் கிளிக் செய்யவும்.",
      "gotIt": "புரிந்தது ✓", "mapsTitle": "கூகுள் மேப்ஸ்", "mapsSub": "வரைபடம் இங்கே தோன்றும்", "trackerTitle": "அகற்றும் செயல்பாடுகள்", "trackerSub": "டிராக்கர்",
      "riskTitle": "சுற்றுச்சூழல் இடர் கால்குலேட்டர்", "riskSub": "விளக்கப்படங்கள் மற்றும் தாக்கம்", "lbTitle": "AMR முன்னிலைப்பலகை",
      "lbDesc": "பாதுகாப்பான மருந்து அகற்றும் போராட்டத்தில் யார் முன்னிலையில் உள்ளனர்.", "topUsers": "சிறந்த பயனர்கள்", "topPharmacies": "சிறந்த மருந்தகங்கள்",
      "rank": "தரவரிசை", "heroName": "ஹீரோ பெயர்", "safeDisposals": "பாதுகாப்பான அகற்றுதல்", "totalPoints": "மொத்த புள்ளிகள்", "pharmacyNameLb": "மருந்தகத்தின் பெயர்",
      "medsCollected": "சேகரிக்கப்பட்ட மருந்துகள்", "rating": "மதிப்பீடு", "partScore": "பங்கேற்பு மதிப்பெண்", "you": "நீங்கள்"
    }
  },
  te: {
    translation: {
      "language": "భాష", "dashboard": "డ్యాష్‌బోర్డ్", "leaderboard": "లీడర్‌బోర్డ్", "findPharmacies": "ఫార్మసీలను కనుగొనండి",
      "searchPlaceholder": "మీ సమీపంలోని ఫార్మసీల కోసం వెతకండి...", "searchBtn": "వెతకండి", "searchingLoc": "10కిమీ లోపు ప్రాంతంలో వెతుకుతోంది",
      "guest": "అతిథి", "pts": "పాయింట్లు", "accountSettings": "ఖాతా సెట్టింగ్‌లు", "disposalHistory": "డిస్పోజల్ చరిత్ర", "pointsBadges": "పాయింట్లు & బ్యాడ్జీలు",
      "logout": "లాగౌట్", "welcomeBack": "తిరిగి స్వాగతం", "signInSubtitle": "AMR కి వ్యతిరేకంగా సైన్ ఇన్ చేయండి", "createAccount": "ఖాతాను సృష్టించండి",
      "signUpSubtitle": "యాంటీమైక్రోబియల్ నిరోధక ఉద్యమంలో చేరండి", "iamA": "నేను ఒక", "user": "వినియోగదారు", "pharmacy": "ఫార్మసీ", "loginTab": "లాగిన్",
      "signupTab": "సైన్ అప్", "password": "పాస్‌వర్ಡ್", "otp": "OTP", "fullName": "పూర్తి పేరు", "phone": "ఫోన్ నంబర్", "email": "ఈమెయిల్",
      "enterName": "మీ పేరు నమోదు చేయండి", "enterPhone": "ఫోన్ నంబర్ నమోదు చేయండి", "enterEmail": "ఈమెయిల్ నమోదు చేయండి", "enterPassword": "పాస్‌వర్ಡ್ నమోదు చేయండి",
      "forgotPassword": "పాస్‌వర్డ్ మర్చిపోయారా?", "sendOtp": "OTP పంపండి", "verifyOtp": "OTP ధృవీకరించండి", "signInBtn": "సైన్ ఇన్", "signUpBtn": "సైన్ అప్",
      "pharmacyName": "ఫార్మసీ పేరు", "enterPharmacy": "ఫార్మసీ పేరు నమోదు చేయండి", "didYouKnow": "👋 మీకు తెలుసా?",
      "tutorialBody": "పాల్గొంటున్న ఫార్మసీలను చూపిస్తాము. మీకు సమీపంలో ఫార్మసీ లేకపోతే ఆందోళన చెందకండి!",
      "tutorialClick": "లైవ్ సెర్చ్ ద్వారా ఏ ఫార్మసీనైనా కనుగొనడానికి ", "tutorialButton": "ఫార్మసీలను కనుగొనండి", "tutorialEnd": " బటన్‌పై క్లిక్ చేయండి.",
      "gotIt": "అర్థమైంది ✓", "mapsTitle": "గూగుల్ మ్యాప్స్", "mapsSub": "మ్యాప్ ఇక్కడ కనిపిస్తుంది", "trackerTitle": "డిస్పోజల్ ట్రాకర్", "trackerSub": "ట్రాకర్",
      "riskTitle": "పర్యావరణ ప్రమాద క్యాలిక్యులేటర్", "riskSub": "చార్ట్స్ మరియు గణాంకాలు", "lbTitle": "AMR లీడర్‌బోర్డ్",
      "lbDesc": "మందుల సురక్షిత తొలగింపు ద్వారా ఎవరు అత్యధిక ప్రభావం చూపుతున్నారో చూడండి.", "topUsers": "టాప్ వినియోగదారులు", "topPharmacies": "టాప్ ఫార్మసీలు",
      "rank": "ర్యాంక్", "heroName": "హీరో పేరు", "safeDisposals": "సురక్షిత డిస్పోజల్", "totalPoints": "మొత్తం పాయింట్లు", "pharmacyNameLb": "ఫార్మసీ పేరు",
      "medsCollected": "సేకరించిన మందులు", "rating": "రేటింగ్", "partScore": "పాల్గొనే స్కోర్", "you": "మీరు"
    }
  },
  ml: {
    translation: {
      "language": "ഭാഷ", "dashboard": "ഡാഷ്ബോർഡ്", "leaderboard": "ലീഡർബോർഡ്", "findPharmacies": "ഫാർമസികൾ കണ്ടെത്തുക",
      "searchPlaceholder": "അടുത്തുള്ള ഫാർമസികൾ തിരയുക...", "searchBtn": "തിരയുക", "searchingLoc": "10 കിലോമീറ്ററിനുള്ളിൽ ഫാർമസികൾ തിരയുന്നു",
      "guest": "അതിഥി", "pts": "പോയിന്റ്", "accountSettings": "ക്രമീകരണങ്ങൾ", "disposalHistory": "ചരിത്രം", "pointsBadges": "പോയിന്റുകളും ബാഡ്ജുകളും",
      "logout": "ലോഗ്ഔട്ട്", "welcomeBack": "സ്വാഗതം", "signInSubtitle": "AMR പ്രതിരോധത്തിൽ പങ്കുചേരാൻ സൈൻ ഇൻ ചെയ്യുക", "createAccount": "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
      "signUpSubtitle": "പോരാട്ടത്തിൽ ചേരുക", "iamA": "ഞാൻ ഒരു", "user": "ഉപയോക്താവ്", "pharmacy": "ഫാർമസി", "loginTab": "ലോഗിൻ", "signupTab": "സൈൻ അപ്പ്",
      "password": "പാസ്‌വേഡ്", "otp": "OTP", "fullName": "മുഴുവൻ പേര്", "phone": "ഫോൺ നമ്പർ", "email": "ഇമെയിൽ", "enterName": "പേര് നൽകുക",
      "enterPhone": "നമ്പർ നൽകുക", "enterEmail": "ഇമെയിൽ നൽകുക", "enterPassword": "പാസ്‌വേഡ് നൽകുക", "forgotPassword": "പാസ്‌വേഡ് മറന്നോ?",
      "sendOtp": "OTP അയയ്‌ക്കുക", "verifyOtp": "OTP സ്ഥിരീകരിക്കുക", "signInBtn": "സൈൻ ഇൻ", "signUpBtn": "സൈൻ അപ്പ്", "pharmacyName": "ഫാർമസിയുടെ പേര്",
      "enterPharmacy": "പേര് നൽകുക", "didYouKnow": "👋 നിങ്ങൾക്ക് അറിയാമോ?", "tutorialBody": "അടുത്തു ഫാർമസി ഇല്ലെങ്കിൽ വിഷമിക്കേണ്ട!",
      "tutorialClick": "ഏതു ഫാർമസിയും കണ്ടെത്താൻ ", "tutorialButton": "ഫാർമസികൾ കണ്ടെത്തുക", "tutorialEnd": " ബട്ടൺ അമർത്തുക.",
      "gotIt": "മനസ്സിലായി ✓", "mapsTitle": "ഗൂഗിൾ മാപ്സ്", "mapsSub": "മാപ്പ് ഇവിടെ ദൃശ്യമാകും", "trackerTitle": "ഡിസ്പോസൽ ട്രാക്കർ", "trackerSub": "ബട്ടൺ",
      "riskTitle": "പാരിസ്ഥിതിക അപകട കാൽക്കുലേറ്റർ", "riskSub": "കണക്കുകൾ", "lbTitle": "AMR ലീഡർബോർഡ്", "lbDesc": "സുരക്ഷിതമായ നിർമാർജന പ്രവർത്തനങ്ങളിൽ മുൻപന്തിയിൽ നിൽക്കുന്നവരെ കാണുക.",
      "topUsers": "മികച്ച ഉപയോക്താക്കൾ", "topPharmacies": "മികച്ച ഫാർമസികൾ", "rank": "റാങ്ക്", "heroName": "ഹീറോയുടെ പേര്", "safeDisposals": "സുരക്ഷിത നിർമാർജനം",
      "totalPoints": "ആകെ പോയിന്റ്", "pharmacyNameLb": "ഫാർമസിയുടെ പേര്", "medsCollected": "ശേഖരിച്ച മരുന്നുകൾ", "rating": "റേറ്റിംഗ്", "partScore": "പങ്കാളിത്ത സ്കോർ", "you": "നിങ്ങൾ"
    }
  },
  gu: {
    translation: {
      "language": "ભાષા", "dashboard": "ડેશબોર્ડ", "leaderboard": "લીડરબોર્ડ", "findPharmacies": "ફાર્મસીઓ શોધો",
      "searchPlaceholder": "નજીકની ફાર્મસીઓ શોધો...", "searchBtn": "શોધો", "searchingLoc": "10 કિલોમીટરની અંદર શોધી રહ્યાં છીએ",
      "guest": "અતિથિ", "pts": "પોઈન્ટ્સ", "accountSettings": "એકાઉન્ટ સેટિંગ્સ", "disposalHistory": "નિકાલનો ઇતિહાસ", "pointsBadges": "પોઇન્ટ્સ અને બેજ",
      "logout": "લોગઆઉટ", "welcomeBack": "ફરી સ્વાગત છે", "signInSubtitle": "AMR સામે સાઇન ઇન કરો", "createAccount": "એકાઉન્ટ બનાવો",
      "signUpSubtitle": "એન્ટિમાઇક્રોબાયલ પ્રતિરોધક અભિયાનમાં જોડાઓ", "iamA": "હું એક", "user": "વપરાશકર્તા", "pharmacy": "ફાર્મસી", "loginTab": "લોગિન",
      "signupTab": "સાઇન અપ", "password": "પાસવર્ડ", "otp": "OTP", "fullName": "પૂરું નામ", "phone": "ફોન નંબર", "email": "ઇમેઇલ",
      "enterName": "નામ દાખલ કરો", "enterPhone": "ફોન નંબર દાખલ કરો", "enterEmail": "ઇમેઇલ દાખલ કરો", "enterPassword": "પાસવર્ડ દાખલ કરો",
      "forgotPassword": "પાસવર્ડ ભૂલી ગયા છો?", "sendOtp": "OTP મોકલો", "verifyOtp": "OTP ચકાસો", "signInBtn": "સાઇન ઇન", "signUpBtn": "સાઇન અપ",
      "pharmacyName": "ફાર્મસીનું નામ", "enterPharmacy": "નામ દાખલ કરો", "didYouKnow": "👋 શું તમે જાણો છો?",
      "tutorialBody": "જો કોઈ ફાર્મસી નજીકમાં ન મળે તો ચિંતા કરશો નહીં!", "tutorialClick": "કોઈપણ ફાર્મસી શોધવા માટે ", "tutorialButton": "ફાર્મસીઓ શોધો",
      "tutorialEnd": " બટન પર ક્લિક કરો.", "gotIt": "સમજી ગયા ✓", "mapsTitle": "ગૂગલ મેપ્સ", "mapsSub": "મેપ અહીં દેખાશે", "trackerTitle": "નિકાલ ટ્રેકર",
      "trackerSub": "ટ્રેકર", "riskTitle": "પર્યાવરણ રિસ્ક કેલ્ક્યુલેટર", "riskSub": "ગણતરી", "lbTitle": "AMR લીડરબોર્ડ",
      "lbDesc": "દવાઓના નિકાલ દ્વારા સૌથી મોટો પ્રભાવ કોણ પાડી રહ્યું છે તે જુઓ.", "topUsers": "ટોચના વપરાશકર્તાઓ", "topPharmacies": "ટોચની ફાર્મસીઓ",
      "rank": "રેન્ક", "heroName": "હીરોનું નામ", "safeDisposals": "સુરક્ષિત નિકાલ", "totalPoints": "કુલ પોઈન્ટ્સ", "pharmacyNameLb": "ફાર્મસીનું નામ",
      "medsCollected": "એકત્રિત દવાઓ", "rating": "રેટિંગ", "partScore": "ભાગીદારી સ્કોર", "you": "તમે"
    }
  },
  pa: {
    translation: {
      "language": "ਭਾਸ਼ਾ", "dashboard": "ਡੈਸ਼ਬੋਰਡ", "leaderboard": "ਲੀਡਰਬੋਰਡ", "findPharmacies": "ਫਾਰਮੇਸੀਆਂ ਲੱਭੋ",
      "searchPlaceholder": "ਨੇੜੇ ਦੀਆਂ ਫਾਰਮੇਸੀਆਂ ਲੱਭੋ...", "searchBtn": "ਖੋਜ", "searchingLoc": "10 ਕਿਲੋਮੀਟਰ ਦੇ ਅੰਦਰ ਖੋਜ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ",
      "guest": "ਮਹਿਮਾਨ", "pts": "ਪੁਆਇੰਟ", "accountSettings": "ਖਾਤਾ ਸੈਟਿੰਗਾਂ", "disposalHistory": "ਨਿਪਟਾਰੇ ਦਾ ਇਤਿਹਾਸ", "pointsBadges": "ਪੁਆਇੰਟ ਅਤੇ ਬੈਜ",
      "logout": "ਲੌਗਆਉਟ", "welcomeBack": "ਜੀ ਆਇਆਂ ਨੂੰ", "signInSubtitle": "AMR ਮੁਹਿੰਮ ਨੂੰ ਜਾਰੀ ਰੱਖਣ ਲਈ ਸਾਈਨ ਇਨ ਕਰੋ", "createAccount": "ਖਾਤਾ ਬਣਾਓ",
      "signUpSubtitle": "ਅੰਦੋਲਨ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ", "iamA": "ਮੈਂ ਇੱਕ", "user": "ਉਪਭੋਗਤਾ", "pharmacy": "ਫਾਰਮੇਸੀ", "loginTab": "ਲੌਗਇਨ", "signupTab": "ਸਾਈਨ ਅੱਪ",
      "password": "ਪਾਸਵਰਡ", "otp": "OTP", "fullName": "ਪੂਰਾ ਨਾਮ", "phone": "ਫੋਨ ਨੰਬਰ", "email": "ਈਮੇਲ", "enterName": "ਨਾਮ ਦਰਜ ਕਰੋ",
      "enterPhone": "ਫੋਨ ਨੰਬਰ ਦਰਜ ਕਰੋ", "enterEmail": "ਈਮੇਲ ਦਰਜ ਕਰੋ", "enterPassword": "ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ", "forgotPassword": "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ ਹੋ?",
      "sendOtp": "OTP ਭੇਜੋ", "verifyOtp": "OTP ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ", "signInBtn": "ਸਾਈਨ ਇਨ", "signUpBtn": "ਸਾਈਨ ਅੱਪ", "pharmacyName": "ਫਾਰਮੇਸੀ ਦਾ ਨਾਮ",
      "enterPharmacy": "ਨਾਮ ਦਰਜ ਕਰੋ", "didYouKnow": "👋 ਕੀ ਤੁਹਾਨੂੰ ਪਤਾ ਹੈ?", "tutorialBody": "ਜੇਕਰ ਕੋਈ ਫਾਰਮੇਸੀ ਨਹੀਂ ਮਿਲਦੀ ਤਾਂ ਚਿੰਤਾ ਨਾ ਕਰੋ!",
      "tutorialClick": "ਕੋਈ ਵੀ ਫਾਰਮੇਸੀ ਲੱਭਣ ਲਈ ", "tutorialButton": "ਫਾਰਮੇਸੀਆਂ ਲੱਭੋ", "tutorialEnd": " ਬਟਨ 'ਤੇ ਕਲਿੱਕ ਕਰੋ।", "gotIt": "ਸਮਝ ਗਏ ✓",
      "mapsTitle": "ਗੂਗਲ ਮੈਪਸ", "mapsSub": "ਨਕਸ਼ਾ ਇੱਥੇ ਦਿਖਾਈ ਦੇਵੇਗਾ", "trackerTitle": "ਨਿਪਟਾਰਾ ਟਰੈਕਰ", "trackerSub": "ਟਰੈਕਰ", "riskTitle": "ਵਾਤਾਵਰਣ ਜੋਖਮ ਕੈਲਕੁਲੇਟਰ",
      "riskSub": "ਗਣਿਤ", "lbTitle": "AMR ਲੀਡਰਬੋਰਡ", "lbDesc": "ਦੇਖੋ ਕਿ ਕੌਣ ਸਭ ਤੋਂ ਵੱਡਾ ਯੋਗਦਾਨ ਪਾ ਰਿਹਾ ਹੈ।", "topUsers": "ਪ੍ਰਮੁੱਖ ਉਪਭੋਗਤਾ",
      "topPharmacies": "ਪ੍ਰਮੁੱਖ ਫਾਰਮੇਸੀਆਂ", "rank": "ਰੈਂਕ", "heroName": "ਹੀਰੋ ਦਾ ਨਾਮ", "safeDisposals": "ਸੁਰੱਖਿਅਤ ਨਿਪਟਾਰਾ", "totalPoints": "ਕੁੱਲ ਪੁਆਇੰਟ",
      "pharmacyNameLb": "ਫਾਰਮੇਸੀ ਦਾ ਨਾਮ", "medsCollected": "ਇਕੱਠੀਆਂ ਕੀਤੀਆਂ ਦਵਾਈਆਂ", "rating": "ਰੇਟਿੰਗ", "partScore": "ਭਾਗੀਦਾਰੀ ਸਕੋਰ", "you": "ਤੁਸੀਂ"
    }
  },
  kn: {
    translation: {
      "language": "ಭಾಷೆ", "dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", "leaderboard": "ಲೀಡರ್‌ಬೋರ್ಡ್", "findPharmacies": "ಫಾರ್ಮಸಿಗಳನ್ನು ಹುಡುಕಿ",
      "searchPlaceholder": "ನಿಮ್ಮ ಸಮೀಪದ ಫಾರ್ಮಸಿಗಳನ್ನು ಹುಡುಕಿ...", "searchBtn": "ಹುಡುಕಿ", "searchingLoc": "10 ಕಿಮೀ ಒಳಗೆ ಹುಡುಕಲಾಗುತ್ತಿದೆ",
      "guest": "ಅತಿಥಿ", "pts": "ಪಾಯಿಂಟ್‌ಗಳು", "accountSettings": "ಖಾತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳು", "disposalHistory": "ವಿಲೇವಾರಿ ಇತಿಹಾಸ", "pointsBadges": "ಬ್ಯಾಡ್ಜ್‌ಗಳು",
      "logout": "ಲಾಗ್ಔಟ್", "welcomeBack": "ಮತ್ತೆ ಸ್ವಾಗತ", "signInSubtitle": "AMR ವಿರುದ್ಧ ನಿಮ್ಮ ಕಾರ್ಯಾಚರಣೆಯನ್ನು ಮುಂದುವರಿಸಲು ಲಾಗಿನ್", "createAccount": "ಖಾತೆಯನ್ನು ರಚಿಸಿ",
      "signUpSubtitle": "ಆಂಟಿಮೈಕ್ರೊಬಿಯಲ್ ಪ್ರತಿರೋಧದ ಚಳುವಳಿಗೆ ಸೇರಿಕೊಳ್ಳಿ", "iamA": "ನಾನು", "user": "ಬಳಕೆದಾರ", "pharmacy": "ಫಾರ್ಮಸಿ",
      "loginTab": "ಲಾಗಿನ್", "signupTab": "ಸೈನ್ ಅಪ್", "password": "ಪಾಸ್‌ವರ್ಡ್", "otp": "OTP", "fullName": "ಪೂರ್ಣ ಹೆಸರು", "phone": "ಫೋನ್ ನಂಬರ್",
      "email": "ಇಮೇಲ್", "enterName": "ಹೆಸರನ್ನು ನಮೂದಿಸಿ", "enterPhone": "ಫೋನ್ ನಂಬರ್ ನಮೂದಿಸಿ", "enterEmail": "ಇಮೇಲ್ ನಮೂದಿಸಿ", "enterPassword": "ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",
      "forgotPassword": "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?", "sendOtp": "OTP ಕಳುಹಿಸಿ", "verifyOtp": "OTP ಪರಿಶೀಲಿಸಿ", "signInBtn": "ಸೈನ್ ಇನ್", "signUpBtn": "ಸೈನ್ ಅಪ್",
      "pharmacyName": "ಫಾರ್ಮಸಿ ಹೆಸರು", "enterPharmacy": "ಹೆಸರು ನಮೂದಿಸಿ", "didYouKnow": "👋 ನಿಮಗೆ ಗೊತ್ತೆ?", "tutorialBody": "ನಿಮಗೆ ಸಮೀಪದಲ್ಲಿ எதுவும் ಸಿಗಲಿಲ್ಲವಾದರೆ ಚಿಂತಿಸಬೇಡಿ!",
      "tutorialClick": "ಲೈವ್ ಹುಡುಕಾಟ ಮೂಲಕ ಪತ್ತೆಹಚ್ಚಲು ", "tutorialButton": "ಫಾರ್ಮಸಿಗಳನ್ನು ಹುಡುಕಿ", "tutorialEnd": " ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.",
      "gotIt": "ಅರ್ಥವಾಯಿತು ✓", "mapsTitle": "ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್", "mapsSub": "ಮ್ಯಾಪ್ ಕಾಣಿಸಿಕೊಳ್ಳಲಿದೆ", "trackerTitle": "ವಿಲೇವಾರಿ ಮತ್ತು ಟ್ರ್ಯಾಕರ್", "trackerSub": "ಟ್ರ್ಯಾಕರ್",
      "riskTitle": "ಪರಿಸರ ಅಪಾಯದ ಕ್ಯಾಲ್ಕುಲೇಟರ್", "riskSub": "ಲೆಕ್ಕಾಚಾರ", "lbTitle": "AMR ಲೀಡರ್‌ಬೋರ್ಡ್",
      "lbDesc": "ಸುರಕ್ಷಿತ ಔಷಧಿ ವಿಲೇವಾರಿ ಮೂಲಕ ಪರಿಸರವನ್ನು ರಕ್ಷಿಸುವವರನ್ನು ನೋಡಿ.", "topUsers": "ಉನ್ನತ ಬಳಕೆದಾರರು", "topPharmacies": "ಉನ್ನತ ಫಾರ್ಮಸಿಗಳು",
      "rank": "ರ‍್ಯಾಂಕ್", "heroName": "ಹೀರೋ ಹೆಸರು", "safeDisposals": "ಸುರಕ್ಷಿತ ವಿಲೇವಾರಿ", "totalPoints": "ಒಟ್ಟು ಪಾಯಿಂಟ್‌ಗಳು", "pharmacyNameLb": "ಫಾರ್ಮಸಿ ಹೆಸರು",
      "medsCollected": "ಸಂಗ್ರಹಿಸಿದ ಔಷಧಿಗಳು", "rating": "ರೇಟಿಂಗ್", "partScore": "ಭಾಗವಹಿಸುವಿಕೆ ಸ್ಕೋರ್", "you": "ನೀವು"
    }
  }
};

const savedLanguage = localStorage.getItem('appLanguage') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage, 
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
