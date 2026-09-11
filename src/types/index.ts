export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  description: string;
  about: string;
  logo: string | null;
  heroImage: string | null;
  restaurantImage: string | null;
  address: string;
  phone: string;
  email: string;
  instagramUrl: string | null;
  mapUrl: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  displayOrder: number;
  items?: MenuItem[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  category?: MenuCategory;
  name: string;
  description: string;
  price: number;
  image: string | null;
  isVeg: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string | null;
  displayOrder: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface OpeningHour {
  id: string;
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  displayOrder: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface PublicDataResponse {
  restaurant: Restaurant | null;
  categories: (MenuCategory & { items: MenuItem[] })[];
  featuredItems: MenuItem[];
  gallery: GalleryImage[];
  hours: OpeningHour[];
}
