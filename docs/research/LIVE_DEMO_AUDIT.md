# Live Demo Audit for SIH26011 Projects

## GeoLayer 3D
**URL**: https://anurag-26112007.github.io/GeoLayer-SIH-Prototype/
**Date Checked**: 2026-09-23

### What loads
The page loads a Mapbox 3D map with buildings, a panel for spatial data and ULPIN, an AI assistant chatbot, and a navbar.

### What is interactive
The map is interactive (click to select a building, mouseover to change cursor), the AI assistant chatbot (input field and button) is interactive, the search bar (geocoder) is interactive, the geolocate button is interactive.

### What can actually be changed
The user can click on a building to change the displayed spatial data and ULPIN (which are randomly generated). The user can interact with the AI assistant by asking questions, which generates responses based on the selected building's data (randomly generated). The user can search for locations via the geocoder. The user can use the geolocate button to center on their location.

### What data is real
The map data (building footprints, etc.) from Mapbox is real (based on OpenStreetMap). The Mapbox token is a real token (though it's exposed in the code, which is a security issue). The geocoder and geolocate are real Mapbox services.

### What data is seeded
The spatial data (X, Y, Z) and ULPIN are randomly generated when a building is clicked. The AI assistant's responses are based on the randomly generated data and are simulated (not real backend calls). The 'Land Registry record' etc. are hardcoded strings with random elements.

### What the 3D viewer really represents
The 3D viewer shows building extrusions from Mapbox's vector tiles (based on OpenStreetMap data) with random heights assigned per click (not actual building heights). It represents a 3D map of buildings in the selected area (default Lucknow).

### What happens when invalid data is entered
There's no form for invalid data entry except the AI assistant input. If the user asks a question without selecting a building, the AI responds asking to select a building. If they ask about owner, tax, dispute, etc., they get hardcoded responses. If they ask other questions, they get a random response (simulated DILRMP authentication status). There's no validation of input beyond checking if it's empty.

### Whether identifiers are dynamic or hardcoded
The ULPIN is dynamically generated (random) on each building click. The spatial data is dynamic (based on click location and random floor count). The AI assistant's responses are dynamic based on the currentUlpin and currentSpatialData (which are dynamic) but the logic is hardcoded.

### Whether the backend really exists
There is no backend; all logic is in the frontend (JavaScript). The AI assistant is simulated with setTimeout and random responses. No API calls are made to a backend; the only external calls are to Mapbox (for tiles, geocoding, geolocation) and Google Fonts.

### Whether API calls are real
The API calls to Mapbox (for tiles, geocoder, geolocate) are real. The AI assistant does not make any API calls; it's entirely simulated.

### Whether the site is merely frontend/static
The site is frontend-only (static HTML, CSS, JS) with no backend. It is hosted on GitHub Pages, which is static hosting.

## BoundaryLens
**URL**: Not publicly available (no live demo found)
**Date Checked**: 2026-09-23

### Note
The project repository exists at https://github.com/NeelakshSaxena/BoundaryLens but does not host a live demo; instructions are for local execution only.

## Other SIH26011 Projects Searched
During research, the following SIH26011 projects were examined but no publicly accessible live demos were found:
- https://github.com/xarjunpatil/SIH26011-3D-ULPIN-Generation-and-vertical-Property-Mapping-SYSTEM (local demo only)
- https://github.com/jagadeesh-9/SIH26011-3D-ULPIN (local demo only)
- Platforms like sihbuddy.in, sih-2026-explorer-pearl.vercel.app, sih-fit.vercel.app list problem statements but do not host team live demos.
