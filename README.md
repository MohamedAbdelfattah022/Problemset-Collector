<h1 align="center">Problemset Collector</h1>

<!-- Status -->

<h4 align="center"> 
	🚧  Problemset Collector 🚀 Under construction...  🚧
</h4> 

<hr>

<p align="center">
  <a href="#about">About</a> &#xa0; | &#xa0; 
  <a href="#features">Features</a> &#xa0; | &#xa0;
  <a href="#technologies">Technologies</a> &#xa0; | &#xa0;
  <a href="#requirements">Requirements</a> &#xa0; | &#xa0;
  <a href="#getting-started">Getting Started</a> &#xa0; | &#xa0;
  <a href="https://github.com/MohamedAbdelfattah022" target="_blank">Author</a>
</p>

<br>

## About

The Problemset Collector is a web application designed to help users access and explore a **Centralized** collection of coding problems. This platform categorizes problems by difficulty and topic, enabling users to efficiently find and solve challenges from various Problem Solving sites, including LeetCode, Codeforces, AtCoder, CodeChef, and others.

## Features

### User Features
- **Problem Browsing**: Users can browse a list of coding problems categorized by various platforms and difficulties. Each problem displays relevant details such as problem name, tags, and difficulty level.

- **Dynamic Filtering**: 
  - Users can filter problems by selecting specific tags and difficulty levels.
  
  - The system supports searching by problem name, platform name, and category, allowing users to find specific problems quickly.

### Admin Features
- **Problem Management**: Admin users have the ability to:
  - **Add New Problems**: Add new Problem to the list.
  - **Edit Problems**: Modify the details of existing problems.
  - **Delete Problems**: Remove problems from the collection, ensuring the database remains up-to-date.

- **Tag Management**: Admins can manage tags associated with each problem, facilitating easier categorization and retrieval of problems.

- **Difficulty Level Management**: Admins can define and manage difficulty levels, allowing for a more structured approach to problem categorization.

## Technologies
This project utilizes the following technologies:

**Database Management System**
- [MS SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

**Client-Side**
- [Node.js](https://nodejs.org/en/)
- [React.js](https://react.dev/)

**Server-Side**
- [ASP.NET Core](https://dotnet.microsoft.com/en-us/apps/aspnet)

## Requirements

Before starting ensure you have the following installed:

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/)
- [React](https://react.dev/)
- [MS SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- [.NET SDK](https://dotnet.microsoft.com/en-us/download)

## Getting Started

Follow these steps to set up the project locally:

```bash
# Clone this project
git clone https://github.com/MohamedAbdelfattah022/Problemset-Collector

# Navigate into the project directory
cd Problemset-Collector

# Navigate into the Client directory
cd client

# Install client-side dependencies
npm install

# Run the client-side application
npm start
# The client will initialize at <http://localhost:3000>

# For server-side setup, navigate to the server directory and run:
cd Problemset-Collection-Server

dotnet run
# The server will initialize at <http://localhost:5293>
```

Made with ❤️ by <a href="https://github.com/MohamedAbdelfattah022" target="_blank">Mohamed Abdelfattah</a> 

<a href="#top">Back to top</a>