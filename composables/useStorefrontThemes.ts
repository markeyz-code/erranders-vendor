/**
 * Storefront themes: the look, not the content.
 *
 * A template decides what sections a page has. A theme decides how the shop feels while you are
 * buying from it — accent colour, corner radius, card weight, spacing. Themes do not remove the
 * product grid, which is the whole point: a vendor should be able to restyle the shop without
 * losing the shop.
 */
export type StorefrontTheme = {
  preset: string;
  accent: string;
  radius: string;
  card: string;
  density: string;
};

export type ThemePreset = StorefrontTheme & {
  name: string;
  description: string;
  appliesTo: string[];
  swatch: string[];
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    preset: 'buka-warm',
    name: 'Buka warm',
    description: 'Terracotta accent, generous corners. Reads home-cooked.',
    appliesTo: ['restaurant', 'soup', 'local', 'eatery', 'kitchen'],
    accent: '#E8590C',
    radius: '1rem',
    card: 'soft',
    density: 'comfortable',
    swatch: ['#E8590C', '#FFF4E6', '#2B1A10'],
  },
  {
    preset: 'fresh-green',
    name: 'Fresh green',
    description: 'Bright green, light surfaces. Good for healthy and produce.',
    appliesTo: ['smoothie', 'juice', 'healthy', 'salad', 'grocer'],
    accent: '#2F9E44',
    radius: '1.25rem',
    card: 'soft',
    density: 'airy',
    swatch: ['#2F9E44', '#EBFBEE', '#12300F'],
  },
  {
    preset: 'pharmacy-clean',
    name: 'Pharmacy clean',
    description: 'Calm teal, tight corners, restrained. Suggests clinical care.',
    appliesTo: ['pharmacy', 'chemist', 'medicine'],
    accent: '#0C8599',
    radius: '0.75rem',
    card: 'flat',
    density: 'comfortable',
    swatch: ['#0C8599', '#E3FAFC', '#0B2B31'],
  },
  {
    preset: 'midnight',
    name: 'Midnight',
    description: 'Dark surfaces with a bright accent. For late-night kitchens.',
    appliesTo: ['grill', 'night', 'shawarma', 'bbq'],
    accent: '#FF6B35',
    radius: '0.875rem',
    card: 'bold',
    density: 'compact',
    swatch: ['#FF6B35', '#1A1A1A', '#F8F9FA'],
  },
  {
    preset: 'boutique',
    name: 'Boutique',
    description: 'Muted plum, wide corners, airy spacing. For fashion and beauty.',
    appliesTo: ['fashion', 'thrift', 'salon', 'beauty', 'boutique'],
    accent: '#9C36B5',
    radius: '1.5rem',
    card: 'soft',
    density: 'airy',
    swatch: ['#9C36B5', '#F8F0FC', '#2B0B33'],
  },
  {
    preset: 'classic-shop',
    name: 'Classic shop',
    description: 'Neutral and unfussy. A safe default for any retail store.',
    appliesTo: ['mini-mart', 'single-category', 'physical_product', 'retail'],
    accent: '#FF5C1A',
    radius: '1rem',
    card: 'flat',
    density: 'comfortable',
    swatch: ['#FF5C1A', '#F6F3EF', '#171310'],
  },
];

export const themesForVendor = (vendorType?: string, category?: string, storeName?: string) => {
  const haystack = [vendorType, category, storeName]
    .map((v) => String(v || '').toLowerCase())
    .filter(Boolean);

  const matches = (t: ThemePreset) => t.appliesTo.some((k) => haystack.some((h) => h.includes(k)));

  // Suited themes first, the rest of the catalogue after — same rule as templates: a vendor
  // should be able to browse, not be told what they are allowed to look like.
  return [...THEME_PRESETS.filter(matches), ...THEME_PRESETS.filter((t) => !matches(t))];
};
