"""
Disease Remedies Database for Krishi AI
Comprehensive treatments tailored for Nepali farmers
"""

DISEASE_REMEDIES = {
    "Apple___Apple_scab": {
        "name": "Apple Scab",
        "name_nepali": "स्याउ दाग रोग",
        "severity": "moderate",
        "symptoms": [
            "Dark, olive-green to brown spots on leaves",
            "Velvety texture on infected areas",
            "Premature leaf drop",
            "Scabby lesions on fruit"
        ],
        "organic_treatments": [
            "Apply neem oil spray (20ml per liter) weekly",
            "Use Bordeaux mixture (copper sulfate + lime)",
            "Remove and burn fallen infected leaves",
            "Apply compost tea as foliar spray"
        ],
        "chemical_treatments": [
            "Mancozeb 75% WP (2.5g per liter) - Available in Nepal",
            "Copper oxychloride 50% WP (3g per liter)",
            "Captan 50% WP (2g per liter)",
            "Apply every 10-14 days during wet season"
        ],
        "prevention": [
            "Plant resistant varieties like 'Royal Delicious'",
            "Ensure proper spacing for air circulation",
            "Prune trees to allow sunlight penetration",
            "Apply preventive spray before monsoon",
            "Rake and destroy fallen leaves regularly"
        ]
    },
    
    "Apple___Black_rot": {
        "name": "Apple Black Rot",
        "name_nepali": "स्याउ कालो सड्ने रोग",
        "severity": "high",
        "symptoms": [
            "Brown circular spots with purple margins on leaves",
            "Black rot on fruit starting from blossom end",
            "Cankers on branches with rough, black edges",
            "Fruit mummifies and stays on tree"
        ],
        "organic_treatments": [
            "Prune out infected branches 15cm below visible damage",
            "Apply neem cake powder around base (500g per tree)",
            "Spray garlic extract (100g crushed garlic in 1L water)",
            "Use cow urine spray (1:10 dilution) weekly"
        ],
        "chemical_treatments": [
            "Thiophanate-methyl 70% WP (1g per liter)",
            "Carbendazim 50% WP (1g per liter) - Common in Nepal",
            "Mancozeb + Carbendazim combination",
            "Spray at petal fall and repeat every 14 days"
        ],
        "prevention": [
            "Remove mummified fruits from trees and ground",
            "Maintain tree vigor with balanced fertilization",
            "Avoid overhead irrigation during fruiting",
            "Apply lime-sulfur spray during dormancy",
            "Practice crop rotation in orchard floor"
        ]
    },

    "Apple___Cedar_apple_rust": {
        "name": "Cedar Apple Rust",
        "name_nepali": "स्याउ खिया रोग",
        "severity": "moderate",
        "symptoms": [
            "Bright orange spots on upper leaf surface",
            "Yellow lesions with red borders",
            "Tube-like growths on leaf undersides",
            "Premature defoliation in severe cases"
        ],
        "organic_treatments": [
            "Remove nearby juniper/cedar trees if possible",
            "Spray sulfur solution (3g per liter)",
            "Apply baking soda spray (5g per liter with soap)",
            "Use compost tea with added garlic"
        ],
        "chemical_treatments": [
            "Myclobutanil fungicide (0.5ml per liter)",
            "Propiconazole 25% EC (1ml per liter)",
            "Mancozeb alternated with systemic fungicides",
            "Begin sprays at bud break"
        ],
        "prevention": [
            "Plant rust-resistant apple varieties",
            "Maintain 500m distance from cedar trees",
            "Apply preventive fungicide before spring rains",
            "Ensure good drainage and air circulation",
            "Fertilize properly to maintain tree health"
        ]
    },

    "Apple___healthy": {
        "name": "Healthy Apple",
        "name_nepali": "स्वस्थ स्याउ",
        "severity": "none",
        "symptoms": [
            "No disease symptoms detected",
            "Leaves are vibrant green",
            "No spots, discoloration, or damage"
        ],
        "organic_treatments": [
            "Continue regular neem oil spray as preventive (monthly)",
            "Apply compost mulch around tree base",
            "Maintain good orchard hygiene"
        ],
        "chemical_treatments": [
            "Preventive fungicide application before monsoon",
            "Copper-based spray every 3-4 weeks in wet season"
        ],
        "prevention": [
            "Maintain current good practices",
            "Monitor regularly for early disease signs",
            "Ensure balanced NPK fertilization",
            "Prune for good air circulation",
            "Keep orchard floor clean"
        ]
    },

    "Blueberry___healthy": {
        "name": "Healthy Blueberry",
        "name_nepali": "स्वस्थ ब्लुबेरी",
        "severity": "none",
        "symptoms": [
            "No disease symptoms detected",
            "Healthy foliage and growth"
        ],
        "organic_treatments": [
            "Maintain acidic soil (pH 4.5-5.5) with sulfur",
            "Apply organic mulch regularly",
            "Use compost tea monthly"
        ],
        "chemical_treatments": [
            "Preventive copper spray if needed",
            "Maintain soil acidity with aluminum sulfate"
        ],
        "prevention": [
            "Continue proper irrigation",
            "Monitor pH levels regularly",
            "Ensure good drainage",
            "Apply balanced fertilizer for acid-loving plants"
        ]
    },

    "Cherry_(including_sour)___Powdery_mildew": {
        "name": "Cherry Powdery Mildew",
        "name_nepali": "चेरी धुलो फफुंद",
        "severity": "moderate",
        "symptoms": [
            "White powdery coating on leaves and shoots",
            "Curled and distorted young leaves",
            "Stunted shoot growth",
            "Reduced fruit quality"
        ],
        "organic_treatments": [
            "Spray sulfur solution (3g per liter water)",
            "Apply baking soda solution (5g per liter + 2ml soap)",
            "Use neem oil (15ml per liter) weekly",
            "Milk spray (1:9 milk:water ratio)"
        ],
        "chemical_treatments": [
            "Sulfex 80% WP (2g per liter) - Available in Nepal",
            "Hexaconazole 5% EC (2ml per liter)",
            "Carbendazim 50% WP (1g per liter)",
            "Spray at first sign, repeat every 10 days"
        ],
        "prevention": [
            "Plant in full sun with good air movement",
            "Avoid overhead watering",
            "Prune to open up canopy",
            "Remove infected shoots promptly",
            "Apply sulfur dust before disease appears"
        ]
    },

    "Cherry_(including_sour)___healthy": {
        "name": "Healthy Cherry",
        "name_nepali": "स्वस्थ चेरी",
        "severity": "none",
        "symptoms": [
            "No disease symptoms detected",
            "Vigorous growth and healthy foliage"
        ],
        "organic_treatments": [
            "Continue organic practices",
            "Monthly neem oil spray as preventive",
            "Maintain proper mulching"
        ],
        "chemical_treatments": [
            "Preventive copper spray before monsoon",
            "Bordeaux mixture application if needed"
        ],
        "prevention": [
            "Maintain current care regimen",
            "Ensure proper pruning and spacing",
            "Regular monitoring for pests and diseases",
            "Balanced fertilization program"
        ]
    },

    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
        "name": "Corn Gray Leaf Spot",
        "name_nepali": "मकै खैरो दाग रोग",
        "severity": "moderate",
        "symptoms": [
            "Rectangular gray-brown lesions on leaves",
            "Lesions parallel to leaf veins",
            "Yellowing around infected areas",
            "Can cause severe defoliation"
        ],
        "organic_treatments": [
            "Remove and burn infected lower leaves",
            "Apply neem oil (20ml per liter) bi-weekly",
            "Spray cow urine solution (1:10 dilution)",
            "Use Trichoderma powder (5g per liter)"
        ],
        "chemical_treatments": [
            "Mancozeb 75% WP (2.5g per liter) - Common in Nepal markets",
            "Propiconazole 25% EC (1ml per liter)",
            "Azoxystrobin 23% SC (1ml per liter)",
            "Apply at first symptom, repeat every 14 days"
        ],
        "prevention": [
            "Use resistant hybrid varieties like 'Rampur Hybrid-2'",
            "Practice crop rotation with non-host crops",
            "Plow under crop residues after harvest",
            "Plant at recommended spacing (60x25cm)",
            "Avoid late planting in monsoon"
        ]
    },

    "Corn_(maize)___Common_rust_": {
        "name": "Corn Common Rust",
        "name_nepali": "मकै खिया रोग",
        "severity": "moderate",
        "symptoms": [
            "Circular to oval rust pustules on leaves",
            "Reddish-brown spores that rub off easily",
            "Pustules on both leaf surfaces",
            "Yellowing of heavily infected leaves"
        ],
        "organic_treatments": [
            "Apply sulfur dust (2kg per kattha)",
            "Neem extract spray (50ml neem oil per 10L water)",
            "Remove severely infected leaves",
            "Garlic-chili spray (blend and filter)"
        ],
        "chemical_treatments": [
            "Mancozeb 75% WP (400g per kattha in 100L water)",
            "Zineb 75% WP (2.5g per liter)",
            "Propiconazole 25% EC (1ml per liter)",
            "Spray when rust first appears"
        ],
        "prevention": [
            "Plant resistant varieties available in Nepal",
            "Early sowing to avoid peak disease period",
            "Adequate spacing for air circulation",
            "Balanced NPK fertilization (80:60:40 kg/ha)",
            "Keep fields free from volunteer corn plants"
        ]
    },

    "Corn_(maize)___Northern_Leaf_Blight": {
        "name": "Northern Leaf Blight",
        "name_nepali": "मकै उत्तरी पात झुल्सा",
        "severity": "high",
        "symptoms": [
            "Long, elliptical gray-green lesions on leaves",
            "Lesions grow to 2.5-15cm long",
            "Starts on lower leaves, moves upward",
            "Can reduce yield by 30-50%"
        ],
        "organic_treatments": [
            "Apply Trichoderma viride (1kg per kattha mixed with FYM)",
            "Neem cake application in soil (200kg/ha)",
            "Bordeaux mixture spray (1% solution)",
            "Remove and destroy infected plant debris"
        ],
        "chemical_treatments": [
            "Mancozeb 75% WP (2.5kg per ha)",
            "Carbendazim + Mancozeb combination (2g per liter)",
            "Propiconazole 25% EC (500ml per ha)",
            "First spray at knee-high stage, repeat after 15 days"
        ],
        "prevention": [
            "Use resistant hybrids like 'Gaurav', 'Rampur Composite'",
            "Deep plowing to bury crop residue",
            "Timely sowing (March-April for spring, June for monsoon)",
            "Proper field drainage to reduce humidity",
            "Avoid excessive nitrogen fertilizer"
        ]
    },

    "Corn_(maize)___healthy": {
        "name": "Healthy Corn",
        "name_nepali": "स्वस्थ मकै",
        "severity": "none",
        "symptoms": [
            "No disease symptoms detected",
            "Healthy green foliage",
            "Normal growth and development"
        ],
        "organic_treatments": [
            "Continue organic compost application",
            "Maintain proper crop rotation",
            "Use biopesticides preventively"
        ],
        "chemical_treatments": [
            "No treatment needed",
            "Preventive fungicide before monsoon if history of disease"
        ],
        "prevention": [
            "Maintain current good practices",
            "Ensure timely weeding",
            "Proper fertilizer application (urea at knee-high and tasseling)",
            "Monitor regularly for early detection",
            "Maintain field sanitation"
        ]
    },

    "Grape___Black_rot": {
        "name": "Grape Black Rot",
        "name_nepali": "अंगुर कालो सड्ने रोग",
        "severity": "high",
        "symptoms": [
            "Reddish-brown circular spots on leaves",
            "Black, shriveled 'mummy' berries",
            "Rotted berries remain attached to cluster",
            "Can destroy entire crop if unchecked"
        ],
        "organic_treatments": [
            "Remove and destroy all mummified berries",
            "Spray Bordeaux mixture (1% solution) weekly",
            "Apply neem oil (20ml per liter) alternately",
            "Prune for better air circulation"
        ],
        "chemical_treatments": [
            "Mancozeb 75% WP (2.5g per liter)",
            "Thiophanate-methyl 70% WP (1g per liter)",
            "Captan 50% WP (2g per liter)",
            "Begin at bud break, continue every 10-14 days"
        ],
        "prevention": [
            "Prune vines to allow air and light penetration",
            "Remove crop debris and mummies before spring",
            "Avoid overhead irrigation during fruiting",
            "Apply dormant spray in late winter",
            "Maintain balanced fertilization"
        ]
    },

    "Grape___Esca_(Black_Measles)": {
        "name": "Grape Esca (Black Measles)",
        "name_nepali": "अंगुर काला दाग रोग",
        "severity": "high",
        "symptoms": [
            "Tiger-stripe pattern on leaves (yellow-green striping)",
            "Sudden wilting of shoots in summer",
            "Dark streaks in wood when cut",
            "Berry spots with dark borders"
        ],
        "organic_treatments": [
            "Prune out infected wood during dormancy",
            "Apply Trichoderma paste on pruning wounds",
            "Improve soil health with compost and biochar",
            "Paint wounds with clay-lime mixture"
        ],
        "chemical_treatments": [
            "No cure available",
            "Sodium arsenite for wound protection (where legal)",
            "Copper-based fungicides for wound sealing",
            "Focus on prevention and management"
        ],
        "prevention": [
            "Minimize pruning wounds; prune in dry weather",
            "Apply wound protectants immediately after cutting",
            "Maintain vine vigor with proper nutrition",
            "Avoid water stress",
            "Remove and burn infected vines completely"
        ]
    },

    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "name": "Grape Leaf Blight",
        "name_nepali": "अंगुर पात झुल्सा",
        "severity": "moderate",
        "symptoms": [
            "Brown, angular spots on leaves",
            "Dark brown margins with lighter centers",
            "Spots may coalesce causing leaf blight",
            "Premature defoliation"
        ],
        "organic_treatments": [
            "Neem oil spray (20ml per liter) weekly",
            "Copper fungicide (2g per liter)",
            "Remove infected leaves promptly",
            "Improve air circulation through pruning"
        ],
        "chemical_treatments": [
            "Mancozeb 75% WP (2.5g per liter)",
            "Carbendazim 50% WP (1g per liter)",
            "Hexaconazole 5% EC (2ml per liter)",
            "Spray every 10-15 days during wet season"
        ],
        "prevention": [
            "Train vines on proper trellis for air flow",
            "Avoid excessive nitrogen fertilizer",
            "Remove weeds from vineyard floor",
            "Practice clean cultivation",
            "Apply preventive copper spray in spring"
        ]
    },

    "Grape___healthy": {
        "name": "Healthy Grape",
        "name_nepali": "स्वस्थ अंगुर",
        "severity": "none",
        "symptoms": [
            "No disease symptoms detected",
            "Healthy vine growth and leaf color"
        ],
        "organic_treatments": [
            "Continue regular neem oil applications",
            "Maintain organic mulch and compost",
            "Preventive copper spray before monsoon"
        ],
        "chemical_treatments": [
            "Preventive fungicide program during susceptible stages",
            "Bordeaux mixture before flowering"
        ],
        "prevention": [
            "Maintain current vineyard management",
            "Regular monitoring and scouting",
            "Proper pruning and canopy management",
            "Balanced fertilization and irrigation"
        ]
    },

    "Orange___Haunglongbing_(Citrus_greening)": {
        "name": "Citrus Greening (HLB)",
        "name_nepali": "सुन्तला हरियाली रोग",
        "severity": "critical",
        "symptoms": [
            "Yellowing of leaf veins (blotchy mottling)",
            "Small, lopsided, bitter fruits",
            "Premature fruit drop",
            "Stunted tree growth and dieback"
        ],
        "organic_treatments": [
            "No cure - focus on psyllid control",
            "Neem oil for psyllid management (20ml per liter)",
            "Remove severely infected trees immediately",
            "Maintain tree nutrition to slow progression"
        ],
        "chemical_treatments": [
            "Imidacloprid 17.8% SL for psyllid (0.5ml per liter)",
            "Thiamethoxam 25% WG (0.2g per liter)",
            "No cure for the disease itself",
            "Foliar nutrients to support tree health"
        ],
        "prevention": [
            "Use certified disease-free planting material only",
            "Control Asian citrus psyllid vectors aggressively",
            "Remove infected trees to prevent spread",
            "Quarantine new plants before introducing",
            "Plant resistant rootstocks if available"
        ]
    },

    "Peach___Bacterial_spot": {
        "name": "Peach Bacterial Spot",
        "name_nepali": "आरु ब्याक्टेरियल दाग",
        "severity": "moderate",
        "symptoms": [
            "Small, purple-black spots on leaves",
            "Spots may have yellow halos",
            "Sunken lesions on fruit",
            "Leaf drop in severe infections"
        ],
        "organic_treatments": [
            "Copper-based sprays (Bordeaux mixture 1%)",
            "Remove and destroy infected plant parts",
            "Avoid overhead watering",
            "Apply compost to improve plant vigor"
        ],
        "chemical_treatments": [
            "Copper oxychloride 50% WP (3g per liter)",
            "Streptomycin sulfate (100ppm) where available",
            "Spray during dormancy and at petal fall",
            "Repeat every 7-10 days during wet weather"
        ],
        "prevention": [
            "Plant resistant varieties",
            "Prune to improve air circulation",
            "Avoid working in wet orchards",
            "Apply copper spray before spring rains",
            "Maintain balanced fertilization"
        ]
    },

    "Peach___healthy": {
        "name": "Healthy Peach",
        "name_nepali": "स्वस्थ आरु",
        "severity": "none",
        "symptoms": [
            "No disease symptoms detected",
            "Healthy foliage and fruit development"
        ],
        "organic_treatments": [
            "Continue preventive organic practices",
            "Monthly neem oil application",
            "Maintain proper mulching"
        ],
        "chemical_treatments": [
            "Dormant oil spray in winter",
            "Preventive copper application before bud break"
        ],
        "prevention": [
            "Continue current management practices",
            "Regular pruning for tree health",
            "Proper thinning of fruit",
            "Monitor for early pest/disease signs"
        ]
    },

    "Pepper,_bell___Bacterial_spot": {
        "name": "Pepper Bacterial Spot",
        "name_nepali": "खुर्सानी ब्याक्टेरियल दाग",
        "severity": "moderate",
        "symptoms": [
            "Small, raised spots on leaves and fruit",
            "Dark brown to black lesions",
            "Leaf yellowing and drop",
            "Fruit becomes unmarketable"
        ],
        "organic_treatments": [
            "Copper-based sprays (Bordeaux mixture)",
            "Remove infected plants immediately",
            "Apply neem extract (50ml per 10L)",
            "Improve drainage and reduce leaf wetness"
        ],
        "chemical_treatments": [
            "Copper oxychloride 50% WP (3g per liter)",
            "Streptocycline 500ppm spray",
            "Spray every 7-10 days during wet period",
            "Alternate with organic treatments"
        ],
        "prevention": [
            "Use disease-free certified seeds",
            "Practice 3-year crop rotation",
            "Avoid overhead irrigation",
            "Mulch with plastic or straw",
            "Stake plants for better air circulation"
        ]
    },

    "Pepper,_bell___healthy": {
        "name": "Healthy Bell Pepper",
        "name_nepali": "स्वस्थ भेडे खुर्सानी",
        "severity": "none",
        "symptoms": [
            "No disease symptoms detected",
            "Healthy growth and fruiting"
        ],
        "organic_treatments": [
            "Continue organic fertilization",
            "Weekly neem oil spray as preventive",
            "Maintain mulching"
        ],
        "chemical_treatments": [
            "Preventive copper spray if weather conducive to disease",
            "Balanced NPK fertilization"
        ],
        "prevention": [
            "Maintain current practices",
            "Proper watering (avoid wetting foliage)",
            "Regular monitoring",
            "Timely harvesting"
        ]
    },

    "Potato___Early_blight": {
        "name": "Potato Early Blight",
        "name_nepali": "आलु अर्ली ब्लाइट",
        "severity": "moderate",
        "symptoms": [
            "Dark brown circular spots with concentric rings (target pattern)",
            "Yellowing of leaves around spots",
            "Premature defoliation of lower leaves",
            "Lesions on tubers"
        ],
        "organic_treatments": [
            "Remove and destroy infected leaves",
            "Spray neem oil (20ml per liter) weekly",
            "Apply Trichoderma powder (5g per liter)",
            "Use cow urine solution (1:10 dilution)"
        ],
        "chemical_treatments": [
            "Mancozeb 75% WP (2.5g per liter) - Widely available in Nepal",
            "Chlorothalonil 75% WP (2g per liter)",
            "Carbendazim + Mancozeb (2g per liter)",
            "Spray every 7-10 days starting at first symptom"
        ],
        "prevention": [
            "Use certified disease-free seed potatoes",
            "Practice 3-4 year crop rotation",
            "Hill up soil around plants",
            "Avoid overhead irrigation in evening",
            "Apply balanced fertilizer (avoid excess nitrogen)"
        ]
    },

    "Potato___Late_blight": {
        "name": "Potato Late Blight",
        "name_nepali": "आलु लेट ब्लाइट",
        "severity": "critical",
        "symptoms": [
            "Water-soaked lesions on leaves",
            "White fungal growth on leaf undersides",
            "Black, rotten stems",
            "Brown, firm rot on tubers",
            "Can destroy crop in 1-2 weeks"
        ],
        "organic_treatments": [
            "Immediate removal of infected plants",
            "Bordeaux mixture 1% (strong copper spray)",
            "Cannot control with organics alone in severe outbreaks",
            "Improve drainage immediately"
        ],
        "chemical_treatments": [
            "Metalaxyl + Mancozeb (Ridomil Gold 2.5g per liter) - Essential",
            "Cymoxanil + Mancozeb (Curzate 2g per liter)",
            "Dimethomorph + Mancozeb (Forum 1.5g per liter)",
            "Spray every 5-7 days during monsoon, CRITICAL"
        ],
        "prevention": [
            "Plant resistant varieties like 'Kufri Jyoti', 'Janakdev'",
            "Timely planting (Sept-Oct in Nepal)",
            "Destroy volunteer potato plants",
            "PREVENTIVE fungicide spray before monsoon",
            "Monitor weather - spray before rain periods",
            "Use healthy seed from disease-free areas"
        ]
    },

    "Potato___healthy": {
        "name": "Healthy Potato",
        "name_nepali": "स्वस्थ आलु",
        "severity": "none",
        "symptoms": [
            "No disease symptoms detected",
            "Healthy foliage and tuber development"
        ],
        "organic_treatments": [
            "Continue good agricultural practices",
            "Preventive Bordeaux spray during monsoon",
            "Regular monitoring"
        ],
        "chemical_treatments": [
            "Preventive fungicide before monsoon season",
            "Proper fertilization schedule"
        ],
        "prevention": [
            "Maintain current practices",
            "Use certified seed",
            "Proper hilling and drainage",
            "Monitor for late blight especially in monsoon"
        ]
    },

    "Raspberry___healthy": {
        "name": "Healthy Raspberry",
        "name_nepali": "स्वस्थ रास्पबेरी",
        "severity": "none",
        "symptoms": [
            "No disease symptoms detected",
            "Healthy canes and foliage"
        ],
        "organic_treatments": [
            "Continue organic practices",
            "Regular pruning of old canes",
            "Maintain mulch layer"
        ],
        "chemical_treatments": [
            "Preventive copper spray if needed",
            "Balanced fertilization"
        ],
        "prevention": [
            "Maintain current care",
            "Proper spacing for air flow",
            "Remove fruited canes after harvest",
            "Regular monitoring"
        ]
    },

    "Soybean___healthy": {
        "name": "Healthy Soybean",
        "name_nepali": "स्वस्थ भटमास",
        "severity": "none",
        "symptoms": [
            "No disease symptoms detected",
            "Healthy plant growth"
        ],
        "organic_treatments": [
            "Continue crop rotation",
            "Apply Rhizobium culture for nitrogen fixation",
            "Regular weeding"
        ],
        "chemical_treatments": [
            "Preventive fungicide if disease history in field",
            "Balanced fertilization"
        ],
        "prevention": [
            "Maintain current practices",
            "Proper seed treatment",
            "Monitor for pod diseases during maturity",
            "Harvest at proper moisture"
        ]
    },

    "Squash___Powdery_mildew": {
        "name": "Squash Powdery Mildew",
        "name_nepali": "फर्सी धुलो फफुंद",
        "severity": "moderate",
        "symptoms": [
            "White powdery spots on leaves",
            "Yellow patches on upper leaf surface",
            "Leaves curl and dry up",
            "Reduced fruit quality and size"
        ],
        "organic_treatments": [
            "Baking soda spray (5g per liter + 2ml soap)",
            "Milk spray (1:10 milk:water)",
            "Neem oil (15ml per liter) weekly",
            "Sulfur dust application (2g per liter)"
        ],
        "chemical_treatments": [
            "Sulfex 80% WP (2g per liter)",
            "Hexaconazole 5% EC (2ml per liter)",
            "Carbendazim 50% WP (1g per liter)",
            "Spray every 7-10 days"
        ],
        "prevention": [
            "Plant in full sun with good spacing",
            "Avoid overhead watering",
            "Remove old infected leaves",
            "Apply sulfur dust preventively",
            "Plant resistant varieties if available"
        ]
    },

    "Strawberry___Leaf_scorch": {
        "name": "Strawberry Leaf Scorch",
        "name_nepali": "स्ट्रबेरी पात जलेको",
        "severity": "moderate",
        "symptoms": [
            "Purple to brown blotches on leaves",
            "Irregular brown patches",
            "Leaves appear scorched",
            "Reduced plant vigor"
        ],
        "organic_treatments": [
            "Remove and destroy infected leaves",
            "Neem oil spray (20ml per liter)",
            "Improve air circulation",
            "Copper-based organic fungicide"
        ],
        "chemical_treatments": [
            "Mancozeb 75% WP (2.5g per liter)",
            "Captan 50% WP (2g per liter)",
            "Spray at 10-14 day intervals",
            "Begin applications at first bloom"
        ],
        "prevention": [
            "Use disease-free planting material",
            "Adequate plant spacing (30cm)",
            "Mulch with plastic or straw",
            "Drip irrigation to avoid wetting foliage",
            "Remove old foliage after harvest"
        ]
    },

    "Strawberry___healthy": {
        "name": "Healthy Strawberry",
        "name_nepali": "स्वस्थ स्ट्रबेरी",
        "severity": "none",
        "symptoms": [
            "No disease symptoms detected",
            "Healthy plants and fruit production"
        ],
        "organic_treatments": [
            "Continue organic practices",
            "Maintain proper mulching",
            "Regular monitoring"
        ],
        "chemical_treatments": [
            "Preventive fungicide if weather conducive",
            "Balanced fertilization"
        ],
        "prevention": [
            "Maintain current practices",
            "Proper irrigation management",
            "Timely harvesting",
            "Runner management"
        ]
    },

    "Tomato___Bacterial_spot": {
        "name": "Tomato Bacterial Spot",
        "name_nepali": "गोलभेडा ब्याक्टेरियल दाग",
        "severity": "moderate",
        "symptoms": [
            "Small dark spots with yellow halos on leaves",
            "Raised black spots on fruits",
            "Leaf yellowing and drop",
            "Fruit becomes unmarketable"
        ],
        "organic_treatments": [
            "Copper-based sprays (Bordeaux 1%)",
            "Remove infected plants",
            "Avoid working in wet fields",
            "Improve drainage"
        ],
        "chemical_treatments": [
            "Copper oxychloride 50% WP (3g per liter)",
            "Streptocycline 500ppm",
            "Spray every 7-10 days in rainy season",
            "Start preventive sprays early"
        ],
        "prevention": [
            "Use certified disease-free seeds/transplants",
            "Practice 3-year crop rotation with non-solanaceous crops",
            "Stake and prune for air circulation",
            "Drip irrigation instead of overhead",
            "Plastic mulching to prevent soil splash"
        ]
    },

    "Tomato___Early_blight": {
        "name": "Tomato Early Blight",
        "name_nepali": "गोलभेडा अर्ली ब्लाइट",
        "severity": "moderate",
        "symptoms": [
            "Target-shaped dark spots with concentric rings",
            "Yellowing around lesions",
            "Lower leaves affected first",
            "Collar rot at soil line",
            "Fruit with dark lesions near stem"
        ],
        "organic_treatments": [
            "Remove lower infected leaves",
            "Neem oil spray (20ml per liter) weekly",
            "Trichoderma application (5g per liter)",
            "Cow urine spray (1:10 dilution)"
        ],
        "chemical_treatments": [
            "Mancozeb 75% WP (2.5g per liter) - Very common in Nepal",
            "Chlorothalonil 75% WP (2g per liter)",
            "Carbendazim + Mancozeb (2g per liter)",
            "Spray every 7-10 days starting at flowering"
        ],
        "prevention": [
            "Stake plants for air circulation",
            "Mulch to prevent soil splash",
            "Avoid overhead watering",
            "Remove volunteer tomatoes",
            "Crop rotation with non-solanaceous crops",
            "Balanced fertilization (avoid excess nitrogen)"
        ]
    },

    "Tomato___Late_blight": {
        "name": "Tomato Late Blight",
        "name_nepali": "गोलभेडा लेट ब्लाइट",
        "severity": "critical",
        "symptoms": [
            "Large brown lesions on leaves",
            "White mold on leaf undersides",
            "Brown-black lesions on stems",
            "Hard brown spots on green fruits",
            "Can destroy crop in days during monsoon"
        ],
        "organic_treatments": [
            "Immediate removal of infected plants",
            "Strong Bordeaux mixture (1%)",
            "Cannot rely on organics alone",
            "Burn infected material"
        ],
        "chemical_treatments": [
            "Metalaxyl + Mancozeb (Ridomil Gold 2.5g/L) - CRITICAL",
            "Cymoxanil + Mancozeb (Curzate 2g/L)",
            "Dimethomorph + Mancozeb combination",
            "Spray every 5-7 days during monsoon - ESSENTIAL",
            "Preventive spray BEFORE disease appears"
        ],
        "prevention": [
            "Grow in protected cultivation during monsoon",
            "Plant resistant varieties if available",
            "PREVENTIVE fungicide program before monsoon",
            "Avoid planting near potato fields",
            "Improve drainage and air circulation",
            "Monitor weather - spray before rain"
        ]
    },

    "Tomato___Leaf_Mold": {
        "name": "Tomato Leaf Mold",
        "name_nepali": "गोलभेडा पात ढुसी",
        "severity": "moderate",
        "symptoms": [
            "Yellow spots on upper leaf surface",
            "Velvety olive-green to brown mold on undersides",
            "Leaves curl and wither",
            "Severe in greenhouse/polyhouse"
        ],
        "organic_treatments": [
            "Improve ventilation immediately",
            "Remove infected lower leaves",
            "Neem oil (20ml per liter)",
            "Reduce humidity in greenhouse"
        ],
        "chemical_treatments": [
            "Mancozeb 75% WP (2.5g per liter)",
            "Hexaconazole 5% EC (2ml per liter)",
            "Chlorothalonil 75% WP (2g per liter)",
            "Spray every 10-14 days, focus on lower leaves"
        ],
        "prevention": [
            "Ensure excellent air circulation",
            "Avoid overhead watering",
            "Reduce humidity in protected cultivation",
            "Space plants adequately",
            "Prune lower leaves touching soil"
        ]
    },

    "Tomato___Septoria_leaf_spot": {
        "name": "Tomato Septoria Leaf Spot",
        "name_nepali": "गोलभेडा सेप्टोरिया दाग",
        "severity": "moderate",
        "symptoms": [
            "Small circular spots with gray centers",
            "Dark borders around spots",
            "Tiny black dots in center (spores)",
            "Lower leaves affected first",
            "Severe defoliation possible"
        ],
        "organic_treatments": [
            "Remove and destroy infected leaves",
            "Neem oil spray (20ml per liter)",
            "Copper-based fungicides",
            "Improve air circulation"
        ],
        "chemical_treatments": [
            "Mancozeb 75% WP (2.5g per liter)",
            "Chlorothalonil 75% WP (2g per liter)",
            "Carbendazim 50% WP (1g per liter)",
            "Spray every 7-10 days"
        ],
        "prevention": [
            "Mulch with plastic to prevent soil splash",
            "Stake and prune for air flow",
            "Water at base, not overhead",
            "Remove lower leaves as plant grows",
            "Crop rotation",
            "Use resistant varieties"
        ]
    },

    "Tomato___Spider_mites Two-spotted_spider_mite": {
        "name": "Two-Spotted Spider Mite",
        "name_nepali": "गोलभेडा माकुरो",
        "severity": "moderate",
        "symptoms": [
            "Fine webbing on leaves",
            "Yellow stippling on upper leaf surface",
            "Leaves turn bronze and dry",
            "Worse in hot, dry conditions"
        ],
        "organic_treatments": [
            "Spray strong water jet to dislodge mites",
            "Neem oil (20ml per liter) every 3-4 days",
            "Garlic-chili-soap spray",
            "Introduce predatory mites if available",
            "Spray leaf undersides thoroughly"
        ],
        "chemical_treatments": [
            "Abamectin 1.8% EC (0.5ml per liter)",
            "Propargite 57% EC (2ml per liter)",
            "Spiromesifen 22.9% SC (1ml per liter)",
            "Spray every 7 days, alternate products"
        ],
        "prevention": [
            "Maintain adequate moisture (mites love dry conditions)",
            "Avoid water stress",
            "Remove dusty conditions",
            "Regular monitoring especially in dry season",
            "Avoid broad-spectrum insecticides that kill natural enemies"
        ]
    },

    "Tomato___Target_Spot": {
        "name": "Tomato Target Spot",
        "name_nepali": "गोलभेडा लक्ष्य दाग",
        "severity": "moderate",
        "symptoms": [
            "Dark brown lesions with target pattern",
            "Spots on leaves, stems, and fruits",
            "Yellowing around lesions",
            "Can cause severe defoliation"
        ],
        "organic_treatments": [
            "Remove infected plant parts",
            "Neem oil spray (20ml per liter)",
            "Copper-based fungicides",
            "Improve air circulation"
        ],
        "chemical_treatments": [
            "Mancozeb 75% WP (2.5g per liter)",
            "Chlorothalonil 75% WP (2g per liter)",
            "Azoxystrobin 23% SC (1ml per liter)",
            "Spray every 7-10 days"
        ],
        "prevention": [
            "Adequate plant spacing",
            "Stake and prune for air flow",
            "Plastic mulching",
            "Drip irrigation",
            "Crop rotation",
            "Remove crop debris after harvest"
        ]
    },

    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "name": "Tomato Yellow Leaf Curl Virus (TYLCV)",
        "name_nepali": "गोलभेडा पहेंलो पात कर्लिङ्ग भाइरस",
        "severity": "critical",
        "symptoms": [
            "Upward curling and yellowing of leaves",
            "Stunted plant growth",
            "Flowers drop, no fruit set",
            "Complete crop failure in severe cases"
        ],
        "organic_treatments": [
            "NO CURE - focus on whitefly control",
            "Neem oil for whitefly (20ml per liter)",
            "Yellow sticky traps",
            "Remove infected plants immediately",
            "Reflective mulch to repel whiteflies"
        ],
        "chemical_treatments": [
            "Imidacloprid 17.8% SL (0.5ml per liter) for whiteflies",
            "Thiamethoxam 25% WG (0.2g per liter)",
            "Spray every 7 days",
            "NO CURE for virus, only vector control"
        ],
        "prevention": [
            "Use virus-free transplants",
            "Grow under net house (40-50 mesh)",
            "Aggressive whitefly control from day 1",
            "Remove infected plants immediately",
            "Plant resistant varieties if available",
            "Border crop with marigold to repel whiteflies",
            "Avoid planting near infected fields"
        ]
    },

    "Tomato___Tomato_mosaic_virus": {
        "name": "Tomato Mosaic Virus",
        "name_nepali": "गोलभेडा मोज़ेक भाइरस",
        "severity": "high",
        "symptoms": [
            "Mottled light and dark green on leaves",
            "Leaves may be distorted",
            "Stunted growth",
            "Poor fruit set and quality",
            "Brown streaks inside fruits"
        ],
        "organic_treatments": [
            "NO CURE - remove infected plants",
            "Disinfect tools with bleach solution (1:9)",
            "Avoid touching plants when wet",
            "Control aphids with neem oil"
        ],
        "chemical_treatments": [
            "NO chemical cure for virus",
            "Control aphid vectors with imidacloprid",
            "Focus on prevention",
            "Remove infected plants to prevent spread"
        ],
        "prevention": [
            "Use certified virus-free seeds/transplants",
            "Wash hands before handling plants",
            "Disinfect tools between plants",
            "Control aphid vectors",
            "Remove infected plants immediately",
            "Don't smoke near tomato plants (virus can spread from tobacco)",
            "Avoid planting near cucurbits"
        ]
    },

    "Tomato___healthy": {
        "name": "Healthy Tomato",
        "name_nepali": "स्वस्थ गोलभेडा",
        "severity": "none",
        "symptoms": [
            "No disease symptoms detected",
            "Healthy foliage and fruit development",
            "Normal plant vigor"
        ],
        "organic_treatments": [
            "Continue organic practices",
            "Weekly preventive neem oil spray",
            "Maintain proper mulching and staking"
        ],
        "chemical_treatments": [
            "Preventive fungicide before monsoon",
            "Balanced fertilization (19:19:19 or 20:20:0)",
            "Micronutrient spray if needed"
        ],
        "prevention": [
            "Maintain current good practices",
            "Regular monitoring for early detection",
            "Proper irrigation and drainage",
            "Continue staking and pruning",
            "Monitor weather for disease-favorable conditions"
        ]
    }
}

def get_remedy(disease_key: str):
    """Get remedy information for a disease"""
    return DISEASE_REMEDIES.get(disease_key, {
        "name": disease_key.replace("___", " - ").replace("_", " "),
        "name_nepali": "अज्ञात रोग",
        "severity": "unknown",
        "symptoms": ["रोग पहिचान गर्न सकिएन"],
        "organic_treatments": ["विशेषज्ञसँग परामर्श गर्नुहोस्"],
        "chemical_treatments": ["नजिकको कृषि सेवा केन्द्रमा सम्पर्क गर्नुहोस्"],
        "prevention": ["नियमित निगरानी गर्नुहोस्"]
    })

def get_severity_level(confidence: float, disease_name: str) -> str:
    """Determine severity based on confidence and disease type"""
    if "healthy" in disease_name.lower():
        return "none"
    
    remedy = DISEASE_REMEDIES.get(disease_name, {})
    base_severity = remedy.get("severity", "moderate")
    
    # Adjust based on confidence
    if confidence < 0.6:
        return "low"
    
    return base_severity