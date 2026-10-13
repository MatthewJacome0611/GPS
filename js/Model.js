import { db, ref, set, onValue } from './Firebase-config.js';

export class Model {
    constructor() {
        this.devicesRef = ref(db, 'devices');
    }

    // Usado por el Emisor para actualizar su posición
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

    // Usado por el Monitor/Jefe para escuchar a toda la flota
    suscribirseATodosLosDispositivos(callback) {
        onValue(this.devicesRef, (snapshot) => {
            const data = snapshot.val();
            callback(data || {});
        });
    }
}