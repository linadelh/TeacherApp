# 📘 Fiche de Voeux Project – Teacher Request Management Application

## Description

This web application is a project developed as part of our academic coursework at USTHB – Faculty of Computer Science.
It was designed in response to a real problem that teachers face every year while submitting their **course preference forms**

Our goal was to propose a *digital solution that simplifies and modernizes this repetitive process* by allowing teachers to easily submit, update, and track their course preferences online.
---

##  Application Overview

- **Secure Authentication**
- **Teacher Dashboard** to submit and update preferences
  ![image alt](https://github.com/linadelh/fiche_voeux/blob/f202a1635c78dbae84011aabcd7a76aaaa67e4ee/espace%20enseignant.png)
  ![image alt](https://github.com/linadelh/fiche_voeux/blob/76aa24c0306140021973214ef08120bcf51c80ef/fiche(1).png)
- **Department Head Dashboard** to validate, manage, and monitor requests
  ![image alt](https://github.com/linadelh/fiche_voeux/blob/76aa24c0306140021973214ef08120bcf51c80ef/chefanal.png)

---

##  Tools and Technologies Used

### 1. Frontend  
- **HTML / CSS / JavaScript** for page structure, styling, and interactivity  
- User-friendly interface with cross-browser compatibility  

### 2. Backend  
- **Node.js** as the server-side JavaScript runtime  
- **Express.js** framework for handling routes, HTTP requests, and business logic (login, submission, etc.)  

### 3. Database  
- **MySQL** relational database system to store users, roles, and preferences  
- **Sequelize** ORM for simplified and secure interaction between Node.js and MySQL  
- **draw.io** for designing the relational database schema  

### 4. Security and Authentication  
- **bcrypt** for password hashing to ensure user data confidentiality  
- **JWT (JSON Web Token)** for secure token-based authentication  
- Custom middleware to enforce role-based access control (teacher vs department head)  

### 5. Development and Testing Tools  
- **Canva** for diagrams and functional flowcharts  
- **VS Code** as the primary code editor  
- **Terminal / Command Prompt** for running npm, node commands, etc.  
- **Postman** for API testing, documentation, and automation  

---

> ⚠️ **Academic Disclaimer**  
> This project is part of a student submission for an academic assignment at USTHB.  
> Please do not reuse, copy, or redistribute this code without explicit permission from the authors.

##  Installation and Setup

1. Clone the repository:  
```bash
git clone https://github.com/linadelh/fiche_voeux.git
cd fiche_voeux
npm install
node app.js
**⚠️ Database import is mandatory**
Please contact me to receive the gestion_voeux.sql file required for setup :))
