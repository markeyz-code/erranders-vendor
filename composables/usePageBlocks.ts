import {
  Sparkles,
  AlignLeft,
  Wrench,
  Image as ImageIcon,
  Clock,
  HelpCircle,
  Quote,
  MapPin,
  Megaphone,
  ShoppingBag,
  UtensilsCrossed,
  Snowflake,
  CalendarClock,
  ShieldCheck,
  Flame,
  Soup,
  PackageCheck,
} from 'lucide-vue-next';

export type FieldType = 'text' | 'textarea' | 'image' | 'url' | 'list' | 'toggle';

export interface BlockField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  itemFields?: Array<{ key: string; label: string; type?: 'text' | 'textarea' }>;
  help?: string;
}

export interface BlockDefinition {
  type: string;
  label: string;
  description: string;
  category: 'core' | 'food' | 'trust' | 'info';
  icon: any;
  defaults: Record<string, any>;
  fields: BlockField[];
}

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    type: 'hero',
    label: 'Hero Banner',
    description: 'Prominent headline, background banner and direct action button.',
    category: 'core',
    icon: Sparkles,
    defaults: {
      headline: 'Welcome to our store',
      subheadline: 'Quality services and products delivered to campus students.',
      image: '',
      ctaLabel: 'Browse offerings',
      ctaHref: '#offerings',
    },
    fields: [
      { key: 'headline', label: 'Headline', type: 'text', placeholder: 'e.g. Campus Top Barber Studio' },
      { key: 'subheadline', label: 'Subheadline', type: 'textarea' },
      { key: 'image', label: 'Background image URL', type: 'image', help: 'A wide landscape banner works best.' },
      { key: 'ctaLabel', label: 'Button label', type: 'text' },
      { key: 'ctaHref', label: 'Button link / anchor', type: 'url' },
    ],
  },
  {
    type: 'specials',
    label: "Daily Specials / Hot Pot",
    description: "Highlight chef specials, hot pots, and today's signature dishes.",
    category: 'food',
    icon: Flame,
    defaults: {
      title: "Today's Specials",
      subtitle: 'Freshly prepared batches with limited quantities available today.',
      items: [
        { name: 'Special Jollof Fiesta & Turkey', price: '₦4,500', badge: "Chef's Pick", description: 'Smoky party jollof served with spicy peppered turkey & plantain.' },
        { name: 'Seafood Okra Pot (1 Litre)', price: '₦6,000', badge: 'Bestseller', description: 'Rich seafood okra with jumbo prawns, croaker fish & crabs.' },
      ],
    },
    fields: [
      { key: 'title', label: 'Title', type: 'text', placeholder: "e.g. Today's Fresh Pots" },
      { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'e.g. Cooked fresh daily at 12:00 PM' },
      {
        key: 'items',
        label: 'Special Items',
        type: 'list',
        itemFields: [
          { key: 'name', label: 'Dish / Item Name' },
          { key: 'price', label: 'Price' },
          { key: 'badge', label: 'Badge (e.g. Hot, Bestseller)' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    type: 'storage_guide',
    label: 'Food Storage & Handling Guide',
    description: 'Shelf life, freezer/fridge guidelines, and reheat instructions for meal preps.',
    category: 'food',
    icon: Snowflake,
    defaults: {
      title: 'Food Storage & Reheating Instructions',
      note: 'Keep your meals fresh and safe in your hostel room or fridge.',
      items: [
        {
          method: 'Freezer Storage',
          shelfLife: 'Up to 3-4 Weeks',
          instructions: 'Store sealed containers at -18°C. Do not refreeze once thawed.',
        },
        {
          method: 'Refrigerator Chilled',
          shelfLife: '3 to 5 Days',
          instructions: 'Keep in the coolest section of your fridge. Ensure lid is firmly sealed.',
        },
        {
          method: 'Reheating & Serving',
          shelfLife: 'Microwave 3-4 mins',
          instructions: 'Loosen lid before microwaving or warm in a pot over medium heat with 2 spoons of water.',
        },
      ],
    },
    fields: [
      { key: 'title', label: 'Title', type: 'text', placeholder: 'e.g. Storage & Reheat Guide' },
      { key: 'note', label: 'Subtitle Note', type: 'text' },
      {
        key: 'items',
        label: 'Storage Guidelines',
        type: 'list',
        itemFields: [
          { key: 'method', label: 'Method / Location (e.g. Freezer, Fridge, Reheating)' },
          { key: 'shelfLife', label: 'Shelf Life / Duration (e.g. 3 Weeks, 4 Days)' },
          { key: 'instructions', label: 'Instructions & Tips', type: 'textarea' },
        ],
      },
    ],
  },
  {
    type: 'delivery_schedule',
    label: 'Cooking & Delivery Schedule',
    description: 'Batch cooking hours, order cut-off times, and hall drop-off slots.',
    category: 'food',
    icon: CalendarClock,
    defaults: {
      title: 'Batch Dispatch & Delivery Windows',
      note: 'Orders placed before cutoff are guaranteed for the next batch drop-off.',
      items: [
        { batch: 'Lunch Dispatch', cutoff: 'Order by 11:30 AM', delivery: 'Delivered 1:00 PM - 2:00 PM', details: 'All campus hostels & faculties' },
        { batch: 'Dinner Rush', cutoff: 'Order by 5:30 PM', delivery: 'Delivered 6:30 PM - 7:30 PM', details: 'Direct hall entrance handover' },
        { batch: 'Weekend Bulk Batch', cutoff: 'Order Friday 8:00 PM', delivery: 'Delivered Saturday 11:00 AM', details: 'Bulk weekly meal prep & soup tubs' },
      ],
    },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'note', label: 'Subtitle note', type: 'text' },
      {
        key: 'items',
        label: 'Delivery Batches',
        type: 'list',
        itemFields: [
          { key: 'batch', label: 'Batch Name (e.g. Lunch Dispatch)' },
          { key: 'cutoff', label: 'Cut-off Time (e.g. Order by 11:30 AM)' },
          { key: 'delivery', label: 'Delivery Window (e.g. 1:00 PM - 2:00 PM)' },
          { key: 'details', label: 'Coverage / Notes' },
        ],
      },
    ],
  },
  {
    type: 'trust_badges',
    label: 'Freshness & Quality Highlights',
    description: 'Hygiene, packaging standards, and food safety badges.',
    category: 'trust',
    icon: ShieldCheck,
    defaults: {
      title: 'Our Quality Standards',
      items: [
        { title: '100% Fresh Daily', description: 'All dishes cooked fresh from scratch every single morning.' },
        { title: 'Freezer-Safe Containers', description: 'Packaged in reusable, BPA-free microwaveable tubs.' },
        { title: 'Campus Thermal Delivery', description: 'Insulated delivery packs keep food piping hot or ice-cold.' },
        { title: 'Strict Hygiene Certified', description: 'Prepared under strict sanitary kitchen standards.' },
      ],
    },
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
      {
        key: 'items',
        label: 'Feature Badges',
        type: 'list',
        itemFields: [
          { key: 'title', label: 'Feature Title' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    type: 'products',
    label: 'Products & Menu Shop',
    description: 'Displays your items and catalogue with live pricing and ordering.',
    category: 'core',
    icon: ShoppingBag,
    defaults: { title: 'Available Menu & Products', note: 'Order directly with hostel delivery.' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'note', label: 'Subtitle note', type: 'text', help: 'Optional line under the title.' },
    ],
  },
  {
    type: 'services',
    label: 'Services & Bookings',
    description: 'Pulls in your active service listings and appointment slots.',
    category: 'core',
    icon: Wrench,
    defaults: { title: 'Book our services', note: 'Select a slot and we will confirm quickly.' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'note', label: 'Subtitle note', type: 'text', help: 'Optional line under the title.' },
    ],
  },
  {
    type: 'about',
    label: 'About & Kitchen Story',
    description: 'A dedicated section introducing your chef, business, or recipe story.',
    category: 'info',
    icon: AlignLeft,
    defaults: { title: 'About our kitchen', body: '' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'body', label: 'Story / Bio', type: 'textarea', placeholder: 'Tell campus students who you are and why they should choose your food.' },
    ],
  },
  {
    type: 'gallery',
    label: 'Photo Showcase / Food Gallery',
    description: 'A visual photo grid of your hot dishes, food tubs, or past work.',
    category: 'info',
    icon: ImageIcon,
    defaults: { title: 'Recent Dishes & Work', images: [] },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'images', label: 'Images', type: 'list', itemFields: [{ key: 'value', label: 'Image URL' }] },
    ],
  },
  {
    type: 'hours',
    label: 'Operating Hours & Kitchen Slots',
    description: 'When students can order or visit your kitchen/counter.',
    category: 'info',
    icon: Clock,
    defaults: {
      title: 'Business & Kitchen Hours',
      rows: [] as Array<{ day: string; hours: string }>,
    },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      {
        key: 'rows',
        label: 'Hours',
        type: 'list',
        itemFields: [
          { key: 'day', label: 'Day' },
          { key: 'hours', label: 'Hours' },
        ],
      },
    ],
  },
  {
    type: 'testimonials',
    label: 'Student Reviews & Testimonials',
    description: 'Authentic student feedback, ratings, and quotes.',
    category: 'trust',
    icon: Quote,
    defaults: { title: 'What Students Say', items: [] as Array<{ name: string; quote: string }> },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      {
        key: 'items',
        label: 'Client Testimonials',
        type: 'list',
        itemFields: [
          { key: 'name', label: 'Student Name / Hostel' },
          { key: 'quote', label: 'Review Quote', type: 'textarea' },
        ],
      },
    ],
  },
  {
    type: 'faq',
    label: 'Frequently Asked Questions',
    description: 'Answers about delivery times, packaging, storage, and payment.',
    category: 'info',
    icon: HelpCircle,
    defaults: { title: 'Frequently Asked Questions', items: [] as Array<{ q: string; a: string }> },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      {
        key: 'items',
        label: 'Questions & Answers',
        type: 'list',
        itemFields: [
          { key: 'q', label: 'Question' },
          { key: 'a', label: 'Answer', type: 'textarea' },
        ],
      },
    ],
  },
  {
    type: 'contact',
    label: 'Contact & Campus Location',
    description: 'Direct phone, WhatsApp order hotline, and pickup location.',
    category: 'info',
    icon: MapPin,
    defaults: { title: 'Contact & Pick-up Info' },
    fields: [{ key: 'title', label: 'Title', type: 'text' }],
  },
  {
    type: 'cta',
    label: 'Order Banner / Call to Action',
    description: 'High-contrast closing banner prompting immediate checkout.',
    category: 'core',
    icon: Megaphone,
    defaults: {
      headline: 'Craving something delicious?',
      body: 'Place your order now and enjoy speedy hostel door delivery.',
      buttonLabel: 'Order Now',
      buttonHref: '#offerings',
    },
    fields: [
      { key: 'headline', label: 'Headline', type: 'text' },
      { key: 'body', label: 'Text', type: 'textarea' },
      { key: 'buttonLabel', label: 'Button label', type: 'text' },
      { key: 'buttonHref', label: 'Button link', type: 'url' },
    ],
  },
];

