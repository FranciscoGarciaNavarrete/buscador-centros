import React, {useState, useEffect} from 'react';
import LiferayApi from '../common/services/liferay/api';
import OpenMap from './OpenStreetMap';

const ListProv = () => {
    const loading = "Cargando...";

    const [comunidades, setComunidades] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [selectableProvincias, setSelectableProvincias] = useState(<option value={-1}>{loading}</option>);
    const [selectedLocation, setSelectedLocation] = useState({"id": -1, "latitud": 41.336, "longitud": 2.175, "selected": "comunidad"});
    const [centrosInMap, setCentrosInMap] = useState([]);
    const [loadingCentros, setLoadingCentros] = useState(false);

    const getComunidades = async () => {
        try {
            const result = await LiferayApi('o/c/cas/');
            setComunidades(result.data.items);
        } catch (error) {
            console.log(error.message);
        }
    }

    const getProvincias = async () => {
        try {
            const result = await LiferayApi('o/c/provincias/');
            setProvincias(result.data.items);
            setSelectableProvincias(result.data.items.map((prov) => <option value={prov.id}>{prov.name}</option>));
        } catch (error) {
            console.log(error.message);
        }
    }

    const updateCentrosInMapQuery = async () => {
        try {
            if(selectedLocation.id != -1){
                let query = '';
                if(selectedLocation.selected == "provincia"){
                    query = encodeURIComponent('r_provincia_c_provinciaId = ' + selectedLocation.id);
                } else {
                    query = encodeURIComponent('r_comunidadCentro_c_caId = ' + selectedLocation.id);
                }
                setLoadingCentros(true);
                await LiferayApi('o/c/centros/?search=' + query).then(res => {
                    setCentrosInMap(res.data.items);
                    setLoadingCentros(false);
                });
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const updateSelectableProvincias = (id) => {
        if(id == -1){
            setSelectableProvincias(provincias.map((prov) => 
                    <option value={prov.id}>{prov.name}</option>
                )
            );
        } else {
            const aux = provincias.filter(prov =>{
                return prov.r_comunidad_c_caId == id;
            });
            const mapped = aux.map((prov) => 
                <option value={prov.id}>{prov.name}</option>
            );

            setSelectableProvincias(mapped);
        }        
    }
    const onComunidadChange = (e) => {
        const id = e.target.value;        
        
        if(id != -1){
            const locationJSON = comunidades.filter(com => {
                return com.id == id;
            })[0];
            locationJSON.selected = "comunidad";
            setSelectedLocation(locationJSON);
        }        

        updateSelectableProvincias(id);
    }

    const onProvinciaChange = (e) => {
        const id = e.target.value;
        
        if(id != -1){
            const locationJSON = provincias.filter(prov => {
                return prov.id == id;
            })[0];
            locationJSON.selected = "provincia";
            setSelectedLocation(locationJSON);
        }
    }

    useEffect(() => {
        getComunidades();
        getProvincias();
    }, []);

    useEffect(() => {
        updateCentrosInMapQuery();
    }, [selectedLocation]);

    let nombreComunidades = <option value={-1}>{loading}</option>;

    if(comunidades.length > 0){
        nombreComunidades = comunidades.map((com) => <option value={com.id}>{com.nombre}</option>);
    }

    return (
        <div className='buscador-centros row'>
            <div id="search" class="col">
                <div class="row search-field">
                    <div class="col">
                        <div class="row">
                            <p>Comunidad autónoma</p>
                        </div>
                        <div class="row select-container">
                            <select onChange={(e) => onComunidadChange(e)} id="selectComunidad">
                                <option value='-1' selected>Selecciona una comunidad autónoma</option>
                                {nombreComunidades}
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row search-field">
                    <div class="col">
                        <div class="row">
                            <p>Provincia</p>
                        </div>
                        <div class="row select-container">
                            <select onChange={(e) => onProvinciaChange(e)} id="selectProvincia">
                                <option value='-1' selected>Selecciona una provincia</option>
                                {selectableProvincias}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div id="map" class="col-9">
                <OpenMap lat={selectedLocation.latitud} long={selectedLocation.longitud} 
                    zoom={selectedLocation.zoom} centros={centrosInMap}
                    loadingCentros={loadingCentros}>
                </OpenMap>
            </div>
        </div>
    );
} 

export default ListProv;