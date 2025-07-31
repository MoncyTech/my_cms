const axios = require("axios");
const fs = require("fs");

const STRAPI_URL = "http://localhost:1337";
const API_TOKEN =
  "ee2db74bb9468a51535952af9a59133a13de67816940ce295fb29df52a8551fd57757abdf7dc5cb9aa085cfe8b5160d0f76e66b445a50982921f25c88a4ab029c73d881dfa2ca2b465d929dbc0839e15167b6b8c396bff90c4a421e02de5c81eea03d6f61e2e875363af6c962f883954c46c48e64d3dfa67aad6cee45f22ae8f";

// Your existing categories data
const existingCategories = [
  { id: 2, name: "Salads" },
  { id: 4, name: "Entrees" },
  { id: 6, name: "Mains" },
  { id: 8, name: "Desserts" },
  { id: 10, name: "Indian Specials" },
];

// Full menu items data
const menuItemsData = {
  salads: [
    {
      name: "Long Green Salad",
      price: 10.99,
      type: "veg",
      description: "Fresh greens with seasonal vegetables and house dressing",
      iconName: "plant",
    },
    {
      name: "Chicken Green Salad",
      price: 10.99,
      type: "non-veg",
      description:
        "Grilled chicken served over crisp greens with lemon dressing",
      iconName: "chicken",
    },
    {
      name: "Oriental Deep Salad",
      price: 10.99,
      type: "veg",
      description: "Asian-inspired salad with sesame dressing",
      iconName: "sushi",
    },
  ],
  entrees: [
    {
      name: "Loaded Fries w/ Gravy",
      price: 12.99,
      type: "non-veg",
      description: "Crispy fries topped with rich gravy and cheese",
      iconName: "dinner",
    },
    {
      name: "Garlic Bread",
      price: 7.99,
      type: "veg",
      description: "Toasted bread with garlic butter spread",
      iconName: "dinner",
    },
    {
      name: "Vegetable Spring Rolls",
      price: 7.99,
      type: "veg",
      description: "Crispy spring rolls with fresh vegetables",
      iconName: "plant",
    },
  ],
  mains: [
    {
      name: "Chicken Schnitzel",
      price: 21.99,
      type: "non-veg",
      description: "Breaded chicken served with salad and fries",
      isPopular: true,
      iconName: "chicken",
    },
    {
      name: "Traditional Chicken Parma",
      price: 26.99,
      type: "non-veg",
      description: "Classic parmigiana with napoli sauce and cheese",
      iconName: "chicken",
    },
    {
      name: "Fish & Chips",
      price: 19.99,
      type: "non-veg",
      description: "Beer-battered fish with tartar sauce",
      iconName: "fish",
    },
    {
      name: "Fettuccine Carbonara",
      price: 23.99,
      type: "non-veg",
      description: "Creamy pasta with bacon and parmesan",
      iconName: "meal",
    },
  ],
  desserts: [
    {
      name: "Sticky Date Pudding",
      price: 10.0,
      type: "veg",
      description: "Warm date pudding with vanilla ice cream",
      isPopular: true,
      iconName: "icecream",
    },
    {
      name: "Chocolate Pudding",
      price: 10.0,
      type: "veg",
      description: "Rich chocolate pudding with ice cream",
      iconName: "icecream",
    },
    {
      name: "Ice Cream",
      price: 5.99,
      type: "veg",
      description: "Selection of homemade ice cream flavors",
      iconName: "icecream",
    },
  ],
  indian: [
    {
      name: "Butter Chicken w/ Rice",
      price: 19.99,
      type: "non-veg",
      description: "Tender chicken in creamy tomato butter sauce",
      isPopular: true,
      iconName: "rice",
    },
    {
      name: "Chicken Korma w/ Rice",
      price: 19.99,
      type: "non-veg",
      description: "Mild creamy curry with cashew sauce",
      iconName: "rice",
    },
    {
      name: "Prawn Sagnal w/ Rice",
      price: 22.99,
      type: "non-veg",
      description: "Prawns cooked with spinach and spices",
      iconName: "rice",
    },
  ],
};

