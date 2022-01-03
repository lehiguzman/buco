# Proyecto Aplicación Movil para Usuarios de la Plataforma Buco

## Descripción Breve del Proyecto

### [Proyecto desarrollado en Ionic 4](https://ionicframework.com/docs)

- [Ionic Instalación](https://ionicframework.com/docs/installation/cli)
- [Ionic Componentes](https://ionicframework.com/docs/component/)
- [Ionic API](https://ionicframework.com/docs/api)
- [Ionic Native](https://ionicframework.com/docs/native)
- [Ionic Iconos](https://ionicframework.com/docs/ionicons)
- [Ionic Temas](https://ionicframework.com/docs/theming/basics)
- [Ionic CLI](https://ionicframework.com/docs/cli/)

### Instalación y Configuración en Ambiente Local

Tome en cuenta que aunque el proyecto esta en Ionic no es necesario instalarlo globalmente. Todas las dependencias de este proyecto deben estar instaladas localmente en el proyecto.

### Dependencias

- Git
  - [Linux](https://gist.github.com/derhuerst/1b15ff4652a867391f03#file-linux-md)
  - [Windows](https://gist.github.com/derhuerst/1b15ff4652a867391f03#file-windows-md)

- NodeJS.
  - [Linux](https://github.com/nodesource/distributions)
  - [Windows](https://nodejs.org/en/)

### Configuracin del ambiente local

Se debe crear en la computadora una llave SSH usando la siguiente documentación: [SSH Doc GitLab](https://docs.gitlab.com/ce/ssh/README.html)

## Instanciación

- Clonar el proyecto. Ejecutar `git clone git@gitlab.com:strapptech/buco/app-buco.git buco-app`.
Este paso creará una carpeta llamada "**buco-app**" dentro del directorio donde se ejecutó el comando con el código fuente perteneciente al proyecto.
- Posteriormente se deben instalar las dependencias con el comando `npm install -d`.

### Ejecución

- Desde la carpeta inicial del proyecto "**buco-app**", ejecute el siguiente comando: `npm start`.

Este comando ejecutará la aplicación en ambiente de desarrollo y permitirá que los cambios se encuentren disponibles en la aplicación apenas se realice un cambio en el código fuente. Esto abrirá una ventana en el navegador.

### Tareas (script en package.josn)

El proyecto contiene tareas, se encuentran disponibles como scripts de npm, descritos en el archivo package.json. Las tareas principales son las siguientes:

- `npm run start:prod`: Ejecuta el proyecto en ambiente de producción.
- `npm run start:cert`: Ejecuta el proyecto en ambiente de certificación.
- `npm start`: Ejecuta el proyecto en ambiente de desarrollo.

Las siguientes tareas son complementarias y no se ejecutan de forma individual; `npm run`:

- `remove:files`: Elimina los archivos de configuración generales del proyecto.
- `files:{dev,cert,prod}`: Copia la configuración del ambiente respectivo.
- `desarrollar:{dev,cert,prod}`: Elimina, copia y ejecuta el proyecto en ambiente respectivo.

Las siguientes tareas si deben ser ejecutadas de forma individual; `npm run`:

- `actualizar:dependencias`: Elimina *node_module/*, *plugins/* y *package-look.json*.
- `simulador:ios:{dev,cert,prod}`: Remueve las plataformas actuales, configura el proyecto y genera la plataforma en el ambiente respectivo.
- `canal:{dev,cert,prod}`: Instala el plugin **cordova-plugin-ionic** con la configuración del ambiente respectivo.
- `construir:web-{dev,cert,prod}`: Genera la configuración del ambiente respectivo.

### Ejecución. Comandos Ionic y Cordova

Para ejecutar los comando de Ionic o Cordova tenga en cuenta que el proyecto esta empaquetado. La forma de ejecución es `node_modules/.bin/ionic`, `node_modules/.bin/cordova` o `node_modules/.bin/ionic cordova`.

### Generar plataformas Android/iOS

Si ejecuta el proyecto por primeras vez y no tiene las plataformas Android/iOS en su proyecto ejecute el comando `node_modules/.bin/ionic cordova prepare`, de esta forma se construiran los proyectos Android/iOS para que pueda emularlos o compilarlos.

### Entrega Contínua (CI/CD)

Este proyecto utiliza [GitLab CI](https://about.gitlab.com/product/continuous-integration/) para integrar el proceso de entrega contínua en los ambientes de desarrollo, certificación y producción; en el archivo `.gitlab-ci.yml` se encuentra definido el proceso y la documentación de la estructura puede encontrarse en [Docs Gitlab-CI](https://docs.gitlab.com/ee/ci/).
