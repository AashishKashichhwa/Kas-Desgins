import { configureStore } from '@reduxjs/toolkit';
import AuthSlice from './AuthSlice';
import notificationsReducer from './notificationsSlice'; // Import the notifications slice
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

// Config for persisting the Auth slice
const authPersistConfig = {
  key: 'auth',
  storage,
};

// Config for persisting the notifications slice
const notificationsPersistConfig = {
  key: 'notifications',
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, AuthSlice);
const persistedNotificationsReducer = persistReducer(notificationsPersistConfig, notificationsReducer);

export const store = configureStore({
  reducer: {
    Auth: persistedAuthReducer,
    notifications: persistedNotificationsReducer, // Persist notifications state as well
  },
});

export const persistor = persistStore(store);
