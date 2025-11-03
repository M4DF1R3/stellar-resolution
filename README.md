# Stellar Resolution

<p>
  Stellar Resolution is an online web application that brings the wonders of deep space exploration to everyone. Designed to make gigapixel and terapixel astronomical images easily explorable, the platform allows users to seamlessly zoom in and out of massive space imagery, revealing intricate cosmic structures and celestial phenomena directly from their browsers. With AI-driven insights, collaborative labeling, and guided story modes, Stellar Resolution transforms space exploration into an interactive, educational, and visually captivating experience.
</p>

<a>https://stellar-resolution.photo/</a>

---

## Key Features
- **Deep Space Exploration**: Seamlessly zoom into gigapixel astronomical images using OpenSeadragon and ArcGIS.
- **AI Vision Assistant**: Receive real-time insights about galaxies, nebulae, and other celestial structures.
- **User Labelling**: Authenticated users can contribute new feature labels and discoveries.
- **Shared Knowledge Base**: Approved community submissions enrich a global, synchronized dataset.
- **Story Mode**: Follow guided narratives that connect discoveries to scientific and historical contexts.
- **Responsive Frontend**: Built with modern web technologies for smooth, immersive interaction.

---

## Technologies Used
- **Frontend**: React, Vite, OpenSeadragon, ArcGIS  
- **Backend**: Node.js, Express.js  
- **Database**: Firebase, AWS (for user data, annotations, and metadata), Machine Vision Model
- **AI & APIs**: NASA/ESA datasets, AI Vision Model, language model integration for guided insights


## Running the Frontend

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
1. Navigate to the front directory:
```sh
cd front
```
2. Install the dependencies:

```sh
npm install
```

### Development Server

To start the development server, run:
```sh
npm run dev
```

This will start the Vite development server and you can access the application at ```http://localhost:3000```.

### Building for Production
To build the project for production, run:

```sh
npm run build
```

The production-ready files will be generated in the build directory.

### Deployment
To deploy the frontend, run:

```sh
npm run deploy
```

This will build the project and deploy it using Firebase.

### Environment Variables
Make sure to set up the following environment variables in the ```.env``` file for both backend and frontend:

* ```GOOGLE_CREDENTIALS```: Firebase admin credentials.