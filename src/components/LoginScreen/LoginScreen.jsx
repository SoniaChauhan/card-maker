'use client';
import { useState, useEffect, useRef } from 'react';
import './LoginScreen.css';
import { useAuth } from '../../contexts/AuthContext';
import {
  generateOTP, storeOTP, verifyOTP,
  signUpUser, signInUser, resetPassword,
  createOrUpdateUser, userExists,
  isAdmin, ADMIN_EMAIL,
} from '../../services/authService';
import { sendOTPEmail, notifyAdmin, sendFeedback } from '../../services/notificationService';
import { isUserBlocked } from '../../services/blockService';
import { maskEmail } from '../../utils/helpers';
import AdminPanel from '../AdminPanel/AdminPanel';
import MyTemplates from '../MyTemplates/MyTemplates';
import DownloadHistory from '../DownloadHistory/DownloadHistory';
import Toast from '../shared/Toast';
import { getActiveFestivals, getVisibleFestivals } from '../../utils/festivalCalendar';

/* Preview components for sample cards */
import WeddingCardPreview from '../WeddingCard/WeddingCardPreview';
import BirthdayCardPreview from '../BirthdayCard/BirthdayCardPreview';
import AnniversaryCardPreview from '../AnniversaryCard/AnniversaryCardPreview';
import BiodataCardPreview from '../BiodataCard/BiodataCardPreview';
import RentCardPreview from '../RentCard/RentCardPreview';
import { PROPERTY_TYPES, PROPERTY_TYPE_CONFIG } from '../RentCard/rentConstants';
import SalonCardPreview from '../SalonCard/SalonCardPreview';
import { TEMPLATES as RESUME_TPL_LIST, SAMPLE_PROFILES } from '../CardResume/ResumeTemplates';
import '../RentCard/RentCard.css';
import '../SalonCard/SalonCard.css';
import '../CardResume/CardResume.css';

/* Sample data for each card type */
const SAMPLE_WEDDING = {
  groomName: 'Rajesh Kumar', brideName: 'Priya Sharma',
  groomFamily: 'Son of Mr. Ramesh Kumar & Mrs. Sunita Kumar',
  brideFamily: 'Daughter of Mr. Vikram Sharma & Mrs. Meena Sharma',
  weddingDate: '2026-04-15', weddingTime: '7:30 PM',
  weddingVenue: 'Royal Palace Banquet Hall', weddingVenueAddress: 'MG Road, New Delhi - 110001',
  receptionDate: '2026-04-16', receptionTime: '8:00 PM', receptionVenue: 'Grand Celebration Hall',
  guestName: 'Dear Guest', message: 'Your gracious presence will make our special day more memorable.',
  familyMembers: '', photo: null, photoPreview: '', customPrograms: [], selectedTemplate: 1, bgColor: '',
};

const SAMPLE_BIRTHDAY = {
  guestName: 'Dear Friends & Family', birthdayPerson: 'Aarav', age: '5',
  date: '2026-03-25', time: '4:00 PM',
  venue: 'Fun Zone Party Hall', venueAddress: 'Sector 18, Noida - 201301',
  hostName: 'Sharma Family', message: 'Join us for a fun-filled celebration!',
  photo: null, photoPreview: '', selectedTemplate: 1, bgColor: '',
};

const SAMPLE_ANNIVERSARY = {
  partner1: 'Anil', partner2: 'Sunita', years: '25',
  date: '2026-05-10', message: 'Celebrating 25 wonderful years of love, laughter, and togetherness. Join us as we renew our vows!',
  photo: null, photoPreview: '', selectedTemplate: 1, bgColor: '',
};

const SAMPLE_BIODATA = {
  fullName: 'Priya Sharma', dob: '1998-06-15', age: '27', height: "5'4\"", weight: '55 kg',
  complexion: 'Fair', bloodGroup: 'B+', religion: 'Hindu', caste: 'Brahmin', subCaste: 'Kanyakubja',
  gotra: 'Kashyap', rashi: 'Virgo', nakshatra: 'Hasta', manglik: 'No',
  education: 'MBA (Finance)', occupation: 'Senior Analyst', employer: 'Deloitte', annualIncome: '₹12 LPA',
  fatherName: 'Mr. Ramesh Sharma', fatherOccupation: 'Retired Bank Manager',
  motherName: 'Mrs. Sunita Sharma', motherOccupation: 'Homemaker',
  siblings: '1 Elder Brother (Married, Software Engineer)', hobbies: 'Reading, Painting, Yoga, Travelling',
  aboutMe: 'A cheerful and family-oriented person with traditional values and modern outlook.',
  contactName: 'Mr. Ramesh Sharma (Father)', contactPhone: '+91 98765 43210',
  contactAddress: 'B-42, Green Park Extension, New Delhi - 110016',
  photo: null, photoPreview: '',
};

/* Template configs for sample preview */
const WEDDING_TEMPLATES = [
  { id: 1,  name: 'Classic Gold',     accent: '#b8860b' },
  { id: 2,  name: 'Gold Ornate',      accent: '#c9a84c' },
  { id: 3,  name: 'Garden Floral',    accent: '#3a7a4a' },
  { id: 4,  name: 'Warm Peach',       accent: '#c4756a' },
  { id: 5,  name: 'Royal Maroon',     accent: '#3d0a12' },
  { id: 6,  name: 'Divine Love',      accent: '#c9976a' },
  { id: 7,  name: 'Sacred Border',    accent: '#8b6914' },
  { id: 8,  name: 'Midnight Navy',    accent: '#1b2a4a' },
  { id: 9,  name: 'Lavender Dream',   accent: '#7b5ea7' },
  { id: 10, name: 'Rose Garden',      accent: '#c45b78' },
  { id: 11, name: 'Teal Royale',      accent: '#1a6b6a' },
  { id: 12, name: 'Champagne Toast',  accent: '#b8976a' },
  { id: 13, name: 'Emerald Palace',   accent: '#1a5a3a' },
  { id: 14, name: 'Ivory Lace',       accent: '#a08a6a' },
  { id: 15, name: 'Sunset Amber',     accent: '#c47820' },
  { id: 16, name: 'Regal Purple',     accent: '#5a2a7a' },
  { id: 17, name: 'Lotus Pink',       accent: '#d4748a' },
  { id: 18, name: 'Ocean Blue',       accent: '#2a6a9a' },
  { id: 19, name: 'Marigold Festive', accent: '#d4882a' },
  { id: 20, name: 'Black Tie',        accent: '#1a1a1a' },
];

const BIRTHDAY_TEMPLATES = [
  { id: 1,  name: 'Space Adventure',  accent: '#2c3e6b' },
  { id: 2,  name: 'Pastel Balloons',  accent: '#c4937f' },
  { id: 3,  name: 'Cute Stars',       accent: '#c67a5c' },
  { id: 4,  name: 'Party Confetti',   accent: '#d98a4b' },
  { id: 5,  name: 'Sunshine Floral',  accent: '#b87f7f' },
  { id: 6,  name: 'Animal Friends',   accent: '#9e7b5a' },
  { id: 7,  name: 'Candy Pop',        accent: '#e85090' },
  { id: 8,  name: 'Ocean Splash',     accent: '#1a8a9a' },
  { id: 9,  name: 'Jungle Safari',    accent: '#4a7a2a' },
  { id: 10, name: 'Princess Castle',  accent: '#9a5abc' },
  { id: 11, name: 'Superhero Pow',    accent: '#c42020' },
  { id: 12, name: 'Unicorn Magic',    accent: '#c488d0' },
  { id: 13, name: 'Dino Roar',        accent: '#5a8848' },
  { id: 14, name: 'Ice Cream Dream',  accent: '#d4748a' },
  { id: 15, name: 'Pirate Treasure',  accent: '#2a3a5a' },
  { id: 16, name: 'Garden Butterfly', accent: '#7a6aaa' },
  { id: 17, name: 'Race Car',         accent: '#b82020' },
  { id: 18, name: 'Rainbow Bright',   accent: '#e87040' },
  { id: 19, name: 'Teddy Picnic',     accent: '#a07850' },
  { id: 20, name: 'Neon Glow',        accent: '#0a0a1a' },
];

const ANNIVERSARY_TEMPLATES = [
  { id: 1,  name: 'Royal Gold Floral',  accent: '#c9a84c' },
  { id: 2,  name: 'Rose Gold Romance',  accent: '#d4a373' },
  { id: 3,  name: 'Emerald Laurels',    accent: '#5a8a4a' },
  { id: 4,  name: 'Mandala Rings',      accent: '#d4af37' },
  { id: 5,  name: 'Vintage Frame',      accent: '#b8860b' },
  { id: 6,  name: 'Minimal Swirl',      accent: '#c9a84c' },
  { id: 7,  name: 'Midnight Sapphire',  accent: '#7b9ec7' },
  { id: 8,  name: 'Blush Petal',        accent: '#d4748a' },
  { id: 9,  name: 'Champagne Glow',     accent: '#c4a35a' },
  { id: 10, name: 'Teal Elegance',      accent: '#2a8a7a' },
  { id: 11, name: 'Burgundy Velvet',    accent: '#8b2252' },
  { id: 12, name: 'Ivory Classic',      accent: '#8b7355' },
  { id: 13, name: 'Sunset Coral',       accent: '#e07050' },
  { id: 14, name: 'Silver Moonlight',   accent: '#a8b8c8' },
  { id: 15, name: 'Lavender Dreams',    accent: '#9b7db8' },
  { id: 16, name: 'Forest & Amber',     accent: '#c8a840' },
  { id: 17, name: 'Ocean Breeze',       accent: '#4a90b8' },
  { id: 18, name: 'Marigold Festive',   accent: '#e0a030' },
  { id: 19, name: 'Copper Rose',        accent: '#c87850' },
  { id: 20, name: 'Pearl White',        accent: '#b0b8c0' },
];

const BIODATA_TEMPLATES = [
  { id: 1,  name: 'Classic Gold',        accent: '#d4af37' },
  { id: 2,  name: 'Royal Blue',          accent: '#1a3a5c' },
  { id: 3,  name: 'Elegant Green',       accent: '#2d5a3d' },
  { id: 4,  name: 'Pink Blossom',        accent: '#d4748a' },
  { id: 5,  name: 'Modern Minimal',      accent: '#4a4a4a' },
  { id: 6,  name: 'Royal Purple',        accent: '#5c3a6e' },
  { id: 7,  name: 'Burgundy Rich',       accent: '#6e1a2a' },
  { id: 8,  name: 'Teal Heritage',       accent: '#1a5a5a' },
  { id: 9,  name: 'Saffron Sunrise',     accent: '#c06020' },
  { id: 10, name: 'Midnight Navy',       accent: '#1a2a4a' },
  { id: 11, name: 'Rose Quartz',         accent: '#b06080' },
  { id: 12, name: 'Olive Traditional',   accent: '#5a6e30' },
  { id: 13, name: 'Copper Charm',        accent: '#a06840' },
  { id: 14, name: 'Sapphire Jewel',      accent: '#2050a0' },
  { id: 15, name: 'Lavender Grace',      accent: '#7a50a0' },
  { id: 16, name: 'Mahogany Classic',    accent: '#5a2a18' },
  { id: 17, name: 'Peacock Teal',        accent: '#0a6a6a' },
  { id: 18, name: 'Coral Festive',       accent: '#d05040' },
  { id: 19, name: 'Slate Formal',        accent: '#4a5568' },
  { id: 20, name: 'Marigold Auspicious', accent: '#c89020' },
];

const SAMPLE_RENT = {
  propertyType: 'pg',
  selectedTemplate: 1,
  title: 'PG / PER BED RENT AVAILABLE',
  location: 'Sector 62, Noida — Near Metro Station',
  rentWithoutAC: '6,500',
  rentWithAC: '8,500',
  features: ['2–3 Beds in Each Room', 'Separate Washroom for Every Room', 'Small Kitchen in Every Room', '24/7 Power Backup'],
  amenities: [
    { icon: '📶', text: 'High-Speed WiFi' },
    { icon: '💧', text: 'RO Drinking Water' },
    { icon: '🚿', text: 'Water Softener' },
    { icon: '📹', text: 'Security Cameras' },
    { icon: '🍱', text: 'Tiffin Service' },
  ],
  contactName: 'Rajesh Kumar',
  contactPhone: '+91 98765 43210',
  logo: null,
  propertyImages: [],
};

const SAMPLE_SALON = {
  businessName: 'Glamour Beauty Studio',
  tagline: 'Special Packages',
  services: [
    { name: 'Hair Spa', details: 'Deep conditioning treatment', price: '899', section: 'ladies' },
    { name: 'Rica Wax (Full Arms)', details: '', price: '449', section: 'ladies' },
    { name: 'Bridal Makeup', details: 'HD finish with airbrush', price: '15,000', section: 'ladies' },
    { name: 'Hair Cut (Men)', details: 'Styling included', price: '199', section: 'men' },
    { name: 'Beard Trim', details: '', price: '99', section: 'men' },
    { name: 'Kids Hair Cut', details: '', price: '149', section: 'kids' },
  ],
  contactPhone: '+91 98765 43210',
  contactName: 'Priya Sharma',
  address: 'MG Road, New Delhi - 110001',
  logo: null,
  theme: 'dark-gold',
};

const SALON_THEMES = [
  { id: 'dark-gold',     name: 'Dark & Gold (Luxury)', accent: '#d4af37' },
  { id: 'dark-rose',     name: 'Dark & Rose',          accent: '#c44569' },
  { id: 'blush-pink',    name: 'Blush Pink',           accent: '#e8a0bf' },
  { id: 'white-gold',    name: 'White & Gold',         accent: '#b8860b' },
  { id: 'teal-cream',    name: 'Teal & Cream',         accent: '#2a9d8f' },
  { id: 'midnight-plum', name: 'Midnight Plum',        accent: '#c890e8' },
  { id: 'sage-green',    name: 'Sage Green',           accent: '#5a7a48' },
  { id: 'coral-peach',   name: 'Coral Peach',          accent: '#d06040' },
  { id: 'navy-silver',   name: 'Navy & Silver',        accent: '#a0b0c0' },
  { id: 'lavender-mist', name: 'Lavender Mist',        accent: '#7a58a0' },
  { id: 'mocha-cream',   name: 'Mocha Cream',          accent: '#6a4a28' },
  { id: 'ruby-black',    name: 'Ruby & Black',         accent: '#d03050' },
  { id: 'mint-fresh',    name: 'Mint Fresh',           accent: '#2a8060' },
  { id: 'sunset-amber',  name: 'Sunset Amber',         accent: '#c08020' },
  { id: 'ice-blue',      name: 'Ice Blue',             accent: '#3070a0' },
  { id: 'mauve-silk',    name: 'Mauve Silk',           accent: '#9a5078' },
  { id: 'forest-bronze', name: 'Forest & Bronze',      accent: '#c0a060' },
  { id: 'champagne',     name: 'Champagne',            accent: '#8a7038' },
  { id: 'berry-wine',    name: 'Berry Wine',           accent: '#e080a0' },
  { id: 'pearl-gray',    name: 'Pearl Gray',           accent: '#5a5a68' },
];

