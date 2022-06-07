import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import '../common/styles/OpenStreetMap.scss';


const OpenMap = (props) => {
    const [map, setMap] = useState(null);
    const [lat, setLat] = useState(props.lat);
    const [long, setLong] = useState(props.long);
    const [centros, setCentros] = useState([]);
    
    const customPin = new L.Icon({
        iconUrl: 'https://www2.cruzroja.es/o/cruzroja-web-theme/images/custom/icons/pin.svg',
        iconRetinaUrl: 'https://www2.cruzroja.es/o/cruzroja-web-theme/images/custom/icons/pin.svg',
        iconSize: new L.Point(30, 45)
    });

    const noResults = new L.Popup().setContent("<h2>No hay centros con el filtro especificado</h2>");

    const Markers = () => {
        return centros.map( cent =>
            <Marker position={[cent.latitud, cent.longitud]} icon={customPin}>
                <Popup>
                    <div class="row popup-header">
                        <h3 class="popup-title col-10">{cent.nombre}</h3>
                        <a href={cent.link} class="col-1 popup-link">+ info</a>
                    </div>
                    
                    <div class="row popup-indications">
                        <div class="col-12 popup-dir">{cent.direccion}</div>
                        <div class="col-12 popup-cp">{cent.cP}</div>
                    </div>
                    <div class="row popup-contact">
                        <div class="col-12 popup-phone">{cent.telefono}</div>
                        <div class="col-12 popup-email">{cent.email}</div>
                    </div>
                </Popup>
            </Marker>
        );
    }

    const disableMap = () => {
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
        if (map.tap) map.tap.disable();
    }

    const enableMap = () => {
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();
        if (map.tap) map.tap.enable();
    }

    useEffect(() => {
        setLat(props.lat);
        setLong(props.long);
    }, [props.lat, props.long]);

    useEffect(() => {
        setCentros(props.centros);
    }, [props.centros]);

    useEffect(() => {
        if(map){
            if(props.loadingCentros){
                disableMap();
            } else{
                enableMap();
                if(props.centros.length > 0){
                    const bounds = new L.LatLngBounds(props.centros.map((cent) => {
                        return [cent.latitud, cent.longitud];
                    }));
                    map.fitBounds(bounds);
                    map.closePopup();
                } else{
                    noResults.setLatLng(map.getCenter()).openOn(map);
                }
            }
            
        }        
    }, [props.loadingCentros]);

    return (
        <MapContainer center={[lat, long]} zoom={9} scrollWheelZoom={true} ref={setMap}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Markers></Markers>
        </MapContainer>
    );
}

export default OpenMap;