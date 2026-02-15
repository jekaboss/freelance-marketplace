import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      projects: 'Projects',
      freelancers: 'Freelancers',
      portfolio: 'Portfolio',
      login: 'Login',
      signup: 'Sign Up',
      adminPanel: 'Admin Panel',
      
      // Hero Section
      heroTitle: 'Find the perfect freelancer for your project',
      heroSubtitle: 'Connect with talented professionals and bring your ideas to life',
      searchPlaceholder: 'Search for services...',
      
      // Marketplace
      featuredProjects: 'Featured Projects',
      browseProjects: 'Browse Projects',
      postProject: 'Post a Project',
      popularSkills: 'Popular Skills',
      
      // Footer
      company: 'Company',
      aboutUs: 'About Us',
      careers: 'Careers',
      blog: 'Blog',
      contact: 'Contact',
      
      // Theme
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      systemMode: 'System',
      
      // Common
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      viewDetails: 'View Details',
      createProfile: 'Create Profile',
      findSpecialist: 'Find Specialist',
      startCooperation: 'Start Cooperation',
      recentlyOpenedOrders: 'Recently Opened Orders',
      viewAll: 'View All',
      popularOrderTags: 'Popular Order Tags',
      whyChooseUs: 'Why Choose Us',
      freelanceMarket: 'Freelance Market - Fast and Convenient',
      advantagesOfPlatform: 'Advantages of the Platform',
      whoIsItFor: 'Who Is It For',
      joinToday: 'Join Today',
      whyItMoreConvenient: 'Why It\'s More Convenient to Work Through the Exchange',
      authentication: 'Authentication',
      loginDescription: 'Enter your credentials to access your account',
      signupDescription: 'Create an account to get started',
      firstName: 'First Name',
      lastName: 'Last Name',
      firstNamePlaceholder: 'John',
      lastNamePlaceholder: 'Doe',
      confirmPassword: 'Confirm Password',
      createAccount: 'Create Account',
      termsAndConditions: 'By signing up, you agree to our Terms and Conditions',
      forgotPassword: 'Forgot Password?',
      accountType: 'Account Type',
      selectAccountType: 'Select account type',
      freelancer: 'Freelancer',
      client: 'Client',
      contentManagement: 'Content Management',
      contentManagementDescription: 'Create and manage platform content and promotional materials',
      // Validation
      errorRequired: 'This field is required',
      errorInvalidEmail: 'Please enter a valid email',
      errorPasswordMismatch: 'Passwords do not match',
      errorBudgetNumber: 'Budget must be a number',
      errorHourlyRateNumber: 'Hourly rate must be a number',
      errorLoginFailed: 'Login failed',
      errorRegistrationFailed: 'Registration failed',
      errorNotAuthenticated: 'Please sign in to continue',
      errorFreelancerCannotCreate: 'Freelancers cannot create projects',
      errorSaveFailed: 'Failed to save',
      errorUpdateFailed: 'Failed to update',
      errorLoadFailed: 'Failed to load data',
      errorDeleteFailed: 'Failed to delete',
    }
  },
  uk: {
    translation: {
      // Navigation
      home: 'Р“РѕР»РѕРІРЅР°',
      projects: 'РџСЂРѕРµРєС‚Рё',
      freelancers: 'Р¤СЂС–Р»Р°РЅСЃРµСЂРё',
      portfolio: 'РџРѕСЂС‚С„РѕР»С–Рѕ',
      login: 'РЈРІС–Р№С‚Рё',
      signup: 'Р РµС”СЃС‚СЂР°С†С–СЏ',
      adminPanel: 'РџР°РЅРµР»СЊ Р°РґРјС–РЅС–СЃС‚СЂР°С‚РѕСЂР°',
      
      // Hero Section
      heroTitle: 'Р—РЅР°Р№РґС–С‚СЊ С–РґРµР°Р»СЊРЅРѕРіРѕ С„СЂС–Р»Р°РЅСЃРµСЂР° РґР»СЏ РІР°С€РѕРіРѕ РїСЂРѕРµРєС‚Сѓ',
      heroSubtitle: 'РџС–РґРєР»СЋС‡Р°Р№С‚РµСЃСЊ РґРѕ С‚Р°Р»Р°РЅРѕРІРёС‚РёС… РїСЂРѕС„РµСЃС–РѕРЅР°Р»С–РІ С– СЂРµР°Р»С–Р·СѓР№С‚Рµ СЃРІРѕС— С–РґРµС—',
      searchPlaceholder: 'РџРѕС€СѓРє РїРѕСЃР»СѓРі...',
      
      // Marketplace
      featuredProjects: 'РџРѕРїСѓР»СЏСЂРЅС– РїСЂРѕРµРєС‚Рё',
      browseProjects: 'РџРµСЂРµРіР»СЏРЅСѓС‚Рё РїСЂРѕРµРєС‚Рё',
      postProject: 'РћРїСѓР±Р»С–РєСѓРІР°С‚Рё РїСЂРѕРµРєС‚',
      popularSkills: 'РџРѕРїСѓР»СЏСЂРЅС– РЅР°РІРёС‡РєРё',
      
      // Footer
      company: 'РљРѕРјРїР°РЅС–СЏ',
      aboutUs: 'РџСЂРѕ РЅР°СЃ',
      careers: 'Р’Р°РєР°РЅСЃС–С—',
      blog: 'Р‘Р»РѕРі',
      contact: 'РљРѕРЅС‚Р°РєС‚Рё',
      
      // Theme
      darkMode: 'РўРµРјРЅР° С‚РµРјР°',
      lightMode: 'РЎРІС–С‚Р»Р° С‚РµРјР°',
      systemMode: 'РЎРёСЃС‚РµРјРЅР°',
      
      // Common
      loading: 'Р—Р°РІР°РЅС‚Р°Р¶РµРЅРЅСЏ...',
      error: 'РџРѕРјРёР»РєР°',
      success: 'РЈСЃРїС–С…',
      cancel: 'РЎРєР°СЃСѓРІР°С‚Рё',
      save: 'Р—Р±РµСЂРµРіС‚Рё',
      edit: 'Р РµРґР°РіСѓРІР°С‚Рё',
      delete: 'Р’РёРґР°Р»РёС‚Рё',
      viewDetails: 'Р”РµС‚Р°Р»СЊРЅС–С€Рµ',
      createProfile: 'РЎС‚РІРѕСЂРёС‚Рё РїСЂРѕС„С–Р»СЊ',
      findSpecialist: 'Р—РЅР°Р№С‚Рё С„Р°С…С–РІС†СЏ',
      startCooperation: 'Р РѕР·РїРѕС‡Р°С‚Рё СЃРїС–РІРїСЂР°С†СЋ',
      recentlyOpenedOrders: 'РќРµС‰РѕРґР°РІРЅРѕ РІС–РґРєСЂРёС‚С– Р·Р°РјРѕРІР»РµРЅРЅСЏ',
      viewAll: 'РџРµСЂРµРіР»СЏРЅСѓС‚Рё РІСЃС–',
      popularOrderTags: 'РџРѕРїСѓР»СЏСЂРЅС– С‚РµРіРё Р·Р°РјРѕРІР»РµРЅСЊ',
      whyChooseUs: 'Р§РѕРјСѓ РѕР±РёСЂР°СЋС‚СЊ РЅР°СЃ',
      freelanceMarket: 'Р‘С–СЂР¶Р° С„СЂС–Р»Р°РЅСЃСѓ вЂ” С€РІРёРґРєРѕ С‚Р° Р·СЂСѓС‡РЅРѕ',
      advantagesOfPlatform: 'РџРµСЂРµРІР°РіРё Р±С–СЂР¶С–',
      whoIsItFor: 'РљРѕРјСѓ РїС–РґС–Р№РґРµ',
      joinToday: 'РџСЂРёС”РґРЅСѓР№С‚РµСЃСЊ РІР¶Рµ СЃСЊРѕРіРѕРґРЅС–',
      whyItMoreConvenient: 'Р§РѕРјСѓ Р·СЂСѓС‡РЅС–С€Рµ РїСЂР°С†СЋРІР°С‚Рё С‡РµСЂРµР· Р±С–СЂР¶Сѓ',
      authentication: 'РђРІС‚РµРЅС‚РёС„С–РєР°С†С–СЏ',
      loginDescription: 'Р’РІРµРґС–С‚СЊ СЃРІРѕС— РґР°РЅС– РґР»СЏ РґРѕСЃС‚СѓРїСѓ РґРѕ РѕР±Р»С–РєРѕРІРѕРіРѕ Р·Р°РїРёСЃСѓ',
      signupDescription: 'РЎС‚РІРѕСЂС–С‚СЊ РѕР±Р»С–РєРѕРІРёР№ Р·Р°РїРёСЃ, С‰РѕР± РїРѕС‡Р°С‚Рё',
      firstName: 'Р†Рј\'СЏ',
      lastName: 'РџСЂС–Р·РІРёС‰Рµ',
      firstNamePlaceholder: 'Р†РІР°РЅ',
      lastNamePlaceholder: 'РџРµС‚СЂРµРЅРєРѕ',
      confirmPassword: 'РџС–РґС‚РІРµСЂРґС–С‚СЊ РїР°СЂРѕР»СЊ',
      createAccount: 'РЎС‚РІРѕСЂРёС‚Рё РѕР±Р»С–РєРѕРІРёР№ Р·Р°РїРёСЃ',
      termsAndConditions: 'Р РµС”СЃС‚СЂСѓСЋС‡РёСЃСЊ, РІРё РїРѕРіРѕРґР¶СѓС”С‚РµСЃСЏ Р· РЅР°С€РёРјРё РЈРјРѕРІР°РјРё РІРёРєРѕСЂРёСЃС‚Р°РЅРЅСЏ',
      forgotPassword: 'Р—Р°Р±СѓР»Рё РїР°СЂРѕР»СЊ?',
      accountType: 'РўРёРї РѕР±Р»С–РєРѕРІРѕРіРѕ Р·Р°РїРёСЃСѓ',
      selectAccountType: 'РћР±РµСЂС–С‚СЊ С‚РёРї РѕР±Р»С–РєРѕРІРѕРіРѕ Р·Р°РїРёСЃСѓ',
      freelancer: 'Р¤СЂС–Р»Р°РЅСЃРµСЂ',
      client: 'РљР»С–С”РЅС‚',
      contentManagement: 'РЈРїСЂР°РІР»С–РЅРЅСЏ РєРѕРЅС‚РµРЅС‚РѕРј',
      contentManagementDescription: 'РЎС‚РІРѕСЂРµРЅРЅСЏ С‚Р° СѓРїСЂР°РІР»С–РЅРЅСЏ РєРѕРЅС‚РµРЅС‚РѕРј РїР»Р°С‚С„РѕСЂРјРё С‚Р° СЂРµРєР»Р°РјРЅРёРјРё РјР°С‚РµСЂС–Р°Р»Р°РјРё',
      // Validation
      errorRequired: 'РџРѕР»Рµ РѕР±РѕРІСЏР·РєРѕРІРµ',
      errorInvalidEmail: 'Р’РІРµРґС–С‚СЊ РєРѕСЂРµРєС‚РЅСѓ СЂРѕР±РѕС‡Сѓ РїРѕС€С‚Сѓ',
      errorPasswordMismatch: 'РџР°СЂРѕР»С– РЅРµ СЃРїС–РІРїР°РґР°СЋС‚СЊ',
      errorBudgetNumber: 'Р‘СЋРґР¶РµС‚ РјР°С” Р±СѓС‚Рё С‡РёСЃР»РѕРј',
      errorHourlyRateNumber: 'РџРѕРіРѕРґРёРЅРЅР° СЃС‚Р°РІРєР° РјР°С” Р±СѓС‚Рё С‡РёСЃР»РѕРј',
      errorLoginFailed: 'РџРѕРјРёР»РєР° РІС…РѕРґСѓ',
      errorRegistrationFailed: 'РџРѕРјРёР»РєР° СЂРµС”СЃС‚СЂР°С†С–С—',
      errorNotAuthenticated: 'РЈРІС–Р№РґС–С‚СЊ, С‰РѕР± РїСЂРѕРґРѕРІР¶РёС‚Рё',
      errorFreelancerCannotCreate: 'Р¤СЂС–Р»Р°РЅСЃРµСЂРё РЅРµ РјРѕР¶СѓС‚СЊ СЃС‚РІРѕСЂСЋРІР°С‚Рё РїСЂРѕРµРєС‚Рё',
      errorSaveFailed: 'РќРµ РІРґР°Р»РѕСЃСЏ Р·Р±РµСЂРµРіС‚Рё',
      errorUpdateFailed: 'РќРµ РІРґР°Р»РѕСЃСЏ РѕРЅРѕРІРёС‚Рё',
      errorLoadFailed: 'РќРµ РІРґР°Р»РѕСЃСЏ Р·Р°РІР°РЅС‚Р°Р¶РёС‚Рё РґР°РЅС–',
      errorDeleteFailed: 'РќРµ РІРґР°Р»РѕСЃСЏ РІРёРґР°Р»РёС‚Рё',
    }
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'uk', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
