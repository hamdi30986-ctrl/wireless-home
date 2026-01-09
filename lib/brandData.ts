// lib/brandData.ts

// 1. EXPORTED TYPES
export type ProductColor = {
  name: string;
  hex: string;
  image?: string;
};

export type ProductType = {
  name: string;
  value: string;
  image?: string;
};

// NEW: Added this definition so 'gang' in Product doesn't error
export type ProductGang = {
  name: string;
  value: string;
  image?: string;
};

export type Product = {
  id: string;
  name: string;
  brand?: string; // <--- FIX: Added optional brand property to satisfy the build error
  category: string;
  images: string[];
  description: string;
  specs: { label: string; value: string }[];
  reviews: { name: string; rating: number; comment: string; date: string }[];
  faqs: { question: string; answer: string }[];
  colors?: ProductColor[];
  types?: ProductType[];
  gang?: ProductGang[]; // NEW
};

export type Brand = {
  name: string;
  displayName: string;
  tagline: string;
  description: string;
  image: string;
  heroGradient: string;
  heroAccent: string;
  accentColor: string;
  products: Product[];
};

// 2. EXPORTED DATA
export const brandData: Record<string, Brand> = {
  aqara: {
    name: 'aqara',
    displayName: 'Aqara',
    tagline: 'Premium Hardware. Browse the complete range of Aqara products.',
    description: 'Apple HomeKit certified devices with enterprise-grade reliability. The gold standard for seamless smart home integration.',
    image: '/images/aqara-hero.jpg',
    heroGradient: 'linear-gradient(135deg, #1a1512 0%, #2d241c 40%, #1f1a15 100%)',
    heroAccent: 'radial-gradient(ellipse at 30% 60%, rgba(196,149,106,0.15) 0%, transparent 50%)',
    accentColor: '#C4956A',
    products: [
      { 
        id: 'aq-1', 
        name: 'Aqara Smart Lock D200i', 
        category: 'Locks',
        images: ['/images/products/aqara/lock-d200i/d200i.jpg', '/images/products/aqara/lock-d200i/d200i-1.jpg', '/images/products/aqara/lock-d200i/d200i-2.jpg', '/images/products/aqara/lock-d200i/d200i-3.jpg', '/images/products/aqara/lock-d200i/d200i-4.jpg', '/images/products/aqara/lock-d200i/d200i-5.jpg', '/images/products/aqara/lock-d200i/d200i-6.jpg', '/images/products/aqara/lock-d200i/d200i-7.jpg'],
        description: 'The Aqara Smart Lock D200i offers futuristic entry with 3D facial recognition that unlocks instantly upon approach, featuring a premium handle-less design, integrated doorbell, and broad compatibility including Apple HomeKey and NFC for a truly keyless experience.',
        specs: [
          { label: 'Protocol', value: 'Zigbee 3.0, Bluetooth 5.1, NFC' },
          { label: 'Power Supply', value: '5000mAh Rechargeable Li-ion Battery (included) + USB-C Emergency Port (5V)' },
          { label: 'Battery Life', value: 'Approx. 4 months per charge' },
          { label: 'Unlocking Methods', value: '3D Face Unlock, Password, NFC Card, Mechanical Key, Bluetooth, Apple HomeKey' },
          { label: 'IP Rating', value: 'IP52 (Indoor/Protected Outdoor use recommended)' },
          { label: 'Door Thickness:', value: '40 – 120mm' },
        ],
        reviews: [],
        faqs: [
          { question: 'Does this require a neutral wire?', answer: 'No, the H1 Pro works without a neutral wire, making it perfect for older installations common in Saudi Arabia.' },
          { question: 'Can I use it with Siri?', answer: 'Yes, it is fully Apple HomeKit certified and works seamlessly with Siri voice commands.' },
          { question: 'What hub do I need?', answer: 'You need an Aqara Hub M2 or M3 to connect this switch to your smart home system.' },
        ],
      },
      { 
        id: 'aq-2', 
        name: 'Aqara Touchscreen Dial V1', 
        category: 'Wall Switches',
        images: ['/images/products/aqara/dial/dial.jpg', '/images/products/aqara/dial/dial-1.jpg', '/images/products/aqara/dial/dial-2.jpg', '/images/products/aqara/dial/dial-3.jpg'], 
        description: 'The Aqara Touchscreen Dial V1 combines a precise rotary knob with a crisp 1.32-inch touchscreen, allowing you to control lights, curtains, and scenes seamlessly with intuitive clicks, slides, or turns, while serving as a secondary control panel for your entire smart home.',
        specs: [
          { label: 'Protocol', value: 'Wi-Fi (2.4/5GHz), Zigbee, Bluetooth' },
          { label: 'Power Input', value: '200-240V AC, 50/60Hz' },
          { label: 'Load Rating', value: 'Max 8A (Resistive Total Load)' },
          { label: 'Neutral Wire', value: 'Required' },
          { label: 'Switches', value: '2 Physical Relays (Wired) + 6 Wireless/Scene Buttons' },
          { label: 'Additional Features', value: 'Built-in Temperature & Humidity sensor, Proximity wake-up sensor' },
        ],
        reviews: [
          { name: 'Khalid M.', rating: 5, comment: '', date: '2025-12-01' },
          { name: 'Fatima S.', rating: 5, comment: '', date: '2025-10-20' },
        ],
        faqs: [
          { question: 'Will it trigger with my pets?', answer: 'The P1 has pet immunity for animals up to 25kg when mounted at the recommended height of 2.2m.' },
          { question: 'How long does the battery last?', answer: 'The CR2450 battery typically lasts about 2 years with normal use.' },
        ],
      },
      { 
        id: 'aq-3', 
        name: 'Aqara Display Switch V1', 
        category: 'Wall Switches',
        images: ['/images/products/aqara/displayswitch/displayswitch.jpg', '/images/products/aqara/displayswitch/displayswitch1.jpg', '/images/products/aqara/displayswitch/displayswitch2.jpg', '/images/products/aqara/displayswitch/displayswitch3.jpg'],
        description: 'The Aqara Display Switch V1 upgrades standard wall switches with a customizable 2.08-inch LCD that clearly labels each button’s function, integrates power monitoring, and uses mmWave radar to wake the screen automatically as you approach.',
        specs: [
          { label: 'Protocols', value: 'Zigbee, Bluetooth (Matter over Bridge supported)' },
          { label: 'Power Input', value: '200-240V AC, 50/60Hz' },
          { label: 'Load Rating', value: 'Max 8A (Total Resistive Load)' },
          { label: 'Neutral Wire', value: 'Required' },
          { label: 'Configuration', value: '2 Wired Channels + 2 Wireless Scene Buttons' },
          { label: 'Display', value: '2.08-inch LCD with customizable icons/text)' },
        ],
        reviews: [
          { name: 'Omar H.', rating: 5, comment: 'The display is super clear and responsive. Love seeing what each button does!', date: '2025-12-10' },
          { name: 'Lina A.', rating: 4, comment: 'Great concept, but a bit tricky to install. Once it\'s in, it\'s fantastic.', date: '2025-11-15' },
          { name: 'Yusuf K.', rating: 5, comment: 'The mmWave wake-up is a game changer. No more fumbling in the dark.', date: '2025-10-30' },
        ],
        faqs: [
          { question: 'Does the display stay on all the time?', answer: 'No, it uses mmWave radar to detect your approach and wakes up automatically, saving power and reducing distraction.' },
          { question: 'Can I customize the button icons?', answer: 'Yes, you can upload custom icons or choose from a library within the Aqara Home app to clearly label each function.' },
          { question: 'Is a neutral wire required for installation?', answer: 'Yes, a neutral wire is required for the Aqara Display Switch V1 to function correctly.' },
        ],
      },
      { 
        id: 'aq-4', 
        name: 'Aqara Presence Sensor FP2', 
        category: 'Sensors',
        images: ['/images/products/aqara/fp2/fp2.jpg', '/images/products/aqara/fp2/fp2-1.jpg', '/images/products/aqara/fp2/fp2-2.jpg', '/images/products/aqara/fp2/fp2-3.jpg'],
        description: 'The Aqara Presence Sensor FP2 utilizes advanced mmWave radar technology to detect up to 5 people simultaneously and map your room into 30 distinct zones, triggering precise local automations like turning on the TV when you sit on the sofa or lights when you enter the study.',
        specs: [
          { label: 'Protocol', value: 'Wi-Fi (2.4GHz), Bluetooth 4.2' },
          { label: 'Power Input', value: 'Wired USB-C (5V 1A)' },
          { label: 'Technology', value: '60GHz Millimeter-wave Radar' },
          { label: 'Detection Range', value: 'Approx. 40 sq. meters / up to 8m radius' },
          { label: 'IP Rating', value: 'IPX5)' },
          { label: 'Mounting', value: '<Wall, Ceiling, or Corner (adjustable stand included)' },
        ],
        reviews: [
          { name: 'Nadia T.', rating: 5, comment: '', date: '2025-12-05' },
          { name: 'Hassan B.', rating: 5, comment: '', date: '2025-11-20' },
        ],
        faqs: [
          { question: 'Will it work with my existing curtains?', answer: 'Yes, it works with most curtains on standard U or I rail tracks. Max weight is 12kg per curtain.' },
          { question: 'How do I charge it?', answer: 'It comes with a USB-C charging cable. One full charge lasts up to a year with typical use.' },
        ],
      },
      { 
        id: 'aq-5', 
        name: 'Aqara Presence Multi-Sensor FP300', 
        category: 'Sensors',
        images: ['/images/products/aqara/fp300/fp300.jpg', '/images/products/aqara/fp300/fp300-1.jpg', '/images/products/aqara/fp300/fp300-2.jpg', '/images/products/aqara/fp300/fp300-3.jpg'],
        description: 'The Aqara FP300 is a versatile, battery-powered presence sensor that fuses mmWave radar with PIR technology for instant, false-alarm-free detection, supporting both Thread and Zigbee protocols to act as a 5-in-1 sensor for presence, light, temperature, and humidity.',
        specs: [
          { label: 'Protocol', value: 'Thread, Zigbee 3.0, Bluetooth (Matter compatible' },
          { label: 'Power Supply', value: 'Battery-powered (2× CR2450)' },
          { label: 'Battery Life', value: 'Up to 3 years (Zigbee mode) / 2 years (Thread mode)' },
          { label: 'Technology', value: '60GHz mmWave Radar + PIR Sensor' },
          { label: 'Detection Range', value: '120° Field of View, up to 6m' },
          { label: 'Mounting', value: 'Magnetic base for Wall/Ceiling/Corner' },
        ],
        reviews: [
          { name: 'Ali S.', rating: 5, comment: '', date: '2025-11-25' },
        ],
        faqs: [
          { question: 'Can I use it on a window?', answer: 'Yes, it works on any door or window. It also detects tilt for awning windows.' },
        ],
      },
      { 
        id: 'aq-6', 
        name: 'Aqara Hub M3', 
        category: 'Hubs',
        images: ['/images/products/aqara/hub/hub-main.jpg', '/images/products/aqara/hub/hub1.jpg', '/images/products/aqara/hub/hub2.jpg', '/images/products/aqara/hub/hub3.jpg'],
        description: 'The Aqara Hub M3 is a next-generation Edge Controller that unifies your smart home by supporting Zigbee, Thread, Matter, and IR devices, offering robust local automation that works without internet and seamless migration from older Aqara hubs.',
        specs: [
          { label: 'Protocol', value: 'Zigbee 3.0, Thread, Matter, Wi-Fi (2.4/5GHz), Bluetooth 5.1' },
          { label: 'Power Input', value: 'USB-C (5V 2A) or PoE (Power over Ethernet 48V)' },
          { label: 'Features', value: 'Built-in 360° IR Blaster, 95dB Speaker' },
          { label: 'Storage', value: '8GB eMMC (Encrypted local storage for automations)' },
          { label: 'Device Limit', value: 'Connects up to 127 Zigbee/Thread devices directly' },
        ],
        reviews: [
          { name: 'Samir J.', rating: 5, comment: '', date: '2025-12-12' },
          { name: 'Huda N.', rating: 5, comment: '', date: '2025-11-08' },
          { name: 'Tariq W.', rating: 5, comment: '', date: '2025-10-15' },
        ],
        faqs: [
          { question: 'What if the battery dies?', answer: 'You can use the included physical key as backup, or use a 9V battery to temporarily power the lock from outside.' },
          { question: 'Does it work with Apple Watch?', answer: 'Yes, with Home Key you can unlock by simply holding your Apple Watch near the lock.' },
        ],
      },
      { 
        id: 'aq-7', 
        name: 'Aqara Smart Lock A100', 
        category: 'Locks',
        images: ['/images/products/aqara/lock100/lock100.jpg', '/images/products/aqara/lock100/lock100-1.jpg', '/images/products/aqara/lock100/lock100-2.jpg', '/images/products/aqara/lock100/lock100-3.jpg'],
        description: 'The Aqara Smart Lock A100 Zigbee is a highly secure, mortise-style lock that integrates deeply with the Apple ecosystem via HomeKey support, offering rapid fingerprint recognition, long battery life, and remote management for modern home security.',
        specs: [
          { label: 'Protocol', value: 'Zigbee 3.0, Bluetooth 5.0, NFC' },
          { label: 'Power Supply', value: '8× AA Batteries (split into two groups for backup)' },
          { label: 'Battery Life', value: 'Approx. 18 months' },
          { label: 'Emergency Power', value: 'USB-C port (5V)' },
          { label: 'Unlock Methods', value: 'Fingerprint, Apple HomeKey, Password, NFC, Mechanical Key, App' },
          { label: 'Door Thickness', value: '40 – 80mm' },
        ],
        reviews: [
          { name: 'Dana M.', rating: 5, comment: '', date: '2025-11-30' },
        ],
        faqs: [
          { question: 'How often does it update?', answer: 'It reports temperature changes of 0.3°C or more, typically updating every few minutes.' },
        ],
      },
      { 
        id: 'aq-8', 
        name: 'Aqara Wall Switch H2', 
        category: 'Wall Switches',
        images: ['/images/products/aqara/switch-h2/switch-h2.jpg', '/images/products/aqara/switch-h2/switch-h2-1.jpg', '/images/products/aqara/switch-h2/switch-h2-2.jpg', '/images/products/aqara/switch-h2/switch-h2-3.jpg'],
        description: 'The Aqara Wall Switch H2 features a universal design compatible with standard 55mm frames and offers a "2-in-1" wiring solution that works with or without a neutral wire, supporting advanced Matter-over-Thread connectivity for future-proof smart lighting control.',
        specs: [
          { label: 'Protocol', value: 'Thread, Zigbee, Bluetooth' },
          { label: 'Voltage', value: '110-240V AC, 50/60Hz' },
          { label: 'Load Rating', value: 'Max 10A (Resistive)' },
          { label: 'Neutral Wire', value: 'Optional (2-in-1 design supports both No-Neutral and With-Neutral)' },
          { label: 'Compatibility', value: 'Fits standard 55mm frames (EU models) / Standard US wall boxes (US models)' },
          { label: 'Features', value: 'Power monitoring (Neutral wire required for this feature)' },
        ],
        reviews: [
          { name: 'Rami K.', rating: 5, comment: '', date: '2025-12-08' },
          { name: 'Mona S.', rating: 4, comment: '', date: '2025-10-25' },
        ],
        faqs: [
          { question: 'What gestures are supported?', answer: 'Push, rotate (clockwise/counter), flip 90°, flip 180°, double tap, and shake.' },
        ],
        types: [
          { name: 'Neutral', value: '1' },
          { name: 'No Neutral', value: '2' },
        ],
      },
      { 
        id: 'aq-9', 
        name: 'Aqara Wall Switch Z1 Pro', 
        category: 'Wall Switches',
        images: ['/images/products/aqara/z1pro/z1pro1.jpg', '/images/products/aqara/z1pro/z1pro2.jpg', '/images/products/aqara/z1pro/z1pro3.jpg', '/images/products/aqara/z1pro/z1pro-b1.jpg', '/images/products/aqara/z1pro/z1pro-b2.jpg', '/images/products/aqara/z1pro/z1pro-b3.jpg', '/images/products/aqara/z1pro/z1pro-b4.jpg', '/images/products/aqara/z1pro/z1pro-w1.jpg', '/images/products/aqara/z1pro/z1pro-w2.jpg', '/images/products/aqara/z1pro/z1pro-w3.jpg', '/images/products/aqara/z1pro/z1pro-w4.jpg'],
        description: 'The Aqara Wall Switch Z1 Pro reimagines lighting control with a unique touch-slider sidebar for dimming lights or controlling curtains, alongside premium relay switches that support "MARS-Tech" to keep smart bulbs powered even when the switch is off.',
        specs: [
          { label: 'Protocol', value: 'Zigbee 3.0' },
          { label: 'Voltage', value: '220V AC, 50Hz' },
          { label: 'Load Rating', value: 'Max 2200W (Total Incandescent), 400W (LED)' },
          { label: 'Neutral Wire', value: 'Options available for both "With Neutral" and "No Neutral' },
          { label: 'Unique Feature', value: 'Wireless Slider Bar (Side touch control for dimming/curtains)' },
          { label: 'Safety', value: 'Overheat and overload protection (Neutral version)' },
        ],
        reviews: [
          { name: 'Rami K.', rating: 5, comment: '', date: '2025-12-08' },
          { name: 'Mona S.', rating: 4, comment: '', date: '2025-10-25' },
        ],
        faqs: [
          { question: 'What gestures are supported?', answer: 'Push, rotate (clockwise/counter), flip 90°, flip 180°, double tap, and shake.' },
        ],
        types: [
          { name: 'Neutral', value: '1' },
          { name: 'No Neutral', value: '2' },
        ],
      },
    ],
  },
  wirelesshome: {
    name: 'wirelesshome',
    displayName: 'WirelessHome',
    tagline: 'Engineered for Saudi Arabia.',
    description: 'Our in-house product line designed specifically for local conditions. Built for concrete walls and desert climates.',
    image: '/images/wireless.jpg',
    heroGradient: 'linear-gradient(135deg, #0d1117 0%, #161b22 40%, #0d1117 100%)',
    heroAccent: 'radial-gradient(ellipse at 70% 40%, rgba(0,102,255,0.12) 0%, transparent 50%)',
    accentColor: '#0066FF',
    products: [
      { 
        id: 'wh-1', 
        name: 'Tank Level Sensor', 
        category: 'Sensors',
        images: ['/images/products/wireless/wsesnor/0.jpg', '/images/products/wireless/wsesnor/1.jpg', '/images/products/wireless/wsesnor/2.jpg', '/images/products/wireless/wsesnor/3.jpg', '/images/products/wireless/wsesnor/4.jpg'],
        description: 'Monitor your underground water tank level in real-time with our Saudi-made sensor. Get alerts before running out, track consumption patterns, and never be surprised by an empty tank again. Designed for Saudi water quality and climate.',
        specs: [
          { label: 'Assampled', value: 'Saudi Arabia' },
          { label: 'Protocol', value: 'WiFi 2.4GHz' },
          { label: 'Length', value: 'Up to 20 meters' },
          { label: 'Accuracy', value: '±2%' },
          { label: 'Power', value: '5V USB (Adapter included)' },
          { label: 'Rating', value: 'IP68 Waterproof' },
        ],
        reviews: [
          { name: 'Abdullah Q.', rating: 5, comment: 'Finally a tank sensor that actually works in our heat. Saudi made!', date: '2024-12-14' },
          { name: 'Majid R.', rating: 5, comment: 'Saved us multiple times from running out of water. Essential.', date: '2024-11-22' },
        ],
        faqs: [
          { question: 'Does it work in extreme heat?', answer: 'Yes, it is designed for Saudi conditions and tested up to 60°C ambient temperature.' },
          { question: 'What app does it use?', answer: 'It connects to the WirelessHome app which also integrates with Apple Home and Google Home.' },
        ],
      },
      { 
        id: 'wh-2', 
        name: 'Wireless Audio System', 
        category: 'Audio',
        images: ['/images/products/wireless/wsv1/0.jpg', '/images/products/wireless/wsv1/1.jpg', '/images/products/wireless/wsv1/2.jpg', '/images/products/wireless/wsv1/3.jpg', '/images/products/wireless/wsv1/4.jpg'],
        description: 'Custom-engineered audio distribution for whole-home sound. unlimited zones connection with independent volume control. Hi-Fi quality audio with support for AirPlay 2, Bluetooth 5.0, and more.',
        specs: [
          { label: 'WiFi Standard', value: 'WiFi 6 (AX3000)' },
          { label: 'Coverage', value: '200sqm per node' },
          { label: 'Concrete Penetration', value: 'Up to 30cm' },
          { label: 'Ports', value: '2x Gigabit Ethernet' },
          { label: 'Max Devices', value: '60 per node' },
          { label: 'Mesh Type', value: 'True Mesh (802.11s)' },
        ],
        reviews: [
          { name: 'Fahad M.', rating: 5, comment: 'My 3-floor villa finally has WiFi everywhere. Basement included!', date: '2024-12-01' },
          { name: 'Turki S.', rating: 5, comment: 'Replaced my Eero system. This actually works through Saudi walls.', date: '2024-11-15' },
        ],
        faqs: [
          { question: 'How many do I need for a typical villa?', answer: 'Most villas need 3-4 nodes. We offer a free site survey to determine exact requirements.' },
          { question: 'Can it replace my router?', answer: 'Yes, the first node connects to your ISP modem and acts as your router.' },
        ],
      },
    ],
  },
  shelly: {
    name: 'shelly',
    displayName: 'Shelly',
    tagline: 'European Engineering. Local Control.',
    description: 'Professional-grade devices trusted by integrators worldwide. No cloud dependency, complete local control.',
    image: '/images/shelly.jpg',
    heroGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #1a1a2e 100%)',
    heroAccent: 'radial-gradient(ellipse at 50% 50%, rgba(74,144,217,0.1) 0%, transparent 50%)',
    accentColor: '#4A90D9',
    products: [
      { id: 'sh-1', name: 'Plus 1 Relay', category: 'Relays', images: ['/images/products/sh-plus1-1.jpg'], description: 'Single channel smart relay with power metering. Fits behind any switch.', specs: [{ label: 'Channels', value: '1' }, { label: 'Max Load', value: '16A' }], reviews: [], faqs: [] },
      { id: 'sh-2', name: 'Plus 2PM', category: 'Relays', images: ['/images/products/sh-plus2-1.jpg'], description: 'Dual channel relay with power metering for roller shutters or two lights.', specs: [{ label: 'Channels', value: '2' }, { label: 'Max Load', value: '10A per channel' }], reviews: [], faqs: [] },
      { id: 'sh-3', name: 'Dimmer 2', category: 'Dimmers', images: ['/images/products/sh-dimmer-1.jpg'], description: 'Universal dimmer that works without neutral wire.', specs: [{ label: 'Load Type', value: 'LED, CFL, Halogen' }, { label: 'Min Load', value: '5W' }], reviews: [], faqs: [] },
      { id: 'sh-4', name: 'RGBW2', category: 'LED', images: ['/images/products/sh-rgbw-1.jpg'], description: 'Control RGB and white LED strips with millions of colors.', specs: [{ label: 'Channels', value: '4 (RGBW)' }, { label: 'Max Power', value: '288W' }], reviews: [], faqs: [] },
      { id: 'sh-5', name: 'EM Monitor', category: 'Energy', images: ['/images/products/sh-em-1.jpg'], description: 'Monitor your home energy consumption in real-time.', specs: [{ label: 'Phases', value: '2' }, { label: 'Max Current', value: '120A per phase' }], reviews: [], faqs: [] },
      { id: 'sh-6', name: 'Pro 4PM', category: 'Relays', images: ['/images/products/sh-pro4-1.jpg'], description: 'Professional 4-channel DIN rail relay with power monitoring.', specs: [{ label: 'Channels', value: '4' }, { label: 'Mounting', value: 'DIN Rail' }], reviews: [], faqs: [] },
    ],
  },
  tuya: {
    name: 'tuya',
    displayName: 'Tuya',
    tagline: 'Smart Home for Everyone.',
    description: 'The world\'s largest IoT ecosystem. Incredible variety and value for every budget and need.',
    image: '/images/tuya.jpg',
    heroGradient: 'linear-gradient(135deg, #1f1410 0%, #2a1a12 40%, #1f1410 100%)',
    heroAccent: 'radial-gradient(ellipse at 40% 50%, rgba(255,107,53,0.1) 0%, transparent 50%)',
    accentColor: '#FF6B35',
    products: [
      { id: 'tu-1', name: 'Zigbee Gateway', category: 'Hubs', images: ['/images/products/tu-gateway-1.jpg'], description: 'Multi-protocol gateway supporting Zigbee and Bluetooth devices.', specs: [{ label: 'Protocols', value: 'Zigbee 3.0 + BLE' }], reviews: [], faqs: [] },
      { id: 'tu-2', name: 'Smart Bulb RGBW', category: 'Lighting', images: ['/images/products/tu-bulb-1.jpg'], description: 'Color changing WiFi bulb with millions of colors.', specs: [{ label: 'Lumens', value: '800lm' }, { label: 'Wattage', value: '9W' }], reviews: [], faqs: [] },
      { id: 'tu-3', name: 'Smart Plug 16A', category: 'Plugs', images: ['/images/products/tu-plug-1.jpg'], description: 'WiFi smart plug with energy monitoring and timer functions.', specs: [{ label: 'Max Load', value: '16A / 3680W' }], reviews: [], faqs: [] },
      { id: 'tu-4', name: 'Touch Switch', category: 'Switches', images: ['/images/products/tu-switch-1.jpg'], description: 'Elegant glass touch panel switch in multiple gang options.', specs: [{ label: 'Gang', value: '1/2/3/4' }], reviews: [], faqs: [] },
      { id: 'tu-5', name: 'Sensor Kit', category: 'Security', images: ['/images/products/tu-kit-1.jpg'], description: 'Starter security kit with motion, door sensors, and gateway.', specs: [{ label: 'Includes', value: 'Gateway + 2 Sensors' }], reviews: [], faqs: [] },
      { id: 'tu-6', name: 'Curtain Motor', category: 'Motors', images: ['/images/products/tu-curtain-1.jpg'], description: 'WiFi curtain motor for track-mounted curtains.', specs: [{ label: 'Max Weight', value: '50kg' }], reviews: [], faqs: [] },
    ],
  },
  zigbee: {
    name: 'zigbee',
    displayName: 'Zigbee',
    tagline: 'Universal Protocol. Endless Possibilities.',
    description: 'Zigbee 3.0 certified devices for cross-platform compatibility. Build a unified mesh network with any brand.',
    image: '/images/zigbee.jpg',
    heroGradient: 'linear-gradient(135deg, #1a0a1a 0%, #2d1028 40%, #1a0a1a 100%)',
    heroAccent: 'radial-gradient(ellipse at 60% 40%, rgba(235,4,67,0.08) 0%, transparent 50%)',
    accentColor: '#EB0443',
    products: [
      { id: 'zb-1', name: 'Coordinator USB', category: 'Hubs', images: ['/images/products/zb-coord-1.jpg'], description: 'USB Zigbee coordinator for Home Assistant and other platforms.', specs: [{ label: 'Chip', value: 'CC2652P' }], reviews: [], faqs: [] },
      { id: 'zb-2', name: 'Wireless Button', category: 'Controllers', images: ['/images/products/zb-button-1.jpg'], description: 'Scene controller with 1-4 button options.', specs: [{ label: 'Actions', value: 'Press, Double, Hold' }], reviews: [], faqs: [] },
      { id: 'zb-3', name: 'Contact Sensor', category: 'Security', images: ['/images/products/zb-contact-1.jpg'], description: 'Door/window sensor for security automations.', specs: [{ label: 'Battery Life', value: '2 years' }], reviews: [], faqs: [] },
      { id: 'zb-4', name: 'PIR Motion', category: 'Sensors', images: ['/images/products/zb-pir-1.jpg'], description: 'Motion sensor with adjustable sensitivity.', specs: [{ label: 'Range', value: '6m' }], reviews: [], faqs: [] },
      { id: 'zb-5', name: 'Climate Sensor', category: 'Climate', images: ['/images/products/zb-climate-1.jpg'], description: 'Temperature and humidity sensor with display.', specs: [{ label: 'Display', value: 'LCD' }], reviews: [], faqs: [] },
      { id: 'zb-6', name: 'Signal Repeater', category: 'Networking', images: ['/images/products/zb-repeater-1.jpg'], description: 'Extend your Zigbee mesh network range.', specs: [{ label: 'Power', value: 'Plug-in' }], reviews: [], faqs: [] },
    ],
  },
  wifi: {
    name: 'wifi',
    displayName: 'WiFi',
    tagline: 'Direct Connection. Zero Hub Required.',
    description: 'WiFi-enabled devices for instant setup. No additional hub needed — just connect to your existing network.',
    image: '/images/wifi.jpg',
    heroGradient: 'linear-gradient(135deg, #0f1419 0%, #1c2526 40%, #0f1419 100%)',
    heroAccent: 'radial-gradient(ellipse at 50% 60%, rgba(16,185,129,0.1) 0%, transparent 50%)',
    accentColor: '#10B981',
    products: [
      { id: 'wf-1', name: 'Smart Plug', category: 'Plugs', images: ['/images/products/wf-plug-1.jpg'], description: 'Compact WiFi plug with energy monitoring.', specs: [{ label: 'Max Load', value: '16A' }], reviews: [], faqs: [] },
      { id: 'wf-2', name: 'LED Strip 5M', category: 'Lighting', images: ['/images/products/wf-strip-1.jpg'], description: 'RGBW LED strip with music sync feature.', specs: [{ label: 'Length', value: '5 meters' }], reviews: [], faqs: [] },
      { id: 'wf-3', name: 'IR Remote Hub', category: 'Controllers', images: ['/images/products/wf-ir-1.jpg'], description: 'Universal IR blaster for AC and TV control.', specs: [{ label: 'Range', value: '10m' }], reviews: [], faqs: [] },
      { id: 'wf-4', name: 'Camera Indoor', category: 'Security', images: ['/images/products/wf-cam-1.jpg'], description: '2K indoor camera with pan/tilt and night vision.', specs: [{ label: 'Resolution', value: '2K' }], reviews: [], faqs: [] },
      { id: 'wf-5', name: 'Doorbell Pro', category: 'Security', images: ['/images/products/wf-doorbell-1.jpg'], description: 'Video doorbell with 2-way audio and motion detection.', specs: [{ label: 'Video', value: '1080p HDR' }], reviews: [], faqs: [] },
      { id: 'wf-6', name: 'Thermostat', category: 'Climate', images: ['/images/products/wf-thermo-1.jpg'], description: 'Smart thermostat for central AC systems.', specs: [{ label: 'Display', value: 'Color LCD' }], reviews: [], faqs: [] },
    ],
  },
};