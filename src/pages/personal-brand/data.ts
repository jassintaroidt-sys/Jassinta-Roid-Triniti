export interface DocumentItem {
  id: number;
  logo: string;
  documentNumber: string;
  x: number; // percentage across container width
  y: number; // percentage across container height
  width: number; // px width
  height: number; // px height
  rotation: number; // degrees
  zIndex: number;
}

export const initialDocuments: DocumentItem[] = [
  {
    id: 1,
    logo: 'logo_1.png',
    documentNumber: '01',
    x: 6,
    y: 8,
    width: 170,
    height: 195,
    rotation: -3,
    zIndex: 21,
  },
  {
    id: 2,
    logo: 'logo_2.png',
    documentNumber: '02',
    x: 78,
    y: 6,
    width: 180,
    height: 175,
    rotation: 4,
    zIndex: 22,
  },
  {
    id: 3,
    logo: 'logo_3.png',
    documentNumber: '03',
    x: 82,
    y: 28,
    width: 165,
    height: 190,
    rotation: -4,
    zIndex: 23,
  },
  {
    id: 4,
    logo: 'logo_4.png',
    documentNumber: '04',
    x: 8,
    y: 30,
    width: 185,
    height: 165,
    rotation: 2,
    zIndex: 24,
  },
  {
    id: 5,
    logo: 'logo_5.png',
    documentNumber: '05',
    x: 5,
    y: 54,
    width: 175,
    height: 195,
    rotation: -5,
    zIndex: 25,
  },
  {
    id: 6,
    logo: 'logo_6.png',
    documentNumber: '06',
    x: 80,
    y: 52,
    width: 170,
    height: 170,
    rotation: 3,
    zIndex: 26,
  },
  {
    id: 7,
    logo: 'logo_7.png',
    documentNumber: '07',
    x: 18,
    y: 75,
    width: 180,
    height: 160,
    rotation: 5,
    zIndex: 27,
  },
  {
    id: 8,
    logo: 'logo_8.png',
    documentNumber: '08',
    x: 74,
    y: 74,
    width: 170,
    height: 190,
    rotation: -3,
    zIndex: 28,
  },
  {
    id: 9,
    logo: 'logo_9.png',
    documentNumber: '09',
    x: 55,
    y: 82,
    width: 175,
    height: 165,
    rotation: 1,
    zIndex: 29,
  },
  {
    id: 10,
    logo: 'logo_10.png',
    documentNumber: '10',
    x: 35,
    y: 80,
    width: 180,
    height: 170,
    rotation: -2,
    zIndex: 30,
  },
];
