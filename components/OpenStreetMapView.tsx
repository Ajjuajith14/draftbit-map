import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import type { Location } from '@/types/location';

type OpenStreetMapViewProps = {
  locations: Location[];
  selectedLocationId: string | null;
  onMarkerPress: (location: Location, index: number) => void;
};

export type OpenStreetMapViewHandle = {
  fitAll: () => void;
  selectLocation: (id: string) => void;
  zoomIn: () => void;
  zoomOut: () => void;
};

export const OpenStreetMapView = forwardRef<OpenStreetMapViewHandle, OpenStreetMapViewProps>(
  function OpenStreetMapView({ locations, selectedLocationId, onMarkerPress }, ref) {
  const webViewRef = useRef<WebView | null>(null);
  const locationsJson = useMemo(() => JSON.stringify(locations), [locations]);

  const html = useMemo(
    () => `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
    <style>
      html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; background: #EAF1F8; }
      .leaflet-control-attribution { font-size: 10px; }
      .marker {
        align-items: center;
        background: #fff;
        border: 2px solid #1E40AF;
        border-radius: 999px;
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.22);
        color: #2563EB;
        display: flex;
        font-size: 18px;
        height: 34px;
        justify-content: center;
        width: 34px;
      }
      .marker.selected {
        border-color: #2563EB;
        color: #1D4ED8;
        height: 42px;
        width: 42px;
      }
      .popup-title { color: #0F172A; font: 700 14px system-ui, -apple-system, BlinkMacSystemFont, sans-serif; margin-bottom: 4px; }
      .popup-meta { color: #64748B; font: 500 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const locations = ${locationsJson};
      let selectedId = ${JSON.stringify(selectedLocationId)};
      const map = L.map('map', {
        zoomControl: false,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const markers = new Map();

      function markerIcon(selected) {
        return L.divIcon({
          className: '',
          html: '<div class="marker' + (selected ? ' selected' : '') + '">⌖</div>',
          iconSize: selected ? [42, 42] : [34, 34],
          iconAnchor: selected ? [21, 42] : [17, 34],
          popupAnchor: [0, -34]
        });
      }

      function escapeHtml(value) {
        return String(value || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      }

      function renderMarkers() {
        const bounds = [];
        locations.forEach((location, index) => {
          const selected = location.id === selectedId;
          const marker = L.marker([location.latitude, location.longitude], { icon: markerIcon(selected) })
            .bindPopup('<div class="popup-title">' + escapeHtml(location.name) + '</div><div class="popup-meta">' + escapeHtml(location.category) + '</div>')
            .addTo(map);

          marker.on('click', () => {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerPress', id: location.id, index }));
          });

          markers.set(location.id, marker);
          bounds.push([location.latitude, location.longitude]);
        });

        if (bounds.length === 1) {
          map.setView(bounds[0], 14);
        } else if (bounds.length > 1) {
          map.fitBounds(bounds, { padding: [38, 38] });
        }
      }

      function selectLocation(id) {
        selectedId = id;
        markers.forEach((marker, markerId) => {
          marker.setIcon(markerIcon(markerId === selectedId));
        });
        const selectedLocation = locations.find((location) => location.id === selectedId);
        if (selectedLocation) {
          map.flyTo([selectedLocation.latitude, selectedLocation.longitude], Math.max(map.getZoom(), 15), { duration: 0.45 });
          markers.get(selectedLocation.id)?.openPopup();
        }
      }

      function fitAll() {
        const coordinates = locations.map((location) => [location.latitude, location.longitude]);
        if (coordinates.length === 1) {
          map.flyTo(coordinates[0], 14, { duration: 0.45 });
        } else if (coordinates.length > 1) {
          map.fitBounds(coordinates, { padding: [38, 38] });
        }
      }

      function zoomIn() {
        map.flyTo(map.getCenter(), Math.min(map.getZoom() + 1, 19), { duration: 0.28 });
      }

      function zoomOut() {
        map.flyTo(map.getCenter(), Math.max(map.getZoom() - 1, 3), { duration: 0.28 });
      }

      document.addEventListener('message', function(event) {
        const message = JSON.parse(event.data);
        if (message.type === 'selectLocation') selectLocation(message.id);
        if (message.type === 'fitAll') fitAll();
        if (message.type === 'zoomIn') zoomIn();
        if (message.type === 'zoomOut') zoomOut();
      });
      window.addEventListener('message', function(event) {
        const message = JSON.parse(event.data);
        if (message.type === 'selectLocation') selectLocation(message.id);
        if (message.type === 'fitAll') fitAll();
        if (message.type === 'zoomIn') zoomIn();
        if (message.type === 'zoomOut') zoomOut();
      });

      renderMarkers();
      if (selectedId) selectLocation(selectedId);
    </script>
  </body>
</html>`,
    [locationsJson, selectedLocationId],
  );

  const handleMessage = (event: WebViewMessageEvent) => {
    const message = JSON.parse(event.nativeEvent.data) as { type?: string; id?: string; index?: number };

    if (message.type !== 'markerPress' || typeof message.index !== 'number') {
      return;
    }

    const location = locations[message.index];

    if (location) {
      onMarkerPress(location, message.index);
    }
  };

  useImperativeHandle(ref, () => ({
    fitAll: () => {
      webViewRef.current?.postMessage(JSON.stringify({ type: 'fitAll' }));
    },
    selectLocation: (id: string) => {
      webViewRef.current?.postMessage(JSON.stringify({ type: 'selectLocation', id }));
    },
    zoomIn: () => {
      webViewRef.current?.postMessage(JSON.stringify({ type: 'zoomIn' }));
    },
    zoomOut: () => {
      webViewRef.current?.postMessage(JSON.stringify({ type: 'zoomOut' }));
    },
  }));

  return (
    <WebView
      ref={webViewRef}
      originWhitelist={['*']}
      source={{ html }}
      javaScriptEnabled
      domStorageEnabled
      onMessage={handleMessage}
      style={styles.webView}
    />
  );
});

const styles = StyleSheet.create({
  webView: {
    flex: 1,
  },
});
