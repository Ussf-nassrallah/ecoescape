# EcoescapeAPI

EcoescapeAPI is an API for managing eco-friendly tours and user accounts. It provides endpoints for tour management, user authentication, and user profile management.

## Who can use EcoescapeAPI?

EcoescapeAPI is designed for businesses and organizations in the travel and tourism industry who want to promote eco-friendly tours and experiences. It's also suitable for developers looking to integrate tour management and user authentication features into their applications.

## Features:

- **Tour Management:** Create, update, and delete eco-friendly tours.
- **User Authentication:** Register, log in, and manage user accounts securely.
- **User Profile Management:** Update user profiles and passwords.
- **Tour Analytics:** Retrieve statistics and analytics for tours.
- **Monthly Plan:** Plan tours for different months of the year.

## Tour Endpoints:

1. **GET /tours**
   - **Description:** Retrieve all tours.
   - **Parameters:** Pagination, sorting, filtering.
   - **Authorization:** Required.

2. **POST /tours**
   - **Description:** Create a new tour.
   - **Authorization:** Only accessible for admin and lead guides.

3. **GET /tours/{id}**
   - **Description:** Retrieve a specific tour by ID.
   - **Authorization:** Required.

4. **PATCH /tours/{id}**
   - **Description:** Update details of a tour.
   - **Authorization:** Only accessible for admin and lead guides.

5. **DELETE /tours/{id}**
   - **Description:** Delete a tour.
   - **Authorization:** Only accessible for admin and lead guides.

6. **GET /tours/top-5-cheap**
   - **Description:** Retrieve the top five cheapest tours.
   - **Authorization:** Required.

7. **GET /tours/tour-stats**
   - **Description:** Retrieve statistics and analytics for tours.
   - **Authorization:** Required.

8. **GET /tours/monthly-plan/{year}**
   - **Description:** Retrieve the monthly plan for tours in a specified year.
   - **Authorization:** Required.

## Authentication Endpoints:

1. **POST /users/signup**
   - **Description:** Register a new user.

2. **POST /users/login**
   - **Description:** Log in an existing user.

## User Endpoints:

1. **GET /users**
   - **Description:** Retrieve all users.
   - **Authorization:** Required.

2. **GET /users/me**
   - **Description:** Retrieve details of the current user.
   - **Authorization:** Required.

3. **PATCH /users/updateMe**
   - **Description:** Update current user's data (name and email).
   - **Authorization:** Required.

4. **PATCH /users/updateMyPassword**
   - **Description:** Update current user's password.
   - **Authorization:** Required.

5. **PATCH /users/forgotPassword**
   - **Description:** Send a reset token to the user's email for password recovery.

6. **PATCH /users/resetPassword/{token}**
   - **Description:** Reset a user's password using the token received through the forgot password process.

7. **DELETE /users/deleteMe**
   - **Description:** Delete the current user's account.
   - **Authorization:** Required.
