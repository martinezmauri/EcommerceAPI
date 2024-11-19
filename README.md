# Ecommerce API - NestJS

Este proyecto es una API de Ecommerce desarrollada con **NestJS** y escrita en **TypeScript**. Su objetivo principal es proporcionar una plataforma backend robusta y segura para gestionar autenticación, compras, detalle de compra.
## Características

- **Autenticación y Autorización:**  
  Implementación de autenticación basada en roles mediante **JWT**, garantizando seguridad y control de accesos.  

- **Gestión de Usuarios y Productos:**  
  CRUD completo para usuarios, productos y órdenes, con validaciones robustas.  

- **Documentación Interactiva:**  
  Documentación de la API utilizando **Swagger**, facilitando la exploración de los endpoints.  

- **Almacenamiento de Imágenes:**  
  Integración con **Cloudinary** para gestionar imágenes de productos.  

- **Pruebas Exhaustivas:**  
  - Pruebas unitarias y de integración desarrolladas con **Jest**, garantizando la funcionalidad y estabilidad de los módulos.  
  - Pruebas End-to-End para verificar el flujo completo de la aplicación.  

- **Contenedorización y Despliegue:**  
  - Uso de **Docker** para la contenedorización.  
  - Despliegue continuo en **Render** utilizando **GitHub Actions**.  

- **Base de Datos:**  
  - Gestión de datos con **PostgreSQL** y **TypeORM**.  
  - Migraciones configuradas para manejo estructurado de datos.  

## Tecnologías Utilizadas

- **Framework:** NestJS  
- **Lenguaje:** TypeScript  
- **Base de Datos:** PostgreSQL  
- **ORM:** TypeORM  
- **Contenedorización:** Docker  
- **Pruebas:** Jest  
- **Despliegue:** Render  
- **Almacenamiento de Imágenes:** Cloudinary  
- **Documentación:** Swagger  

## Instalación y Uso

### Prerrequisitos
Asegúrate de tener instalados en tu sistema:  
- Node.js  
- Docker (opcional, para ejecutar con contenedores)  
- PostgreSQL  

### Pasos para la instalación

1. Clona este repositorio:  
   ```bash
   git clone https://github.com/martinezmauri/EcommerceAPI.git
   cd EcommerceAPI
2. Instala las dependecias necesarias:
   ```bash
   npm install
3. Configura las variables de entorno:
    ```bash
    DATABASE_URL=postgresql://user:password@localhost:5432/database
    JWT_SECRET=tu_secreto_jwt
    CLOUDINARY_CLOUD_NAME=tu_nombre_de_cloudinary
    CLOUDINARY_API_KEY=tu_api_key
    CLOUDINARY_API_SECRET=tu_api_secret
4. Inicia el servidor en modo desarrollo:
    ```bash
    npm run start:dev
