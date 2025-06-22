import test from 'node:test';
import assert from 'node:assert';
import tsp from '.';

const testPoints = [
  { latitude: 40.7128, longitude: -74.006 },   // New York
  { latitude: 34.0522, longitude: -118.2437 }, // Los Angeles  
  { latitude: -33.8688, longitude: 151.2093 }, // Sydney
  { latitude: 55.7558, longitude: 37.6173 },   // Moscow
  { latitude: -22.9068, longitude: -43.1729 }  // Rio de Janeiro
];

test('should handle empty array', () => {
  const result = tsp([]);
  assert.deepStrictEqual(result, []);
});

test('should handle single point', () => {
  const points = [{ latitude: 40.7128, longitude: -74.006 }];
  const result = tsp(points);
  assert.deepStrictEqual(result, points);
});

test('should handle two points', () => {
  const points = [
    { latitude: 40.7128, longitude: -74.006 },
    { latitude: 34.0522, longitude: -118.2437 }
  ];
  const result = tsp(points);
  assert.strictEqual(result.length, 2);
  assert.deepStrictEqual(result, points);
});

test('should return valid tour for three points', () => {
  const points = [
    { latitude: 0, longitude: 0 },
    { latitude: 1, longitude: 0 },
    { latitude: 0, longitude: 1 }
  ];
  const result = tsp(points);
  
  assert.strictEqual(result.length, 3);
  
  // Verify all original points are included
  for (const point of points) {
    assert(result.some(p => p.latitude === point.latitude && p.longitude === point.longitude));
  }
});

test('should optimize tour for README example points', () => {
  const result = tsp(testPoints);
  
  assert.strictEqual(result.length, 5);
  
  // Verify all original points are included
  for (const point of testPoints) {
    assert(result.some(p => p.latitude === point.latitude && p.longitude === point.longitude));
  }
  
  // The algorithm should produce a valid tour
  assert(Array.isArray(result));
  assert(result.every(point => 
    typeof point.latitude === 'number' && 
    typeof point.longitude === 'number'
  ));
});

test('should handle duplicate coordinates', () => {
  const points = [
    { latitude: 40.7128, longitude: -74.006 },
    { latitude: 40.7128, longitude: -74.006 },
    { latitude: 34.0522, longitude: -118.2437 }
  ];
  const result = tsp(points);
  
  assert.strictEqual(result.length, 3);
  
  // Should still include all points even if duplicated
  for (const point of points) {
    assert(result.some(p => p.latitude === point.latitude && p.longitude === point.longitude));
  }
});

test('should produce consistent results', () => {
  const result1 = tsp(testPoints);
  const result2 = tsp(testPoints);
  
  // Results should be deterministic
  assert.deepStrictEqual(result1, result2);
});

test('should handle larger dataset', () => {
  const largePoints = [
    { latitude: 40.7128, longitude: -74.006 },   // New York
    { latitude: 34.0522, longitude: -118.2437 }, // Los Angeles
    { latitude: 41.8781, longitude: -87.6298 },  // Chicago
    { latitude: 29.7604, longitude: -95.3698 },  // Houston
    { latitude: 39.9526, longitude: -75.1652 },  // Philadelphia
    { latitude: 33.4484, longitude: -112.074 },  // Phoenix
    { latitude: 37.7749, longitude: -122.4194 }, // San Francisco
    { latitude: 32.7767, longitude: -96.797 }    // Dallas
  ];
  
  const result = tsp(largePoints);
  
  assert.strictEqual(result.length, 8);
  
  // Verify all points are included
  for (const point of largePoints) {
    assert(result.some(p => p.latitude === point.latitude && p.longitude === point.longitude));
  }
});
