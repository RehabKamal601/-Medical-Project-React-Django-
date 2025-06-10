# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# 🏥 Medical Appointment System

A full-stack web application for managing medical appointments with role-based access for Admins, Doctors, and Patients.


# Medical App Frontend
# Project Structure
```bash
medical-app-frontend/
│
├── public/
├── src/
│   ├── assets/              # Images, logos, etc.
│   ├── components/          # Shared/common UI components
│   │   ├── Button.jsx
│   │   └── DoctorCard.jsx
│   ├── features/            # Feature-based folder structure
│   │   ├── auth/            # Login, register, logout
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── authSlice.js
│   │   │   └── authAPI.js
│   │   ├── appointments/    # Booking & managing appointments
│   │   ├── doctors/         # Doctor list, profile, availability
│   │   ├── patients/        # Patient profile & actions
│   │   ├── admin/           # Admin dashboards
│   │   └── notifications/   # Emails or UI notifications
│   ├── pages/               # Route-level components
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx
│   │   ├── DoctorProfile.jsx
│   │   └── NotFound.jsx
│   ├── routes/              # Route definitions + Role-based routing
│   │   └── ProtectedRoutes.jsx
│   ├── services/            # Axios instances, API base config
│   │   └── api.js
│   ├── store/               # Redux Toolkit slices, store config
│   │   ├── store.js
│   │   └── slices/
│   ├── utils/               # Helper functions, validators
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env                    # REACT_APP_API_URL etc.
├── package.json
└── README.md

# Medical App Frontend