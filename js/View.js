export class View {
    constructor() {
        this.map = null;
        this.activeMeters = {}; // Diccionario para guardar el marcador, polilínea e historial de cada usuario
        
        this.btnStart = document.getElementById('btn-start');
        this.btnStop = document.getElementById('btn-stop');
        this.txtUsername = document.getElementById('txt-username');
        this.lblLat = document.getElementById('lbl-lat');
        this.lblLng = document.getElementById('lbl-lng');
        this.lblTime = document.getElementById('lbl-time');
        this.statusText = document.getElementById('status-text');

        this.inicializarMapa();
    }

    inicializarMapa() {
        const defaultLat = -0.1807; // Quito, Ecuador por defecto
        const defaultLng = -78.4678;

        this.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: defaultLat, lng: defaultLng },
            zoom: 15,
            mapTypeControl: false
        });
    }

    /**
     * Genera un color hexadecimal aleatorio pero consistente para cada usuario nuevo
     */
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

    /**
     * Actualiza o crea en el mapa el marcador y la ruta de CUALQUIER usuario conectado
     */
    actualizarDispositivoEnMapa(userData) {
        const { userId, latitude, longitude, timestamp } = userData;
        const nuevaPosicion = { lat: latitude, lng: longitude };

        // Si este usuario aún no existe en nuestro mapa, lo inicializamos
        if (!this.activeMeters[userId]) {
            const colorUser = this.obtenerColorUsuario(userId);

            // Crear Marcador con etiqueta de texto (Nombre del usuario visible en el mapa)
            const marker = new google.maps.Marker({
                position: nuevaPosicion,
                map: this.map,
                title: userId,
                label: {
                    text: userId,
                    color: "#000000",
                    fontWeight: "bold",
                    fontSize: "14px"
                },
                animation: google.maps.Animation.DROP
            });

            // Crear Historial y Polilínea independiente para este usuario
            const pathCoordinates = [nuevaPosicion];
            const polyline = new google.maps.Polyline({
                path: pathCoordinates,
                geodesic: true,
                strokeColor: colorUser,
                strokeOpacity: 1.0,
                strokeWeight: 4
            });
            polyline.setMap(this.map);

            this.activeMeters[userId] = {
                marker,
                polyline,
                pathCoordinates
            };
        } else {
            // Si ya existe, actualizamos su posición y añadimos el punto a su polilínea
            const dispositivo = this.activeMeters[userId];
            dispositivo.marker.setPosition(nuevaPosicion);
            
            dispositivo.pathCoordinates.push(nuevaPosicion);
            dispositivo.polyline.setPath(dispositivo.pathCoordinates);
        }
    }

    actualizarUIPropia(lat, lng, timestamp) {
        this.lblLat.textContent = lat.toFixed(6);
        this.lblLng.textContent = lng.toFixed(6);
        this.lblTime.textContent = new Date(timestamp).toLocaleTimeString();
    }

    centrarMapaEn(lat, lng) {
        this.map.panTo({ lat, lng });
    }

    cambiarEstado(conectado) {
        this.statusText.textContent = conectado ? "Transmitiendo / Sincronizado" : "Desconectado";
        this.statusText.style.color = conectado ? "#34a853" : "#ea4335";
        this.btnStart.disabled = conectado;
        this.btnStop.disabled = !conectado;
        this.txtUsername.disabled = conectado;
    }
}