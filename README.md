# Tracker GPS multiusuario

Aplicación web estática que muestra en Google Maps las ubicaciones compartidas mediante Firebase Realtime Database.

## Publicación

El sitio se sirve desde la raíz de la rama `main` en GitHub Pages. La geolocalización del navegador requiere HTTPS y permiso explícito del usuario.

## Configuración y privacidad

- Restringe la clave de Google Maps a los dominios donde publiques el sitio y limita las APIs habilitadas.
- Configura las reglas de Firebase Realtime Database para autorizar únicamente a usuarios que deban leer y escribir ubicaciones. La aplicación no implementa autenticación.
- Las claves y la configuración incluidas en una aplicación web son visibles para cualquier visitante; no las uses como mecanismo de autorización.
- No transmitas ubicaciones reales hasta haber verificado las restricciones y reglas de acceso.
