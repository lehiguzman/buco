// Archivo de Configuración del Ambiente Desarrollo
export const Config = {
    urlDominioAPI: {
        urlBase: 'https://apibuco-dev.strappinc.net',
        apiVersion: '/api/v1'
    },
    urlDominioPanel: {
        urlBase: 'https://panelbuco-dev.strappinc.net',
        uploads: '/uploads'
    },
    loginGenerico: {
        username: 'apiinterno',
        password: 'API$123Interno'
    },
    env: 'dev',
    debugMode: true,
    secretKey: 'dj77mi7o43dt8qjqmc3mxp3cwgcwbx1t'
};

// Configuración de Firebase
export const firebaseConfig = {
    apiKey: 'AIzaSyAyXIFMMcI0eNBZw-9vk-uQt2Cpi443QwM',
    authDomain: 'appbuco-dev.firebaseapp.com',
    databaseURL: 'https://appbuco-dev.firebaseio.com',
    projectId: 'appbuco-dev',
    storageBucket: 'appbuco-dev.appspot.com',
    messagingSenderId: '1084149110291',
    appId: '1:1084149110291:web:fb7dbe833c1dae3c1391e6',
    measurementId: 'G-C0X26SFX35'
};

// Configuración de Application Insights
export const applicationInsightsConfig = {
    instrumentationKey: 'f472eb3a-c207-472b-ad98-02b747d7721f'
};

export const environment = {
    production: false
};

import 'zone.js/dist/zone';
import 'zone.js/dist/zone-error';
