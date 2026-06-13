# Draftbit Map App

Beginner-friendly notes for explaining this Expo SDK 54 React Native TypeScript take-home project in an interview.

## What This App Does

This is a small map-focused mobile app called **Map Explorer**.

It shows a set of Paris landmark locations, lets the user inspect them on a map, and loads richer details for a selected place using the OpenStreetMap Nominatim API.

The assignment goal is not to build a huge production app. The goal is to show that the app has:

- Expo SDK 54 with TypeScript
- Expo Router navigation
- A tab layout
- A map screen with pins
- A location details screen
- A service layer for data
- A custom hook for loading state
- Reusable components
- Constants for shared styling and map/card layout

## Screens

- `app/(tabs)/index.tsx` is the Home tab. It introduces the app and has an Explore Map button.
- `app/(tabs)/locations.tsx` is the Locations tab. It shows the map, markers, selected place details, and horizontal location cards.
- `app/location-details/[id].tsx` is the detail screen. It is a dynamic route where the file name `[id]` means the URL contains a location id.

## User Flow

```text
App opens
  -> Expo Router entry from package.json
  -> app/_layout.tsx sets the root stack
  -> app/(tabs)/_layout.tsx sets the bottom tabs
  -> Home tab or Locations tab renders
  -> Locations screen calls useLocations()
  -> useLocations() calls getLocations()
  -> valid coordinates are filtered
  -> OpenStreetMapView renders markers
  -> user taps marker or card
  -> selected marker/card updates
  -> getLocationById() loads Nominatim details
  -> detail panel updates
```

The closest React web comparison is:

```text
React web:
index.html -> main.tsx -> root.render(<App />)

Expo Router:
package.json main: expo-router/entry -> app/_layout.tsx -> file-based screens
```

## Quick Start

```bash
npm install
npx expo start
```

Then:

- Press `i` for iOS simulator.
- Press `a` for Android emulator.
- Run `npm run lint` to check linting.

Other scripts:

```bash
npm run android
npm run ios
npm run web
```

There is no Cloudflare Worker folder in this repo right now, so `wrangler deploy` does not apply unless a worker is added later.

## Important Implementation Note

This project uses `react-native-webview` with Leaflet and OpenStreetMap tiles in `components/OpenStreetMapView.tsx`.

It does **not** currently use `react-native-maps` / native `MapView`, even though common map interview questions may mention `MapView`, `Marker`, and `initialRegion`. For this project, the equivalent responsibilities are handled by:

- `WebView` as the native wrapper
- Leaflet inside the HTML string
- `fitBounds`, `flyTo`, and marker creation inside the embedded script
- messages between React Native and the WebView

## Where To Read Next

Read [PROJECT_NOTES.md](./PROJECT_NOTES.md) for the full interview prep guide, including file-by-file explanations, API flow, navigation flow, debugging, and likely live-coding follow-up features.

## Expo SDK 54 References Checked

- Expo SDK 54 reference: https://docs.expo.dev/versions/v54.0.0/
- Expo Router UI SDK 54 reference: https://docs.expo.dev/versions/v54.0.0/sdk/router-ui/
- react-native-maps SDK 54 reference: https://docs.expo.dev/versions/v54.0.0/sdk/map-view/
