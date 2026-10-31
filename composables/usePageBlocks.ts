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