/* Sample resume data for template previews — full data matching TemplateSelector */
const SAMPLE_RESUME = {
  fullName: 'Priya Sharma',
  jobTitle: 'Senior Software Engineer',
  email: 'priya.sharma@example.com',
  phone: '+91 98765 43210',
  location: 'Bangalore, India 560001',
  linkedin: 'linkedin.com/in/priyasharma',
  summary: 'Dynamic Senior Software Engineer with extensive experience specializing in Angular and React.js. Proven track record in developing robust applications and enhancing team collaboration. Adept at integrating complex APIs and optimizing performance, while ensuring client requirements are met through innovative solutions and effective communication.',
  experience: [
    { title: 'Senior Software Engineer', company: 'Wipro Technologies', from: '12/2022', to: 'Current', location: 'Greater Noida, India', desc: 'Developed and maintained front-end applications for Dealer Management System (DMS) using Angular.\nImplemented unit test cases using Jest for robust and reliable code.\nWorked on multiple dashboards including Windsurf Dashboard, Tooling Dashboard, KPI Dashboard, and Metrics Dashboard.\nIntegrated and managed tools like Codebeamer and Jama for requirement and project management.\nCollaborated on full-stack development using Angular, React.js, Node.js, .NET, and Python.\nUtilized tools such as pgAdmin, Docker, Git, and MongoDB for database management, containerization, version control, and data handling.' },
    { title: 'Software Engineer', company: 'Magic EdTech', from: '06/2021', to: '11/2022', location: 'Greater Noida, India', desc: 'Established efficient communication channels within the team, leading to better collaboration among members during project development phases.\nCoordinated with other engineers to evaluate and improve software and hardware interfaces.\nTested methodology with writing and execution of test plans, debugging and testing scripts and tools.\nFocused on Accessibility compliance for web applications.\nDeveloped features using React.js, Angular, Redux, and TypeScript.' },
    { title: 'Software Engineer', company: 'Hocalwire', from: '02/2021', to: '05/2021', location: 'Noida, India', desc: 'Debug and troubleshoot template-related issues.\nParticipate in code reviews and contribute to best practices for templating and front-end development.\nDevelop and maintain Jade/Pug templates for rendering dynamic HTML content.\nCollaborate with designers and back-end developers to implement responsive and user-friendly interfaces.\nOptimize templates for performance and scalability.' },
    { title: 'Software Engineer', company: 'Enco Engineer Combine Pvt Ltd', from: '11/2019', to: '01/2021', location: 'Gurgaon, India', desc: 'Develop and maintain ERP web applications for multiple business modules (HR, Finance, Sales, Marketing).\nDesign and implement dynamic and responsive forms using Angular.\nIntegrate RESTful APIs and third-party services into ERP systems.\nCollaborate with cross-functional teams to gather requirements and deliver scalable solutions.\nOptimize application performance and ensure security compliance.\nTroubleshoot and resolve technical issues across ERP modules.\nParticipate in code reviews and maintain best practices in software development.' },
    { title: 'Software Engineer', company: 'Educo Internation Pvt Ltd', from: '09/2018', to: '08/2019', location: 'New Delhi, India', desc: 'Developed and maintained interactive web applications using HTML, JavaScript, jQuery, and SVG for dynamic and responsive user interfaces.\nImplemented mathematical and logical algorithms to solve complex problems and enhance application functionality.\nDesigned and integrated social science-based animations to create engaging and educational user experiences.\nOptimized front-end performance and ensured cross-browser compatibility for seamless user interaction.\nCollaborated with teams to deliver data-driven visualizations and interactive content for diverse domains.' },
  ],
  education: [
    { degree: 'Bachelor of Technology: Computer Science', institution: 'Guru Govind Singh Indraprastha University', year: '07/2018', location: 'New Delhi, India' },
  ],
  skills: 'React.js, Angular, Node.js, Python, .NET, Jest, Docker, Git, MongoDB, pgAdmin, Client Requirements',
  languages: 'Hindi: Native speaker, English: Professional',
  interests: 'Full-stack Development, Open Source Contributions, Tech Community',
  photo: null,
  photoPreview: '',
};

/* Resume template configs for sample preview — show all templates with diverse profiles */
const RESUME_TEMPLATES = RESUME_TPL_LIST.map((t, i) => ({
  id: t.id, name: t.name, accent: t.color, Component: t.Component,
  sampleData: SAMPLE_PROFILES[i % SAMPLE_PROFILES.length],
}));

/* Rent card colour themes for landing-page sample previews */
const RENT_TEMPLATES = [
  { id: 1,  name: 'Classic Blue',     accent: '#0b3d91' },
  { id: 2,  name: 'Royal Purple',     accent: '#4a148c' },
  { id: 3,  name: 'Forest Green',     accent: '#1b5e20' },
  { id: 4,  name: 'Sunset Orange',    accent: '#e65100' },
  { id: 5,  name: 'Midnight Dark',    accent: '#212121' },
  { id: 6,  name: 'Cherry Red',       accent: '#b71c1c' },
  { id: 7,  name: 'Teal Wave',        accent: '#00695c' },
  { id: 8,  name: 'Rose Gold',        accent: '#8d6e63' },
  { id: 9,  name: 'Sky Horizon',      accent: '#0277bd' },
  { id: 10, name: 'Burgundy Wine',    accent: '#880e4f' },
  { id: 11, name: 'Olive Earthy',     accent: '#33691e' },
  { id: 12, name: 'Indigo Night',     accent: '#1a237e' },
  { id: 13, name: 'Coral Breeze',     accent: '#d84315' },
  { id: 14, name: 'Steel Gray',       accent: '#37474f' },
  { id: 15, name: 'Plum Delight',     accent: '#6a1b9a' },
  { id: 16, name: 'Ocean Deep',       accent: '#004d40' },
  { id: 17, name: 'Amber Gold',       accent: '#e65100' },
  { id: 18, name: 'Slate Blue',       accent: '#455a64' },
  { id: 19, name: 'Emerald Luxe',     accent: '#2e7d32' },
  { id: 20, name: 'Charcoal Premium', accent: '#1a1a1a' },
];

/* Sample data per template — varied property types for richer previews */
const SAMPLE_RENT_BY_TPL = {
  1: {
    propertyType: 'pg', selectedTemplate: 1,
    title: 'PG / PER BED RENT AVAILABLE',
    location: 'Sector 62, Noida — Near Metro Station',
    rentWithoutAC: '6,500', rentWithAC: '8,500',
    features: ['2–3 Beds in Each Room', 'Separate Washroom for Every Room', 'Small Kitchen in Every Room', '24/7 Power Backup'],
    amenities: [
      { icon: '📶', text: 'High-Speed WiFi' }, { icon: '💧', text: 'RO Drinking Water' },
      { icon: '🚿', text: 'Water Softener' }, { icon: '📹', text: 'Security Cameras' },
      { icon: '🍱', text: 'Tiffin Service' },
    ],
    contactName: 'Rajesh Kumar', contactPhone: '+91 98765 43210', logo: null, propertyImages: [],
  },
  2: {
    propertyType: 'flat', selectedTemplate: 2,
    title: 'SPACIOUS 2 BHK FLAT FOR RENT',
    location: 'Indirapuram, Ghaziabad — Near Vaishali Metro',
    rentWithoutAC: '12,000', rentWithAC: '15,000',
    features: ['2 Bedrooms + Hall + Kitchen', 'Modular Kitchen', 'Attached Balcony', 'Reserved Car Parking'],
    amenities: [
      { icon: '🏋️', text: 'Gym Access' }, { icon: '🏊', text: 'Swimming Pool' },
      { icon: '🔒', text: '24×7 Security' }, { icon: '⚡', text: 'Power Backup' },
      { icon: '🌿', text: 'Garden & Park' },
    ],
    contactName: 'Anita Verma', contactPhone: '+91 99887 65432', logo: null, propertyImages: [],
  },
  3: {
    propertyType: 'room', selectedTemplate: 3,
    title: 'FURNISHED ROOM AVAILABLE',
    location: 'Laxmi Nagar, Delhi — Near Metro Gate 2',
    rentWithoutAC: '5,000', rentWithAC: '7,500',
    features: ['Fully Furnished', 'Attached Washroom', 'Separate Entry', 'No Owner Restriction'],
    amenities: [
      { icon: '📶', text: 'WiFi Included' }, { icon: '💧', text: 'RO Water' },
      { icon: '🧹', text: 'Daily Cleaning' }, { icon: '🚗', text: 'Bike Parking' },
    ],
    contactName: 'Sunil Sharma', contactPhone: '+91 88776 54321', logo: null, propertyImages: [],
  },
  4: {
    propertyType: 'hostel', selectedTemplate: 4,
    title: 'BOYS HOSTEL — BEDS AVAILABLE',
    location: 'Kota, Rajasthan — Near Allen Coaching',
    rentWithoutAC: '4,000', rentWithAC: '6,000',
    features: ['Triple Sharing Rooms', 'Mess Facility', '24/7 Hot Water', 'Study Hall'],
    amenities: [
      { icon: '📶', text: 'High-Speed WiFi' }, { icon: '🍳', text: 'Veg & Non-Veg Mess' },
      { icon: '🧺', text: 'Laundry Service' }, { icon: '📹', text: 'CCTV Surveillance' },
      { icon: '🛺', text: 'Auto Stand Nearby' },
    ],
    contactName: 'Mahesh Jain', contactPhone: '+91 77665 43210', logo: null, propertyImages: [],
  },
  5: {
    propertyType: 'shop', selectedTemplate: 5,
    title: 'PRIME SHOP SPACE FOR RENT',
    location: 'MG Road, Gurugram — Ground Floor, Main Market',
    rentWithoutAC: '25,000', rentWithAC: '',
    features: ['350 sq ft Carpet Area', 'Glass Front Façade', 'Separate Electric Meter', 'Ample Footfall Location'],
    amenities: [
      { icon: '🚗', text: 'Customer Parking' }, { icon: '⚡', text: '3-Phase Power' },
      { icon: '💧', text: '24×7 Water' }, { icon: '🔒', text: 'Roller Shutter' },
    ],
    contactName: 'Vikram Singh', contactPhone: '+91 99001 23456', logo: null, propertyImages: [],
  },
  6: {
    propertyType: 'pg', selectedTemplate: 6,
    title: 'GIRLS PG — SAFE & HOMELY',
    location: 'Koramangala, Bangalore — Near Forum Mall',
    rentWithoutAC: '7,000', rentWithAC: '9,500',
    features: ['Single / Double Sharing', 'Home-Cooked Meals', 'Attached Washroom', 'No Curfew'],
    amenities: [
      { icon: '📶', text: 'WiFi Included' }, { icon: '🧹', text: 'Housekeeping' },
      { icon: '🔐', text: 'Biometric Lock' }, { icon: '💧', text: 'RO + Geyser' },
      { icon: '🏥', text: 'Clinic Nearby' },
    ],
    contactName: 'Priya Nair', contactPhone: '+91 98123 45678', logo: null, propertyImages: [],
  },
  7: {
    propertyType: 'flat', selectedTemplate: 7,
    title: '3 BHK LUXURY FLAT FOR RENT',
    location: 'Powai, Mumbai — Near Hiranandani Gardens',
    rentWithoutAC: '35,000', rentWithAC: '40,000',
    features: ['3 BHK + Servant Room', 'Italian Marble Flooring', 'Modular Kitchen', 'Covered Parking × 2'],
    amenities: [
      { icon: '🏊', text: 'Infinity Pool' }, { icon: '🏋️', text: 'Premium Gym' },
      { icon: '🌿', text: 'Rooftop Garden' }, { icon: '🔐', text: '24×7 Security' },
    ],
    contactName: 'Sanjay Mehta', contactPhone: '+91 99012 34567', logo: null, propertyImages: [],
  },
  8: {
    propertyType: 'pg', selectedTemplate: 8,
    title: 'WORKING WOMEN PG — PREMIUM',
    location: 'HSR Layout, Bangalore — Near Silk Board',
    rentWithoutAC: '8,000', rentWithAC: '10,500',
    features: ['Single & Double Sharing', 'Home-Cooked Meals (Veg)', 'Hot Water 24×7', 'Weekly Room Cleaning'],
    amenities: [
      { icon: '📶', text: 'High-Speed WiFi' }, { icon: '🧹', text: 'Housekeeping' },
      { icon: '🔐', text: 'Biometric Access' }, { icon: '🏥', text: 'First Aid Kit' },
    ],
    contactName: 'Lakshmi Devi', contactPhone: '+91 87654 32109', logo: null, propertyImages: [],
  },
  9: {
    propertyType: 'room', selectedTemplate: 9,
    title: 'INDEPENDENT ROOM — NEAR IT PARK',
    location: 'Whitefield, Bangalore — Near ITPL',
    rentWithoutAC: '6,500', rentWithAC: '9,000',
    features: ['Fully Furnished', 'Private Washroom', 'Separate Entrance', 'Balcony Attached'],
    amenities: [
      { icon: '📶', text: 'WiFi Included' }, { icon: '🚗', text: 'Parking Available' },
      { icon: '💧', text: 'RO + Geyser' }, { icon: '🛒', text: 'Grocery Store Nearby' },
    ],
    contactName: 'Arun Kumar', contactPhone: '+91 76543 21098', logo: null, propertyImages: [],
  },
  10: {
    propertyType: 'hostel', selectedTemplate: 10,
    title: 'GIRLS HOSTEL — SAFE & CLEAN',
    location: 'Andheri West, Mumbai — Near Station',
    rentWithoutAC: '5,500', rentWithAC: '7,500',
    features: ['Double & Triple Sharing', 'Meal Included', 'Hot Water', 'Study Room'],
    amenities: [
      { icon: '📶', text: 'WiFi Included' }, { icon: '🍳', text: 'Veg Meals' },
      { icon: '📹', text: 'CCTV Security' }, { icon: '🧺', text: 'Laundry Service' },
    ],
    contactName: 'Meena Shah', contactPhone: '+91 65432 10987', logo: null, propertyImages: [],
  },
  11: {
    propertyType: 'shop', selectedTemplate: 11,
    title: 'COMMERCIAL SPACE — PRIME LOCATION',
    location: 'Connaught Place, Delhi — Inner Circle',
    rentWithoutAC: '50,000', rentWithAC: '',
    features: ['500 sq ft Carpet Area', 'High Street Frontage', 'Ready to Move', '24/7 Access'],
    amenities: [
      { icon: '🚗', text: 'Valet Parking' }, { icon: '⚡', text: 'Power Backup' },
      { icon: '🔒', text: 'Security Guard' }, { icon: '🛗', text: 'Lift Access' },
    ],
    contactName: 'Rohit Kapoor', contactPhone: '+91 54321 09876', logo: null, propertyImages: [],
  },
  12: {
    propertyType: 'pg', selectedTemplate: 12,
    title: 'BOYS PG — NEAR UNIVERSITY',
    location: 'Vijay Nagar, Indore — Near DA-IICT',
    rentWithoutAC: '4,500', rentWithAC: '6,500',
    features: ['Triple Sharing', 'Tiffin Service', 'Study Area', 'Laundry Facility'],
    amenities: [
      { icon: '📶', text: 'High-Speed WiFi' }, { icon: '💧', text: 'RO Water' },
      { icon: '📹', text: 'CCTV Cameras' }, { icon: '🏪', text: 'Canteen Nearby' },
    ],
    contactName: 'Deepak Joshi', contactPhone: '+91 43210 98765', logo: null, propertyImages: [],
  },
  13: {
    propertyType: 'flat', selectedTemplate: 13,
    title: '1 BHK FURNISHED FLAT',
    location: 'Wakad, Pune — Near Hinjewadi IT Park',
    rentWithoutAC: '14,000', rentWithAC: '17,000',
    features: ['1 BHK Fully Furnished', 'Modular Kitchen', 'Reserved Parking', 'Balcony with View'],
    amenities: [
      { icon: '🏋️', text: 'Gym Available' }, { icon: '🏊', text: 'Pool Access' },
      { icon: '🔐', text: 'Gated Security' }, { icon: '🌿', text: 'Garden Area' },
    ],
    contactName: 'Sneha Patil', contactPhone: '+91 32109 87654', logo: null, propertyImages: [],
  },
  14: {
    propertyType: 'room', selectedTemplate: 14,
    title: 'SPACIOUS ROOM — FAMILY AREA',
    location: 'Gomti Nagar, Lucknow — Near Phoenix Mall',
    rentWithoutAC: '5,500', rentWithAC: '7,000',
    features: ['Spacious Room + Kitchen', 'Attached Washroom', 'Separate Entry', 'Ground Floor'],
    amenities: [
      { icon: '📶', text: 'WiFi Available' }, { icon: '💧', text: 'Water Supply 24×7' },
      { icon: '🚗', text: 'Two-Wheeler Parking' }, { icon: '🏪', text: 'Market Nearby' },
    ],
    contactName: 'Ramesh Gupta', contactPhone: '+91 21098 76543', logo: null, propertyImages: [],
  },
  15: {
    propertyType: 'hostel', selectedTemplate: 15,
    title: 'CO-LIVING SPACE — MODERN',
    location: 'Marathahalli, Bangalore — Near ORR',
    rentWithoutAC: '7,000', rentWithAC: '9,500',
    features: ['Single & Double Sharing', 'Fully Furnished', 'Common Kitchen', 'Lounge Area'],
    amenities: [
      { icon: '📶', text: 'Fiber WiFi' }, { icon: '🧹', text: 'Daily Housekeeping' },
      { icon: '🍳', text: 'Kitchen Access' }, { icon: '🎮', text: 'Gaming Zone' },
    ],
    contactName: 'Kiran Reddy', contactPhone: '+91 10987 65432', logo: null, propertyImages: [],
  },
  16: {
    propertyType: 'shop', selectedTemplate: 16,
    title: 'OFFICE SPACE FOR RENT',
    location: 'BKC, Mumbai — Near Platina Building',
    rentWithoutAC: '75,000', rentWithAC: '',
    features: ['1200 sq ft Built-Up', 'Fully Furnished', 'Conference Room', 'Pantry Area'],
    amenities: [
      { icon: '🚗', text: 'Reserved Parking' }, { icon: '⚡', text: 'UPS Backup' },
      { icon: '🔒', text: 'Card Access Security' }, { icon: '🛗', text: 'High-Speed Lifts' },
    ],
    contactName: 'Nitin Deshmukh', contactPhone: '+91 09876 54321', logo: null, propertyImages: [],
  },
  17: {
    propertyType: 'pg', selectedTemplate: 17,
    title: 'EXECUTIVE PG — FURNISHED',
    location: 'Thane West, Mumbai — Near Viviana Mall',
    rentWithoutAC: '9,000', rentWithAC: '12,000',
    features: ['Single Occupancy', 'AC Room', 'Attached Washroom', 'Meals Included'],
    amenities: [
      { icon: '📶', text: 'WiFi + DTH' }, { icon: '🧺', text: 'Laundry' },
      { icon: '🔐', text: 'Digital Lock' }, { icon: '🚿', text: 'Geyser + RO' },
    ],
    contactName: 'Vishal Thakur', contactPhone: '+91 98765 12345', logo: null, propertyImages: [],
  },
  18: {
    propertyType: 'flat', selectedTemplate: 18,
    title: '2 BHK SEMI-FURNISHED FLAT',
    location: 'Salt Lake, Kolkata — Sector V IT Hub',
    rentWithoutAC: '15,000', rentWithAC: '18,000',
    features: ['2 BHK + Dining', 'Wardrobe in Both Rooms', 'Balcony Attached', 'Covered Parking'],
    amenities: [
      { icon: '🔐', text: 'Gated Complex' }, { icon: '🌿', text: 'Children Play Area' },
      { icon: '⚡', text: 'Generator Backup' }, { icon: '🛒', text: 'Supermarket Inside' },
    ],
    contactName: 'Debashis Roy', contactPhone: '+91 87654 56789', logo: null, propertyImages: [],
  },
  19: {
    propertyType: 'room', selectedTemplate: 19,
    title: 'FURNISHED ROOM FOR BACHELORS',
    location: 'Baner, Pune — Near Balewadi Stadium',
    rentWithoutAC: '7,000', rentWithAC: '9,000',
    features: ['Bed + Wardrobe + Desk', 'Private Washroom', 'Separate Entry', 'First Floor'],
    amenities: [
      { icon: '📶', text: 'WiFi Included' }, { icon: '💧', text: '24×7 Water' },
      { icon: '🚗', text: 'Bike Parking' }, { icon: '🏪', text: 'Food Street Nearby' },
    ],
    contactName: 'Amit Kulkarni', contactPhone: '+91 76543 89012', logo: null, propertyImages: [],
  },
  20: {
    propertyType: 'hostel', selectedTemplate: 20,
    title: 'PREMIUM STUDENTS HOSTEL',
    location: 'Rajouri Garden, Delhi — Near Metro',
    rentWithoutAC: '5,000', rentWithAC: '7,000',
    features: ['Double Sharing AC Rooms', 'Study Hall', 'Indoor Games', 'Mess Facility'],
    amenities: [
      { icon: '📶', text: 'High-Speed WiFi' }, { icon: '🍳', text: 'North & South Meals' },
      { icon: '📹', text: 'CCTV Security' }, { icon: '🧺', text: 'Laundry Machine' },
    ],
    contactName: 'Naveen Singh', contactPhone: '+91 65432 78901', logo: null, propertyImages: [],
  },
};

