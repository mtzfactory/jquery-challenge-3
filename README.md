[![Skylab](https://github.com/Iggy-Codes/logo-images/blob/master/logos/skylab-56.png)](http://www.skylabcoders.com/)
<a href="https://www.w3.org/"><img src="https://github.com/MarioTerron/logo-images/blob/master/logos/html5-css3-js.png" height= "56px"></a>

## Full Stack Web Development Bootcamp @Otoño2017

### Spotifire ~ con JQuery y Ajax.

Otro reproductor basado en la gran _Spotify_, pequeño reto de JQuery y  ajax.

Para poder realizar consultas a Spotiy, necesitamos obtener un token fresco que autorize dichas consultas en sus servidores. Tener en cuenta que spotify proporciona un token _de duración determinada_.

Revisando la documentación al respecto, probando el metodo de autenticación [Client credentials flow][credentials-flow] directamente en mi webapp resulta en un problema de CORS, por esta razón cree un servicio que devuelve un token actualizado.

El resultado de [la llamada al servicio][mtz-api] es como el siguiente, obteniendo un token válido y listo para ser utilizado en nuestra aplicación:

```json
{
"client": "37.223.99.71",
"token": "BQAaxfp1MD_vd435Gl3aR-zBhX18EFIiP-qzrLA-rxMh_C464MBStKnBPWMUkY72tpMKQwxR650LazRcNx7WYg"
}
```

La API esta hospedada en Heroku... por lo que la primera llamada puede ser lenta, dado que el servidor esta en la nube y tarda en levantar el servicio.

Si no quieres usar esa API,  deberás [canviar el valor del **token**][spotify-token] en la variable ```token```, del fichero ```app.js```.

![artistas-screenshot-1](./img/screenshot-1.png)

![artistas-screenshot-1](./img/screenshot-2.png)

[credentials-flow]: https://developer.spotify.com/web-api/authorization-guide/#client-credentials-flow

[mtz-api]: https://whispering-tundra-41801.herokuapp.com/api/v1/mtzfactory

[spotify-token]: (https://developer.spotify.com/web-api/console/get-search-item/)