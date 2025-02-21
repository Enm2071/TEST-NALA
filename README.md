# Instrucciones para Ejecutar el Proyecto

Copia y pega el siguiente script en tu terminal para ejecutar el Frontend y el Backend de forma conjunta:

```bash
#!/bin/bash

# --- Ejecutar Frontend ---
echo "Iniciando el Frontend..."
(cd test_nala && npm install && npm run dev) &

# Espera unos segundos para que el Frontend se inicie

# --- Ejecutar Backend ---
echo "Iniciando el Backend..."
cd test_nala_be
npm install
npm run start:app

Importante: Ten en cuenta que npm run start:app reinicia la base de datos. Si ya has corrido la aplicación y deseas detenerla y ejecutarla nuevamente sin reiniciar la base de datos, utiliza npm run start:app_not_seeded.

Nota: Asegúrate de tener Docker en ejecución y configurado correctamente antes de ejecutar el script para el Backend.