const api = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json",
  },
});
const seedMenuItems = async () => {
  try {
    const menuItemsData = {
      salads: [
        {
          name: "Long Green Salad",
          price: 10.99,
          type: "veg",
          description:
            "Temper and fisher on a crisp break shade with plan and glyps",
          iconName: "plant",
          menu_category: "cmj7hqgftgm04gzbjulkwd9l",
        },
        {
          name: "Chicken Green Salad",
          price: 10.99,
          type: "non-veg",
          description:
            "Chicken green served over their break-style slide with peck and break",
          iconName: "plant",
          menu_category: "cmj7hqgftgm04gzbjulkwd9l",
        },
        {
          name: "Oriental Deep Salad",
          price: 10.99,
          type: "veg",
          description: "Rambering ramp rede served in a money shade",
          iconName: "plant",
          menu_category: "cmj7hqgftgm04gzbjulkwd9l",
        },
      ],
      entree: [
        {
          name: "Ledow Pepper Calumnat",
          price: 13.79,
          type: "veg",
          description:
            "Vegetable very calumnate seasoner with petty linda foots",
          iconName: "food",
          menu_category: "ufnbdgo5hjs0vq22eim3mzlw",
        },
        {
          name: "One of Fries w/ Dip",
          price: 8.0,
          type: "veg",
          description: "Bone, high-served butter tombs and pepper bracks",
          iconName: "food",
          menu_category: "ufnbdgo5hjs0vq22eim3mzlw",
        },
        {
          name: "Bone of Wedges w/ Dip",
          price: 9.0,
          type: "veg",
          description: "During wedges never with a creamy depthing",
          iconName: "food",
          menu_category: "ufnbdgo5hjs0vq22eim3mzlw",
        },
        {
          name: "Loaded Fries - w/ Gravy",
          price: 12.99,
          type: "non-veg",
          description: "Chicken fries reminded in real and grown",
          iconName: "food",
          menu_category: "ufnbdgo5hjs0vq22eim3mzlw",
        },
        {
          name: "Loaded Fries - w/ Gravy & Heat",
          price: 14.99,
          type: "non-veg",
          description:
            "Loaded three reminders in real and grown and management in that philadelphia officer",
          iconName: "food",
          menu_category: "ufnbdgo5hjs0vq22eim3mzlw",
        },
        {
          name: "Garlic Bread",
          price: 7.99,
          type: "veg",
          description: "Toasted bread with different garlic spreads",
          iconName: "food",
          menu_category: "ufnbdgo5hjs0vq22eim3mzlw",
        },
        {
          name: "Greeky Sarlic Bread",
          price: 9.0,
          type: "veg",
          description: "Garlic sarlic bread topped with helped orders",
          iconName: "food",
          menu_category: "ufnbdgo5hjs0vq22eim3mzlw",
        },
        {
          name: "Vegetable Nakka Spring Boll",
          price: 7.99,
          type: "veg",
          description: "Creamy frame spring rolls with huds-stinker flash",
          iconName: "food",
          menu_category: "ufnbdgo5hjs0vq22eim3mzlw",
        },
      ],
      main: [
        {
          name: "Chicken Skuntzel",
          price: 21.99,
          type: "non-veg",
          description:
            "Supply chicken skuntzel composed and fried to prospections, served with salad and glyps and concise or saucé",
          iconName: "food",
          menu_category: "xi1rfhtyw9n3htqr9ddveq4a",
        },
        {
          name: "Traditional Chicken Parma",
          price: 26.99,
          type: "non-veg",
          description: "Classic parma with navige sauce and cheese",
          iconName: "food",
          menu_category: "xi1rfhtyw9n3htqr9ddveq4a",
        },
        {
          name: "Hamaziln Chicken Parma",
          price: 27.99,
          type: "non-veg",
          description: "Farm with a tropical eyeservice trist",
          iconName: "food",
          menu_category: "xi1rfhtyw9n3htqr9ddveq4a",
        },
        {
          name: "Fish & Chips",
          price: 19.99,
          type: "non-veg",
          description:
            "Drispy heating fish served with grided fries and tentah sauce",
          iconName: "food",
          menu_category: "xi1rfhtyw9n3htqr9ddveq4a",
        },
        {
          name: "Chicken Arrastata Pasta",
          price: 23.99,
          type: "non-veg",
          description:
            "Supply toward-based pasta with tender chicken and cheese",
          iconName: "food",
          menu_category: "xi1rfhtyw9n3htqr9ddveq4a",
        },
        {
          name: "Fettuccine Carbonara",
          price: 23.99,
          type: "non-veg",
          description:
            "Creamy fettuccine with grided, bacon and amhergha cheese",
          iconName: "food",
          menu_category: "xi1rfhtyw9n3htqr9ddveq4a",
        },
        {
          name: "Penne Garbert w/ Pranns",
          price: 25.99,
          type: "non-veg",
          description:
            "Penne pasta tossed with pranns in a garlic toward sauce",
          iconName: "food",
          menu_category: "xi1rfhtyw9n3htqr9ddveq4a",
        },
      ],
      sauces: [
        {
          name: "Hushroom",
          price: 2.0,
          type: "veg",
          description: "",
          iconName: "food",
          menu_category: "",
        },
        {
          name: "Gravy",
          price: 2.0,
          type: "veg",
          description: "",
          iconName: "food",
          menu_category: "",
        },
        {
          name: "Pepper Sauce",
          price: 2.0,
          type: "veg",
          description: "",
          iconName: "food",
          menu_category: "",
        },
      ],
      vegetarian: [
        {
          name: "Greek Salad",
          price: 9.99,
          type: "veg",
          description:
            "Lifture, thunders, cugnnets, olives, and peta with a linda-creamo dressing",
          iconName: "plant",
          menu_category: "ov5ukgzcq60xq7miycp8v160",
        },
        {
          name: "Vegetable Arrastata",
          price: 19.99,
          type: "veg",
          description:
            "More peace in a rold, spice toward sauce with santied seasonal vegetables",
          iconName: "plant",
          menu_category: "ov5ukgzcq60xq7miycp8v160",
        },
        {
          name: "Fettuccine",
          price: 19.99,
          type: "veg",
          description:
            "Creamy fettuccine pasta tossed with santied hushroom and ness",
          iconName: "plant",
          menu_category: "ov5ukgzcq60xq7miycp8v160",
        },
      ],
      kids: [
        {
          name: "Kids Parma w/ Chips",
          price: 14.99,
          type: "non-veg",
          description: "Kids chicken parma with creamy chips",
          iconName: "food",
          menu_category: "sjrsmeaa6dljgofub6y7l6t5",
        },
        {
          name: "Muggets and Chips",
          price: 12.99,
          type: "non-veg",
          description: "Chicken muggets served with grided fries",
          iconName: "food",
          menu_category: "sjrsmeaa6dljgofub6y7l6t5",
        },
        {
          name: "Fish & Chips",
          price: 12.99,
          type: "non-veg",
          description: "Structure bittered fish with fries and sauce",
          iconName: "food",
          menu_category: "sjrsmeaa6dljgofub6y7l6t5",
        },
        {
          name: "Penne Napolitana",
          price: 12.99,
          type: "veg",
          description:
            "Penne pasta tower with in a classic napolitana toward sauce",
          iconName: "food",
          menu_category: "sjrsmeaa6dljgofub6y7l6t5",
        },
      ],
      dessert: [
        {
          name: "Sticky Dates w/ Ice Cream",
          price: 10.0,
          type: "veg",
          description:
            "When sticky dates thunders with ice creamy and canadel sauce",
          iconName: "food",
          menu_category: "v13kfpmy9jn6vhyfxyh4zyna",
        },
        {
          name: "Chocolate Pudding w/ Ice Cream",
          price: 10.0,
          type: "veg",
          description:
            "Creamy chicken performed served when with a scene of ice creamy",
          iconName: "food",
          menu_category: "v13kfpmy9jn6vhyfxyh4zyna",
        },
        {
          name: "Ice Cream",
          price: 5.99,
          type: "veg",
          description: "A scene of work favourite ice creamy flaxors",
          iconName: "food",
          menu_category: "v13kfpmy9jn6vhyfxyh4zyna",
        },
        {
          name: "Guild Janhu w/ Ice Cream",
          price: 6.99,
          type: "veg",
          description:
            "Work served on a smoke served with creamy vanilla ice creamy",
          iconName: "food",
          menu_category: "v13kfpmy9jn6vhyfxyh4zyna",
        },
      ],
      indian_specials: [
        {
          name: "Traditional Chicken Fry w/ Gree Rice & Dal Curry",
          price: 19.99,
          type: "non-veg",
          description:
            "Traditional spices chicken fry served with gree rice and comforting dal curry",
          iconName: "food",
          menu_category: "wafwpw8sz6gzo91r5k9wn9a6",
        },
        {
          name: "Chicken Dun Betavan",
          price: 21.99,
          type: "non-veg",
          description:
            "Fragrant radiant rice comics with tender chicken pieces and addatic spices",
          iconName: "food",
          menu_category: "wafwpw8sz6gzo91r5k9wn9a6",
        },
        {
          name: "Beef Fry w/ Gree Rice & Dal Curry",
          price: 22.99,
          type: "non-veg",
          description: "Spices turning beef fry served with fragrant gree rice",
          iconName: "food",
          menu_category: "wafwpw8sz6gzo91r5k9wn9a6",
        },
        {
          name: "Butter Chicken w/ Rice",
          price: 19.99,
          type: "non-veg",
          description:
            "Tender chicken comics in a rich, creamy toward and butter sauce, served with plain soft rice",
          iconName: "food",
          menu_category: "wafwpw8sz6gzo91r5k9wn9a6",
        },
        {
          name: "Chicken Sagnal w/ Rice",
          price: 19.99,
          type: "non-veg",
          description:
            "Tender chicken common with fresh speaked and traditional toward spices, served with plain soft rice",
          iconName: "food",
          menu_category: "wafwpw8sz6gzo91r5k9wn9a6",
        },
        {
          name: "Chicken Korma w/ Rice",
          price: 19.99,
          type: "non-veg",
          description:
            "Tender chicken sitness in a hild, creamy sauce like with notes and advancive spices, served with plain soft rice",
          iconName: "food",
          menu_category: "wafwpw8sz6gzo91r5k9wn9a6",
        },
        {
          name: "Laud Sagnal w/ Rice",
          price: 21.99,
          type: "non-veg",
          description:
            "Tender laug glories with speaked and fragrant spices for a flavoured dish, served with plain soft rice",
          iconName: "food",
          menu_category: "wafwpw8sz6gzo91r5k9wn9a6",
        },
        {
          name: "Laud Korma w/ Rice",
          price: 21.99,
          type: "non-veg",
          description:
            "Tender laug slow-crowded in a rich and creamy hut-based sauce, served with plain soft rice",
          iconName: "food",
          menu_category: "wafwpw8sz6gzo91r5k9wn9a6",
        },
        {
          name: "Prawn Hawani w/ Rice",
          price: 22.99,
          type: "non-veg",
          description:
            "Succupied pranns common in a buttery toward sauce with hill spices, served with plain soft rice",
          iconName: "food",
          menu_category: "wafwpw8sz6gzo91r5k9wn9a6",
        },
        {
          name: "Prawn Sagnal w/ Rice",
          price: 22.99,
          type: "non-veg",
          description:
            "Pranns common with speaked and traditional spices for a firmat flavour, served with plain soft rice",
          iconName: "food",
          menu_category: "wafwpw8sz6gzo91r5k9wn9a6",
        },
        {
          name: "Prawn Korma w/ Rice",
          price: 22.99,
          type: "non-veg",
          description:
            "Succupied pranns sitness in a creamy, thick cash but sauce with while spices, served with plain soft rice",
          iconName: "food",
          menu_category: "wafwpw8sz6gzo91r5k9wn9a6",
        },
        {
          name: "Panger Sagnal w/ Rice",
          price: 18.99,
          type: "veg",
          description:
            "Panger common with speaked and spices, served with plain soft rice",
          iconName: "food",
          menu_category: "wafwpw8sz6gzo91r5k9wn9a6",
        },
        {
          name: "Panger Hawani w/ Rice",
          price: 18.99,
          type: "veg",
          description:
            "Panger is a creamy toward butter sauce, served with plain soft rice",
          iconName: "food",
          menu_category: "wafwpw8sz6gzo91r5k9wn9a6",
        },
      ],
    };

    // // Seed all menu items
    for (const [categoryName, items] of Object.entries(menuItemsData)) {
      for (const item of items) {
        try {
          await api.post("/api/menu-items", {
            data: {
              ...item,
            },
          });
          console.log(`✅ Created: ${item.name} in ${categoryName}`);
        } catch (error) {
          console.error(
            `❌ Failed to create ${item.name}:`,
            error.response?.data?.error?.message || error.message
          );
        }
      }
    }

    console.log("🎉 Menu items seeding completed!");
  } catch (error) {
    console.error("🔥 Error in menu items seeding:", error.message);
  }
};

