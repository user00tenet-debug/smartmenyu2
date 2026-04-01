// ==========================================
// PARADISE RESTAURANT — MENU DATA
// ==========================================

const menuItems = [
    // -------- BIRYANIS --------
    {
        key: 'chicken-biryani', title: 'Chicken Biryani', price: '₹210', dietType: 'non-veg', foodCategory: 'biryanis', description: 'Classic Hyderabadi chicken biryani cooked with aromatic basmati rice, tender chicken pieces, and a blend of traditional spices. A timeless Paradise signature.',
        ingredients: [
            { item: 'Aged basmati rice – 120 grams' },
            { item: 'Bone-in chicken – 180–200 grams' },
            { item: 'Thick yogurt – 60 grams' },
            { item: 'Ginger-garlic paste – 10 grams' },
            { item: 'Red chili powder – 4 grams' },
            { item: 'Turmeric powder – 1 gram' },
            { item: 'Coriander powder – 3 grams' },
            { item: 'Cumin powder – 2 grams' },
            { item: 'Garam masala – 2 grams' },
            { item: 'Salt – 4 grams' },
            { item: 'Lemon juice – 5 ml' },
            { item: 'Green chili – 1 small' },
            { item: 'Onion – 100 grams' },
            { item: '→ Fry to yield ~35–40 grams birista' },
            { item: 'Fresh mint leaves – 5 grams' },
            { item: 'Fresh coriander leaves – 5 grams' },
            { item: 'Bay leaf – 1 small' },
            { item: 'Green cardamom – 2 pods' },
            { item: 'Cloves – 3 pieces' },
            { item: 'Cinnamon – 1 small 1-inch stick' },
            { item: 'Shah jeera – ½ tsp' },
            { item: 'Black peppercorns – 4–5 pieces' },
            { item: 'Oil – 20 ml' },
            { item: 'Ghee – 10 grams' },
            { item: 'Saffron – 6–8 strands soaked in 15 ml warm milk' },
            { item: 'Kewra water – 2–3 drops' },
            { item: 'Rice ~ 300g' },
            { item: 'Chicken + gravy ~ 180g' },
            { item: 'Total plated biryani: ~450–500g' }
        ],
        nutrients: [
            { label: 'Calories', value: '850–950 kcal' },
            { label: 'Protein', value: '42–48 g' },
            { label: 'Carbohydrates', value: '95–105 g' },
            { label: 'Total Fat', value: '35–45 g' },
            { label: 'Saturated Fat', value: '10–14 g' },
            { label: 'Fiber', value: '3–4 g' },
            { label: 'Sodium', value: '900–1200 mg' },
            { label: 'Cholesterol', value: '110–140 mg' }
        ]
    },
    {
        key: 'mutton-biryani', title: 'Mutton Biryani', price: '₹253', dietType: 'non-veg', foodCategory: 'biryanis', description: 'Succulent mutton pieces slow-cooked with fragrant basmati rice and rich Hyderabadi spices. The crown jewel of Paradise since 1953.',
        ingredients: [
            { item: 'Aged basmati rice – 120 grams' },
            { item: 'Bone-in mutton pieces – 180–200 grams' },
            { item: 'Thick yogurt – 60 grams' },
            { item: 'Ginger-garlic paste – 12 grams' },
            { item: 'Red chili powder – 4 grams' },
            { item: 'Turmeric powder – 1 gram' },
            { item: 'Coriander powder – 4 grams' },
            { item: 'Cumin powder – 2 grams' },
            { item: 'Garam masala – 2 grams' },
            { item: 'Salt – 5 grams' },
            { item: 'Lemon juice – 5 ml' },
            { item: 'Green chili – 1 small' },
            { item: 'Onion – 120 grams' },
            { item: 'Fresh mint leaves – 5–7 grams' },
            { item: 'Fresh coriander leaves – 5–7 grams' },
            { item: 'Bay leaf – 1' },
            { item: 'Green cardamom – 2 pods' },
            { item: 'Cloves – 3 pieces' },
            { item: 'Cinnamon – 1 small 1-inch stick' },
            { item: 'Black cardamom – 1 small' },
            { item: 'Shah jeera – ½ tsp' },
            { item: 'Black peppercorns – 4–5 pieces' },
            { item: 'Cooking oil – 25 ml' },
            { item: 'Ghee – 10 grams' },
            { item: 'Saffron – 6–8 strands soaked in 15 ml warm milk' },
            { item: 'Kewra water or rose water – 2–3 drops' },
            { item: 'Cooked rice ~ 300g' },
            { item: 'Cooked mutton + gravy ~ 180–200g' },
            { item: 'Total plated biryani: ~480–500g' }
        ],
        nutrients: [
            { label: 'Calories', value: '950–1100 kcal' },
            { label: 'Protein', value: '40–45 g' },
            { label: 'Carbohydrates', value: '95–105 g' },
            { label: 'Total Fat', value: '45–55 g' },
            { label: 'Saturated Fat', value: '18–22 g' },
            { label: 'Fiber', value: '3–4 g' },
            { label: 'Sodium', value: '1000–1300 mg' },
            { label: 'Cholesterol', value: '130–160 mg' }
        ]
    },
    {
        key: 'egg-biryani', title: 'Egg Biryani', price: '₹154', dietType: 'non-veg', foodCategory: 'biryanis', description: 'Flavorful biryani layered with perfectly boiled eggs and aromatic spiced rice. Simple, satisfying, and delicious.',
        ingredients: [
            { item: 'Aged basmati rice – 120 grams' },
            { item: 'Boiled eggs – 2 pieces (100–110 grams)' },
            { item: 'Thick yogurt – 60 grams' },
            { item: 'Onion (thinly sliced) – 80 grams' },
            { item: 'Tomato (chopped) – 60 grams' },
            { item: 'Ginger-garlic paste – 10 grams' },
            { item: 'Green chilies – 6 grams' },
            { item: 'Red chili powder – 4 grams' },
            { item: 'Turmeric powder – 1 gram' },
            { item: 'Biryani masala – 6 grams' },
            { item: 'Fresh mint leaves – 6 grams' },
            { item: 'Fresh coriander leaves – 6 grams' },
            { item: 'Lemon juice – 5 grams' },
            { item: 'Cooking oil or ghee – 25 grams' },
            { item: 'Salt – 5 grams' },
            { item: 'Whole spices (bay leaf, cloves, cardamom, cinnamon) – 3 grams' }
        ],
        nutrients: [
            { label: 'Calories', value: '780–880 kcal' },
            { label: 'Protein', value: '24–30 g' },
            { label: 'Carbohydrates', value: '90–100 g' },
            { label: 'Total Fat', value: '30–38 g' },
            { label: 'Saturated Fat', value: '8–12 g' },
            { label: 'Fiber', value: '3–5 g' },
            { label: 'Sugar', value: '3–4 g' },
            { label: 'Sodium', value: '850–1100 mg' },
            { label: 'Cholesterol', value: '370–420 mg' },
            { label: 'Potassium', value: '420–520 mg' },
            { label: 'Calcium', value: '110–150 mg' },
            { label: 'Iron', value: '3–4 mg' }
        ]
    },
    {
        key: 'veg-biryani', title: 'Veg Biryani', price: '₹154', dietType: 'veg', foodCategory: 'biryanis', description: 'Aromatic vegetable biryani made with fresh seasonal vegetables and fragrant basmati rice. A vegetarian delight.',
        ingredients: [
            { item: 'Aged basmati rice – 120 grams' },
            { item: 'Mixed vegetables (carrot, beans, peas, potato) – 150 grams' },
            { item: 'Thick yogurt – 60 grams' },
            { item: 'Onion (thinly sliced) – 80 grams' },
            { item: 'Tomato (chopped) – 60 grams' },
            { item: 'Ginger-garlic paste – 10 grams' },
            { item: 'Green chilies – 6 grams' },
            { item: 'Red chili powder – 4 grams' },
            { item: 'Turmeric powder – 1 gram' },
            { item: 'Biryani masala – 6 grams' },
            { item: 'Fresh mint leaves – 6 grams' },
            { item: 'Fresh coriander leaves – 6 grams' },
            { item: 'Lemon juice – 5 grams' },
            { item: 'Cooking oil or ghee – 25 grams' },
            { item: 'Salt – 5 grams' },
            { item: 'Whole spices (bay leaf, cloves, cardamom, cinnamon) – 3 grams' }
        ],
        nutrients: [
            { label: 'Calories', value: '650–750 kcal' },
            { label: 'Protein', value: '14–18 g' },
            { label: 'Carbohydrates', value: '95–105 g' },
            { label: 'Total Fat', value: '22–30 g' },
            { label: 'Saturated Fat', value: '6–9 g' },
            { label: 'Fiber', value: '6–8 g' },
            { label: 'Sugar', value: '6–8 g' },
            { label: 'Sodium', value: '750–950 mg' },
            { label: 'Cholesterol', value: '15–25 mg' },
            { label: 'Potassium', value: '500–650 mg' },
            { label: 'Calcium', value: '120–160 mg' },
            { label: 'Iron', value: '3–4 mg' }
        ]
    },

    // -------- STARTERS --------
    {
        key: 'chilli-chicken', title: 'Chilli Chicken', price: '₹264', dietType: 'non-veg', foodCategory: 'starters', description: 'Spicy, tangy chicken tossed with green chillies, bell peppers, and aromatic sauces. A fiery Indo-Chinese starter!',
        ingredients: [
            { item: 'Boneless chicken – 150 grams' },
            { item: 'Cornflour – 25 grams' },
            { item: 'All-purpose flour – 15 grams' },
            { item: 'Egg – 1 piece (50 grams)' },
            { item: 'Onion (cubed) – 70 grams' },
            { item: 'Capsicum (cubed) – 70 grams' },
            { item: 'Green chilies – 8 grams' },
            { item: 'Ginger-garlic paste – 12 grams' },
            { item: 'Soy sauce – 10 grams' },
            { item: 'Chili sauce – 15 grams' },
            { item: 'Tomato ketchup – 15 grams' },
            { item: 'Black pepper powder – 2 grams' },
            { item: 'Salt – 4 grams' },
            { item: 'Spring onions – 10 grams' },
            { item: 'Cooking oil (for frying) – 35 grams' }
        ],
        nutrients: [
            { label: 'Calories', value: '420–520 kcal' },
            { label: 'Protein', value: '32–36 g' },
            { label: 'Carbohydrates', value: '18–25 g' },
            { label: 'Total Fat', value: '22–28 g' },
            { label: 'Saturated Fat', value: '5–7 g' },
            { label: 'Fiber', value: '2–3 g' },
            { label: 'Sugar', value: '4–6 g' },
            { label: 'Sodium', value: '950–1200 mg' },
            { label: 'Cholesterol', value: '120–150 mg' },
            { label: 'Potassium', value: '420–520 mg' },
            { label: 'Calcium', value: '40–60 mg' },
            { label: 'Iron', value: '2–3 mg' }
        ]
    },
    {
        key: 'chicken-65', title: 'Chicken 65', price: '₹264', dietType: 'non-veg', foodCategory: 'starters', description: 'Iconic deep-fried chicken bites marinated in a spicy red masala. Crispy on the outside, juicy on the inside.',
        ingredients: [
            { item: 'Boneless chicken – 150 grams' },
            { item: 'Cornflour – 20 grams' },
            { item: 'Rice flour – 15 grams' },
            { item: 'Egg – 1 piece (50 grams)' },
            { item: 'Ginger-garlic paste – 12 grams' },
            { item: 'Red chili powder – 6 grams' },
            { item: 'Turmeric powder – 1 gram' },
            { item: 'Garam masala – 2 grams' },
            { item: 'Curry leaves – 3 grams' },
            { item: 'Green chilies – 8 grams' },
            { item: 'Lemon juice – 5 grams' },
            { item: 'Salt – 4 grams' },
            { item: 'Cooking oil (for deep frying) – 40 grams' }
        ],
        nutrients: [
            { label: 'Calories', value: '450–550 kcal' },
            { label: 'Protein', value: '32–36 g' },
            { label: 'Carbohydrates', value: '12–18 g' },
            { label: 'Total Fat', value: '28–34 g' },
            { label: 'Saturated Fat', value: '6–8 g' },
            { label: 'Fiber', value: '1–2 g' },
            { label: 'Sugar', value: '1–2 g' },
            { label: 'Sodium', value: '800–1000 mg' },
            { label: 'Cholesterol', value: '130–160 mg' },
            { label: 'Potassium', value: '420–500 mg' },
            { label: 'Calcium', value: '40–60 mg' },
            { label: 'Iron', value: '2–3 mg' }
        ]
    },
    {
        key: 'pepper-chicken', title: 'Pepper Chicken', price: '₹264', dietType: 'non-veg', foodCategory: 'starters', description: 'Tender chicken pieces tossed in a bold cracked pepper and spice sauce. A peppery delight for spice lovers.',
        ingredients: [
            { item: 'Boneless chicken – 250 grams' },
            { item: 'Onion – 120 grams' },
            { item: 'Ginger-garlic paste – 12 grams' },
            { item: 'Green chilies – 1–2 small' },
            { item: 'Curry leaves – 8–10 leaves' },
            { item: 'Freshly crushed black pepper – 5–6 grams' },
            { item: 'Red chili powder – 2 grams' },
            { item: 'Turmeric powder – 1 gram' },
            { item: 'Coriander powder – 3 grams' },
            { item: 'Garam masala – 2 grams' },
            { item: 'Salt – 4–5 grams' },
            { item: 'Fresh coriander leaves – 5 grams' },
            { item: 'Lemon juice – 5 ml' },
            { item: 'Cooking oil – 20 ml' },
            { item: 'Ghee – 1 tsp' },
            { item: 'Fennel seeds – ½ tsp' },
            { item: 'Cinnamon – small ½-inch piece' },
            { item: 'Cloves – 2 pieces' }
        ],
        nutrients: [
            { label: 'Calories', value: '450–550 kcal' },
            { label: 'Protein', value: '45–55 g' },
            { label: 'Carbohydrates', value: '8–12 g' },
            { label: 'Total Fat', value: '28–35 g' },
            { label: 'Saturated Fat', value: '6–8 g' },
            { label: 'Fiber', value: '1–2 g' },
            { label: 'Sodium', value: '700–900 mg' },
            { label: 'Cholesterol', value: '120–140 mg' }
        ]
    },
    {
        key: 'paneer-65', title: 'Paneer 65', price: '₹196', dietType: 'veg', foodCategory: 'starters', description: 'Crispy paneer cubes marinated in spicy batter and deep-fried to golden perfection. A vegetarian twist on a classic.',
        ingredients: [
            { item: 'Paneer (cottage cheese) – 150 grams' },
            { item: 'Cornflour – 20 grams' },
            { item: 'Rice flour – 15 grams' },
            { item: 'Yogurt – 40 grams' },
            { item: 'Ginger-garlic paste – 10 grams' },
            { item: 'Red chili powder – 6 grams' },
            { item: 'Turmeric powder – 1 gram' },
            { item: 'Garam masala – 2 grams' },
            { item: 'Curry leaves – 3 grams' },
            { item: 'Green chilies – 8 grams' },
            { item: 'Lemon juice – 5 grams' },
            { item: 'Salt – 4 grams' },
            { item: 'Cooking oil (for deep frying) – 35 grams' }
        ],
        nutrients: [
            { label: 'Calories', value: '520–620 kcal' },
            { label: 'Protein', value: '22–26 g' },
            { label: 'Carbohydrates', value: '16–22 g' },
            { label: 'Total Fat', value: '36–42 g' },
            { label: 'Saturated Fat', value: '16–20 g' },
            { label: 'Fiber', value: '1–2 g' },
            { label: 'Sugar', value: '3–5 g' },
            { label: 'Sodium', value: '650–850 mg' },
            { label: 'Cholesterol', value: '60–80 mg' },
            { label: 'Potassium', value: '220–300 mg' },
            { label: 'Calcium', value: '420–500 mg' },
            { label: 'Iron', value: '1–2 mg' }
        ]
    },
    {
        key: 'veg-manchurian', title: 'Veg Manchurian', price: '₹189', dietType: 'veg', foodCategory: 'starters', description: 'Crispy vegetable balls tossed in a tangy, spicy Manchurian sauce. Indo-Chinese comfort food at its best.',
        ingredients: [
            { item: 'Cabbage (finely chopped) – 100 grams' },
            { item: 'Carrot (grated) – 60 grams' },
            { item: 'Capsicum (finely chopped) – 40 grams' },
            { item: 'Spring onions – 20 grams' },
            { item: 'Cornflour – 35 grams' },
            { item: 'All-purpose flour – 20 grams' },
            { item: 'Ginger-garlic paste – 10 grams' },
            { item: 'Green chilies – 6 grams' },
            { item: 'Soy sauce – 12 grams' },
            { item: 'Chili sauce – 15 grams' },
            { item: 'Tomato ketchup – 15 grams' },
            { item: 'Black pepper powder – 2 grams' },
            { item: 'Salt – 4 grams' },
            { item: 'Cooking oil (for frying) – 35 grams' }
        ],
        nutrients: [
            { label: 'Calories', value: '320–400 kcal' },
            { label: 'Protein', value: '8–10 g' },
            { label: 'Carbohydrates', value: '40–48 g' },
            { label: 'Total Fat', value: '14–18 g' },
            { label: 'Saturated Fat', value: '2–3 g' },
            { label: 'Fiber', value: '4–6 g' },
            { label: 'Sugar', value: '5–7 g' },
            { label: 'Sodium', value: '900–1100 mg' },
            { label: 'Cholesterol', value: '0 mg' },
            { label: 'Potassium', value: '350–450 mg' },
            { label: 'Calcium', value: '50–70 mg' },
            { label: 'Iron', value: '2–3 mg' }
        ]
    },

    // -------- KEBABS --------
    {
        key: 'chicken-tikka-kebab', title: 'Chicken Tikka Kebab', price: '₹243', dietType: 'non-veg', foodCategory: 'kebabs', description: 'Tender chicken chunks marinated in yogurt and spices, grilled to smoky perfection in the tandoor.',
        ingredients: [
            { item: 'Boneless chicken – 180 grams' },
            { item: 'Thick yogurt – 70 grams' },
            { item: 'Ginger-garlic paste – 12 grams' },
            { item: 'Red chili powder – 5 grams' },
            { item: 'Turmeric powder – 1 gram' },
            { item: 'Garam masala – 3 grams' },
            { item: 'Cumin powder – 2 grams' },
            { item: 'Lemon juice – 8 grams' },
            { item: 'Fresh coriander leaves – 6 grams' },
            { item: 'Salt – 4 grams' },
            { item: 'Cooking oil or butter – 15 grams' }
        ],
        nutrients: [
            { label: 'Calories', value: '320–380 kcal' },
            { label: 'Protein', value: '36–40 g' },
            { label: 'Carbohydrates', value: '4–6 g' },
            { label: 'Total Fat', value: '16–20 g' },
            { label: 'Saturated Fat', value: '4–6 g' },
            { label: 'Fiber', value: '1 g' },
            { label: 'Sugar', value: '2–3 g' },
            { label: 'Sodium', value: '650–850 mg' },
            { label: 'Cholesterol', value: '120–150 mg' },
            { label: 'Potassium', value: '420–520 mg' },
            { label: 'Calcium', value: '90–120 mg' },
            { label: 'Iron', value: '2–3 mg' }
        ]
    },
    {
        key: 'tandoori-chicken', title: 'Tandoori Chicken', price: '₹243', dietType: 'non-veg', foodCategory: 'kebabs', description: 'Our classic tandoori chicken, marinated overnight and chargrilled to perfection.',
        ingredients: [
            { item: 'Chicken (with bone) – 250 grams' },
            { item: 'Thick yogurt – 80 grams' },
            { item: 'Ginger-garlic paste – 12 grams' },
            { item: 'Red chili powder – 6 grams' },
            { item: 'Turmeric powder – 1 gram' },
            { item: 'Garam masala – 3 grams' },
            { item: 'Cumin powder – 2 grams' },
            { item: 'Lemon juice – 10 grams' },
            { item: 'Kasuri methi (dried fenugreek leaves) – 2 grams' },
            { item: 'Salt – 5 grams' },
            { item: 'Cooking oil or butter – 15 grams' }
        ],
        nutrients: [
            { label: 'Calories', value: '300–360 kcal' },
            { label: 'Protein', value: '34–38 g' },
            { label: 'Carbohydrates', value: '3–5 g' },
            { label: 'Total Fat', value: '14–18 g' },
            { label: 'Saturated Fat', value: '4–6 g' },
            { label: 'Fiber', value: '1 g' },
            { label: 'Sugar', value: '2–3 g' },
            { label: 'Sodium', value: '700–900 mg' },
            { label: 'Cholesterol', value: '130–160 mg' },
            { label: 'Potassium', value: '420–520 mg' },
            { label: 'Calcium', value: '80–110 mg' },
            { label: 'Iron', value: '2–3 mg' }
        ]
    },
    {
        key: 'chicken-reshmi-kebab', title: 'Chicken Reshmi Kebab', price: '₹243', dietType: 'non-veg', foodCategory: 'kebabs', description: 'Silky smooth chicken kebabs made with cream and mild spices. Melt-in-your-mouth tender.',
        ingredients: [
            { item: 'Boneless chicken – 250 grams' },
            { item: 'Thick fresh cream – 40 ml' },
            { item: 'Hung curd – 50 grams' },
            { item: 'Cashew paste – 20 grams' },
            { item: 'Ginger-garlic paste – 12 grams' },
            { item: 'Lemon juice – 5 ml' },
            { item: 'White pepper powder – 1 tsp' },
            { item: 'Green chili paste – ½–1 tsp' },
            { item: 'Garam masala – ½ tsp' },
            { item: 'Cardamom powder – ¼ tsp' },
            { item: 'Salt – 4–5 grams' },
            { item: 'Fresh coriander leaves – 1 tbsp' },
            { item: 'Fresh mint leaves – 1 tbsp' },
            { item: 'Butter or ghee – 1–2 tbsp' },
            { item: 'Oil – 1 tbsp' }
        ],
        nutrients: [
            { label: 'Calories', value: '600–700 kcal' },
            { label: 'Protein', value: '45–50 g' },
            { label: 'Carbohydrates', value: '8–12 g' },
            { label: 'Total Fat', value: '45–55 g' },
            { label: 'Saturated Fat', value: '18–22 g' },
            { label: 'Fiber', value: '1 g' },
            { label: 'Sodium', value: '700–900 mg' },
            { label: 'Cholesterol', value: '140–170 mg' }
        ]
    },
    {
        key: 'chicken-garlic-kebab', title: 'Chicken Garlic Kebab', price: '₹243', dietType: 'non-veg', foodCategory: 'kebabs', description: 'Juicy chicken kebabs infused with roasted garlic and aromatic herbs. Bold, savory, and irresistible.',
        ingredients: [
            { item: 'Boneless chicken – 180 grams' },
            { item: 'Garlic (finely minced) – 15 grams' },
            { item: 'Thick yogurt – 60 grams' },
            { item: 'Ginger-garlic paste – 10 grams' },
            { item: 'Black pepper powder – 3 grams' },
            { item: 'Cumin powder – 2 grams' },
            { item: 'Lemon juice – 8 grams' },
            { item: 'Fresh coriander leaves – 6 grams' },
            { item: 'Green chilies – 5 grams' },
            { item: 'Salt – 4 grams' },
            { item: 'Cooking oil or butter – 15 grams' }
        ],
        nutrients: [
            { label: 'Calories', value: '310–370 kcal' },
            { label: 'Protein', value: '36–40 g' },
            { label: 'Carbohydrates', value: '4–6 g' },
            { label: 'Total Fat', value: '15–19 g' },
            { label: 'Saturated Fat', value: '4–6 g' },
            { label: 'Fiber', value: '1 g' },
            { label: 'Sugar', value: '2–3 g' },
            { label: 'Sodium', value: '650–850 mg' },
            { label: 'Cholesterol', value: '120–150 mg' },
            { label: 'Potassium', value: '420–520 mg' },
            { label: 'Calcium', value: '80–110 mg' },
            { label: 'Iron', value: '2–3 mg' }
        ]
    },

    // -------- CURRIES --------

    // -------- INDIAN BREADS --------

    // -------- DESSERTS --------

    {
        key: 'double-ka-meetha', title: 'Double Ka Meetha', price: '₹73', dietType: 'veg', foodCategory: 'desserts', description: 'Rich Hyderabadi bread pudding soaked in sweetened milk, flavored with cardamom, and garnished with nuts. Sweet indulgence.',
        ingredients: [
            { item: 'White bread slices – 3 pieces (90 grams)' },
            { item: 'Milk – 200 ml' },
            { item: 'Sugar – 50 grams' },
            { item: 'Ghee (clarified butter) – 25 grams' },
            { item: 'Condensed milk – 30 grams' },
            { item: 'Cashews – 10 grams' },
            { item: 'Almonds – 10 grams' },
            { item: 'Raisins – 8 grams' },
            { item: 'Cardamom powder – 1 gram' },
            { item: 'Saffron strands – 0.2 grams' }
        ],
        nutrients: [
            { label: 'Calories', value: '500–620 kcal' },
            { label: 'Protein', value: '10–14 g' },
            { label: 'Carbohydrates', value: '65–75 g' },
            { label: 'Total Fat', value: '22–28 g' },
            { label: 'Saturated Fat', value: '12–16 g' },
            { label: 'Fiber', value: '2–3 g' },
            { label: 'Sugar', value: '40–50 g' },
            { label: 'Sodium', value: '180–240 mg' },
            { label: 'Cholesterol', value: '40–60 mg' },
            { label: 'Potassium', value: '220–300 mg' },
            { label: 'Calcium', value: '180–220 mg' },
            { label: 'Iron', value: '1–2 mg' }
        ]
    },

    // -------- BEVERAGES --------
    {
        key: 'diet-coke', title: 'Diet Coke', price: '₹50', dietType: 'veg', foodCategory: 'beverages', description: 'Zero-calorie cola for a guilt-free refreshment alongside your meal.',
        ingredients: [
            { item: 'Carbonated water – 320 ml' },
            { item: 'Caramel color – 0.5 grams' },
            { item: 'Phosphoric acid – 0.2 grams' },
            { item: 'Aspartame (artificial sweetener) – 0.18 grams' },
            { item: 'Acesulfame potassium – 0.04 grams' },
            { item: 'Natural flavors – 0.08 grams' },
            { item: 'Caffeine – 0.03 grams' },
            { item: 'Sodium benzoate (preservative) – 0.02 grams' },
            { item: 'Citric acid – 0.05 grams' }
        ],
        nutrients: [
            { label: 'Calories', value: '0–2 kcal' },
            { label: 'Protein', value: '0 g' },
            { label: 'Carbohydrates', value: '0 g' },
            { label: 'Total Fat', value: '0 g' },
            { label: 'Saturated Fat', value: '0 g' },
            { label: 'Fiber', value: '0 g' },
            { label: 'Sugar', value: '0 g' },
            { label: 'Sodium', value: '35–45 mg' },
            { label: 'Cholesterol', value: '0 mg' },
            { label: 'Potassium', value: '0–5 mg' },
            { label: 'Calcium', value: '0 mg' },
            { label: 'Iron', value: '0 mg' }
        ]
    },

];

const foodCategories = [
    { key: 'biryanis', title: 'Biryanis', icon: 'assets/category-icons/biryanis.png' },
    { key: 'starters', title: 'Starters', icon: 'assets/category-icons/starters.png' },
    { key: 'kebabs', title: 'Kebabs', icon: 'assets/category-icons/kebabs.png' },
    { key: 'curries', title: 'Curries', icon: 'assets/category-icons/curries.png' },
    { key: 'indian-breads', title: 'Indian Breads', icon: 'assets/category-icons/indian-breads.png' },
    { key: 'desserts', title: 'Desserts', icon: 'assets/category-icons/desserts.png' },
    { key: 'beverages', title: 'Beverages', icon: 'assets/category-icons/beverages.png' }
];
