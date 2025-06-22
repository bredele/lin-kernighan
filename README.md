# lin-kernighan

Adaptive k-opt heuristic improving TSP (traveling salesman problem) tours by swapping edges to shorten routes.

## Installation

```sh
npm install lin-kernighan
```

## Usage

```ts
import tsp from 'lin-kernighan';

tsp([
  { latitude: 40.7128, longitude: -74.006 },
  { latitude: 34.0522, longitude: -118.2437 },
  { latitude: -33.8688, longitude: 151.2093 },
  { latitude: 55.7558, longitude: 37.6173 },
  { latitude: -22.9068, longitude: -43.1729 },
]);
// => optimal tsp tour
```
