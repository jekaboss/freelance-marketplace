const bcrypt = require('bcrypt');
const { DataSource } = require('typeorm');

// Define the User entity directly in this script since we can't import from NestJS
const User = {
  name: 'User',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    email: {
      type: 'varchar',
      unique: true,
    },
    fullName: {
      type: 'varchar',
    },
    passwordHash: {
      type: 'varchar',
      select: false,
    },
    role: {
      type: 'varchar',
      default: 'client',
    },
    avatarUrl: {
      type: 'varchar',
      nullable: true,
    },
    portfolioUrls: {
      type: 'text',
      array: true,
      default: '{}',
    },
 }
};

async function createAdminUser() {
  // Database connection parameters - adjust according to your setup
  const AppDataSource = new DataSource({
    type: 'postgres', // Change this if using a different database
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME || 'your_db_username',
    password: process.env.DB_PASSWORD || 'your_db_password',
    database: process.env.DB_NAME || 'freelancemarketplacedb',
    entities: [User], // Use the entity defined above
    synchronize: false, // Don't use synchronize in production
    logging: false,
  });

  try {
    await AppDataSource.initialize();
    console.log('Connected to the database');

    // Hash the password
    const passwordHash = await bcrypt.hash('admin123', 10); // Default admin password

    // Create admin user
    const adminUser = {
      email: 'admin@example.com',
      fullName: 'Admin User',
      passwordHash: passwordHash,
      role: 'admin',
    };

    // Save the admin user to the database
    const userRepository = AppDataSource.getRepository('User');
    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@example.com' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    await userRepository.insert(adminUser);
    console.log('Admin user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

// Run the function
createAdminUser();