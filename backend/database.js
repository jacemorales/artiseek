const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, 'db.json');

async function readDB() {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    const db = JSON.parse(data);
    if (!db.services) {
      db.services = [];
    }
    if (!db.projects) {
      db.projects = [];
    }
    if (!db.applications) {
      db.applications = [];
    }
    return db;
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeDB({ users: [], services: [], projects: [], applications: [] });
      return { users: [], services: [], projects: [], applications: [] };
    }
    throw error;
  }
}

async function writeDB(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

async function findUserByEmail(email) {
  const db = await readDB();
  return db.users.find(user => user.email === email);
}

async function findUserById(id) {
  const db = await readDB();
  return db.users.find(user => user.id === id);
}

async function createUser(userData) {
  const db = await readDB();
  const newUser = {
    id: uuidv4(),
    ...userData,
    date: new Date().toISOString(),
    isEmailVerified: false,
    emailVerificationToken: null,
    phone: null,
    isPhoneVerified: false,
    phoneVerificationToken: null,
    dob: null,
    location: null,
    clientType: null,
    freelancerType: null,
    verification: {},
    onboardingComplete: false,
    artipoints: 0,
  };
  db.users.push(newUser);
  await writeDB(db);
  return newUser;
}

async function updateUser(id, userData) {
  const db = await readDB();
  const userIndex = db.users.findIndex(user => user.id === id);
  if (userIndex === -1) {
    return null;
  }
  db.users[userIndex] = { ...db.users[userIndex], ...userData };
  await writeDB(db);
  return db.users[userIndex];
}

async function deleteUser(id) {
    const db = await readDB();
    const userIndex = db.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
        return null;
    }
    const deletedUser = db.users.splice(userIndex, 1);
    await writeDB(db);
    return deletedUser[0];
}

async function createService(serviceData) {
    const db = await readDB();
    const newService = {
        id: uuidv4(),
        ...serviceData,
        createdAt: new Date().toISOString(),
    };
    db.services.push(newService);
    await writeDB(db);
    return newService;
}

async function getServices() {
    const db = await readDB();
    return db.services;
}

async function getServiceById(id) {
    const db = await readDB();
    return db.services.find(service => service.id === id);
}

async function getServicesByUserId(userId) {
    const db = await readDB();
    return db.services.filter(service => service.userId === userId);
}

async function updateService(id, serviceData) {
    const db = await readDB();
    const serviceIndex = db.services.findIndex(service => service.id === id);
    if (serviceIndex === -1) {
        return null;
    }
    db.services[serviceIndex] = { ...db.services[serviceIndex], ...serviceData };
    await writeDB(db);
    return db.services[serviceIndex];
}

async function deleteService(id) {
    const db = await readDB();
    const serviceIndex = db.services.findIndex(service => service.id === id);
    if (serviceIndex === -1) {
        return null;
    }
    const deletedService = db.services.splice(serviceIndex, 1);
    await writeDB(db);
    return deletedService[0];
}

async function createProject(projectData) {
    const db = await readDB();
    const newProject = {
        id: uuidv4(),
        ...projectData,
        createdAt: new Date().toISOString(),
    };
    db.projects.push(newProject);
    await writeDB(db);
    return newProject;
}

async function getProjects() {
    const db = await readDB();
    return db.projects;
}

async function getProjectById(id) {
    const db = await readDB();
    return db.projects.find(project => project.id === id);
}

async function getProjectsByUserId(userId) {
    const db = await readDB();
    return db.projects.filter(project => project.userId === userId);
}

async function updateProject(id, projectData) {
    const db = await readDB();
    const projectIndex = db.projects.findIndex(project => project.id === id);
    if (projectIndex === -1) {
        return null;
    }
    db.projects[projectIndex] = { ...db.projects[projectIndex], ...projectData };
    await writeDB(db);
    return db.projects[projectIndex];
}

async function deleteProject(id) {
    const db = await readDB();
    const projectIndex = db.projects.findIndex(project => project.id === id);
    if (projectIndex === -1) {
        return null;
    }
    const deletedProject = db.projects.splice(projectIndex, 1);
    await writeDB(db);
    return deletedProject[0];
}

async function createApplication(applicationData) {
    const db = await readDB();
    const newApplication = {
        id: uuidv4(),
        ...applicationData,
        status: 'pending',
        createdAt: new Date().toISOString(),
    };
    db.applications.push(newApplication);
    await writeDB(db);
    return newApplication;
}

async function getApplicationsByProjectId(projectId) {
    const db = await readDB();
    return db.applications.filter(app => app.projectId === projectId);
}

async function getApplicationsByUserId(userId) {
    const db = await readDB();
    return db.applications.filter(app => app.userId === userId);
}

async function updateApplication(id, applicationData) {
    const db = await readDB();
    const appIndex = db.applications.findIndex(app => app.id === id);
    if (appIndex === -1) {
        return null;
    }
    db.applications[appIndex] = { ...db.applications[appIndex], ...applicationData };
    await writeDB(db);
    return db.applications[appIndex];
}


module.exports = {
  readDB,
  writeDB,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  createService,
  getServices,
  getServiceById,
  getServicesByUserId,
  updateService,
  deleteService,
  createProject,
  getProjects,
  getProjectById,
  getProjectsByUserId,
  updateProject,
  deleteProject,
  createApplication,
  getApplicationsByProjectId,
  getApplicationsByUserId,
  updateApplication,
};
