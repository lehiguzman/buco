// Archivo de Configuración del Ambiente Pre-Producción
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
    env: 'preprod',
    debugMode: false,
    secretKey: 'dj77mi7o43dt8qjqmc3mxp3cwgcwbx1t'
};

// Configuración de Firebase
export const firebaseConfig = {
    apiKey: 'AIzaSyAHdsiqnapD9odx9vynJaeePHV_wwuFXf8',
    authDomain: 'app-buco.firebaseapp.com',
    databaseURL: 'https://app-buco.firebaseio.com',
    projectId: 'app-buco',
    storageBucket: 'app-buco.appspot.com',
    messagingSenderId: '623556925361',
    appId: '1:623556925361:web:6784b3690c7ef5dcb4cf90'
};

// Configuración de Application Insights
export const applicationInsightsConfig = {
    instrumentationKey: 'f472eb3a-c207-472b-ad98-02b747d7721f'
};

export const environment = {
    production: true
};
