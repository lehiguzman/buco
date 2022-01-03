// Archivo de Configuración del Ambiente Certificación
export const Config = {
    urlDominioAPI: {
        urlBase: 'https://apibuco-cert.strappinc.net',
        apiVersion: '/api/v1'
    },
    urlDominioPanel: {
        urlBase: 'https://panelbuco-cert.strappinc.net',
        uploads: '/uploads'
    },
    loginGenerico: {
        username: 'apiinterno',
        password: 'API$123Interno'
    },
    env: 'cert',
    debugMode: true,
    secretKey: 'dj77mi7o43dt8qjqmc3mxp3cwgcwbx1t'
};

// Configuración de Firebase
export const firebaseConfig = {
    apiKey: 'AIzaSyC_GYQDJZ4NCda7p8w_8gOhbYNwrb3aR_0',
    authDomain: 'appbuco-cert.firebaseapp.com',
    databaseURL: 'https://appbuco-cert.firebaseio.com',
    projectId: 'appbuco-cert',
    storageBucket: 'appbuco-cert.appspot.com',
    messagingSenderId: '355270419307',
    appId: '1:355270419307:web:a56f7bc32f57d34528a22e',
    measurementId: 'G-SP135YRDT9'
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
