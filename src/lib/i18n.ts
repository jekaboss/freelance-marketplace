import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      login: 'Login',
      signup: 'Sign Up',
      adminPanel: 'Admin Panel',
      profile: 'Profile',
      logout: 'Logout',
      
      // Header Menu
      forClients: 'For Clients',
      forFreelancers: 'For Freelancers',
      vacancies: 'Vacancies',
      
      // Vacancies Menu
      listVacancies: 'List of Vacancies',
      listVacanciesDesc: 'Browse vacancies and apply for the ones you like',
      
      // For Clients Menu
      createFreelanceProject: 'Create Freelance Project',
      createFreelanceProjectDesc: 'Get the best offers by price and deadlines',
      postJob: 'Post a Job',
      postJobDesc: 'Find a collaborator for permanent remote or office work',
      findFreelancer: 'Find Freelancer',
      findFreelancerDesc: 'Choose the best specialist by reviews, rating and portfolio',
      businessSafe: 'Business Safe',
      businessSafeDesc: 'Work with non-cash payment and get reporting documents',
      
      // For Freelancers Menu
      findFreelanceProject: 'Find Freelance Project',
      findFreelanceProjectDesc: 'Choose from open freelance projects',
      postResume: 'Post Resume',
      postResumeDesc: 'Find permanent remote or office work',
      
      // Jobs Menu
      postVacancy: 'Post Vacancy',
      postVacancyDesc: 'Find a collaborator for permanent remote or office work',

      // Hero Section
      heroTitle: 'Best freelancers for your tasks',
      heroSubtitle: 'Connect with talented professionals and bring your ideas to life',
      searchPlaceholder: 'Search',
      
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
      whyItMoreConvenient: 'Why it is more convenient',
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
      home: 'Головна',
      login: 'Увійти',
      signup: 'Реєстрація',
      adminPanel: 'Панель адміністратора',
      profile: 'Профіль',
      logout: 'Вийти',
      
      // Main Menu
      forClients: 'Замовникам',
      forFreelancers: 'Фрилансерам',
      vacancies: 'Вакансії',
      
      // Vacancies Menu
      listVacancies: 'Список вакансій',
      listVacanciesDesc: 'Перегляньте вакансії та відгукніться на ті, які сподобалися',
      
      // For Clients Menu
      createFreelanceProject: 'Створити фриланс проект',
      createFreelanceProjectDesc: 'Отримайте найкращі пропозиції за ціною та термінами від фрилансерів',
      postJob: 'Розмістити вакансію',
      postJobDesc: 'Знайдіть співробітника на постійну роботу віддалено чи в офісі',
      findFreelancer: 'Знайти фрилансера',
      findFreelancerDesc: 'Виберіть найкращого спеціаліста за відгуками, рейтингом та портфоліо',
      businessSafe: 'Бізнес сейф',
      businessSafeDesc: 'Працюйте за безготівковим розрахунком та отримуйте звітні документи',
      
      // For Freelancers Menu
      findFreelanceProject: 'Знайти фриланс проект',
      findFreelanceProjectDesc: 'Вибирайте серед відкритих фріланс проектів',
      postResume: 'Розмістити резюме',
      postResumeDesc: 'Знайдіть постійну роботу віддалено чи в офісі',
      
      // Jobs Menu
      postVacancy: 'Розмістити вакансію',
      postVacancyDesc: 'Знайдіть співробітника на постійну роботу віддалено чи в офіс',
      jobsList: 'Список вакансій',
      jobsListDesc: 'Ознайомтесь зі списком вакансій та відгукніться на ті, які сподобалися',
      
      // Hero Section
      heroTitle: 'Найкращі фрилансери для ваших завдань',
      heroSubtitle: 'Підключайтеся до талановитих професіоналів і реалізуйте свої ідеї',
      searchPlaceholder: 'Знайти',
      
      // Marketplace
      featuredProjects: 'Популярні проекти',
      browseProjects: 'Переглянути проекти',
      postProject: 'Опублікувати проект',
      popularSkills: 'Популярні навички',
      
      // Footer
      company: 'Компанія',
      aboutUs: 'Про нас',
      careers: 'Вакансії',
      blog: 'Блог',
      contact: 'Контакти',
      
      // Theme
      darkMode: 'Темна тема',
      lightMode: 'Світла тема',
      systemMode: 'Системна',
      
      // Common
      loading: 'Завантаження...',
      error: 'Помилка',
      success: 'Успіх',
      cancel: 'Скасувати',
      save: 'Зберегти',
      edit: 'Редагувати',
      delete: 'Видалити',
      viewDetails: 'Детальніше',
      createProfile: 'Створити профіль',
      findSpecialist: 'Знайти фахівця',
      startCooperation: 'Розпочати співпрацю',
      recentlyOpenedOrders: 'Нещодавно відкриті замовлення',
      viewAll: 'Переглянути всі',
      popularOrderTags: 'Популярні теги замовлень',
      whyChooseUs: 'Чому обирають нас',
      freelanceMarket: 'Біржа фрілансу — швидко та зручно',
      advantagesOfPlatform: 'Переваги біржі',
      whoIsItFor: 'Кому підійде',
      joinToday: 'Приєднуйтесь вже сьогодні',
      whyItMoreConvenient: 'Чому це зручніше',
      authentication: 'Автентифікація',
      loginDescription: 'Введіть свої дані для доступу до облікового запису',
      signupDescription: 'Створіть обліковий запис, щоб почати',
      firstName: "Ім'я",
      lastName: 'Прізвище',
      firstNamePlaceholder: 'Іван',
      lastNamePlaceholder: 'Петренко',
      confirmPassword: 'Підтвердіть пароль',
      createAccount: 'Створити обліковий запис',
      termsAndConditions: 'Реєструючись, ви погоджуєтесь з нашими Умовами використання',
      forgotPassword: 'Забули пароль?',
      accountType: 'Тип облікового запису',
      selectAccountType: 'Оберіть тип облікового запису',
      freelancer: 'Фрілансер',
      client: 'Клієнт',
      contentManagement: 'Управління контентом',
      contentManagementDescription: 'Створення та управління контентом платформи та рекламними матеріалами',
      // Validation
      errorRequired: 'Поле обов\'язкове',
      errorInvalidEmail: 'Введіть коректну робочу пошту',
      errorPasswordMismatch: 'Паролі не співпадають',
      errorBudgetNumber: 'Бюджет має бути числом',
      errorHourlyRateNumber: 'Погодинна ставка має бути числом',
      errorLoginFailed: 'Помилка входу',
      errorRegistrationFailed: 'Помилка реєстрації',
      errorNotAuthenticated: 'Увійдіть, щоб продовжити',
      errorFreelancerCannotCreate: 'Фрілансери не можуть створювати проекти',
      errorSaveFailed: 'Не вдалося зберегти',
      errorUpdateFailed: 'Не вдалося оновити',
      errorLoadFailed: 'Не вдалося завантажити дані',
      errorDeleteFailed: 'Не вдалося видалити',
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
