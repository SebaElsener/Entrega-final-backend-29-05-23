
## TESTEAMOS NUESTRA API REST
---

* Desarrollar un cliente HTTP de pruebas que utilice Axios para enviar peticiones:
  
Se ejecuta el archivo *test-axios-http.js* que está en la carpeta *src/test* con el script *npm run test-http*

Resultados:
````
{"level":30,"time":"2023-04-23T03:55:18.446Z","pid":2852,"hostname":"DESKTOP-48ND4VH","msg":"TEST GET TODOS LOS PRODUCTOS"}
{"level":30,"time":"2023-04-23T03:55:18.558Z","pid":2852,"hostname":"DESKTOP-48ND4VH","0":{"_id":"63d99b9f866138633a76105b","product":"Globo terr├íqueo","price":45.67,"stock":47,"description":"Globo terr├íqueo mediano","code":"1223","thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png","__v":0},"1":{"_id":"63d99bdb866138633a76105f","product":"Escuadra","price":33.78,"stock":11,"description":"Escuadra con comp├ís","code":"44567","thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png","__v":0},"2":{"_id":"63d99bf8866138633a761063","product":"Calculadora","price":56.7,"stock":112,"description":"Calculadora solar","code":"5679","thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png","__v":0}}
{"level":30,"time":"2023-04-23T03:55:18.558Z","pid":2852,"hostname":"DESKTOP-48ND4VH","msg":"TEST AGREGAR PRODUCTO"}
{"level":30,"time":"2023-04-23T03:55:18.656Z","pid":2852,"hostname":"DESKTOP-48ND4VH","msg":"PRODUCTO Lapiz color INGRESADO OK"}
{"level":30,"time":"2023-04-23T03:55:18.657Z","pid":2852,"hostname":"DESKTOP-48ND4VH","msg":"TEST ACTUALIZAR PRODUCTO"}
{"level":30,"time":"2023-04-23T03:55:18.721Z","pid":2852,"hostname":"DESKTOP-48ND4VH","msg":"PRODUCTO ACTUALIZADO CON EXITO"}
{"level":30,"time":"2023-04-23T03:55:18.722Z","pid":2852,"hostname":"DESKTOP-48ND4VH","msg":"TEST ELIMINAR PRODUCTO"}      
{"level":30,"time":"2023-04-23T03:55:18.733Z","pid":2852,"hostname":"DESKTOP-48ND4VH","msg":"PRODUCTO ELIMINADO CON EXITO"}
````
#
* Luego, realizar las mismas pruebas, a través de un código de test apropiado, que utilice mocha, chai y Supertest:
  
Se ejecuta el archivo *test-mocha.js* que está en la carpeta *src/test* con el script *npm run test-mocha*

Resultados:
````
  TEST API RESTFull     
    1-SERVIDOR EN MARCHA
      ✔ Deberia retornar status 200 (127ms)
    2-TEST CRUD
      ✔ Deberia agregar un producto (264ms)
      ✔ Deberia listar todos los productos (63ms)
      ✔ Deberia listar un producto por su ID (69ms)
      ✔ Deberia actualizar un producto (128ms)
      ✔ Deberia eliminar un producto por su ID


  6 passing (685ms)
````
#
* Observaciones:  para los test se eliminaron los middleware *adminUser* y *userLoginWatcher* para prevenir errores por inicio de sesión

---
*  TODO: Cambio de password en menú "Mis datos" - Control stock - Filtros de búsqueda de usuarios en control de usuarios y filtros en listado de productos pág principal
---