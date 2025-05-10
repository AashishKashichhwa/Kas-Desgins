// src/services/notificationService.js

import { get } from './ApiEndpoint'; // Import the get function from ApiEndpoint.js

// Function to fetch notifications based on user ID
export const getNotifications = async (userId) => {  // Removed userId parameter

    try {
        // Call the get function with the appropriate URL
        const response = await get(`/api/notifications`);
        return response; // Return the response from the API
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error; // Re-throw the error for handling in the component
    }
};