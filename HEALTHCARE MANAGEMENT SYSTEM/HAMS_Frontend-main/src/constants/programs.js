// healthCarePrograms.js
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import HealingIcon from '@mui/icons-material/Healing';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman';
import AirIcon from '@mui/icons-material/Air';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ChildCareIcon from '@mui/icons-material/ChildCare';

// Map of icon keys to actual MUI components
export const iconMap = {
  LocalDining: LocalDiningIcon,
  Favorite: FavoriteIcon,
  HealthAndSafety: HealthAndSafetyIcon,
  Healing: HealingIcon,
  AccessibilityNew: AccessibilityNewIcon,
  PregnantWoman: PregnantWomanIcon,
  Air: AirIcon,
  InvertColors: InvertColorsIcon,
  Psychology: PsychologyIcon,
  ChildCare: ChildCareIcon
};

// Function to format price with k/L suffix
export const formatPrice = (price) => {
  if (price >= 100000) {
    return (price / 100000).toFixed(price % 100000 === 0 ? 0 : 1) + 'L';
  } else if (price >= 1000) {
    return (price / 1000).toFixed(price % 1000 === 0 ? 0 : 1) + 'k';
  }
  return price.toString();
};

export const healthCarePrograms = [
  {
    iconKey: 'LocalDining',
    name: 'Complete Nutrition & Dietetics',
    description: 'Initial dietician assessment, customized meal plan, follow-up sessions, and body composition analysis',
    price: 8000
  },
  {
    iconKey: 'Favorite',
    name: 'Comprehensive Cardiac Check-Up',
    description: 'Cardiologist consultation, ECG, ECHO, TMT stress test, lipid profile, and lifestyle counseling',
    price: 15000
  },
  {
    iconKey: 'HealthAndSafety',
    name: 'Diabetes Management Program',
    description: 'Endocrinologist consult, HbA1c and glucose monitoring, diet & exercise planning, and patient education workshops',
    price: 10000
  },
  {
    iconKey: 'Healing',
    name: 'Oncology Care Package',
    description: 'Oncologist consultation, chemotherapy/radiation planning, infusion nursing support, and psychosocial & nutritional counseling',
    price: 120000
  },
  {
    iconKey: 'AccessibilityNew',
    name: 'Orthopedic Rehabilitation',
    description: 'Orthopedic and physiotherapy consultations, manual therapy, electrotherapy sessions, and assistive device fitting',
    price: 40000
  },
  {
    iconKey: 'PregnantWoman',
    name: 'Maternity Care Package',
    description: 'Antenatal visits and scans, normal or C-section delivery, postnatal care, and neonatal screening & immunizations',
    price: 100000
  },
  {
    iconKey: 'Air',
    name: 'Pulmonary Rehabilitation Program',
    description: 'Pulmonologist consult, spirometry testing, breathing exercises, physiotherapy, and smoking-cessation support',
    price: 25000
  },
  {
    iconKey: 'InvertColors',
    name: 'Renal Dialysis Sessions',
    description: 'Hemodialysis sessions, AV-fistula care, electrolyte & anemia management, and dietary counseling',
    price: 3000
  },
  {
    iconKey: 'Psychology',
    name: 'Mental Health & Wellness',
    description: 'Psychiatrist & psychologist sessions, group therapy, stress-management workshops, and telepsychiatry follow-ups',
    price: 5000
  },
  {
    iconKey: 'ChildCare',
    name: 'Pediatric Wellness & Immunization',
    description: 'Growth & developmental monitoring, standard immunizations, nutrition & feeding counseling, and early screening',
    price: 8000
  }
];

export default healthCarePrograms;