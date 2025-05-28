# Workiva Assessment – ProductApp

This repository contains **ProductApp**, a single-page application developed using Angular. The project was created as part of a technical assessment for Workiva, focusing on building a responsive and maintainable web application.

## 🚀 Features

* **Angular Framework**: Built with Angular CLI version 19.2.13, leveraging modern web development practices.
* **Component-Based Architecture**: Utilizes Angular's component system for modularity and reusability.
* **Responsive Design**: Ensures compatibility across various devices and screen sizes.
* **Live Reloading**: Supports automatic browser reloading during development for efficient testing.

## 📁 Project Structure

```

├── src/
│   ├── app/
│   │   ├── components/       # Reusable UI components
│   │   ├── services/         # Application services
│   │   ├── models/           # TypeScript interfaces and models
│   │   └── app.module.ts     # Root module definition
├── public/                   # Static assets
├── .vscode/                  # VSCode workspace settings
├── angular.json              # Angular CLI configuration
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript compiler configuration
└── README.md                 # Project documentation
```



## 🛠️ Getting Started

### Prerequisites

Ensure you have the following installed:

* **Node.js** (v16 or higher)
* **npm** (v8 or higher)
* **Angular CLI** (v19.2.13)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Bhavanish19/Workiva-assessment.git
   cd Workiva-assessment
   ```



2. **Install dependencies**:

   ```bash
   npm install
   ```



### Running the Application

Start the development server:

```bash
ng serve
```



Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you make changes to the source files.

## 🧪 Testing

To execute unit tests via [Karma](https://karma-runner.github.io):

```bash
ng test
```



## 📦 Building for Production

To build the project for production:

```bash
ng build --prod
```



The compiled files will be located in the `dist/` directory.


## 🙌 Acknowledgements

Developed by [Bhavanish19](https://github.com/Bhavanish19) as part of a technical assessment for Workiva.

---

Feel free to customize this README further to align with any additional features or specific requirements of your project.
