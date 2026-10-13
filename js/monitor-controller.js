import { Model } from './Model.js';

class MonitorController {
    constructor() {
        this.model = new Model();
        this.map = null;
        this.activeMeters = {}; // Almacena marcadores, polilíneas y rutas por usuario

        this.inicializarMapa();
        this.iniciarMonitoreoGlobal();
    }

    inicializarMapa() {
        const defaultLat = -0.1807;
        const defaultLng = -78.4678;

        this.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: defaultLat, lng: defaultLng },
            zoom: 14,
            mapTypeControl: true
        });
    }

    obtenerColorUsuario(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            let value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    }

    iniciarMonitoreoGlobal() {
        this.model.suscribirseATodosLosDispositivos((devicesData) => {
            const fleetListContainer = document.getElementById('fleet-list');
            fleetListContainer.innerHTML = ''; // Limpiar lista lateral

            Object.keys(devicesData).forEach((userId) => {
                const userData = devicesData[userId];
                if (!userData || !Number.isFinite(userData.latitude) || !Number.isFinite(userData.longitude)) {
                    console.warn(`Se omite una ubicación inválida para ${userId}.`);
                    return;
                }

                const nuevaPosicion = { lat: userData.latitude, lng: userData.longitude };

                // 1. Renderizar tarjeta en el panel lateral del jefe
                const card = document.createElement('div');
                card.style.cssText = "background: #f8f9fa; padding: 10px; border-radius: 6px; border-left: 4px solid " + this.obtenerColorUsuario(userId) + "; font-size: 0.9rem;";
                const name = document.createElement('strong');
                name.textContent = `🚗 ${userId}`;
                const coordinates = document.createElement('span');
                coordinates.style.cssText = 'font-size: 0.8rem; color: #555;';
                coordinates.textContent = `Lat: ${userData.latitude.toFixed(4)}, Lng: ${userData.longitude.toFixed(4)}`;
                card.append(name, document.createElement('br'), coordinates);
                fleetListContainer.appendChild(card);

                // 2. Actualizar o crear marcador y polilínea en el mapa de Google Maps
                if (!this.activeMeters[userId]) {
                    const colorUser = this.obtenerColorUsuario(userId);

                    const marker = new google.maps.Marker({
                        position: nuevaPosicion,
                        map: this.map,
                        title: userId,
                        label: { text: userId, color: "#000", fontWeight: "bold", fontSize: "13px" },
                        animation: google.maps.Animation.DROP
                    });

                    const pathCoordinates = [nuevaPosicion];
                    const polyline = new google.maps.Polyline({
                        path: pathCoordinates,
                        geodesic: true,
                        strokeColor: colorUser,
                        strokeOpacity: 1.0,
                        strokeWeight: 4
                    });
                    polyline.setMap(this.map);

                    this.activeMeters[userId] = { marker, polyline, pathCoordinates };
                } else {
                    const dispositivo = this.activeMeters[userId];
                    dispositivo.marker.setPosition(nuevaPosicion);
                    dispositivo.pathCoordinates.push(nuevaPosicion);
                    dispositivo.polyline.setPath(dispositivo.pathCoordinates);
                }
            });
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new MonitorController();
});