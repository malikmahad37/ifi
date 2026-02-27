
export interface ProductSeries {
  id: string;
  name: string;
  nameUrdu: string;
  image: string;
  description: string;
  descriptionUrdu: string;
  sizes: string[];
  specifications?: string[];
}

export interface Category {
  id: string;
  name: string;
  nameUrdu: string;
  image: string;
  description: string;
  descriptionUrdu: string;
  series: ProductSeries[];
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  titleUrdu: string;
  content: string;
  contentUrdu: string;
  excerpt: string;
  excerptUrdu: string;
  date: string;
  image: string;
  author: string;
}
