import { createContext, useContext, useEffect, useState } from "react";

// Demo users for testing
const demoUsers = [
  {
    email: "student@example.com",
    password: "password123",
    fullName: "John Student",
    university: "Demo University",
    major: "Computer Science",
    role: "student"
  },
  {
    email: "employee@example.com",
    password: "password123",
    fullName: "Jane Employee",
    currentCompany: "Demo Corp",
    jobTitle: "HR Manager",
    role: "employee"
  },
  {
    email: "company@example.com",
    password: "password123",
    companyName: "Tech Solutions Inc",
    industry: "Technology",
    role: "company"
  },
  {
    email: "institution@example.com",
    password: "password123",
    institutionName: "Learning Academy",
    website: "https://example.com",
    contactPerson: "Dr. Smith",
    role: "institution"
  }
];

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  
  // Load users from localStorage on initial mount
  useEffect(() => {
    const storedUsers = localStorage.getItem("placify_users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Initialize with demo users if no users exist
      setUsers(demoUsers);
      localStorage.setItem("placify_users", JSON.stringify(demoUsers));
    }
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("placify_users", JSON.stringify(users));
    }
  }, [users]);

  // Add a new user
  const addUser = (userData) => {
    // Check if user already exists with this email
    const userExists = users.some(user => user.email === userData.email);
    
    if (userExists) {
      throw new Error("A user with this email already exists");
    }
    
    // Add new user
    const newUsers = [...users, userData];
    setUsers(newUsers);
    return userData;
  };

  // Authenticate a user
  const authenticateUser = (email, password) => {
    const user = users.find(user => 
      user.email === email && user.password === password
    );
    
    if (!user) {
      throw new Error("Invalid email or password");
    }
    
    // Create a properly formatted JWT-like token
    // Format: header.payload.signature
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({
      id: Date.now(),
      email: user.email,
      role: user.role || 'student',
      name: user.fullName || user.companyName || user.institutionName || 'User',
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // Expires in 7 days (in seconds)
    }));
    // In a real app, the signature would be cryptographically generated
    // For this demo, we'll just use a dummy signature
    const signature = btoa("demo-signature");
    
    const token = `${header}.${payload}.${signature}`;
    
    return { token };
  };

  return (
    <UserContext.Provider value={{ users, addUser, authenticateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