/*
  Modes:
    signin          – Email + Password (default)
    signup          – Name + Email + Password → OTP verify
    signup-otp      – Enter OTP after signup
    forgot          – Enter email to get reset OTP
    forgot-otp      – Enter OTP for reset
    forgot-newpw    – Set new password
    otp-login       – Login via OTP (no password)
    otp-login-verify – Verify OTP for passwordless login
*/

export default function LoginScreen({ onSelect, onSelectFestival, onEditTemplate, onOpenCombo, onOpenCalendar, onOpenFreeCards }) {
  const { user, login, loginAsGuest, logout, isGuest, isFreePlan, isSuperAdmin } = useAuth();

  const [mode, setMode]           = useState('signin');
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [otp, setOtp]             = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [info, setInfo]           = useState('');

  /* Account panel overlay */
  const [accountTab, setAccountTab] = useState(null); // null | 'profile' | 'templates' | 'downloads' | 'admin'
  const [toast, setToast]           = useState({ show: false, text: '' });
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  /* Hidden admin login trigger — triple-click logo */
  const logoClickRef = useRef({ count: 0, timer: null });

  /* Full preview overlay state */
  const [fullPreviewTpl, setFullPreviewTpl] = useState(null);

  /* Rent property-type tab state for landing page showcase */
  const [activeRentType, setActiveRentType] = useState('pg');

  /* Header state */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tplDropdownOpen, setTplDropdownOpen] = useState(false);

  function openAuthPopup(m = 'signin') { switchMode(m); setShowAuthPopup(true); }
  function closeAuthPopup() { setShowAuthPopup(false); resetForm(); }

  /* Feedback state */
  const [fbName, setFbName]       = useState('');
  const [fbEmail, setFbEmail]     = useState('');
  const [fbRating, setFbRating]   = useState(0);
  const [fbHover, setFbHover]     = useState(0);
  const [fbComment, setFbComment] = useState('');
  const [fbSending, setFbSending] = useState(false);
  const [fbMsg, setFbMsg]         = useState('');
  const [reviews, setReviews]     = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [submittedEmail, setSubmittedEmail] = useState('');

  /* Edit / Delete / Reply state */
  const [editId, setEditId]                 = useState(null);
  const [editRating, setEditRating]         = useState(0);
  const [editHover, setEditHover]           = useState(0);
  const [editComment, setEditComment]       = useState('');
  const [editSaving, setEditSaving]         = useState(false);
  const [replyToId, setReplyToId]           = useState(null);
  const [replyComment, setReplyComment]     = useState('');
  const [replyName, setReplyName]           = useState('');
  const [replySending, setReplySending]     = useState(false);

  /* Load public reviews on mount */
  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'list' }),
        });
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch { /* silently ignore */ }
      finally { setReviewsLoading(false); }
    }
    loadReviews();
  }, []);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim().toLowerCase();

  function resetForm() {
    setName(''); setEmail(''); setPassword(''); setConfirmPw('');
    setOtp(''); setError(''); setInfo(''); setShowPw(false);
  }

  function switchMode(m) {
    resetForm();
    setMode(m);
  }

  /* ========== SIGN IN (email + password) ========== */
  async function handleSignIn(e) {
    e.preventDefault();
    setError(''); setInfo('');
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) { setError('Enter a valid email.'); return; }
    if (!password) { setError('Enter your password.'); return; }

    setLoading(true);
    try {
      try {
        if (await isUserBlocked(trimmedEmail)) {
          setError('Your account has been blocked. Contact the admin for assistance.');
          setLoading(false);
          return;
        }
      } catch (_) { /* block-check failed — allow login */ }
      const user = await signInUser(trimmedEmail, password);
      login(user);
      setShowAuthPopup(false);
      notifyAdmin('🔑 User Login — Card Maker',
        `Sender: ${maskEmail(user.email)}\nName: ${user.name}\nRole: ${user.role}\nLogged in at ${new Date().toLocaleString()}.`,
        user.email
      ).catch(() => {});
    } catch (err) {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('permission')) {
        setError('Server configuration error. Please contact the admin.');
      } else {
        setError(msg || 'Sign-in failed.');
      }
    } finally { setLoading(false); }
  }

  /* ========== SIGN UP step 1 — collect info & send OTP ========== */
  async function handleSignUp(e) {
    e.preventDefault();
    setError(''); setInfo('');
    if (!name.trim()) { setError('Enter your name.'); setName(''); setEmail(''); setPassword(''); setConfirmPw(''); return; }
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) { setError('Enter a valid email.'); setPassword(''); setConfirmPw(''); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); setPassword(''); setConfirmPw(''); return; }
    if (password !== confirmPw) { setError('Passwords do not match.'); setPassword(''); setConfirmPw(''); return; }

    setLoading(true);
    try {
      const exists = await userExists(trimmedEmail);
      if (exists) { setError('Account already exists. Please sign in.'); setLoading(false); return; }

      const code = generateOTP();
      await storeOTP(trimmedEmail, code);
      await sendOTPEmail(trimmedEmail, code);
      setInfo(`OTP sent to ${trimmedEmail} — check your inbox.`);
      setMode('signup-otp');
    } catch (err) {
      console.error('OTP send error:', err);
      const msg = err?.text || err?.message || '';
      setError(msg || 'Failed to send OTP. Please try again.');
    } finally { setLoading(false); }
  }

  /* ========== SIGN UP step 2 — verify OTP & create account ========== */
  async function handleSignUpOTP(e) {
    e.preventDefault();
    setError(''); setInfo('');
    if (otp.length !== 6) { setError('Enter the 6-digit OTP.'); return; }

    setLoading(true);
    try {
      const valid = await verifyOTP(trimmedEmail, otp);
      if (!valid) { setError('Invalid or expired OTP.'); setLoading(false); return; }

      try {
        if (await isUserBlocked(trimmedEmail)) {
          setError('This email has been blocked. Contact the admin for assistance.');
          setLoading(false);
          return;
        }
      } catch (_) { /* block-check failed — allow sign-up */ }
      const user = await signUpUser(name, trimmedEmail, password);
      login(user);
      setShowAuthPopup(false);
      notifyAdmin('🆕 New Sign-Up — Card Maker',
        `Sender: ${maskEmail(user.email)}\nName: ${user.name}\nRole: ${user.role}\nSigned up at ${new Date().toLocaleString()}.`,
        user.email
      ).catch(() => {});
    } catch (err) {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('permission')) {
        setError('Server configuration error. Please contact the admin.');
      } else {
        setError(msg || 'Sign-up failed.');
      }
    } finally { setLoading(false); }
  }

  /* ========== FORGOT PASSWORD step 1 — send OTP ========== */
  async function handleForgotSend(e) {
    e.preventDefault();
    setError(''); setInfo('');
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) { setError('Enter a valid email.'); return; }

    setLoading(true);
    try {
      const exists = await userExists(trimmedEmail);
      if (!exists) { setError('No account found with this email.'); setLoading(false); return; }

      const code = generateOTP();
      await storeOTP(trimmedEmail, code);
      await sendOTPEmail(trimmedEmail, code);
      setInfo(`OTP sent to ${trimmedEmail}`);
      setMode('forgot-otp');
    } catch (err) {
      console.error('OTP send error:', err);
      const msg = err?.text || err?.message || '';
      setError(msg || 'Failed to send OTP. Please try again.');
    } finally { setLoading(false); }
  }

  /* ========== FORGOT PASSWORD step 2 — verify OTP ========== */
  async function handleForgotOTP(e) {
    e.preventDefault();
    setError(''); setInfo('');
    if (otp.length !== 6) { setError('Enter the 6-digit OTP.'); return; }

    setLoading(true);
    try {
      const valid = await verifyOTP(trimmedEmail, otp);
      if (!valid) { setError('Invalid or expired OTP.'); setLoading(false); return; }
      setInfo('OTP verified! Set your new password.');
      setOtp('');
      setMode('forgot-newpw');
    } catch (err) {
      setError('Verification failed.');
    } finally { setLoading(false); }
  }

  /* ========== FORGOT PASSWORD step 3 — set new password ========== */
  async function handleNewPassword(e) {
    e.preventDefault();
    setError(''); setInfo('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPw) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      await resetPassword(trimmedEmail, password);
      setInfo('Password reset successfully! Please sign in.');
      setPassword(''); setConfirmPw('');
      setTimeout(() => switchMode('signin'), 1500);
    } catch (err) {
      setError(err.message || 'Reset failed.');
    } finally { setLoading(false); }
  }

  /* ========== OTP LOGIN step 1 — send OTP ========== */
  async function handleOTPLoginSend(e) {
    e.preventDefault();
    setError(''); setInfo('');
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) { setError('Enter a valid email.'); return; }

    setLoading(true);
    try {
      const code = generateOTP();
      await storeOTP(trimmedEmail, code);
      await sendOTPEmail(trimmedEmail, code);
      setInfo(`OTP sent to ${trimmedEmail}`);
      setMode('otp-login-verify');
    } catch (err) {
      console.error('OTP send error:', err);
      const msg = err?.text || err?.message || '';
      setError(msg || 'Failed to send OTP. Please try again.');
    } finally { setLoading(false); }
  }

  /* ========== OTP LOGIN step 2 — verify ========== */
  async function handleOTPLoginVerify(e) {
    e.preventDefault();
    setError(''); setInfo('');
    if (otp.length !== 6) { setError('Enter the 6-digit OTP.'); return; }

    setLoading(true);
    try {
      const valid = await verifyOTP(trimmedEmail, otp);
      if (!valid) { setError('Invalid or expired OTP.'); setLoading(false); return; }

      try {
        if (await isUserBlocked(trimmedEmail)) {
          setError('Your account has been blocked. Contact the admin for assistance.');
          setLoading(false);
          return;
        }
      } catch (_) { /* block-check failed — allow login */ }
      const user = await createOrUpdateUser(trimmedEmail);
      login(user);
      setShowAuthPopup(false);
      notifyAdmin('🔑 OTP Login — Card Maker',
        `Sender: ${maskEmail(user.email)}\nRole: ${user.role}\nLogged in via OTP at ${new Date().toLocaleString()}.`,
        user.email
      ).catch(() => {});
    } catch (err) {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('permission')) {
        setError('Server configuration error. Please contact the admin.');
      } else {
        setError(msg || 'Verification failed.');
      }
    } finally { setLoading(false); }
  }

  /* ========== Resend OTP (reusable) ========== */
  async function handleResend() {
    setError(''); setInfo('');
    setLoading(true);
    try {
      const code = generateOTP();
      await storeOTP(trimmedEmail, code);
      await sendOTPEmail(trimmedEmail, code);
      setInfo('New OTP sent!');
    } catch {
      setError('Failed to resend OTP.');
    } finally { setLoading(false); }
  }

  /* ========== SUBMIT FEEDBACK ========== */
  async function handleFeedbackSubmit(e) {
    e.preventDefault();
    setFbMsg('');
    if (!fbName.trim()) { setFbMsg('⚠️ Please enter your name.'); return; }
    if (!fbEmail.trim()) { setFbMsg('⚠️ Please enter your email.'); return; }
    if (!emailRegex.test(fbEmail.trim().toLowerCase())) { setFbMsg('⚠️ Please enter a valid email address.'); return; }
    const domain = fbEmail.trim().split('@')[1]?.toLowerCase();
    const blockedDomains = ['test.com', 'fake.com', 'example.com', 'temp.com', 'xxx.com'];
    if (!domain || domain.split('.').length < 2 || domain.split('.').pop().length < 2 || blockedDomains.includes(domain)) {
      setFbMsg('⚠️ Please use a valid email with a real domain (e.g. gmail.com, yahoo.com).'); return;
    }
    if (!fbRating) { setFbMsg('⚠️ Please select a star rating.'); return; }
    if (!fbComment.trim()) { setFbMsg('⚠️ Please write a comment.'); return; }
    setFbSending(true);
    try {
      // Save to MongoDB
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', name: fbName.trim(), email: fbEmail.trim(), rating: fbRating, comment: fbComment.trim() }),
      });
      // Also send email notification
      await sendFeedback(fbName.trim(), fbEmail.trim(), fbRating, fbComment.trim());
      setFbMsg('✅ Thank you for your feedback!');
      setTimeout(() => setFbMsg(''), 4000);
      setSubmittedEmail(fbEmail.trim().toLowerCase());
      // Add to displayed reviews instantly
      setReviews(prev => [{ id: Date.now().toString(), name: fbName.trim(), email: fbEmail.trim().toLowerCase(), rating: fbRating, comment: fbComment.trim(), createdAt: new Date().toISOString(), replies: [] }, ...prev]);
      setFbName(''); setFbEmail(''); setFbRating(0); setFbComment('');
    } catch {
      setFbMsg('⚠️ Failed to send. Please try again.');
      setTimeout(() => setFbMsg(''), 4000);
    } finally { setFbSending(false); }
  }

  /* ========== EDIT FEEDBACK ========== */
  function startEdit(r) {
    setEditId(r.id);
    setEditRating(r.rating);
    setEditComment(r.comment);
  }
  function cancelEdit() { setEditId(null); setEditRating(0); setEditComment(''); setEditHover(0); }

  async function saveEdit(reviewId, ownerEmail) {
    if (!editComment.trim() || !editRating) return;
    setEditSaving(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', id: reviewId, email: ownerEmail, rating: editRating, comment: editComment.trim() }),
      });
      if (res.ok) {
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, rating: editRating, comment: editComment.trim() } : r));
        cancelEdit();
      }
    } catch { /* ignore */ }
    finally { setEditSaving(false); }
  }

  /* ========== DELETE FEEDBACK ========== */
  async function deleteFeedback(reviewId, ownerEmail) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    const userEmail = (fbEmail || submittedEmail || '').trim().toLowerCase();
    const userIsAdmin = isAdmin(userEmail);
    try {
      const payload = { action: 'delete', id: reviewId };
      if (userIsAdmin) {
        payload.adminEmail = userEmail;
      } else {
        payload.email = ownerEmail || userEmail;
      }
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== reviewId));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to delete.');
      }
    } catch { /* ignore */ }
  }

  /* ========== REPLY TO FEEDBACK ========== */
  function openReply(id) { setReplyToId(id); setReplyComment(''); setReplyName(''); }
  function cancelReply() { setReplyToId(null); setReplyComment(''); setReplyName(''); }

  async function submitReply(reviewId) {
    if (!replyComment.trim() || !replyName.trim()) return;
    setReplySending(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reply', id: reviewId, replyName: replyName.trim(), replyEmail: fbEmail || '', replyComment: replyComment.trim() }),
      });
      if (res.ok) {
        const newReply = { name: replyName.trim(), comment: replyComment.trim(), createdAt: new Date().toISOString() };
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, replies: [...(r.replies || []), newReply] } : r));
        cancelReply();
      }
    } catch { /* ignore */ }
    finally { setReplySending(false); }
  }

  /* ========== RENDER ========== */
  const titles = {
    'signin':           'Welcome Back',
    'signup':           'Create Account',
    'signup-otp':       'Verify Email',
    'forgot':           'Forgot Password',
    'forgot-otp':       'Verify OTP',
    'forgot-newpw':     'New Password',
    'otp-login':        'Login with OTP',
    'otp-login-verify': 'Verify OTP',
  };

  const subtitles = {
    'signin':           'Sign in with your email & password',
    'signup':           'Fill in your details to get started',
    'signup-otp':       `Enter the 6-digit OTP sent to ${maskEmail(email)}`,
    'forgot':           'Enter your email to receive a reset OTP',
    'forgot-otp':       `Enter the OTP sent to ${maskEmail(email)}`,
    'forgot-newpw':     'Choose a strong new password',
    'otp-login':        'We\'ll send a one-time code to your email',
    'otp-login-verify': `Enter the OTP sent to ${maskEmail(email)}`,
  };

  /* ═══ CARD CATEGORIES ═══ */
  const PREMIUM_CARDS = [
    { id: 'birthday',      icon: '🎂', name: 'Birthday Invite Designer',      desc: 'Create personalised and stylish birthday party invitations with ease.',   grad: 'linear-gradient(135deg, #c084fc, #818cf8, #a78bfa)', price: '₹19/₹49' },
    { id: 'wedding',       icon: '💐', name: 'Wedding Invite Designer',       desc: 'Create royal and classic wedding invitations with beautiful themes.',      grad: 'linear-gradient(135deg, #a78bfa, #f0abfc, #c084fc)', price: '₹19/₹49' },
    { id: 'anniversary',   icon: '💍', name: 'Anniversary Greeting Designer', desc: 'Craft elegant anniversary greetings to celebrate love and togetherness.', grad: 'linear-gradient(135deg, #e9d5ff, #c4b5fd, #a78bfa)', price: '₹19/₹49' },
    { id: 'biodata',       icon: '💒', name: 'Marriage Profile Designer',     desc: 'Build a traditional and detailed marriage biodata with a clean layout.',   grad: 'linear-gradient(135deg, #d8b4fe, #93c5fd, #a78bfa)', price: '₹49' },
    { id: 'rentcard',      icon: '🏠', name: 'PG / Rent Card',                desc: 'PG, Flat, Room, Hostel & Shop cards with 6 themes, amenities & dynamic layouts.', grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)', price: '₹49' },
    { id: 'saloncard',     icon: '💇', name: 'Salon / Parlour Card',           desc: 'Create elegant salon service & price list cards for your beauty business.', grad: 'linear-gradient(135deg, #c084fc, #f9a8d4, #d8b4fe)', price: '₹49' },
    { id: 'cardresume',    icon: '🪪', name: 'Professional Resume Maker',      desc: 'Download your job‑ready resume. Perfect for freshers & professionals.',       grad: 'linear-gradient(135deg, #7c3aed, #a78bfa, #818cf8)', price: '₹99' },
  ];

  const AI_FREE_CARDS = [
    { id: 'aitextimage', icon: '🎨', name: 'AI Text + Image Card',  desc: 'Upload photo, add text, choose layout — create personalised cards instantly!', grad: 'linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6)' },
    { id: 'aifaceswap',  icon: '🎭', name: 'AI Themed Card Maker',  desc: 'Pick a theme, upload your face & get a personalised themed card!',             grad: 'linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6)' },
    { id: 'videomaker',  icon: '🎬', name: 'Video Card Maker',      desc: 'Upload photos & a song — create a video slideshow with transitions!',          grad: 'linear-gradient(135deg, #6366f1, #ec4899, #f59e0b)' },
  ];

  const VIDEO_TOOLS = [
    { id: 'videotrimmer',   icon: '✂️', name: 'Video Trimmer / Cropper', desc: 'Upload a video, trim it into clips & download — all in your browser!',      grad: 'linear-gradient(135deg, #22d3ee, #a78bfa, #f472b6)' },
    { id: 'mp4tomp3',       icon: '🎵', name: 'MP4 → MP3 Converter',    desc: 'Extract audio from any video — choose quality & download instantly!',         grad: 'linear-gradient(135deg, #34d399, #60a5fa, #c084fc)' },
    { id: 'videoaudioswap', icon: '🔊', name: 'Video Audio Replacer',    desc: 'Replace video sound with a new song — adjust volumes & download!',           grad: 'linear-gradient(135deg, #f472b6, #818cf8, #34d399)' },
  ];

  /* Festival calendar — auto-detect active festivals */
  const activeFestivals = getActiveFestivals();
  const visibleFestivals = getVisibleFestivals();
  const FREE_CARDS_HINDI = [
    { id: 'motivational',  icon: '💪', name: 'प्रेरणादायक विचार',      desc: 'प्रेरणादायक विचार — थीम चुनें, कस्टमाइज़ करें और डाउनलोड करें!', grad: 'linear-gradient(135deg, #0f0c29, #302b63)' },
    { id: 'fathers',       icon: '👨‍👧', name: 'पिता पर सुविचार',        desc: 'पिता के प्यार को शब्दों में — थीम चुनें और फ्री डाउनलोड करें!', grad: 'linear-gradient(135deg, #2d3436, #636e72)' },
    { id: 'mothers',       icon: '💐', name: 'माँ पर सुविचार',         desc: 'माँ के प्यार को शब्दों में — थीम चुनें और फ्री डाउनलोड करें!', grad: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)' },
  ];

  const FREE_CARDS_ENGLISH = [
    { id: 'motivational-en', icon: '💪', name: 'Motivational Quotes',  desc: 'Inspiring English quotes — pick a theme, customize & download free!', grad: 'linear-gradient(135deg, #134e5e, #71b280)' },
    { id: 'fathers-en',      icon: '👨‍👧', name: 'Father\'s Quotes',     desc: 'Heartfelt father\'s quotes — pick a theme, customize & download free!', grad: 'linear-gradient(135deg, #0c3483, #a2b6df)' },
    { id: 'mothers-en',      icon: '💐', name: 'Mother\'s Quotes',     desc: 'Beautiful quotes celebrating a mother\'s love — customize & download free!', grad: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)' },
  ];



  /* ========== CARD CLICK — works for both logged-in and guest ========== */
  function handleCardClick(cardId) {
    if (!user) {
      loginAsGuest();
    }
    if (onSelect) onSelect(cardId);
  }

  const displayName = user?.name || user?.email?.split('@')[0] || '';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="login-page">

      {/* ═══════ HEADER — full navigation bar ═══════ */}
      <header className="lp-header">
        <div className="lp-header-inner">

          {/* Logo + Brand */}
          <div className="lp-header-brand" onClick={() => {
            const ref = logoClickRef.current;
            ref.count += 1;
            clearTimeout(ref.timer);
            if (ref.count >= 3) { ref.count = 0; openAuthPopup('otp-login'); }
            else { ref.timer = setTimeout(() => { ref.count = 0; }, 600); }
          }}>
            <span className="lp-header-logo">✨</span>
            <div className="lp-header-brand-text">
              <span className="lp-header-brand-name">Card Maker</span>
              <span className="lp-header-tagline">Design Cards, Invites &amp; Resumes — Instantly</span>
            </div>
          </div>

          {/* Hamburger for mobile */}
          <button className="lp-header-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? '✕' : '☰'}
          </button>

          {/* Navigation */}
          <nav className={`lp-header-nav${mobileMenuOpen ? ' open' : ''}`}>

            {/* Templates Dropdown */}
            <div className="lp-nav-dropdown-wrap">
              <button className="lp-nav-link lp-nav-dropdown-trigger" onClick={() => setTplDropdownOpen(!tplDropdownOpen)}>
                Templates <span className={`lp-nav-chevron${tplDropdownOpen ? ' open' : ''}`}>▾</span>
              </button>
              {tplDropdownOpen && (
                <div className="lp-nav-dropdown" onClick={() => { setTplDropdownOpen(false); setMobileMenuOpen(false); }}>
                  <button className="lp-nav-dropdown-item" onClick={() => handleCardClick('wedding')}>💐 Wedding Cards</button>
                  <button className="lp-nav-dropdown-item" onClick={() => handleCardClick('birthday')}>🎂 Birthday Invites</button>
                  <button className="lp-nav-dropdown-item" onClick={() => handleCardClick('anniversary')}>💍 Anniversary Cards</button>
                  <button className="lp-nav-dropdown-item" onClick={() => handleCardClick('biodata')}>💒 Marriage Biodata</button>
                  <button className="lp-nav-dropdown-item" onClick={() => handleCardClick('rentcard')}>🏠 PG / Rent Cards</button>
                  <button className="lp-nav-dropdown-item" onClick={() => handleCardClick('saloncard')}>💇 Salon Cards</button>
                  <button className="lp-nav-dropdown-item" onClick={() => handleCardClick('cardresume')}>📄 Resume Builder</button>
                  <button className="lp-nav-dropdown-item" onClick={() => handleCardClick('aitextimage')}>🎨 AI Text+Image Card</button>
                  <button className="lp-nav-dropdown-item" onClick={() => handleCardClick('aifaceswap')}>🎭 AI Themed Card</button>
                </div>
              )}
            </div>

            {/* Nav links */}
            <a className="lp-nav-link" href="#lp-card-seo-anchor" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a className="lp-nav-link" href="/blog/best-online-card-maker-in-india" onClick={() => setMobileMenuOpen(false)}>Blog</a>

            {/* Logged-in user tabs */}
            {user && !isGuest && (
              <>
                <button className={`lp-nav-link${accountTab === 'profile' ? ' active' : ''}`} onClick={() => { setAccountTab(accountTab === 'profile' ? null : 'profile'); setMobileMenuOpen(false); }}>👤 Profile</button>
                <button className={`lp-nav-link${accountTab === 'templates' ? ' active' : ''}`} onClick={() => { setAccountTab(accountTab === 'templates' ? null : 'templates'); setMobileMenuOpen(false); }}>📋 My Templates</button>
                <button className={`lp-nav-link${accountTab === 'downloads' ? ' active' : ''}`} onClick={() => { setAccountTab(accountTab === 'downloads' ? null : 'downloads'); setMobileMenuOpen(false); }}>📥 Downloads</button>
                {isSuperAdmin && (
                  <button className={`lp-nav-link${accountTab === 'admin' ? ' active' : ''}`} onClick={() => { setAccountTab(accountTab === 'admin' ? null : 'admin'); setMobileMenuOpen(false); }}>⚙️ Admin</button>
                )}
              </>
            )}

            {/* CTA Button */}
            <button className="lp-header-cta" onClick={() => { setMobileMenuOpen(false); document.getElementById('lp-cards-anchor')?.scrollIntoView({ behavior: 'smooth' }); }}>
              🎨 Start Creating
            </button>
          </nav>
        </div>
      </header>

      {/* ═══════ ACCOUNT PANEL OVERLAY ═══════ */}
      {user && accountTab && (
        <div className="lp-account-overlay" onClick={() => setAccountTab(null)}>
          <div className={`lp-account-panel${accountTab === 'admin' ? ' lp-account-panel--wide' : ''}`} onClick={e => e.stopPropagation()}>
            <button className="lp-account-close" onClick={() => setAccountTab(null)}>✕</button>

            {accountTab === 'profile' && (
              <div className="lp-account-content">
                <div className="lp-profile-avatar">{initial}</div>
                <h3 className="lp-profile-name">{user.name || 'Card Maker User'}</h3>
                <span className="lp-profile-badge">{isSuperAdmin ? '⭐ Super Admin' : isFreePlan ? '🆓 Free Plan' : '💎 Premium'}</span>
                <div className="lp-profile-info">
                  <div className="lp-profile-row"><span>📧</span> {maskEmail(user.email)}</div>
                  <div className="lp-profile-row"><span>🛡️</span> {isSuperAdmin ? 'Super Admin' : isFreePlan ? 'Free' : 'Premium'}</div>
                  <div className="lp-profile-row"><span>📅</span> Member since {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}</div>
                </div>
              </div>
            )}

            {accountTab === 'templates' && (
              <MyTemplates userEmail={user.email} onEditTemplate={onEditTemplate} />
            )}

            {accountTab === 'downloads' && (
              <DownloadHistory userEmail={user.email} />
            )}

            {accountTab === 'admin' && isSuperAdmin && <AdminPanel />}
          </div>
        </div>
      )}

      {/* ═══════ HERO SECTION ═══════ */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <h1 className="lp-hero-title">
            Create Beautiful Cards <span className="lp-accent">in Minutes</span>
          </h1>
          <p className="lp-hero-sub">
            Design stunning invitations, biodata, resumes &amp; more — browse template previews below and start creating instantly.
          </p>

          <div className="lp-hero-stats">
            <div className="lp-stat"><span className="lp-stat-num">23+</span><span className="lp-stat-label">Card Types</span></div>
            <div className="lp-stat-divider" />
            <div className="lp-stat"><span className="lp-stat-num">50+</span><span className="lp-stat-label">Templates Planned</span></div>
            <div className="lp-stat-divider" />
            <div className="lp-stat"><span className="lp-stat-num">5</span><span className="lp-stat-label">Languages</span></div>
          </div>

          {/* Trust Badges */}
          <div className="lp-trust-badges">
            <div className="lp-trust-badge"><span className="lp-trust-badge-icon">🔒</span> Secure Downloads</div>
            <div className="lp-trust-badge"><span className="lp-trust-badge-icon">⚡</span> Instant Preview</div>
            <div className="lp-trust-badge"><span className="lp-trust-badge-icon">🇮🇳</span> Made in India</div>
            <div className="lp-trust-badge"><span className="lp-trust-badge-icon">📱</span> Works on All Devices</div>
          </div>
        </div>
      </section>

      {/* ═══════ POPULAR AI CARD MAKERS ═══════ */}
      <section className="lp-upcoming-section">
        <h2 className="lp-section-title">⭐ Popular AI Card Makers</h2>
        <p className="lp-section-sub">Create stunning cards instantly with free online tools.</p>

        <div className="lp-upcoming-grid lp-ai-free-grid">
          {/* AI Free Cards */}
          {AI_FREE_CARDS.map(c => (
            <button key={c.id} className="lp-upcoming-card lp-ai-free-card" style={{ background: c.grad }} type="button" onClick={() => handleCardClick(c.id)}>
              <span className="lp-ai-free-tag">✨ FREE</span>
              <span className="lp-showcase-icon">{c.icon}</span>
              <h3 className="lp-showcase-name">{c.name}</h3>
              <p className="lp-ai-free-desc">{c.desc}</p>
              <span className="lp-ai-free-cta">Try Now →</span>
            </button>
          ))}
          {/* Visible Festival Cards (7 days before → 1 day after) */}
          {visibleFestivals.map(f => (
            <button key={f.key} className="lp-upcoming-card lp-ai-free-card lp-festival-free-card" style={{ background: f.grad }} type="button" onClick={() => { if (onSelectFestival) onSelectFestival(f.key); handleCardClick(f.offerCard); }}>
              <span className="lp-ai-free-tag">🆓 FREE</span>
              <span className="lp-showcase-icon">{f.icon}</span>
              <h3 className="lp-showcase-name">{f.name}</h3>
              <p className="lp-ai-free-desc">{f.seoTagline}</p>
              <span className="lp-ai-free-cta">Create Free Card →</span>
            </button>
          ))}
        </div>

      </section>

      {/* ═══════ FREE VIDEO EDITING TOOLS ═══════ */}
      <section className="lp-upcoming-section">
        <h2 className="lp-section-title">🔧 Free Video Editing Tools</h2>
        <p className="lp-section-sub">Quick online tools — trim, extract audio &amp; edit videos.</p>

        <div className="lp-upcoming-grid lp-ai-free-grid">
          {VIDEO_TOOLS.map(c => (
            <button key={c.id} className="lp-upcoming-card lp-ai-free-card" style={{ background: c.grad }} type="button" onClick={() => handleCardClick(c.id)}>
              <span className="lp-ai-free-tag">✨ FREE</span>
              <span className="lp-showcase-icon">{c.icon}</span>
              <h3 className="lp-showcase-name">{c.name}</h3>
              <p className="lp-ai-free-desc">{c.desc}</p>
              <span className="lp-ai-free-cta">Try Now →</span>
            </button>
          ))}
        </div>
      </section>

      {/* ═══════ PREMIUM CARDS ═══════ */}
      <section className="lp-showcase" id="lp-cards-anchor">
        <div className="lp-section-header">
          <h2 className="lp-section-title">✨ Premium Card Designers</h2>
          <span className="lp-section-price">Starting from ₹19</span>
        </div>
        <p className="lp-section-sub">Beautiful cards that need your details — fill the form, preview &amp; download</p>

        {/* 7-Day Highlight + Combo Offer — side by side */}
        <div className="lp-offer-row">
          <div className="lp-seven-day-banner">
            <span className="lp-seven-day-icon">🔓</span>
            <div className="lp-seven-day-text">
              <strong>Pay Once, Download for 7 Days!</strong>
              <span>Edit &amp; re-download unlimited — no extra charges for 7 days.</span>
            </div>
          </div>
          <div className="lp-combo-banner" onClick={onOpenCombo} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onOpenCombo?.()}>
            <div className="lp-combo-fire">🔥</div>
            <div className="lp-combo-content">
              <div className="lp-combo-tag">COMBO OFFER</div>
              <h3 className="lp-combo-title">Any 2 Cards — Just ₹69</h3>
              <p className="lp-combo-desc">15 days unlimited • No watermark • Save ₹29!</p>
            </div>
            <div className="lp-combo-arrow">→</div>
          </div>
        </div>

        <div className="lp-showcase-grid">
          {PREMIUM_CARDS.map(c => (
            <button key={c.id} className="lp-showcase-card lp-premium-card" style={{ background: c.grad }} type="button" onClick={() => handleCardClick(c.id)}>
              <span className="lp-price-badge">{c.price}</span>
              <span className="lp-showcase-icon">{c.icon}</span>
              <h3 className="lp-showcase-name">{c.name}</h3>
              <p className="lp-showcase-desc">{c.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ═══════ CARD-TYPE SEO SECTIONS ═══════ */}
      <div className="lp-card-seo" id="lp-card-seo-anchor">

        {/* ── Birthday Invitation Card Maker ── */}
        <section className="lp-cseo-section">
          <div className="lp-cseo-icon-wrap lp-cseo--birthday">🎂</div>
          <h2 className="lp-cseo-title">Birthday Invitation Card Maker</h2>
          <div className="lp-cseo-rating"><span className="lp-cseo-rating-text">Simple • Fast • Professional</span></div>
          <p className="lp-cseo-desc">
            Create stunning <strong>birthday invitation cards online</strong> in minutes. Our <strong>birthday invite maker</strong> offers beautiful <strong>birthday card templates</strong> for kids, adults, and themed birthday parties. Design a <strong>digital birthday party invitation</strong>, customize colors, text &amp; photos, and download instantly — perfect for sharing on WhatsApp, Instagram, or printing.
          </p>
          <div className="lp-cseo-features">
            <span>✓ 20 Kids &amp; Adult Templates</span>
            <span>✓ Live Preview</span>
            <span>✓ Hindi &amp; English</span>
            <span>✓ HD PNG Download</span>
          </div>
          <div className="lp-cseo-actions">
            <button className="lp-cseo-btn" type="button" onClick={() => handleCardClick('birthday')}>🎂 Create Birthday Invite →</button>
          </div>
          <div className="lp-cseo-samples">
            <p className="lp-cseo-samples-label">👀 Preview Templates</p>
            <div className="lp-cseo-samples-row">
              {BIRTHDAY_TEMPLATES.map(tpl => (
                <div key={tpl.id} className="lp-cseo-tpl" onClick={() => setFullPreviewTpl({ type: 'birthday', id: tpl.id, name: tpl.name })}>
                  <div className="lp-cseo-tpl-preview">
                    <div className="lp-sample-preview-inner lp-sample-preview--birthday">
                      <BirthdayCardPreview data={{ ...SAMPLE_BIRTHDAY, selectedTemplate: tpl.id }} lang="en" template={tpl.id} />
                    </div>
                  </div>
                  <span className="lp-cseo-tpl-name">{tpl.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════ BIRTHDAY SEO CONTENT ═══════ */}
          <div id="birthday-seo-content" className="lp-anniversary-seo">
            <h2 className="lp-section-title">⭐ About Our Birthday Card Maker</h2>
            <div className="lp-anniversary-seo-body">
              <p>
                Birthdays are meant to be special, and the perfect card can make the celebration even more memorable. With our <strong>Free Birthday Card Maker</strong>, you can design unique and personalized birthday cards in just a few minutes. Whether you want to create a fun card for kids, a cute birthday wish for friends, or a stylish birthday invitation, our tool offers everything you need in one place.
              </p>
              <p>
                Choose from a wide collection of colorful, modern, cartoon, floral, minimal, and photo‑based birthday templates. Customize your card by adding the birthday person&apos;s name, age, photos, stickers, quotes, and personalized messages. Our editor gives you a live preview so you can see changes instantly.
              </p>
              <p>
                After designing, download your <strong>birthday card</strong> instantly in high‑quality PNG format. Share it on WhatsApp, Instagram, or print it for gifting. No signup or app installation is required — easy and fast for all users.
              </p>
              <h3 className="lp-anniversary-seo-subtitle">Our birthday card maker is perfect for:</h3>
              <ul className="lp-anniversary-seo-list">
                <li>Kids&apos; birthday invitation cards</li>
                <li>Adult &amp; friend birthday greetings</li>
                <li>Funny birthday wishes</li>
                <li>Photo birthday cards for family</li>
                <li>Simple and elegant birthday invitations</li>
              </ul>
              <p>
                Design a birthday card that stands out and brings a smile to your loved one&apos;s face — all within minutes.
              </p>
            </div>
          </div>
        </section>

        {/* ── Wedding Invitation Card Maker ── */}
        <section className="lp-cseo-section">
          <div className="lp-cseo-icon-wrap lp-cseo--wedding">💐</div>
          <h2 className="lp-cseo-title">Wedding Invitation Card Maker</h2>
          <div className="lp-cseo-rating"><span className="lp-cseo-rating-text">Simple • Fast • Professional</span></div>
          <p className="lp-cseo-desc">
            Design elegant <strong>wedding invitation cards online</strong> with our <strong>wedding invite maker</strong>. Choose from <strong>royal wedding card designs</strong> and <strong>Indian wedding invitation templates</strong> — including Sikh, Hindu, Muslim &amp; Christian styles. Add photos, family details, venue info, and <strong>create wedding cards online</strong> in Hindi, English, Punjabi or Gujarati.
          </p>
          <div className="lp-cseo-features">
            <span>✓ 20 Royal Templates</span>
            <span>✓ Multi-Language</span>
            <span>✓ Photo Upload</span>
            <span>✓ Print &amp; Share Ready</span>
          </div>
          <div className="lp-cseo-actions">
            <button className="lp-cseo-btn" type="button" onClick={() => handleCardClick('wedding')}>💐 Create Wedding Card →</button>
          </div>
          <div className="lp-cseo-samples">
            <p className="lp-cseo-samples-label">👀 Preview Templates</p>
            <div className="lp-cseo-samples-row">
              {WEDDING_TEMPLATES.map(tpl => (
                <div key={tpl.id} className="lp-cseo-tpl" onClick={() => setFullPreviewTpl({ type: 'wedding', id: tpl.id, name: tpl.name })}>
                  <div className="lp-cseo-tpl-preview">
                    <div className="lp-sample-preview-inner lp-sample-preview--wedding">
                      <WeddingCardPreview data={{ ...SAMPLE_WEDDING, selectedTemplate: tpl.id }} lang="en" template={tpl.id} />
                    </div>
                  </div>
                  <span className="lp-cseo-tpl-name">{tpl.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════ WEDDING SEO CONTENT ═══════ */}
          <div id="wedding-seo-content" className="lp-anniversary-seo">
            <h2 className="lp-section-title">⭐ About Our Wedding Invitation Card Maker</h2>
            <div className="lp-anniversary-seo-body">
              <p>
                Your wedding is one of the most memorable days of your life, and your invitation card should reflect that beauty. Our <strong>Free Wedding Invitation Card Maker</strong> allows you to create elegant, modern, and traditional shaadi cards in just a few minutes. Whether you&apos;re planning a simple ceremony or a grand celebration, our designer-made templates make it easy to create the perfect wedding invite.
              </p>
              <p>
                Choose from a wide range of royal, floral, pastel, minimalist, Hindu wedding, Muslim wedding, Sikh wedding, Christian wedding, and traditional <strong>Indian wedding invitation</strong> designs. Customize everything — add names, event dates, timings, venue details, RSVP info, photos, and personal messages. Use our live preview editor to see real-time changes before downloading.
              </p>
              <p>
                Once your design is ready, download your <strong>wedding invitation card</strong> instantly in high‑quality PNG format. Share it digitally on WhatsApp, Instagram, or print it for distribution. No signup or app installation required — fast and simple for all users.
              </p>
              <h3 className="lp-anniversary-seo-subtitle">Our wedding card maker is perfect for:</h3>
              <ul className="lp-anniversary-seo-list">
                <li>Digital shaadi card invitations</li>
                <li>Simple &amp; modern wedding invites</li>
                <li>Traditional Indian wedding cards</li>
                <li>Photo wedding invitation designs</li>
                <li>Engagement &amp; ring ceremony invitations</li>
              </ul>
              <p>
                Create your beautiful wedding invitation card today — elegant, unique, and unforgettable.
              </p>
            </div>
          </div>
        </section>

        {/* ── Anniversary Greeting Card Maker ── */}
        <section className="lp-cseo-section">
          <div className="lp-cseo-icon-wrap lp-cseo--anniversary">💍</div>
          <h2 className="lp-cseo-title">Anniversary Greeting Card Creator</h2>
          <div className="lp-cseo-rating"><span className="lp-cseo-rating-text">Simple • Fast • Professional</span></div>
          <p className="lp-cseo-desc">
            Celebrate milestones with our <strong>anniversary greeting card maker</strong>. Create beautiful <strong>wedding anniversary wishes cards</strong> and <strong>digital anniversary cards</strong> with elegant designs, couple photos, and heartfelt messages. Our <strong>anniversary card design online</strong> tool offers <strong>anniversary invitation templates</strong> for 25th, 50th, and every special year.
          </p>
          <div className="lp-cseo-features">
            <span>✓ 20 Elegant Themes</span>
            <span>✓ Couple Photo</span>
            <span>✓ Emotional Designs</span>
            <span>✓ Instant Download</span>
          </div>
          <div className="lp-cseo-actions">
            <button className="lp-cseo-btn" type="button" onClick={() => handleCardClick('anniversary')}>💍 Create Anniversary Card →</button>
          </div>
          <div className="lp-cseo-samples">
            <p className="lp-cseo-samples-label">👀 Preview Templates</p>
            <div className="lp-cseo-samples-row">
              {ANNIVERSARY_TEMPLATES.map(tpl => (
                <div key={tpl.id} className="lp-cseo-tpl" onClick={() => setFullPreviewTpl({ type: 'anniversary', id: tpl.id, name: tpl.name })}>
                  <div className="lp-cseo-tpl-preview">
                    <div className="lp-sample-preview-inner lp-sample-preview--anniversary">
                      <AnniversaryCardPreview data={{ ...SAMPLE_ANNIVERSARY, selectedTemplate: tpl.id }} lang="en" template={tpl.id} />
                    </div>
                  </div>
                  <span className="lp-cseo-tpl-name">{tpl.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════ ANNIVERSARY SEO CONTENT ═══════ */}
          <div id="anniversary-seo-content" className="lp-anniversary-seo">
            <h2 className="lp-section-title">⭐ About Our Anniversary Card Maker</h2>
            <div className="lp-anniversary-seo-body">
              <p>
                Celebrating a milestone with your loved ones becomes even more special with a beautifully crafted anniversary card. Our <strong>Anniversary Card Maker</strong> lets you design personalized cards online in just a few minutes. Whether you&apos;re creating a <strong>wedding anniversary greeting</strong>, a couple celebration card, or a heartfelt wish for parents or friends, our tool offers everything you need in one simple platform.
              </p>
              <p>
                Choose from a variety of elegant, romantic, floral, classic, and modern templates designed to match every style. Personalize each card by adding names, photos, anniversary dates, heartfelt messages, quotes, and more. The editor is easy to use, and all changes are visible instantly with our live preview feature.
              </p>
              <p>
                Once you finish your design, download your <strong>anniversary card</strong> instantly in high‑quality PNG format. You can share it on WhatsApp, Instagram, or print it for gifting. No signup or app installation is required — perfect for users who want a quick and beautiful card without hassle.
              </p>
              <h3 className="lp-anniversary-seo-subtitle">Our tool is ideal for:</h3>
              <ul className="lp-anniversary-seo-list">
                <li>Wedding anniversary wishes</li>
                <li>Couple photo anniversary cards</li>
                <li>Parents&apos; or friends&apos; anniversary greetings</li>
                <li>Simple and elegant anniversary invitation cards</li>
              </ul>
              <p>
                Make every anniversary unforgettable with a custom card that truly reflects your love and emotions.
              </p>
            </div>
          </div>
        </section>

        {/* ── Marriage Biodata Maker ── */}
        <section className="lp-cseo-section">
          <div className="lp-cseo-icon-wrap lp-cseo--biodata">💒</div>
          <h2 className="lp-cseo-title">Marriage Biodata / Marriage Profile Maker</h2>
          <div className="lp-cseo-rating"><span className="lp-cseo-rating-text">Simple • Fast • Professional</span></div>
          <p className="lp-cseo-desc">
            Build a professional <strong>marriage biodata</strong> with our easy‑to‑use <strong>biodata for marriage online</strong> tool. Our <strong>marriage biodata maker</strong> supports <strong>Hindu marriage biodata</strong>, Sikh, Muslim &amp; Jain formats with the <strong>Indian wedding biodata format</strong> that families expect. Add personal details, family info, education, career, and a beautiful photo — ready for <strong>marriage profile design</strong> sharing.
          </p>
          <div className="lp-cseo-features">
            <span>✓ 20 Community Formats</span>
            <span>✓ Hindi / English / Punjabi</span>
            <span>✓ Photo &amp; Family Details</span>
            <span>✓ PNG Download</span>
          </div>
          <div className="lp-cseo-actions">
            <button className="lp-cseo-btn" type="button" onClick={() => handleCardClick('biodata')}>💒 Create Marriage Biodata →</button>
          </div>
          <div className="lp-cseo-samples">
            <p className="lp-cseo-samples-label">👀 Preview Templates</p>
            <div className="lp-cseo-samples-row">
              {BIODATA_TEMPLATES.map(tpl => (
                <div key={tpl.id} className="lp-cseo-tpl" onClick={() => setFullPreviewTpl({ type: 'biodata', id: tpl.id, name: tpl.name })}>
                  <div className="lp-cseo-tpl-preview">
                    <div className="lp-sample-preview-inner lp-sample-preview--biodata">
                      <BiodataCardPreview data={SAMPLE_BIODATA} lang="en" template={tpl.id} community="hindi" />
                    </div>
                  </div>
                  <span className="lp-cseo-tpl-name">{tpl.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════ BIODATA SEO CONTENT ═══════ */}
          <div id="biodata-seo-content" className="lp-anniversary-seo">
            <h2 className="lp-section-title">⭐ About Our Marriage Biodata Maker</h2>
            <div className="lp-anniversary-seo-body">
              <p>
                Your marriage biodata is the first impression for any suitable match, and a well‑designed profile makes all the difference. With our <strong>Free Marriage Biodata Maker</strong>, you can create a clean, professional, and beautifully formatted biodata in just a few minutes. Whether you need a biodata for Hindu marriage, Muslim marriage, Sikh marriage, Jain marriage, Christian marriage, or a simple traditional <strong>Shaadi biodata</strong>, our templates are designed to suit every community and preference.
              </p>
              <p>
                Choose from a variety of elegant and modern layouts and easily add your personal details, including name, age, date of birth, height, education, occupation, family background, partner preferences, and more. You can also upload a photo and customize colors, fonts, and sections as needed. Our live preview editor ensures every detail is perfectly aligned.
              </p>
              <p>
                Once your <strong>marriage biodata</strong> is ready, download it instantly in high-quality PNG format. You can print it, share it on WhatsApp, or email it to relatives, matrimonial agents, or potential matches. No app installation or signup required.
              </p>
              <p>
                Create a biodata that stands out — professional, clean, and ready for your marriage journey.
              </p>
            </div>
          </div>
        </section>

        {/* ── PG / Rent Card Maker ── */}
        <section className="lp-cseo-section">
          <div className="lp-cseo-icon-wrap lp-cseo--rent">🏠</div>
          <h2 className="lp-cseo-title">PG / Rent Advertisement Card Maker</h2>
          <div className="lp-cseo-rating"><span className="lp-cseo-rating-text">Simple • Fast • Professional</span></div>
          <p className="lp-cseo-desc">
            Create professional <strong>PG advertisement cards</strong> and <strong>rental room ad cards</strong> in seconds. Our <strong>PG for rent digital card</strong> maker helps landlords and PG owners design eye‑catching <strong>property rent advertisement templates</strong> with room details, amenities, rent pricing &amp; contact info. <strong>Create rent cards online</strong> and share instantly on social media or print for notice boards.
          </p>

          {/* Property Type Showcase — interactive */}
          <div className="lp-rent-proptype">
            <h3 className="lp-rent-proptype-title">🏷️ Property Type</h3>
            <p className="lp-rent-proptype-hint">Select what type of property you&apos;re listing.</p>
            <div className="lp-rent-proptype-tabs">
              {PROPERTY_TYPES.map(pt => (
                <button key={pt.id} type="button"
                  className={`lp-rent-proptype-tab${activeRentType === pt.id ? ' active' : ''}`}
                  onClick={() => setActiveRentType(pt.id)}
                >{pt.label}</button>
              ))}
            </div>

            {/* Dynamic feature pills based on selected property type */}
            {(() => {
              const cfg = PROPERTY_TYPE_CONFIG[activeRentType] || PROPERTY_TYPE_CONFIG.pg;
              return (
                <div className="lp-rent-proptype-details">
                  <div className="lp-rent-proptype-col">
                    <h4 className="lp-rent-proptype-subhead">{cfg.featuresLabel}</h4>
                    <ul className="lp-rent-proptype-list">
                      {cfg.defaultFeatures.map((f, i) => <li key={i}>✅ {f}</li>)}
                    </ul>
                  </div>
                  <div className="lp-rent-proptype-col">
                    <h4 className="lp-rent-proptype-subhead">{cfg.amenitiesLabel}</h4>
                    <ul className="lp-rent-proptype-list">
                      {cfg.defaultAmenities.map((a, i) => <li key={i}>{a.icon} {a.text}</li>)}
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="lp-cseo-features">
            <span>✓ {(PROPERTY_TYPE_CONFIG[activeRentType] || PROPERTY_TYPE_CONFIG.pg).featuresHeading}</span>
            <span>✓ {(PROPERTY_TYPE_CONFIG[activeRentType] || PROPERTY_TYPE_CONFIG.pg).priceLabel1} &amp; {(PROPERTY_TYPE_CONFIG[activeRentType] || PROPERTY_TYPE_CONFIG.pg).priceLabel2}</span>
            <span>✓ Contact &amp; Logo</span>
            <span>✓ 20 Professional Color Themes</span>
          </div>
          <div className="lp-cseo-actions">
            <button className="lp-cseo-btn" type="button" onClick={() => handleCardClick('rentcard')}>🏠 Create Rent Card →</button>
          </div>
          <div className="lp-cseo-samples">
            <p className="lp-cseo-samples-label">👀 Preview Templates — 20 Color Themes</p>
            <div className="lp-cseo-samples-row">
              {RENT_TEMPLATES.map(tpl => (
                <div key={tpl.id} className="lp-cseo-tpl" onClick={() => setFullPreviewTpl({ type: 'rentcard', id: tpl.id, name: tpl.name })}>
                  <div className="lp-cseo-tpl-preview">
                    <div className="lp-sample-preview-inner lp-sample-preview--rentcard">
                      <RentCardPreview data={SAMPLE_RENT_BY_TPL[tpl.id] || SAMPLE_RENT} />
                    </div>
                  </div>
                  <span className="lp-cseo-tpl-name">{tpl.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── PG/Rent SEO Content ── */}
          <div className="lp-anniversary-seo" id="pgrent-seo-content">
            <h2 className="lp-section-title">🏠 About Our PG &amp; Rent Card Maker</h2>
            <div className="lp-anniversary-seo-body">
              <p>
                Managing rental properties becomes easier when you share information clearly and professionally.
                With our Free PG &amp; Rent Card Maker, you can create clean and attractive rent cards for PG
                accommodations, hostels, flats, shops, rooms, and rental properties in just a few minutes —
                no design skills needed. Choose from ready-made templates designed for PG owners, hostel managers,
                rental brokers, flat owners, and small landlords. Customize your rent card by adding amenities,
                pricing, room type, rules, food availability, Wi-Fi options, deposit details, and contact
                information. Download your card instantly in high-quality PNG format.
              </p>
              <h3 className="lp-anniversary-seo-subtitle">Our rent card maker is perfect for:</h3>
              <ul className="lp-anniversary-seo-list">
                <li>PG / Hostel accommodation cards</li>
                <li>Room or flat rent cards</li>
                <li>Shop rent announcement cards</li>
                <li>Monthly rental information cards</li>
                <li>Student hostel &amp; PG contacts</li>
              </ul>
              <p>
                Create a professional and informative rent card that makes renting easier and more transparent.
                No app or signup required — simple and fast for all users.
              </p>
            </div>
          </div>
        </section>

        {/* ── Salon / Parlour Card Maker ── */}
        <section className="lp-cseo-section">
          <div className="lp-cseo-icon-wrap lp-cseo--salon">💇</div>
          <h2 className="lp-cseo-title">Salon / Parlour Price Card Designer</h2>
          <div className="lp-cseo-rating"><span className="lp-cseo-rating-text">Simple • Fast • Professional</span></div>
          <p className="lp-cseo-desc">
            Design a professional <strong>salon price list card</strong> for your business. Our <strong>beauty parlour service card</strong> maker lets you create stunning <strong>salon menu card designs</strong> with categorized services for ladies, men &amp; kids. Showcase treatments, packages &amp; pricing with a beautiful <strong>beauty service price card</strong> — perfect as a <strong>parlour rate card design</strong> for printing or WhatsApp sharing.
          </p>
          <div className="lp-cseo-features">
            <span>✓ 20 Premium Themes</span>
            <span>✓ Ladies / Men / Kids Sections</span>
            <span>✓ Logo &amp; Contact</span>
            <span>✓ Print‑Ready Quality</span>
          </div>
          <div className="lp-cseo-actions">
            <button className="lp-cseo-btn" type="button" onClick={() => handleCardClick('saloncard')}>💇 Create Salon Card →</button>
          </div>
          <div className="lp-cseo-samples">
            <p className="lp-cseo-samples-label">👀 Preview Themes</p>
            <div className="lp-cseo-samples-row">
              {SALON_THEMES.map(tpl => (
                <div key={tpl.id} className="lp-cseo-tpl" onClick={() => setFullPreviewTpl({ type: 'saloncard', id: tpl.id, name: tpl.name })}>
                  <div className="lp-cseo-tpl-preview">
                    <div className="lp-sample-preview-inner lp-sample-preview--saloncard">
                      <SalonCardPreview data={{ ...SAMPLE_SALON, theme: tpl.id }} />
                    </div>
                  </div>
                  <span className="lp-cseo-tpl-name">{tpl.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Salon SEO Content ── */}
          <div className="lp-anniversary-seo" id="salon-seo-content">
            <h2 className="lp-section-title">💄 About Our Salon &amp; Beauty Parlour Card Maker</h2>
            <div className="lp-anniversary-seo-body">
              <p>
                Make your beauty business stand out with clean, attractive, and easy-to-share cards. Our Free
                Salon &amp; Beauty Parlour Card Maker helps you design professional cards in minutes — ideal for
                service menus, price lists, festive offers, bridal packages, monthly memberships, visiting cards,
                and appointment reminders. Choose from elegant templates tailored for salons, parlours, beauty
                studios, nail art, spa &amp; wellness centers, makeup artists, mehndi artists, and home salons.
                Customize every detail and download instantly in high-quality PNG format.
              </p>
              <h3 className="lp-anniversary-seo-subtitle">Perfect for:</h3>
              <ul className="lp-anniversary-seo-list">
                <li>Service &amp; price list cards</li>
                <li>Festival / seasonal offer cards</li>
                <li>Bridal &amp; party makeup packages</li>
                <li>Spa &amp; wellness service menus</li>
                <li>Visiting / appointment cards</li>
              </ul>
              <p>
                Create stylish salon cards that attract more bookings and keep clients coming back.
                No signup or app required — fast and business-friendly.
              </p>
            </div>
          </div>
        </section>

        {/* ── Resume / CV Builder ── */}
        <section className="lp-cseo-section">
          <div className="lp-cseo-icon-wrap lp-cseo--resume">📄</div>
          <h2 className="lp-cseo-title">Professional Resume / CV Builder Online</h2>
          <div className="lp-cseo-rating"><span className="lp-cseo-rating-text">Simple • Fast • Professional</span></div>
          <p className="lp-cseo-desc">
            Build a professional <strong>resume online</strong> in minutes with our easy‑to‑use <strong>resume maker</strong>. Our <strong>ATS‑friendly resume builder</strong> offers clean, modern templates designed for freshers and experienced professionals alike. Create a job‑ready <strong>CV online</strong>, add your skills, experience &amp; education, and download as <strong>PDF or Word</strong> — perfect for Naukri, LinkedIn, and email applications.
          </p>
          <div className="lp-cseo-features">
            <span>✓ 20 Professional Templates</span>
            <span>✓ ATS Friendly</span>
            <span>✓ PDF &amp; Word Download</span>
            <span>✓ Mobile Responsive</span>
          </div>
          <div className="lp-cseo-actions">
            <button className="lp-cseo-btn" type="button" onClick={() => handleCardClick('cardresume')}>📄 Create Resume →</button>
          </div>
          <div className="lp-cseo-samples">
            <p className="lp-cseo-samples-label">👀 Preview Templates</p>
            <div className="lp-cseo-samples-row lp-cseo-samples-row--resume">
              {RESUME_TEMPLATES.map(tpl => (
                <div key={tpl.id} className="lp-rcard" style={{ cursor: 'pointer' }} onClick={() => setFullPreviewTpl({ type: 'resume', id: tpl.id, name: tpl.name, Component: tpl.Component, sampleData: tpl.sampleData })}>
                  <div className="lp-rcard-preview">
                    <div className="lp-rcard-scaler">
                      <tpl.Component data={tpl.sampleData} />
                    </div>
                  </div>
                  <span className="lp-cseo-tpl-name">{tpl.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Resume SEO Content ── */}
          <div className="lp-anniversary-seo" id="resume-seo-content">
            <h2 className="lp-section-title">📄 About Our Resume Maker</h2>
            <div className="lp-anniversary-seo-body">
              <p>
                A professional resume is the first step toward your dream job. With our Free Online Resume Maker,
                you can create a clean, modern, and job-ready resume in just a few minutes. Whether you are a fresher,
                a student, or an experienced professional, our resume templates are crafted to help you stand out and
                make a strong first impression. Choose from a range of HR-approved templates designed for IT jobs,
                non-technical roles, designers, developers, accountants, teachers, marketing professionals, and more.
                Customize everything easily — add your personal details, education, work experience, skills, projects,
                certifications, and profile summary. Download your resume instantly in high-quality PDF or Word format.
              </p>
              <h3 className="lp-anniversary-seo-subtitle">Our resume maker is perfect for:</h3>
              <ul className="lp-anniversary-seo-list">
                <li>Fresher resumes (10th / 12th / Graduates)</li>
                <li>Experienced professionals (1–15 years)</li>
                <li>Student internship resumes</li>
                <li>IT &amp; non-IT job resume formats</li>
                <li>Modern and clean one-page resumes</li>
              </ul>
              <p>
                Create a resume that gets noticed — professional, polished, and ready for your next opportunity.
                No signup or app installation required — simple, fast, and beginner-friendly.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* ═══════ FREQUENTLY ASKED QUESTIONS ═══════ */}
      <section className="lp-faq-section">
        <h2 className="lp-section-title">❓ Frequently Asked Questions</h2>
        <p className="lp-section-sub">Got questions? We&apos;ve got answers.</p>
        <div className="lp-faq-list">
          <details className="lp-faq-item">
            <summary className="lp-faq-q">Is Card Maker free to use?</summary>
            <p className="lp-faq-a">Card Maker is a premium tool that lets you create professional-quality cards. We also have a separate &quot;Free Instant Cards&quot; section where you can download cards with a watermark at no cost.</p>
          </details>
          <details className="lp-faq-item">
            <summary className="lp-faq-q">What types of cards can I create?</summary>
            <p className="lp-faq-a">You can create birthday invitations, wedding cards, anniversary greetings, marriage biodata, PG/rent ads, salon price cards, professional resumes, festival cards, and more.</p>
          </details>
          <details className="lp-faq-item">
            <summary className="lp-faq-q">Can I download my card as PNG or PDF?</summary>
            <p className="lp-faq-a">All cards are downloaded in high-quality PNG format. Only resumes support PDF and Word downloads.</p>
          </details>
          <details className="lp-faq-item">
            <summary className="lp-faq-q">Do I need to sign up to use Card Maker?</summary>
            <p className="lp-faq-a">No signup is needed to browse templates and preview designs. You only need an account to download your final card.</p>
          </details>
          <details className="lp-faq-item">
            <summary className="lp-faq-q">Which languages are supported?</summary>
            <p className="lp-faq-a">We support Hindi, English, Punjabi, Gujarati, and Marathi across most card types.</p>
          </details>
          <details className="lp-faq-item">
            <summary className="lp-faq-q">Can I share my card on WhatsApp or Instagram?</summary>
            <p className="lp-faq-a">Yes! Once downloaded, your card is ready to share on any platform — WhatsApp, Instagram, Facebook, email, or print.</p>
          </details>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="lp-how-it-works">
        <h2 className="lp-section-title">📋 How It Works</h2>
        <p className="lp-section-sub">Create stunning cards in 4 simple steps</p>
        <div className="lp-steps-grid">
          <div className="lp-step">
            <span className="lp-step-num">1</span>
            <h3>Choose a Template</h3>
            <p>Browse our collection of 50+ professionally designed templates for every occasion.</p>
          </div>
          <div className="lp-step">
            <span className="lp-step-num">2</span>
            <h3>Customize Your Card</h3>
            <p>Add your text, photos, choose colors and fonts. Live preview as you type!</p>
          </div>
          <div className="lp-step">
            <span className="lp-step-num">3</span>
            <h3>Preview Your Design</h3>
            <p>See exactly how your card looks before downloading. Make any final adjustments.</p>
          </div>
          <div className="lp-step">
            <span className="lp-step-num">4</span>
            <h3>Download Instantly</h3>
            <p>Download your card as high-quality PNG (or PDF &amp; Word for resumes). Share via WhatsApp, print, or email!</p>
          </div>
        </div>
      </section>

      {/* ═══════ AUTH POPUP MODAL ═══════ */}
      {showAuthPopup && (
        <div className="lp-auth-overlay" onClick={closeAuthPopup}>
          <div className="lp-auth-popup" onClick={e => e.stopPropagation()}>
            <button className="lp-auth-popup-close" onClick={closeAuthPopup}>✕</button>

            <div className="login-card">
              <h3 className="login-title">{titles[mode]}</h3>
              <p className="login-subtitle">{subtitles[mode]}</p>

              {error && <div className="login-error">⚠️ {error}</div>}
              {info  && <div className="login-info">✅ {info}</div>}

              {/* ---- SIGN IN ---- */}
              {mode === 'signin' && (
                <form onSubmit={handleSignIn} autoComplete="off">
                  <input className="login-input" type="email" placeholder="Email address"
                    value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" autoFocus />
                  <div className="login-pw-wrap">
                    <input className="login-input" type={showPw ? 'text' : 'password'} placeholder="Password"
                      value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
                    <button type="button" className="login-pw-toggle" onClick={() => setShowPw(!showPw)}>
                      {showPw ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <button className="login-btn" disabled={loading}>
                    {loading ? '⏳ Signing in…' : '🔐 Sign In'}
                  </button>
                  <div className="login-links">
                    <button type="button" onClick={() => switchMode('forgot')}>Forgot password?</button>
                    <button type="button" onClick={() => switchMode('otp-login')}>Login with OTP</button>
                  </div>
                  <div className="login-switch">
                    Don&apos;t have an account?{' '}
                    <button type="button" onClick={() => switchMode('signup')}>Sign Up</button>
                  </div>
                  <div className="login-guest-divider"><span>or</span></div>
                  <button type="button" className="login-guest-btn" onClick={() => { closeAuthPopup(); loginAsGuest(); }}>
                    👤 Continue as Guest
                  </button>
                </form>
              )}

              {/* ---- SIGN UP ---- */}
              {mode === 'signup' && (
                <form onSubmit={handleSignUp} autoComplete="off">
                  <input className="login-input" type="text" placeholder="Full Name"
                    value={name} onChange={e => setName(e.target.value)} autoComplete="off" autoFocus />
                  <input className="login-input" type="email" placeholder="Email address"
                    value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" />
                  <div className="login-pw-wrap">
                    <input className="login-input" type={showPw ? 'text' : 'password'} placeholder="Password (min 6 chars)"
                      value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
                    <button type="button" className="login-pw-toggle" onClick={() => setShowPw(!showPw)}>
                      {showPw ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <input className="login-input" type="password" placeholder="Confirm Password"
                    value={confirmPw} onChange={e => setConfirmPw(e.target.value)} autoComplete="new-password" />
                  <button className="login-btn signup" disabled={loading}>
                    {loading ? '⏳ Sending OTP…' : '📩 Sign Up'}
                  </button>
                  <div className="login-switch">
                    Already have an account?{' '}
                    <button type="button" onClick={() => switchMode('signin')}>Sign In</button>
                  </div>
                  <div className="login-guest-divider"><span>or</span></div>
                  <button type="button" className="login-guest-btn" onClick={() => { closeAuthPopup(); loginAsGuest(); }}>
                    👤 Continue as Guest
                  </button>
                </form>
              )}

              {/* ---- SIGN UP OTP VERIFY ---- */}
              {mode === 'signup-otp' && (
                <form onSubmit={handleSignUpOTP} autoComplete="off">
                  <input className="login-input otp" type="text" maxLength={6} placeholder="Enter 6-digit OTP"
                    value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} autoComplete="off" autoFocus />
                  <button className="login-btn" disabled={loading}>
                    {loading ? '⏳ Verifying…' : '✅ Verify & Create Account'}
                  </button>
                  <div className="login-resend">
                    Didn&apos;t receive it?{' '}
                    <button type="button" onClick={handleResend} disabled={loading}>Resend OTP</button>
                  </div>
                </form>
              )}

              {/* ---- FORGOT PASSWORD — enter email ---- */}
              {mode === 'forgot' && (
                <form onSubmit={handleForgotSend} autoComplete="off">
                  <input className="login-input" type="email" placeholder="Email address"
                    value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" autoFocus />
                  <button className="login-btn" disabled={loading}>
                    {loading ? '⏳ Sending…' : '📩 Send Reset OTP'}
                  </button>
                  <div className="login-switch">
                    <button type="button" onClick={() => switchMode('signin')}>← Back to Sign In</button>
                  </div>
                </form>
              )}

              {/* ---- FORGOT PASSWORD — verify OTP ---- */}
              {mode === 'forgot-otp' && (
                <form onSubmit={handleForgotOTP} autoComplete="off">
                  <input className="login-input otp" type="text" maxLength={6} placeholder="Enter 6-digit OTP"
                    value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} autoComplete="off" autoFocus />
                  <button className="login-btn" disabled={loading}>
                    {loading ? '⏳ Verifying…' : '✅ Verify OTP'}
                  </button>
                  <div className="login-resend">
                    Didn&apos;t receive it?{' '}
                    <button type="button" onClick={handleResend} disabled={loading}>Resend OTP</button>
                  </div>
                </form>
              )}

              {/* ---- FORGOT PASSWORD — new password ---- */}
              {mode === 'forgot-newpw' && (
                <form onSubmit={handleNewPassword} autoComplete="off">
                  <div className="login-pw-wrap">
                    <input className="login-input" type={showPw ? 'text' : 'password'} placeholder="New Password (min 6 chars)"
                      value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" autoFocus />
                    <button type="button" className="login-pw-toggle" onClick={() => setShowPw(!showPw)}>
                      {showPw ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <input className="login-input" type="password" placeholder="Confirm New Password"
                    value={confirmPw} onChange={e => setConfirmPw(e.target.value)} autoComplete="new-password" />
                  <button className="login-btn" disabled={loading}>
                    {loading ? '⏳ Resetting…' : '🔒 Reset Password'}
                  </button>
                </form>
              )}

              {/* ---- OTP LOGIN — enter email ---- */}
              {mode === 'otp-login' && (
                <form onSubmit={handleOTPLoginSend} autoComplete="off">
                  <input className="login-input" type="email" placeholder="Email address"
                    value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" autoFocus />
                  <button className="login-btn" disabled={loading}>
                    {loading ? '⏳ Sending…' : '📩 Send OTP'}
                  </button>
                  <div className="login-switch">
                    <button type="button" onClick={() => switchMode('signin')}>← Back to Sign In</button>
                  </div>
                </form>
              )}

              {/* ---- OTP LOGIN — verify ---- */}
              {mode === 'otp-login-verify' && (
                <form onSubmit={handleOTPLoginVerify} autoComplete="off">
                  <input className="login-input otp" type="text" maxLength={6} placeholder="Enter 6-digit OTP"
                    value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} autoComplete="off" autoFocus />
                  <button className="login-btn" disabled={loading}>
                    {loading ? '⏳ Verifying…' : '🔐 Verify & Login'}
                  </button>
                  <div className="login-resend">
                    Didn&apos;t receive it?{' '}
                    <button type="button" onClick={handleResend} disabled={loading}>Resend OTP</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════ FEATURES + FEEDBACK SECTION ═══════ */}
      <section className="lp-extras">
        <div className="lp-extras-grid">
          {/* Features card */}
          <div className="lp-col-card">
            <h4 className="lp-subheading">🌟 Why Choose Our Card Maker?</h4>
            <ul className="lp-features">
              <li><strong>✓ Premium Templates for Every Card Type</strong> — Access a wide collection of professionally designed templates for invitations, festival greetings, announcements, business flyers, and more—each crafted to help your card look stunning and professional.</li>
              <li><strong>✓ Real‑Time Editing with Live Preview</strong> — Customize your card easily with instant live preview. Change colors, text, images, and layout while seeing updates in real time.</li>
              <li><strong>✓ High‑Resolution PNG Downloads</strong> — Download print‑ready, high‑quality PNG files ideal for sharing on WhatsApp, Instagram, Facebook, or printing. Resumes also support PDF &amp; Word formats.</li>
              <li><strong>✓ Multi‑Language Support</strong> — Design your cards in multiple languages to suit your personal, cultural, or business needs.</li>
              <li><strong>✓ Works Smoothly on All Devices</strong> — Create beautiful cards from your desktop, tablet, or mobile. Our platform is fully responsive and optimized for every screen size.</li>
            </ul>
          </div>

          {/* Rate & Review */}
          <div className="lp-feedback-section">
            <h4 className="lp-subheading">⭐ Rate &amp; Review</h4>
            <p className="lp-fb-tagline">
              💬 Your feedback matters! Help us improve by sharing your thoughts.
              Rate your experience and leave a comment — every review helps us serve you better.
            </p>
            <form className="lp-feedback-form" onSubmit={handleFeedbackSubmit}>
              <div className="login-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`login-star ${star <= (fbHover || fbRating) ? 'filled' : ''}`}
                    onClick={() => setFbRating(star)}
                    onMouseEnter={() => setFbHover(star)}
                    onMouseLeave={() => setFbHover(0)}
                    aria-label={`${star} star`}
                  >★</button>
                ))}
                {fbRating > 0 && <span className="login-star-label">{fbRating}/5</span>}
              </div>
              <div className="lp-fb-row">
                <input className="lp-fb-input" type="text" placeholder="Your name *"
                  value={fbName} onChange={e => setFbName(e.target.value)} autoComplete="off" required />
                <input className="lp-fb-input" type="email" placeholder="Your email *"
                  value={fbEmail} onChange={e => setFbEmail(e.target.value)} autoComplete="off" required />
              </div>
              <textarea className="lp-fb-textarea" placeholder="Write your feedback…"
                rows={3} value={fbComment} onChange={e => setFbComment(e.target.value)} autoComplete="off" />
              <button className="login-btn lp-fb-btn" disabled={fbSending}>
                {fbSending ? '⏳ Sending…' : '📨 Submit Review'}
              </button>
              {fbMsg && <div className={`login-fb-msg ${fbMsg.startsWith('✅') ? 'success' : 'warn'}`}>{fbMsg}</div>}
            </form>

            {/* Real user reviews displayed inside this section */}
            <div className="lp-inline-reviews">
              <h5 className="lp-inline-reviews-title">💬 What Our Users Say</h5>
              {reviews.length > 0 && (
                <div className="lp-reviews-summary">
                  <span className="lp-reviews-avg-stars">{'★'.repeat(Math.round(reviews.reduce((s,r) => s + r.rating, 0) / reviews.length))}</span>
                  <span className="lp-reviews-avg-text">{(reviews.reduce((s,r) => s + r.rating, 0) / reviews.length).toFixed(1)}/5 from {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
                  <span className="lp-reviews-verified">✓ Verified</span>
                </div>
              )}
              {reviewsLoading ? (
                <p className="lp-reviews-loading">Loading reviews…</p>
              ) : reviews.length === 0 ? (
                <p className="lp-reviews-empty">No reviews yet. Be the first to share your feedback! ⭐</p>
              ) : (
                <div className="lp-inline-reviews-list">
                  {reviews.map(r => {
                    const ownerCheck = (fbEmail || submittedEmail || '').trim().toLowerCase();
                    const isOwner = ownerCheck && r.email && ownerCheck === r.email.trim().toLowerCase();
                    const isUserAdmin = isAdmin(ownerCheck);
                    const isEditing = editId === r.id;
                    const isReplying = replyToId === r.id;
                    return (
                      <div className="lp-review-card" key={r.id}>
                        <div className="lp-review-header">
                          <div className="lp-review-avatar">{r.name?.charAt(0)?.toUpperCase() || '?'}</div>
                          <div>
                            <div className="lp-review-name">{r.name}</div>
                            {!isEditing && (
                              <div className="lp-review-stars">
                                {[1, 2, 3, 4, 5].map(s => (
                                  <span key={s} className={`lp-review-star ${s <= r.rating ? 'filled' : ''}`}>★</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="lp-review-date" style={{ marginLeft: 'auto' }}>
                            {new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>

                        {/* Normal view */}
                        {!isEditing && r.comment && <p className="lp-review-comment">{r.comment}</p>}

                        {/* Edit mode */}
                        {isEditing && (
                          <div className="lp-review-edit-form">
                            <div className="login-stars" style={{ marginBottom: 8 }}>
                              {[1, 2, 3, 4, 5].map(s => (
                                <button key={s} type="button"
                                  className={`login-star ${s <= (editHover || editRating) ? 'filled' : ''}`}
                                  onClick={() => setEditRating(s)}
                                  onMouseEnter={() => setEditHover(s)}
                                  onMouseLeave={() => setEditHover(0)}
                                >★</button>
                              ))}
                            </div>
                            <textarea className="lp-fb-textarea" rows={2} value={editComment}
                              onChange={e => setEditComment(e.target.value)} />
                            <div className="lp-review-edit-actions">
                              <button className="lp-review-btn save" onClick={() => saveEdit(r.id, r.email)} disabled={editSaving}>
                                {editSaving ? '⏳' : '💾'} Save
                              </button>
                              <button className="lp-review-btn cancel" onClick={cancelEdit}>✕ Cancel</button>
                            </div>
                          </div>
                        )}

                        {/* Action buttons — owner: edit+delete, admin: delete, others: reply only */}
                        {!isEditing && (
                          <div className="lp-review-actions">
                            {isOwner && (
                              <button className="lp-review-btn edit" onClick={() => startEdit(r)}>✏️ Edit</button>
                            )}
                            {(isOwner || isUserAdmin) && (
                              <button className="lp-review-btn delete" onClick={() => deleteFeedback(r.id, r.email)}>🗑️ Delete</button>
                            )}
                            {!isOwner && (
                              <button className="lp-review-btn reply" onClick={() => openReply(r.id)}>💬 Reply</button>
                            )}
                          </div>
                        )}

                        {/* Replies list */}
                        {r.replies && r.replies.length > 0 && (
                          <div className="lp-review-replies">
                            {r.replies.map((rp, ri) => (
                              <div key={ri} className="lp-reply-item">
                                <div className="lp-reply-header">
                                  <span className="lp-reply-avatar">{rp.name?.charAt(0)?.toUpperCase() || '?'}</span>
                                  <span className="lp-reply-name">{rp.name}</span>
                                  <span className="lp-reply-date">
                                    {new Date(rp.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                  </span>
                                </div>
                                <p className="lp-reply-comment">{rp.comment}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply form */}
                        {isReplying && (
                          <div className="lp-reply-form">
                            <input className="lp-fb-input" type="text" placeholder="Your name *"
                              value={replyName} onChange={e => setReplyName(e.target.value)} />
                            <textarea className="lp-fb-textarea" rows={2} placeholder="Write a reply…"
                              value={replyComment} onChange={e => setReplyComment(e.target.value)} />
                            <div className="lp-review-edit-actions">
                              <button className="lp-review-btn save" onClick={() => submitReply(r.id)} disabled={replySending}>
                                {replySending ? '⏳' : '📨'} Reply
                              </button>
                              <button className="lp-review-btn cancel" onClick={cancelReply}>✕ Cancel</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FREE CARDS BUTTON ═══════ */}
      <section className="lp-showcase lp-free-section">
        <div className="lp-section-header">
          <h2 className="lp-section-title">🎁 Free Instant Cards</h2>
          <span className="lp-section-free-tag">100% FREE</span>
        </div>
        <p className="lp-section-sub">No form needed — just pick, customize colors &amp; download instantly!</p>
        <button className="lp-free-cards-btn" onClick={onOpenFreeCards}>
          🎁 Browse Free Cards
        </button>
      </section>

      <section className="lp-showcase lp-calendar-section">
        <h2 className="lp-section-title">🗓️ Festival Calendar</h2>
        <p className="lp-section-sub">Plan ahead! Explore all Indian festivals month‑wise and create cards for each celebration.</p>
        <button className="lp-free-cards-btn" onClick={onOpenCalendar}>
          🗓️ Open Festival Calendar
        </button>
      </section>

      {/* ═══════ NEED A CUSTOM DESIGN ═══════ */}
      <section className="lp-custom-design-section">
        <h2 className="lp-section-title">🎨 Need a Custom Design?</h2>
        <div className="lp-custom-design">
          <p className="lp-text">
            Looking for a card that is fully personalized and tailored to your exact theme, event, or business branding?
            We offer custom card design services created exclusively by Creative Thinker Design Hub.
          </p>
          <p className="lp-text">📩 Email us your requirements at: <strong>creativethinker.designhub@gmail.com</strong></p>
          <p className="lp-text lp-brand-subtle">Our team will create a unique, high-quality design specifically for you.</p>
        </div>
      </section>

      {/* ═══════ ABOUT CARD MAKER ═══════ */}
      <section className="lp-about">
        <h2 className="lp-section-title">📖 About Card Maker</h2>
        <div className="lp-about-content">
          <p>
            <strong>Card Maker</strong> is a simple and intuitive online tool that helps you create birthday invitations,
            wedding cards, anniversary greetings, festival greeting cards, motivational quote cards, and professional
            documents like resumes and marriage biodata — all in one place. With a growing library of ready‑to‑use
            templates in <strong>Hindi, English, Punjabi, and Gujarati</strong>, it&apos;s easy for anyone to design and
            download beautiful cards quickly.
          </p>
          <p>
            Our editor lets you customize text, colors, fonts, and images with a smooth live preview experience.
            Once your design is ready, you can download it instantly in high‑quality PNG format, perfect for
            printing or sharing on WhatsApp, Instagram, or email. Resumes also support PDF and Word downloads.
          </p>
          <p>
            Developed by <strong>Creative Thinker Design Hub</strong>, Card Maker focuses on making design accessible
            to everyone — from students and families to small business owners and event planners. Whether it&apos;s a festive
            greeting or a professional document, Card Maker helps you create polished, visually appealing cards without
            needing any design skills.
          </p>
        </div>
      </section>





      {/* ═══════ FOOTER ═══════ */}
      <footer className="lp-footer">
        <div className="lp-footer-top-line" />
        <div className="lp-footer-inner">
          {/* Column 1 — Brand */}
          <div className="lp-footer-col lp-footer-brand">
            <h3 className="lp-footer-brand-title">✨ Creative Thinker Design Hub</h3>
            <p className="lp-footer-tagline">Create invitations, greetings, biodata, rent cards &amp; resumes in minutes.</p>
            <button className="lp-footer-cta" type="button" onClick={() => document.getElementById('lp-cards-anchor')?.scrollIntoView({ behavior: 'smooth' })}>
              🎨 Start Creating →
            </button>
          </div>

          {/* Column 2 — Quick Links */}
          <div className="lp-footer-col">
            <h4 className="lp-footer-heading">Quick Links</h4>
            <nav className="lp-footer-links">
              <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
              <button type="button" onClick={() => document.getElementById('lp-cards-anchor')?.scrollIntoView({ behavior: 'smooth' })}>All Templates</button>
              <button type="button" onClick={() => handleCardClick('birthday')}>Birthday Invitation</button>
              <button type="button" onClick={() => handleCardClick('wedding')}>Wedding Invitation</button>
              <button type="button" onClick={() => handleCardClick('anniversary')}>Anniversary Cards</button>
              <button type="button" onClick={() => handleCardClick('biodata')}>Marriage Biodata</button>
              <button type="button" onClick={() => handleCardClick('cardresume')}>Resume Maker</button>
            </nav>
          </div>

          {/* Column 3 — Support */}
          <div className="lp-footer-col">
            <h4 className="lp-footer-heading">Support</h4>
            <nav className="lp-footer-links">
              <button type="button" onClick={() => document.querySelector('.lp-about')?.scrollIntoView({ behavior: 'smooth' })}>About Us</button>
              <button type="button" onClick={() => document.querySelector('.lp-faq')?.scrollIntoView({ behavior: 'smooth' })}>FAQ</button>
              <a href="https://mail.google.com/mail/?view=cm&to=creativethinker.designhub@gmail.com&su=Support%20-%20Card%20Maker" target="_blank" rel="noopener noreferrer">Contact Support</a>
              <a href="https://mail.google.com/mail/?view=cm&to=creativethinker.designhub@gmail.com&su=Bug%20Report%20-%20Card%20Maker" target="_blank" rel="noopener noreferrer">Report an Issue</a>
              <a href="https://mail.google.com/mail/?view=cm&to=creativethinker.designhub@gmail.com&su=Feature%20Request%20-%20Card%20Maker" target="_blank" rel="noopener noreferrer">Feature Request</a>
            </nav>
          </div>

          {/* Column 4 — Connect */}
          <div className="lp-footer-col">
            <h4 className="lp-footer-heading">Connect With Us</h4>
            <div className="lp-footer-socials">
              <span className="lp-footer-social lp-footer-social--disabled" title="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </span>
              <span className="lp-footer-social lp-footer-social--disabled" title="LinkedIn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm13.5 11.27h-3v-5.34c0-3.18-4-2.94-4 0v5.34h-3v-10h3v1.77c1.4-2.59 7-2.78 7 2.48v5.75z"/></svg>
              </span>
              <span className="lp-footer-social lp-footer-social--disabled" title="YouTube">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </span>
              <span className="lp-footer-social lp-footer-social--disabled" title="Facebook">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z"/></svg>
              </span>
              <span className="lp-footer-social lp-footer-social--disabled" title="Pinterest">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
              </span>
              <a href="https://mail.google.com/mail/?view=cm&to=creativethinker.designhub@gmail.com&su=Inquiry%20-%20Card%20Maker" target="_blank" rel="noopener noreferrer" className="lp-footer-social" title="Email Us">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20 4h-16c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2zm0 4l-8 5-8-5v-2l8 5 8-5v2z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="lp-footer-bottom">
          <p className="lp-footer-copy">© 2026 Creative Thinker Design Hub. All Rights Reserved.</p>
          <p className="lp-footer-love">Made with ❤️ in India</p>
        </div>
      </footer>

      {/* ═══════ FULL PREVIEW OVERLAY (standalone) ═══════ */}
      {fullPreviewTpl && (
        <div className="lp-fullpreview-overlay" onClick={() => setFullPreviewTpl(null)}>
          <div className={`lp-fullpreview-wrap${fullPreviewTpl.type === 'resume' ? ' lp-fullpreview-wrap--resume' : ''}`} onClick={e => e.stopPropagation()}>
            <button className="lp-fullpreview-close" onClick={() => setFullPreviewTpl(null)}>✕</button>
            <h3 className="lp-fullpreview-title">{fullPreviewTpl.name}</h3>
            <div className="lp-fullpreview-card">
              {fullPreviewTpl.type === 'wedding' && (
                <WeddingCardPreview data={{ ...SAMPLE_WEDDING, selectedTemplate: fullPreviewTpl.id }} lang="en" template={fullPreviewTpl.id} />
              )}
              {fullPreviewTpl.type === 'birthday' && (
                <BirthdayCardPreview data={{ ...SAMPLE_BIRTHDAY, selectedTemplate: fullPreviewTpl.id }} lang="en" template={fullPreviewTpl.id} />
              )}
              {fullPreviewTpl.type === 'anniversary' && (
                <AnniversaryCardPreview data={{ ...SAMPLE_ANNIVERSARY, selectedTemplate: fullPreviewTpl.id }} lang="en" template={fullPreviewTpl.id} />
              )}
              {fullPreviewTpl.type === 'biodata' && (
                <BiodataCardPreview data={SAMPLE_BIODATA} lang="en" template={fullPreviewTpl.id} community="hindi" />
              )}
              {fullPreviewTpl.type === 'rentcard' && (
                <RentCardPreview data={SAMPLE_RENT_BY_TPL[fullPreviewTpl.id] || SAMPLE_RENT} />
              )}
              {fullPreviewTpl.type === 'saloncard' && (
                <SalonCardPreview data={{ ...SAMPLE_SALON, theme: fullPreviewTpl.id }} />
              )}
              {fullPreviewTpl.type === 'resume' && fullPreviewTpl.Component && (
                <fullPreviewTpl.Component data={fullPreviewTpl.sampleData || SAMPLE_RESUME} />
              )}
            </div>
            <button className="lp-fullpreview-back" onClick={() => setFullPreviewTpl(null)}>
              ← Back
            </button>
          </div>
        </div>
      )}

      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
