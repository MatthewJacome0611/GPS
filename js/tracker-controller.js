import { Model } from './Model.js';

class TrackerController {
    constructor() {
        this.model = new Model();
        this.watchId = null;

        this.btnStart = document.getElementById('btn-start');
        this.btnStop = document.getElementById('btn-stop');
        this.txtUsername = document.getElementById('txt-username');
        this.lblLat = document.getElementById('lbl-lat');
        this.lblLng = document.getElementById('lbl-lng');
        this.lblTime = document.getElementById('lbl-time');
        this.statusText = document.getElementById('status-text');

        this.initListeners();
    }

    initListeners() {
        this.btnStart.addEventListener('click', () => this.iniciarGPS());
        this.btnStop.addEventListener('click', () => this.detenerGPS());
    }

    iniciarGPS() {
        const userId = this.txtUsername.value.trim();
        if (!userId) {
            alert("Ingresa un nombre de usuario válido.");
            return;
        }

        if (!navigator.geolocation) {
            alert("Tu navegador no soporta geolocalización.");
            return;
        }

        this.cambiarEstado(true);

        const opciones = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        // Captura GPS cada 1000ms o cambio de posición en tiempo real
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const timestamp = position.timestamp;

                // Enviar a Firebase
                this.model.actualizarUbicacionFirebase(userId, lat, lng);

                // Actualizar interfaz visual del emisor
                this.lblLat.textContent = lat.toFixed(6);
                this.lblLng.textContent = lng.toFixed(6);
                this.lblTime.textContent = new Date(timestamp).toLocaleTimeString();
            },
            (error) => {
                console.error("Error de GPS:", error);
                alert("No se pudo obtener la ubicación GPS.");
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
        this.cambiarEstado(false);
    }

    cambiarEstado(conectado) {
        this.statusText.textContent = conectado ? "Transmitiendo GPS..." : "Desconectado";
        this.statusText.style.color = conectado ? "#34a853" : "#ea4335";
        this.btnStart.disabled = conectado;
        this.btnStop.disabled = !conectado;
        this.txtUsername.disabled = conectado;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new TrackerController();
});