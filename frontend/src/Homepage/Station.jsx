import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Red marker for user location
const redIcon = new L.Icon({
  iconUrl: "http://maps.gstatic.com/mapfiles/markers2/icon_green.png", // small red dot
  iconSize: [21, 21],
  iconAnchor: [10, 34],
});

const Routing = ({ userLocation, destination }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map || !userLocation || !destination) return;

    // If there's an existing route, remove it first
    if (routingControlRef.current) {
      try {
        map.removeControl(routingControlRef.current);
      } catch (e) {
        console.warn(
          "Tried removing routing control but it was already gone:",
          e
        );
      }
    }

    const control = L.Routing.control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(destination[0], destination[1]),
      ],
      lineOptions: {
        styles: [{ color: "blue", weight: 4 }],
      },
      createMarker: () => null,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
    });

    routingControlRef.current = control;
    control.addTo(map);

    return () => {
      if (map && routingControlRef.current) {
        try {
          map.removeControl(routingControlRef.current);
        } catch (e) {
          console.warn("Cleanup failed, but it's fine:", e);
        }
      }
    };
  }, [map, userLocation, destination]);

  return null;
};

const EVMap = () => {
  const [evList, setEvList] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestStation, setNearestStation] = useState(null);

  const getDistance = (coords1, coords2) => {
    const toRad = (val) => (val * Math.PI) / 180;
    const [lat1, lng1] = coords1;
    const [lat2, lng2] = coords2;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    // Fetch EV stations
    fetch("http://localhost:4000/ev/getstations", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const stationsArr = result.stations.map((el) => ({
          name: el.stationname,
          coords: [parseFloat(el.lat), parseFloat(el.lng)],
        }));
        setEvList(stationsArr);
      })
      .catch((err) => console.error("Error fetching stations:", err));

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);
        },
        (err) => console.warn("Geolocation error:", err)
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation && evList.length) {
      let nearest = null;
      let minDist = Infinity;

      evList.forEach((station) => {
        const dist = getDistance(userLocation, station.coords);
        if (dist < minDist) {
          minDist = dist;
          nearest = station;
        }
      });

      setNearestStation(nearest);
    }
  }, [userLocation, evList]);
  const stationIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [25, 25],
    iconAnchor: [12, 41],
  });
  return (
    <div style={{ height: "100vh" }}>
      <MapContainer
        center={userLocation || [22.9734, 78.6569]}
        zoom={6}
        style={{ height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {evList.map((station, i) => (
          <Marker key={i} position={station.coords} icon={stationIcon}>
            <Popup>{station.name}</Popup>
          </Marker>
        ))}

        {userLocation && (
          <Marker position={userLocation} icon={redIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {userLocation && nearestStation && (
          <Routing
            userLocation={userLocation}
            destination={nearestStation.coords}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default EVMap;