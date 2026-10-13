import { Model } from './Model.js';
import { View } from './View.js';

class Controller {
    constructor() {
        this.model = new Model();
        this.view = new View();
        this.watchId = null;

        this.initListeners();
        this.iniciarEscuchaGlobal();
    }

    initListeners() {
        this.view.btnStart.addEventListener('click', () => this.iniciarGPS());
        this.view.btnStop.addEventListener('click', () => this.detenerGPS());
    }

    iniciarGPS() {
        const userId = this.view.txtUsername.value.trim();
        if (!userId) {
            alert("Por favor ingresa un nombre de usuario válido.");
            return;
        }

        if (!navigator.geolocation) {
            alert("Tu navegador no soporta geolocalización.");
            return;
        }

        this.view.cambiarEstado(true);

        const opciones = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        // Captura GPS en tiempo real
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // Enviar la posición a Firebase asociada a ESTE usuario
                this.model.actualizarUbicacionFirebase(userId, lat, lng);
                
                // Actualizar textos informativos locales
                this.view.actualizarUIPropia(lat, lng, position.timestamp);
            },
            (error) => {
                console.error("Error de GPS:", error);
                alert("No se pudo obtener la ubicación GPS. Verifica los permisos.");
                this.detenerGPS();
            },
            opciones
        );
    }

    detenerGPS() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
        this.view.cambiarEstado(false);
    }

    iniciarEscuchaGlobal() {
        // Escucha en tiempo real todos los dispositivos conectados en Firebase
        this.model.suscribirseATodosLosDispositivos((devicesData) => {
            const currentUser = this.view.txtUsername.value.trim();

            // Iterar sobre cada usuario registrado en la base de datos
            Object.keys(devicesData).forEach((userId) => {
                const userData = devicesData[userId];
                
                // Pintar o actualizar su marcador y su recorrido en el mapa
                this.view.actualizarDispositivoEnMapa(userData);

                // Si soy yo el que se está moviendo, centrar el mapa automáticamente en mi posición
                if (userId === currentUser && this.watchId !== null) {
                    this.view.centrarMapaEn(userData.latitude, userData.longitude);
                }
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',пель => {
    new Controller();
});