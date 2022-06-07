# React remote app "_buscador-centros_"

This is a remote app based on React for finding headquarters using Liferay's frameworks. You can find how to build and deploy this application into Liferay DXP 7.4 in [its documentation](https://learn.liferay.com/dxp/latest/en/building-applications/remote-apps/remote-apps-tutorials/creating-a-basic-remote-app.html#building-the-react-application).

The [Objects](https://learn.liferay.com/dxp/latest/en/building-applications/objects.html) needed for this application can be uploaded into Liferay using their JSON structures found in [this folder](public/objects). Their fields and use are the following:
- [CA](public/objects/Object_CA_66765_20220607142059667.json)  
  Used to represent Comunidades autónomas. Its fields and relationships are the following:
  - Nombre: name of the "Comunidad"
  - One to many relationship with Provincia: relationship to represent that each Provincia belongs to a Comunidad
  - One to many relationship with Centro: relationship to represent that each Centro belongs to a Comunidad
- [Provincia](public/objects/Object_Provincia_60942_20220607142056771.json)  
  Used to represent Provincias. Its fields and relationships are the following:
  - Nombre: name of the "Provincia"
  - Comunidad: ID of the Comunidad it belongs. It's made from the relationship made in Comunidad
  - One to many relationship with Centro: relationship to represent that each Centro belongs to a Provincia
- [Centro](public/objects/Object_Centro_66771_20220607142101869.json)  
  Used to represent all the information needed for each Centro. Its fields are the following:
  - Nombre: name of the "Centro"
  - Direccion: direction of the "Centro"
  - CP: postal code of the "Centro"
  - Telefono: phone number of the "Centro"
  - Email: email of the "Centro"
  - Link: link to the detail page of the "Centro"
  - Latitud: latitude where the "Centro" is placed
  - Longitud: longitude where the "Centro" is placed
  - Provincia: ID of the Provincia it belongs. It's made from the relationship made in Provincia
  - ComunidadCentro: ID of the Comunidad it belongs. It's made from the relationship made in Comunidad.
  
In order to make the app work a couple changes have to be made in the [api.js](src/common/services/liferay/api.js) file to be able to access the API Rest:
1. Change the credentials used in [line 5](https://github.com/FranciscoGarciaNavarrete/buscador-centros/blob/main/src/common/services/liferay/api.js#L5) to the ones used in the environment where the app is running
2. Change the variable [apiPath](https://github.com/FranciscoGarciaNavarrete/buscador-centros/blob/main/src/common/services/liferay/api.js#L9) value to API's URL
