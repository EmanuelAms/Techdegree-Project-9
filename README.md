# Techdegree-Project-9
 My 9th Techdegree Project

This project is a REST API created with Express and Sequelize.
This back-end server app is completed with the Project 10 front-end client app, to make a full stack application.

The API gives acces to a school database with two tables : Users, and Courses.
The database is contained in the fsjstd-restapi.db file.

app.js is the main file of the application, which notably sets up the routes.
users.js and courses.js, in the models folder, set up the Users and Courses models.
users.js and courses.js, in the routes folder, set up various routes to allow some interaction with the Users and Courses models.
auth-user.js, in the middleware folder, sets up an authentification middleware to verify who is the user logged into the database.

The application is launched by typing "npm start" in the terminal.
The routes can be tested with the Postman application, via the RESTAPI.postman_collection.json file.
