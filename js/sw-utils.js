
/**
 * Este archivo contiene Utilerías para el Service Worker
 */

function actualizarCacheDinamico(dynamicCache, request, response) {

	if (response.ok) {

		return caches.open(dynamicCache).then(cache => {

			cache.put(request, response.clone());

			return respuesta.clone();

		});

	} else {		// Naá quéhacer
		return response;
	}

}