// seedMenuItems();


const openingHoursData = {
  sunday: {
    day_number: 0,
    open: true,
    hours: '1:00PM - 6:00PM',
    opening_time: '13:00:00',
    closing_time: '18:00:00'
  },
  monday: {
    day_number: 1,
    open: false,
    hours: 'Closed'
  },
  tuesday: {
    day_number: 2,
    open: false,
    hours: 'Closed'
  },
  wednesday: {
    day_number: 3,
    open: true,
    hours: '1:00PM - 9:00PM',
    opening_time: '13:00:00',
    closing_time: '21:00:00'
  },
  thursday: {
    day_number: 4,
    open: true,
    hours: '1:00PM - 9:00PM',
    opening_time: '13:00:00',
    closing_time: '21:00:00'
  },
  friday: {
    day_number: 5,
    open: true,
    hours: '1:00PM - 11:00PM',
    opening_time: '13:00:00',
    closing_time: '23:00:00'
  },
  saturday: {
    day_number: 6,
    open: true,
    hours: '1:00PM - 11:00PM',
    opening_time: '13:00:00',
    closing_time: '23:00:00'
  }
};

async function populateOpeningHours() {
  try {
    for (const [dayName, data] of Object.entries(openingHoursData)) {
      const payload = {
        data: {
          day: dayName,
          ...data
        }
      };

      // Check if entry exists
      const existingEntries = await api.get('/opening-hours', {
        params: {
          'filters[day][$eq]': dayName
        }
      });

      if (existingEntries.data.data.length > 0) {
        // Update existing entry
        await api.post(`/opening-hours/${existingEntries.data.data[0].id}`, payload);
        console.log(`Updated ${dayName}`);
      } else {
        // Create new entry
        await api.post('/opening-hours', payload);
        console.log(`Created ${dayName}`);
      }
    }
    console.log('All opening hours updated successfully!');
  } catch (error) {
    console.error('Error updating opening hours:', error.response?.data || error.message);
  }
}

populateOpeningHours();
