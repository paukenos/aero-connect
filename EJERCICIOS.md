## Ejercicio 1 — Componentes y pipes

`SearchResultsComponent` concentra demasiada responsabilidad. Refactorízalo.

Parte de esa refactorización implica crear un componente que pueda reutilizarse en otros contextos de la aplicación. Ese componente vive en `shared/` y no depende de ningún servicio.

Revisa también cómo se transforma la información en los templates y aplica las abstracciones de Angular que correspondan.

- Separar los distintos componentes y mirar los output y los inputs
---

## Ejercicio 2 — Estado con Signals y RxJS 

Implementa `FlightSearchService` y úsalo en `SearchResultsComponent`.

El servicio debe gestionar el estado de la búsqueda y exponer los datos a los componentes mediante signals. La búsqueda de vuelos debe resolverse de forma reactiva, y el servicio debe ser capaz de cargar recursos en paralelo cuando sea necesario.

---

## Ejercicio 3 — Formularios reactivos 

El formulario de `BookingComponent` es un formulario HTML nativo. Conviértelo a Reactive Forms.

El formulario debe validar los datos correctamente, incluyendo al menos un validador personalizado. Reacciona a los cambios del formulario donde tenga sentido mostrárselo al usuario.

---

## Ejercicio 4 — Guard e Interceptor 

La aplicación no protege sus rutas ni autentica sus peticiones a la API.

Implementa los dos ficheros que encontrarás en `core/` e intégralos en el routing y la configuración de la aplicación. Consulta el código de `AuthService` y la configuracion de stubby para entender cómo funciona la autenticación.

---

## Ejercicio 5 — Tipos 

Los componentes de vista consumen directamente los modelos de la API, exponiendo propiedades que no son relevantes para la presentación.

Crea los tipos adecuados en `features/search-results/flight.dto.ts` y úsalos donde corresponda.

---

## Bonus

Hay aspectos de la aplicación que funcionan de forma incompleta y cuya mejora suma puntos adicionales. Explora el código.

---

