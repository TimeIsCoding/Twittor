
// Utilerías para el Service Worker
importScripts("./js/sw-utils.js");

// Nombre de los caches
const STATIC_CACHE = "static-v3";
const DYNAMIC_CACHE = "dynamic-v1";
const INMUTABLE_CACHE = "inmutable-v1";

// Cache estático - App Shell - Todo lo "fijo" hecho por el desarrollador
const APP_SHELL = [
	"./",
	"./index.html",
	"./css/style.css",
	"./img/favicon.ico",
	"./img/avatars/hulk.jpg",
	"./img/avatars/ironman.jpg",
	"./img/avatars/spiderman.jpg",
	"./img/avatars/thor.jpg",
	"./img/avatars/wolverine.jpg",
	"./js/app.js",
	"./js/sw-utils.js"
];

// Cache inmutable - Todo lo "fijo" hecho por terceros
const APP_SHELL_INMUTABLE = [
	"https://fonts.googleapis.com/css?family=Quicksand:300,400",
	"https://fonts.googleapis.com/css?family=Lato:400,300",
	"https://use.fontawesome.com/releases/v5.3.1/css/all.css",
	"./css/animate.css",
	"./js/libs/jquery.js"
];



// Durante la instalación del Service Worker...
self.addEventListener("install", e => {

	// Creación de los caches
	const cacheStatic = caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL));
	const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => cache.addAll(APP_SHELL_INMUTABLE));

	// Aqui podríamos incluir el Skip Waiting, pero el autor decidió manejarlo desde las Dev Tools de Chrome

	// ... Y entonces...
	e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

});



// Durante la activación del Service Worker...
self.addEventListener("activate", e=> {

	// Borrado de los caches estáticos obsoletos.
	const response = caches.keys().then(keys => {

		// Borrado de los caches cuyo nombre no coincida con el valor de la constante CACHE_STATIC y contengan el string "static"
		keys.forEach(key => {
			if (key !== STATIC_CACHE && key.includes("static")) {
				return caches.delete(key);
			}
		});

	});

	// ... Y entonces...
	e.waitUntil(response);

});



// Estrategia para el cache
self.addEventListener("fetch", e => {

	// Estrategia - Cache with Network Fallback
	const response = caches.match(e.request).then(resp => {
		if (resp) {
			return resp;
		} else {

			// Si se llega a este punto es porque, por ejemplo, las peticiones a las fuentes de Google son una referencia a una dirección que es la que hace la petición final al servidor correspondiente. Lo que debemos hacer es almacenar en el caché dinámico (no definido al momento de escribir esta línea de comentario) las direcciones reportadas por las referencias mencionadas
			return fetch(e.request).then(resp2 => {
				return actualizarCacheDinamico(DYNAMIC_CACHE, e.request, resp2);		// ./js/sw-utils.js
			});

		}
	});

	// A'i te va
	e.respondWith(response);
})
