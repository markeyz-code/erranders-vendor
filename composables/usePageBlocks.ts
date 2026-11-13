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
  icon: any;
  defaults: Record<string, any>;
  fields: BlockField[];
}

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    type: 'hero',
    label: 'Hero',
    description: 'Big headline, background banner and a call to action.',
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
    type: 'about',
    label: 'About',
    description: 'A dedicated section introducing who you are.',
    icon: AlignLeft,
    defaults: { title: 'About our business', body: '' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'body', label: 'Story / Bio', type: 'textarea', placeholder: 'Tell campus students who you are and why they should choose you.' },
    ],
  },
  {
    type: 'services',
    label: 'Services',
    description: 'Pulls in your active service listings and prices automatically.',
    icon: Wrench,
    defaults: { title: 'Book our services', note: 'Select a slot and we will confirm quickly.' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'note', label: 'Subtitle note', type: 'text', help: 'Optional line under the title.' },
    ],
  },
  {
    type: 'products',
    label: 'Products & Shop',
    description: 'Displays your items and catalogue with live pricing.',
    icon: ShoppingBag,
    defaults: { title: 'Available products', note: 'Order directly with hostel delivery.' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'note', label: 'Subtitle note', type: 'text', help: 'Optional line under the title.' },
    ],
  },
  {
    type: 'gallery',
    label: 'Gallery & Work',
    description: 'A grid showcase of photos of your work or meals.',
    icon: ImageIcon,
    defaults: { title: 'Recent work', images: [] },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'images', label: 'Images', type: 'list', itemFields: [{ key: 'value', label: 'Image URL' }] },
    ],
  },
  {
    type: 'hours',
    label: 'Operating Hours',
    description: 'When students can find you open.',
    icon: Clock,
    defaults: {
      title: 'Business hours',
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
    type: 'faq',
    label: 'FAQ',
    description: 'Frequently asked questions from campus clients.',
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
    type: 'testimonials',
    label: 'Testimonials',
    description: 'Reviews and quotes from student clients.',
    icon: Quote,
    defaults: { title: 'What students say', items: [] as Array<{ name: string; quote: string }> },
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
    type: 'contact',
    label: 'Contact & Location',
    description: 'Direct phone, WhatsApp and campus location.',
    icon: MapPin,
    defaults: { title: 'Contact us' },
    fields: [{ key: 'title', label: 'Title', type: 'text' }],
  },
  {
    type: 'cta',
    label: 'Call to Action',
    description: 'A bold closing banner encouraging immediate booking.',
    icon: Megaphone,
    defaults: {
      headline: 'Ready to get started?',
      body: 'Reach out or book an appointment today.',
      buttonLabel: 'Get in touch',
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

export const makeBlock = (type: string) => {
  const definition = definitionFor(type);
  if (!definition) throw new Error(`Unknown block type "${type}"`);
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    isVisible: true,
    props: JSON.parse(JSON.stringify(definition.defaults)),
  };
};

/**
 * Ready-made storefronts, by the kind of store.
 *
 * Asking a barber and a pharmacy to assemble sections from an empty canvas produces either
 * nothing or the same page twice. A template gives each one a sensible shape on day one, which
 * they can then reorder or delete.
 *
 * Section order matters more than the copy: products first for a shop, services first for a
 * service provider, an hours block early for anything with a counter.
 */
export type StorefrontTemplate = {
  id: string;
  name: string;
  description: string;
  appliesTo: string[];
  sections: string[];
};

export const STOREFRONT_TEMPLATES: StorefrontTemplate[] = [
  {
    id: 'food-classic',
    name: 'Kitchen & food',
    description: 'Hero, your story, the menu, opening hours.',
    appliesTo: ['restaurant', 'food', 'kitchen', 'eatery'],
    sections: ['hero', 'about', 'products', 'hours', 'contact'],
  },
  {
    id: 'smoothie-bar',
    name: 'Smoothie & juice bar',
    description: 'Bright hero, best sellers, reviews, hours.',
    appliesTo: ['smoothie', 'juice', 'drinks', 'milkshake', 'parfait'],
    sections: ['hero', 'products', 'testimonials', 'hours', 'contact'],
  },
  {
    id: 'bakery',
    name: 'Bakery & pastry',
    description: 'Hero, today’s bakes, gallery, delivery questions.',
    appliesTo: ['bakery', 'cakes', 'pastry', 'bread'],
    sections: ['hero', 'products', 'gallery', 'hours', 'faq', 'contact'],
  },
  {
    id: 'grills-fastfood',
    name: 'Grills & fast food',
    description: 'Bold hero, full menu, reviews, order call to action.',
    appliesTo: ['grill', 'fastfood', 'sharwarma', 'burger', 'chicken'],
    sections: ['hero', 'products', 'services', 'testimonials', 'hours', 'cta', 'contact'],
  },
  {
    id: 'shop-classic',
    name: 'Retail shop',
    description: 'Hero, shop shelves, story, location.',
    appliesTo: ['mini-mart', 'single-category', 'physical_product', 'provisions', 'grocery'],
    sections: ['hero', 'products', 'about', 'hours', 'contact'],
  },
  {
    id: 'fashion',
    name: 'Fashion & thrift',
    description: 'Lookbook gallery first, then the range and reviews.',
    appliesTo: ['fashion', 'thrift', 'clothing', 'boutique', 'wears'],
    sections: ['hero', 'gallery', 'products', 'about', 'testimonials', 'contact'],
  },
  {
    id: 'electronics',
    name: 'Electronics & gadgets',
    description: 'Products, what you service, warranty questions.',
    appliesTo: ['electronics', 'gadget', 'phones', 'accessories'],
    sections: ['hero', 'products', 'services', 'faq', 'contact'],
  },
  {
    id: 'phone-repair',
    name: 'Phone & device repair',
    description: 'What you fix, before/after work, common questions.',
    appliesTo: ['repair', 'technician', 'screen', 'laptop'],
    sections: ['hero', 'services', 'gallery', 'faq', 'hours', 'contact'],
  },
  {
    id: 'salon',
    name: 'Beauty & salon',
    description: 'Services and prices, your work, reviews, booking.',
    appliesTo: ['salon', 'beauty', 'makeup', 'nails', 'spa'],
    sections: ['hero', 'services', 'gallery', 'testimonials', 'hours', 'cta', 'contact'],
  },
  {
    id: 'barber',
    name: 'Barbershop',
    description: 'Cuts and prices, gallery, hours, book a slot.',
    appliesTo: ['barber', 'barbing', 'haircut', 'hair'],
    sections: ['hero', 'services', 'gallery', 'hours', 'testimonials', 'contact'],
  },
  {
    id: 'laundry',
    name: 'Laundry & cleaning',
    description: 'How it works, pricing, turnaround questions.',
    appliesTo: ['laundry', 'cleaning', 'wash'],
    sections: ['hero', 'services', 'faq', 'hours', 'cta', 'contact'],
  },
  {
    id: 'printing',
    name: 'Printing & stationery',
    description: 'Services, samples of past work, file questions.',
    appliesTo: ['printing', 'stationery', 'cyber', 'design'],
    sections: ['hero', 'services', 'gallery', 'faq', 'contact'],
  },
  {
    id: 'gym',
    name: 'Gym & fitness',
    description: 'Programmes, timings, member reviews, join now.',
    appliesTo: ['gym', 'fitness', 'training', 'coach'],
    sections: ['hero', 'services', 'hours', 'testimonials', 'cta', 'contact'],
  },
  {
    id: 'photography',
    name: 'Photography & media',
    description: 'Portfolio-first, packages, reviews, enquiry form.',
    appliesTo: ['photography', 'photo', 'video', 'media', 'content'],
    sections: ['hero', 'gallery', 'services', 'testimonials', 'cta', 'contact'],
  },
  {
    id: 'catering',
    name: 'Catering & events',
    description: 'Packages, past events, planning questions.',
    appliesTo: ['catering', 'events', 'party', 'cook'],
    sections: ['hero', 'services', 'gallery', 'testimonials', 'faq', 'contact'],
  },
  {
    id: 'pharmacy-safe',
    name: 'Pharmacy',
    description: 'Hero, your services, how to order, hours, questions, location.',
    appliesTo: ['pharmacy', 'chemist', 'medicine'],
    sections: ['hero', 'services', 'about', 'hours', 'faq', 'contact'],
  },
  {
    id: 'service-pro',
    name: 'Service provider',
    description: 'Hero, what you do, your work, reviews, booking and contact.',
    appliesTo: ['service_provider', 'service', 'repair', 'tutorial', 'lesson'],
    sections: ['hero', 'services', 'gallery', 'testimonials', 'hours', 'cta', 'contact'],
  },
  {
    id: 'hostel',
    name: 'Hostel & housing',
    description: 'Photos, what is included, house rules, contact.',
    appliesTo: ['hostel', 'housing', 'lodge', 'accommodation', 'apartment'],
    sections: ['hero', 'gallery', 'about', 'faq', 'contact'],
  },
];

export const templatesForVendor = (
  vendorType?: string,
  category?: string,
  storeName?: string,
): StorefrontTemplate[] => {
  // Match on all three: shops often leave the category vague but put the trade in the name
  // ("Smoothiedaddi", "Waris Kitchen"), and the name is the signal that carries.
  const haystack = [vendorType, category, storeName]
    .map((v) => String(v || '').toLowerCase())
    .filter(Boolean);

  const matching = STOREFRONT_TEMPLATES.filter((t) =>
    t.appliesTo.some((key) => haystack.some((h) => h.includes(key))),
  );

  // Never leave the vendor with an empty picker: a shop template is a sane fallback.
  return matching.length > 0 ? matching : [STOREFRONT_TEMPLATES[4]];
};

/** Builds the blocks a template describes, using each section's own defaults. */
export const blocksFromTemplate = (template: StorefrontTemplate) =>
  template.sections.map((type) => makeBlock(type));