export const definitionFor = (type: string): BlockDefinition | undefined =>
  BLOCK_DEFINITIONS.find((definition) => definition.type === type);

export const makeBlock = (type: string, customProps?: Record<string, any>) => {
  const definition = definitionFor(type);
  if (!definition) throw new Error(`Unknown block type "${type}"`);
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    isVisible: true,
    props: {
      ...JSON.parse(JSON.stringify(definition.defaults)),
      ...(customProps ? JSON.parse(JSON.stringify(customProps)) : {}),
    },
  };
};

export type StorefrontTemplateCategory =
  | 'kitchen'
  | 'storage'
  | 'drinks'
  | 'bakery'
  | 'retail'
  | 'services';

export type StorefrontTemplate = {
  id: string;
  name: string;
  category: StorefrontTemplateCategory;
  categoryLabel: string;
  badge?: string;
  description: string;
  previewGradient: string;
  appliesTo: string[];
  sections: Array<{ type: string; props?: Record<string, any> } | string>;
};

export const STOREFRONT_TEMPLATES: StorefrontTemplate[] = [
  // ── KITCHEN & HOT FOOD ──────────────────────────────────────────────
  {
    id: 'chef-express-kitchen',
    name: "Chef's Express Kitchen",
    category: 'kitchen',
    categoryLabel: 'Kitchen & Hot Meals',
    badge: 'Popular',
    description: 'High-energy layout with daily specials, live menu, express delivery badge, and opening hours.',
    previewGradient: 'from-amber-600 via-orange-600 to-red-600',
    appliesTo: ['restaurant', 'kitchen', 'food', 'eatery', 'chef', 'hot food'],
    sections: [
      {
        type: 'hero',
        props: {
          headline: 'Hot, Fresh & Delicious Campus Meals',
          subheadline: 'Crafted with authentic ingredients. Cooked fresh daily and delivered hot to your hostel room.',
          ctaLabel: 'Order Hot Food',
          ctaHref: '#offerings',
        },
      },
      {
        type: 'specials',
        props: {
          title: "Today's Chef Specials",
          subtitle: 'Fresh batches straight from the kitchen. Limited quantities available today!',
          items: [
            { name: 'Smoky Jollof Fiesta & Turkey', price: '₦4,500', badge: 'Hot Pick', description: 'Party jollof rice served with fried plantain and peppered turkey.' },
            { name: 'Special Fried Rice & Crispy Chicken', price: '₦4,200', badge: 'Bestseller', description: 'Loaded veggie fried rice paired with seasoned golden crispy chicken.' },
          ],
        },
      },
      'products',
      {
        type: 'trust_badges',
        props: {
          title: 'Why Students Love Our Food',
          items: [
            { title: 'Fresh Daily', description: 'Cooked every morning with zero leftover policy.' },
            { title: 'Piping Hot Delivery', description: 'Insulated bags ensure your meal arrives steaming hot.' },
            { title: 'Generous Campus Portions', description: 'Hearty portions guaranteed to fill you up.' },
          ],
        },
      },
      'hours',
      'testimonials',
      'contact',
    ],
  },
  {
    id: 'campus-buka-swallow',
    name: 'Campus Buka & Swallow Kitchen',
    category: 'kitchen',
    categoryLabel: 'Kitchen & Hot Meals',
    badge: 'Traditional',
    description: 'Traditional home-style buka layout featuring pounded yam, amala, rich soups, and assorted meats.',
    previewGradient: 'from-yellow-700 via-amber-800 to-red-900',
    appliesTo: ['soup', 'swallow', 'amala', 'egusi', 'buka', 'local', 'kitchen', 'mama put'],
    sections: [
      {
        type: 'hero',
        props: {
          headline: 'Authentic Campus Buka & Hot Soups',
          subheadline: 'Pounded yam, piping hot amala, egusi, and rich seafood okra served with succulent assorted meats.',
          ctaLabel: 'Browse Buka Menu',
          ctaHref: '#offerings',
        },
      },
      {
        type: 'specials',
        props: {
          title: 'Fresh Soup Pots Ready Now',
          subtitle: 'Steaming pots of soup cooked fresh for lunch and dinner rush.',
          items: [
            { name: 'Seafood Okra & Amala Pot', price: '₦5,000', badge: 'Customer Favorite', description: 'Fresh okra soup loaded with crabs, prawns, fish & soft amala.' },
            { name: 'Efo Riro & Pounded Yam Combo', price: '₦4,500', badge: 'Authentic', description: 'Rich vegetable soup with stockfish, shaki & goat meat.' },
          ],
        },
      },
      'products',
      'hours',
      'testimonials',
      'faq',
      'contact',
    ],
  },
  {
    id: 'grill-shawarma-night',
    name: 'Grill House & Night Kitchen',
    category: 'kitchen',
    categoryLabel: 'Kitchen & Hot Meals',
    badge: 'Late Night',
    description: 'Dark, vibrant theme built for barbecue, burgers, suya, shawarma, and late-night campus cravings.',
    previewGradient: 'from-zinc-900 via-red-900 to-amber-700',
    appliesTo: ['grill', 'bbq', 'shawarma', 'burger', 'suya', 'night', 'fastfood'],
    sections: [
      {
        type: 'hero',
        props: {
          headline: 'Late-Night Grills, Shawarma & Burgers',
          subheadline: 'Smoky barbecue, crispy loaded fries, and juicy double shawarma delivered late to your doorstep.',
          ctaLabel: 'Order Night Grills',
          ctaHref: '#offerings',
        },
      },
      {
        type: 'specials',
        props: {
          title: 'Late Night Hot Grills',
          subtitle: 'Fresh off the coal fire. Available till 2:00 AM!',
          items: [
            { name: 'Jumbo Double Sausage Shawarma', price: '₦3,800', badge: 'Spicy', description: 'Creamy grilled chicken with beef franks & melted cheese.' },
            { name: 'Quarter Chicken & Peppered Fries', price: '₦4,600', badge: 'Grill Special', description: 'Charcoal grilled chicken quarter bathed in spicy pepper glaze.' },
          ],
        },
      },
      'products',
      'hours',
      'cta',
      'contact',
    ],
  },
  {
    id: 'soup-pot-central',
    name: 'Soup Pot & Stew Central',
    category: 'kitchen',
    categoryLabel: 'Kitchen & Hot Meals',
    badge: 'Bulk Food',
    description: 'Specialized for kitchens selling soups, stews, and sauces by the litre for hostel students.',
    previewGradient: 'from-orange-700 via-amber-700 to-emerald-800',
    appliesTo: ['soup', 'stew', 'pot', 'sauce', 'bulk', 'litre', 'kitchen'],
    sections: [
      {
        type: 'hero',
        props: {
          headline: 'Fresh Soups & Stews by the Litre',
          subheadline: 'Stock your hostel with rich, authentic soups and pepper stews. Order 1L, 2L, or 5L tubs.',
          ctaLabel: 'View Soup Sizes',
          ctaHref: '#offerings',
        },
      },
      'products',
      {
        type: 'delivery_schedule',
        props: {
          title: 'Soup Pot Cooking Schedule',
          note: 'Soups are cooked fresh in large batches every Monday, Wednesday, and Saturday.',
        },
      },
      {
        type: 'storage_guide',
        props: {
          title: 'How to Store & Portion Your Soup Tubs',
          note: 'Guidelines to keep your soup fresh for up to 30 days in campus hostels.',
        },
      },
      'testimonials',
      'faq',
      'contact',
    ],
  },

  // ── FOOD STORAGE & MEAL PREP ─────────────────────────────────────────
  {
    id: 'hostel-meal-prep-storage',
    name: 'Hostel Meal Prep & Bulk Storage',
    category: 'storage',
    categoryLabel: 'Food Storage & Meal Prep',
    badge: 'Campus Favorite',
    description: 'Designed for students who stock their hostel fridge: weekly meal boxes, shelf life guidelines, reheat steps.',
    previewGradient: 'from-teal-700 via-cyan-800 to-blue-900',
    appliesTo: ['meal prep', 'prep', 'storage', 'freeze', 'healthy', 'bulk meal', 'weekly', 'hostel food'],
    sections: [
      {
        type: 'hero',
        props: {
          headline: 'Hostel Meal Prep & Weekly Food Storage',
          subheadline: 'Pre-portioned, nutrient-dense meals in microwave-safe freezer containers. Save money and eat healthy all week long.',
          ctaLabel: 'Build Your Weekly Pack',
          ctaHref: '#offerings',
        },
      },
      {
        type: 'storage_guide',
        props: {
          title: 'Storage & Reheating Guide',
          note: 'How to keep your meal packs fresh in your hostel mini-fridge or freezer.',
          items: [
            { method: 'Deep Freezer Pack', shelfLife: '3 to 4 Weeks', instructions: 'Keep sealed tubs at -18°C. Defrost overnight in fridge before heating.' },
            { method: 'Chilled Fridge Life', shelfLife: '4 to 5 Days', instructions: 'Store on the middle shelf. Keep airtight to retain flavor.' },
            { method: 'Quick Reheat', shelfLife: '3 Minutes', instructions: 'Pop open the container lid corner and microwave for 3 minutes until piping hot.' },
          ],
        },
      },
      'products',
      {
        type: 'delivery_schedule',
        props: {
          title: 'Weekly Meal Prep Delivery Schedule',
          note: 'We cook on weekends and midweek so your fridge is always stocked.',
          items: [
            { batch: 'Sunday Batch Drop', cutoff: 'Order Friday 9 PM', delivery: 'Sunday 2:00 PM - 5:00 PM', details: 'Full 7-day campus meal kits' },
            { batch: 'Wednesday Midweek Top-up', cutoff: 'Order Tuesday 2 PM', delivery: 'Wednesday 4:00 PM - 7:00 PM', details: 'Fresh sides, protein packs & soups' },
          ],
        },
      },
      {
        type: 'trust_badges',
        props: {
          title: 'Safe, Clean & Hostel-Ready Packaging',
          items: [
            { title: 'BPA-Free Containers', description: 'Microwave and freezer safe, reusable food bowls.' },
            { title: 'Portion Controlled', description: 'Balanced macros with premium clean ingredients.' },
            { title: 'Vacuum Sealed Tops', description: 'Leak-proof lids ensure zero spills during delivery.' },
          ],
        },
      },
      'faq',
      'testimonials',
      'contact',
    ],
  },
  {
    id: 'frozen-foods-cold-storage',
    name: 'Frozen Foods & Cold Storage Hub',
    category: 'storage',
    categoryLabel: 'Food Storage & Meal Prep',
    badge: 'Cold Chain',
    description: 'For merchants selling raw frozen chicken, turkey, fish, and seafood with cold-chain guarantee and thawing instructions.',
    previewGradient: 'from-blue-700 via-indigo-800 to-slate-900',
    appliesTo: ['frozen', 'cold storage', 'chicken', 'turkey', 'fish', 'seafood', 'raw food', 'meat'],
    sections: [
      {
        type: 'hero',
        props: {
          headline: 'Campus Cold Storage & Frozen Foods',
          subheadline: 'Grade-A frozen chicken parts, turkey cuts, fish, prawns, and beef delivered in thermal cooler bags directly to your hall.',
          ctaLabel: 'Shop Frozen Cuts',
          ctaHref: '#offerings',
        },
      },
      {
        type: 'storage_guide',
        props: {
          title: 'Safe Thawing & Storage Instructions',
          note: 'Best practices for food safety and shelf life in campus freezers.',
          items: [
            { method: 'Freezer Storage', shelfLife: 'Up to 3 Months', instructions: 'Maintain at 0°F / -18°C. Keep in original moisture-proof wrapping.' },
            { method: 'Safe Defrosting', shelfLife: 'Cook within 24h', instructions: 'Thaw in refrigerator or submerge sealed pack in cold water. Never leave on counter.' },
          ],
        },
      },
      'products',
      {
        type: 'trust_badges',
        props: {
          title: 'Guaranteed Cold Chain Delivery',
          items: [
            { title: 'Ice-Pack Thermal Bags', description: 'Items stay frozen solid until they reach your hostel room.' },
            { title: '100% Inspected & Clean', description: 'Pre-washed, cleanly dressed, and ready for your pot.' },
            { title: 'Bulk Carton Discounts', description: 'Save big when you and your roommates share a carton.' },
          ],
        },
      },
      'faq',
      'hours',
      'contact',
    ],
  },
  {
    id: 'cooked-soup-tubs-freezer',
    name: 'Cooked Soup Tubs & Freezer Packs',
    category: 'storage',
    categoryLabel: 'Food Storage & Meal Prep',
    badge: 'Freezer Tubs',
    description: 'Ready-to-freeze cooked soups (Egusi, Ogbono, Oha, Banga) packaged in 1L to 5L containers for long-term storage.',
    previewGradient: 'from-emerald-800 via-teal-900 to-slate-900',
    appliesTo: ['soup tub', 'freezer soup', 'frozen soup', 'stew tub', 'hostel freezer', 'cooked food'],
    sections: [
      {
        type: 'hero',
        props: {
          headline: 'Pre-Cooked Soup Tubs for Your Freezer',
          subheadline: 'Rich, thick, authentic Nigerian soups packed in 1L-5L airtight tubs. Just warm up and pair with your favorite swallow.',
          ctaLabel: 'Browse Soup Tubs',
          ctaHref: '#offerings',
        },
      },
      'products',
      {
        type: 'storage_guide',
        props: {
          title: 'Soup Preservation & Heating Guidelines',
          note: 'Maximize taste and freshness throughout the semester.',
          items: [
            { method: 'Freezer Life', shelfLife: '30 Days Guaranteed', instructions: 'Keeps 100% fresh in your freezer without losing flavour or texture.' },
            { method: 'Portion Scooping', shelfLife: 'As needed', instructions: 'Use a clean dry spoon to scoop what you need, then return tub to freezer immediately.' },
            { method: 'Pot Reheating', shelfLife: '5-7 Mins', instructions: 'Warm in a small pot with a splash of hot water over low heat.' },
          ],
        },
      },
      'testimonials',
      'faq',
      'contact',
    ],
  },
  {
    id: 'pantry-dry-food-storage',
    name: 'Pantry Staples & Dry Food Storage',
    category: 'storage',
    categoryLabel: 'Food Storage & Meal Prep',
    badge: 'Bulk Pantry',
    description: 'Bulk rice bags, garri, beans, noodles cartons, and dry provisions with pest-proof hostel storage guidance.',
    previewGradient: 'from-amber-800 via-yellow-900 to-stone-900',
    appliesTo: ['pantry', 'garri', 'rice', 'beans', 'dry food', 'provisions', 'groceries', 'bulk'],
    sections: [
      {
        type: 'hero',
        props: {
          headline: 'Campus Pantry Essentials & Bulk Food Bags',
          subheadline: 'High-grade rice, ijebu garri, brown beans, vegetable oils, and instant noodles delivered in bulk at wholesale campus rates.',
          ctaLabel: 'Stock Your Pantry',
          ctaHref: '#offerings',
        },
      },
      {
        type: 'storage_guide',
        props: {
          title: 'Hostel Room Pantry & Pest-Proof Storage',
          note: 'Keep your dry goods safe from insects, moisture, and pests.',
          items: [
            { method: 'Airtight Buckets', shelfLife: '6+ Months', instructions: 'Transfer dry grains into airtight plastic food buckets off the floor.' },
            { method: 'Dry & Cool Storage', shelfLife: 'Keep ventilated', instructions: 'Store in a dry cupboard away from direct sunlight and humidity.' },
          ],
        },
      },
      'products',
      'hours',
      'faq',
      'contact',
    ],
  },
  {
    id: 'fresh-produce-storage',
    name: 'Fresh Farm Produce & Market Store',
    category: 'storage',
    categoryLabel: 'Food Storage & Meal Prep',
    badge: 'Farm Fresh',
    description: 'Fresh tubers of yam, plantain bunches, pepper baskets, and produce storage tips to prevent spoilage in hostel rooms.',
    previewGradient: 'from-lime-800 via-green-800 to-emerald-950',
    appliesTo: ['produce', 'farm', 'yam', 'plantain', 'pepper', 'tomatoes', 'raw food', 'fruits'],
    sections: [
      {
        type: 'hero',
        props: {
          headline: 'Farm-Fresh Produce Delivered to Campus',
          subheadline: 'Handpicked yams, ripe plantains, sweet potatoes, and fresh pepper blends straight from the market to your hostel.',
          ctaLabel: 'Shop Fresh Produce',
          ctaHref: '#offerings',
        },
      },
      'products',
      {
        type: 'storage_guide',
        props: {
          title: 'How to Keep Produce Fresh in Your Hostel',
          note: 'Pro-tips to make your plantains, yams, and vegetables last twice as long.',
        },
      },
      'delivery_schedule',
      'contact',
    ],
  },

  // ── DRINKS & SMOOTHIES ───────────────────────────────────────────────
  {
    id: 'chilled-parfait-smoothie-storage',
    name: 'Chilled Parfait & Smoothie Bar',
    category: 'drinks',
    categoryLabel: 'Smoothies & Cold Drinks',
    badge: 'Chilled',
    description: 'Vibrant layout for Greek yogurt parfaits, overnight oats, layered fruit cups, and smoothies with cooler-bag dispatch.',
    previewGradient: 'from-pink-600 via-rose-500 to-amber-500',
    appliesTo: ['smoothie', 'juice', 'parfait', 'yogurt', 'milkshake', 'drinks', 'chilled'],
    sections: [
      {
        type: 'hero',
        props: {
          headline: 'Fresh Fruit Smoothies & Layered Parfaits',
          subheadline: 'Thick Greek yogurt, crunchy honey granola, fresh berries, and 100% natural fruit juices made to order.',
          ctaLabel: 'Order Chilled Parfait',
          ctaHref: '#offerings',
        },
      },
      {
        type: 'storage_guide',
        props: {
          title: 'Chilled Shelf Life & Storage Tips',
          note: 'Enjoy peak freshness and probiotic goodness.',
          items: [
            { method: 'Refrigerator Storage', shelfLife: '3 to 4 Days', instructions: 'Keep upright in your fridge. Mix granola right before eating for crunch.' },
            { method: 'Smoothies & Juices', shelfLife: '48 Hours', instructions: 'Shake well before opening. Keep chilled at all times.' },
          ],
        },
      },
      'products',
      'testimonials',
      'hours',
      'contact',
    ],
  },
  {
    id: 'healthy-juice-detox',
    name: 'Fresh Pressed Juice & Wellness Bar',
    category: 'drinks',
    categoryLabel: 'Smoothies & Cold Drinks',
    badge: '100% Natural',
    description: 'Cold-pressed immune boosters, tiger nut milk, zobo, and fresh citrus juices.',
    previewGradient: 'from-emerald-600 via-teal-600 to-lime-600',
    appliesTo: ['juice', 'detox', 'wellness', 'cleanse', 'drinks', 'tiger nut', 'zobo'],
    sections: [
      {
        type: 'hero',
        props: {
          headline: 'Cold-Pressed Juices & Wellness Blends',
          subheadline: 'Zero added sugar, zero preservatives. Pure wholesome fuel for lectures and exam season.',
          ctaLabel: 'Browse Juice Menu',
          ctaHref: '#offerings',
        },
      },
      'products',
      'testimonials',
      'hours',
      'faq',
      'contact',
    ],
  },

  // ── BAKERY & TREATS ─────────────────────────────────────────────────
  {
    id: 'bakery-fresh-pastry',
    name: 'Artisan Bakery & Pastry Shop',
    category: 'bakery',
    categoryLabel: 'Bakery & Pastries',
    badge: 'Fresh Bakes',
    description: 'Warm, inviting design for custom celebration cakes, meat pies, banana bread, and fresh pastry boxes.',
    previewGradient: 'from-amber-700 via-yellow-700 to-orange-800',
    appliesTo: ['bakery', 'cake', 'bread', 'pastry', 'meat pie', 'bake'],
    sections: [
      {
        type: 'hero',
        props: {
          headline: 'Oven-Fresh Bakes & Custom Cakes',
          subheadline: 'Flaky meat pies, soft banana loaves, cinnamon rolls, and handcrafted birthday cakes for campus celebrations.',
          ctaLabel: 'Order Fresh Bakes',
          ctaHref: '#offerings',
        },
      },
      'products',
      'gallery',
      'hours',
      'testimonials',
      'faq',
      'contact',
    ],
  },

  // ── RETAIL & CAMPUS MART ─────────────────────────────────────────────
  {
    id: 'campus-mart-retail',
    name: 'Campus Mart & Provisions Store',
    category: 'retail',
    categoryLabel: 'Campus Mart & Retail',
    description: 'Shelves-first storefront for mini-marts, snacks, stationery, and hostel essentials.',
    previewGradient: 'from-blue-600 via-indigo-600 to-purple-700',
    appliesTo: ['mart', 'mini-mart', 'retail', 'provisions', 'supermarket', 'store'],
    sections: ['hero', 'products', 'about', 'hours', 'contact'],
  },
  {
    id: 'fashion-thrift-boutique',
    name: 'Fashion, Thrift & Streetwear',
    category: 'retail',
    categoryLabel: 'Campus Mart & Retail',
    description: 'Lookbook gallery first, trending drops, product showcase, and reviews.',
    previewGradient: 'from-purple-800 via-violet-900 to-slate-900',
    appliesTo: ['fashion', 'thrift', 'clothing', 'boutique', 'wears', 'shoes'],
    sections: ['hero', 'gallery', 'products', 'about', 'testimonials', 'contact'],
  },

  // ── SERVICES & SALONS ───────────────────────────────────────────────
  {
    id: 'barber-salon-studio',
    name: 'Campus Barber & Hair Studio',
    category: 'services',
    categoryLabel: 'Services & Care',
    description: 'Services and cuts with pricing, haircut showcase gallery, hours, and appointment booking.',
    previewGradient: 'from-zinc-800 via-neutral-900 to-amber-900',
    appliesTo: ['barber', 'salon', 'haircut', 'barbing', 'hair'],
    sections: ['hero', 'services', 'gallery', 'hours', 'testimonials', 'contact'],
  },
  {
    id: 'beauty-makeup-spa',
    name: 'Beauty, Lashes & Makeup Lounge',
    category: 'services',
    categoryLabel: 'Services & Care',
    description: 'Glamour portfolio showcase, price list, student reviews, and booking button.',
    previewGradient: 'from-rose-600 via-pink-700 to-purple-800',
    appliesTo: ['beauty', 'makeup', 'lashes', 'nails', 'spa'],
    sections: ['hero', 'services', 'gallery', 'testimonials', 'hours', 'cta', 'contact'],
  },
  {
    id: 'device-phone-repair',
    name: 'Phone & Tech Repair Lab',
    category: 'services',
    categoryLabel: 'Services & Care',
    description: 'Fix list, screen replacement prices, before/after work, warranty questions, and shop location.',
    previewGradient: 'from-cyan-700 via-blue-800 to-slate-900',
    appliesTo: ['repair', 'technician', 'screen', 'laptop', 'phone', 'gadget'],
    sections: ['hero', 'services', 'gallery', 'faq', 'hours', 'contact'],
  },
  {
    id: 'pharmacy-campus-chemist',
    name: 'Campus Chemist & Pharmacy',
    category: 'services',
    categoryLabel: 'Services & Care',
    description: 'Health essentials, pharmacy hours, prescription queries, and discreet hostel delivery.',
    previewGradient: 'from-emerald-700 via-teal-800 to-cyan-900',
    appliesTo: ['pharmacy', 'chemist', 'medicine', 'health', 'drugs'],
    sections: ['hero', 'services', 'about', 'hours', 'faq', 'contact'],
  },
  {
    id: 'campus-laundry-cleaning',
    name: 'Hostel Laundry & Dry Clean Hub',
    category: 'services',
    categoryLabel: 'Services & Care',
    description: 'Bag pricing, wash & fold turnarounds, pickup & drop schedule, and student testimonials.',
    previewGradient: 'from-sky-600 via-blue-700 to-indigo-800',
    appliesTo: ['laundry', 'cleaning', 'wash', 'ironing', 'dry clean'],
    sections: ['hero', 'services', 'delivery_schedule', 'faq', 'hours', 'cta', 'contact'],
  },
];

export const templatesForVendor = (
  vendorType?: string,
  category?: string,
  storeName?: string,
): StorefrontTemplate[] => {
  const haystack = [vendorType, category, storeName]
    .map((v) => String(v || '').toLowerCase())
    .filter(Boolean);

  const matches = (t: StorefrontTemplate) =>
    t.appliesTo.some((key) => haystack.some((h) => h.includes(key)));

  const matched = STOREFRONT_TEMPLATES.filter(matches);
  const others = STOREFRONT_TEMPLATES.filter((t) => !matches(t));

  return [...matched, ...others];
};

/** Builds the blocks a template describes, combining block defaults with template custom props. */
export const blocksFromTemplate = (template: StorefrontTemplate) => {
  return template.sections.map((sec) => {
    if (typeof sec === 'string') {
      return makeBlock(sec);
    }
    return makeBlock(sec.type, sec.props);
  });
};

