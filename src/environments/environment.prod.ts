// Archivo de Configuración del Ambiente Producción
export const Config = {
    urlDominioAPI: {
        urlBase: 'https://apibuco.strappinc.net',
        apiVersion: '/api/v1'
    },
    urlDominioPanel: {
        urlBase: 'https://panelbuco.strappinc.net',
        uploads: '/uploads'
    },
    loginGenerico: {
        username: 'apiinterno',
        password: 'API$123Interno'
    },
    env: 'prod',
    debugMode: false,
    secretKey: 'dj77mi7o43dt8qjqmc3mxp3cwgcwbx1t'
};

// Configuración de Firebase
export const firebaseConfig = {
    apiKey: 'AIzaSyBN3UcKoKIymOhyrawIrO3ONAmbMquAAa0',
    authDomain: 'appbuco-prod.firebaseapp.com',
    databaseURL: 'https://appbuco-prod.firebaseio.com',
    projectId: 'appbuco-prod',
    storageBucket: 'appbuco-prod.appspot.com',
    messagingSenderId: '876852923539',
    appId: '1:876852923539:web:5e67f0a3cf4104a21bd166',
    measurementId: 'G-DT20B6L8JS'
};

// Configuración de Application Insights
export const applicationInsightsConfig = {
    instrumentationKey: 'f472eb3a-c207-472b-ad98-02b747d7721f'
};

export const environment = {
    production: true
};
