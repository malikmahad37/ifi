
import { Category, ContactInfo } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'nuts',
    name: 'Industrial Nuts',
    nameUrdu: 'صنعتی نٹ',
    image: 'https://images.unsplash.com/photo-1530124560612-3f94ca9d3a00?q=80&w=1000&auto=format&fit=crop',
    description: 'High-precision industrial nuts manufactured for extreme durability and heavy-duty industrial applications.',
    descriptionUrdu: 'اعلیٰ درستگی والے صنعتی نٹ جو انتہائی پائیداری اور بھاری صنعتی استعمال کے لیے بنائے گئے ہیں۔',
    series: [
      {
        id: 'hex-nuts',
        name: 'Hexagonal Nuts',
        nameUrdu: 'ہیکساگونل نٹ',
        image: 'https://images.unsplash.com/photo-1621905252507-b354bcadcabc?q=80&w=1000&auto=format&fit=crop',
        description: 'Standard hexagonal nuts providing strong grip and reliable fastening for all mechanical structures.',
        descriptionUrdu: 'تمام مکینیکل ڈھانچوں کے لیے مضبوط گرفت اور قابل اعتماد مضبوطی فراہم کرنے والے معیاری ہیکساگونل نٹ۔',
        sizes: ['M4', 'M5', 'M6', 'M8', 'M10', 'M12', 'M16', 'M20', 'M24', 'M30'],
        specifications: ['Grade 8.8 Steel', 'Zinc Plated', 'Metric Thread']
      }
    ]
  },
  {
    id: 'bolts',
    name: 'Precision Bolts',
    nameUrdu: 'درست بولٹ',
    image: 'https://images.unsplash.com/photo-1542157585-ef20bfcce579?q=80&w=1000&auto=format&fit=crop',
    description: 'High-tensile bolts engineered for structural integrity and mechanical engineering excellence.',
    descriptionUrdu: 'سٹرکچرل سالمیت اور مکینیکل انجینئرنگ کی عمدگی کے لیے تیار کردہ ہائی ٹینسائل بولٹ۔',
    series: [
      {
        id: 'hex-head-bolts',
        name: 'Hex Head Bolts',
        nameUrdu: 'ہیکس ہیڈ بولٹ',
        image: 'https://images.unsplash.com/photo-1615486511484-69970344d271?q=80&w=1000&auto=format&fit=crop',
        description: 'Heavy-duty structural bolts with precision hexagonal heads for secure industrial installation.',
        descriptionUrdu: 'محفوظ صنعتی تنصیب کے لیے درست ہیکساگونل ہیڈز کے ساتھ ہیوی ڈیوٹی سٹرکچرل بولٹ۔',
        sizes: ['M8x20', 'M10x50', 'M12x60', 'M16x80'],
        specifications: ['High Tensile 10.9', 'Black Oxide Finish']
      }
    ]
  }
];

export const INITIAL_CONTACT: ContactInfo = {
  phone: "+923239645001",
  whatsapp: "+923239645001",
  email: "",
  address: "Lahore, Pakistan"
};

export const LOGO_URL = "/logo.png";
