import { db, ref, set, onValue } from './Firebase-config.js';

export class Model {
    constructor() {
        this.devicesRef = ref(db, 'devices');
    }

    /**
     * Envía la ubicación actual a Firebase bajo el ID del usuario específico
     */
    async actualizarUbicacionFirebase(userId, lat, lng) {
        try {
            const userDeviceRef = ref(db, `devices/${userId}`);
            await set(userDeviceRef, {
                userId: userId,
                latitude: lat,
                longitude: lng,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error("Error al guardar en Firebase:", error);
        }
    }

    /**
     * Escucha en tiempo real a TODOS los dispositivos conectados en Firebase
     */
    suscribirseATodosLosDispositivos(callback) {
        onValue(this.devicesRef, (snapshot) => {
            const data = snapshot.val();
            // data será un objeto con todos los usuarios: { "Juan": {lat, lng...}, "Maria": {lat, lng...} }
            callback(data || {});
        });
    }
}