
# GitHub Secrets — Resumen

Este documento indica, de forma breve y no técnica, las piezas de configuración necesarias para que la integración continua y el despliegue funcionen en este repositorio.

Environments
- production: variables y secretos relacionados con el entorno de producción.
- develop (opcional): valores para staging o pruebas.

Variables clave (GitHub Environments)
- `SSH_USER`: usuario SSH del servidor.
- `SSH_HOST`: dirección del servidor.
- `SERVICE_DOMAIN`: dominio público de la aplicación.

Secrets esenciales
- `DOPPLER_SERVICE_TOKEN`: credencial para obtener variables de configuración centralizadas.
- `SSH_PRIVATE_KEY`: llave privada para despliegues.
- `GITHUB_TOKEN` (acciones): token que utiliza GitHub Actions para operaciones autorizadas.

Doppler
- Se recomienda gestionar las credenciales de la aplicación (base de datos, redis, claves secretas) desde una herramienta de secretos como Doppler.

Buenas prácticas de protección de ramas
- Requerir Pull Requests y checks de CI antes de mergear.
- Exigir revisiones y mantener las ramas actualizadas con la rama protegida.

Notas
- No comprometer secretos ni credenciales en el repositorio. Mantener permisos y accesos restringidos.
- Esta guía es informativa; los detalles operativos y los comandos específicos deben gestionarse fuera del código fuente.
