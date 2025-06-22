import { matrix as haversineMatrix, Point } from "haversine-matrix";

/**
 * Calculates the total distance of a tour by summing distances between consecutive cities.
 * @param tour Array of city indices representing the tour order
 * @param distanceMatrix 2D array containing distances between all city pairs
 * @returns Total distance of the tour
 */

const calculateTourDistance = (
  tour: number[],
  distanceMatrix: number[][]
): number => {
  let totalDistance = 0;
  for (let i = 0; i < tour.length; i++) {
    const from = tour[i];
    const to = tour[(i + 1) % tour.length];
    totalDistance += distanceMatrix[from][to];
  }
  return totalDistance;
};

/**
 * Generates an initial tour using the nearest neighbor heuristic.
 * Starts from city 0 and always visits the nearest unvisited city next.
 * @param distanceMatrix 2D array containing distances between all city pairs
 * @returns Array of city indices representing the initial tour
 */

const nearestNeighborTour = (distanceMatrix: number[][]): number[] => {
  const n = distanceMatrix.length;
  const visited = new Array(n).fill(false);
  const tour = [0];
  visited[0] = true;

  for (let i = 1; i < n; i++) {
    let nearest = -1;
    let minDistance = Infinity;

    for (let j = 0; j < n; j++) {
      if (
        !visited[j] &&
        distanceMatrix[tour[tour.length - 1]][j] < minDistance
      ) {
        minDistance = distanceMatrix[tour[tour.length - 1]][j];
        nearest = j;
      }
    }

    tour.push(nearest);
    visited[nearest] = true;
  }

  return tour;
};

/**
 * Performs a 2-opt swap by reversing the segment between two positions.
 * This is the core operation for improving tour efficiency.
 * @param tour Current tour as array of city indices
 * @param i Start position for the segment to reverse
 * @param k End position for the segment to reverse
 * @returns New tour with the segment reversed
 */

const twoOptSwap = (tour: number[], i: number, k: number): number[] => {
  const newTour = [...tour];

  // Reverse the segment between i+1 and k
  let left = i + 1;
  let right = k;

  while (left < right) {
    [newTour[left], newTour[right]] = [newTour[right], newTour[left]];
    left++;
    right--;
  }

  return newTour;
};

/**
 * Implements the Lin-Kernighan algorithm to optimize the tour.
 * Uses 2-opt and 3-opt edge swapping to find better tour configurations.
 * @param tour Initial tour as array of city indices
 * @param distanceMatrix 2D array containing distances between all city pairs
 * @returns Optimized tour as array of city indices
 */

const linKernighan = (tour: number[], distanceMatrix: number[][]): number[] => {
  const n = tour.length;
  let bestTour = [...tour];
  let bestDistance = calculateTourDistance(bestTour, distanceMatrix);
  let improved = true;

  while (improved) {
    improved = false;

    // 2-opt improvements
    for (let i = 0; i < n - 1; i++) {
      for (let k = i + 1; k < n; k++) {
        const newTour = twoOptSwap(bestTour, i, k);
        const newDistance = calculateTourDistance(newTour, distanceMatrix);

        if (newDistance < bestDistance) {
          bestTour = newTour;
          bestDistance = newDistance;
          improved = true;
        }
      }
    }

    // 3-opt improvements (more complex edge swapping)
    if (!improved) {
      for (let i = 0; i < n - 2; i++) {
        for (let j = i + 1; j < n - 1; j++) {
          for (let k = j + 1; k < n; k++) {
            // Try different 3-opt reconnection patterns
            const segments = [
              bestTour.slice(0, i + 1),
              bestTour.slice(i + 1, j + 1),
              bestTour.slice(j + 1, k + 1),
              bestTour.slice(k + 1),
            ];

            // Pattern 1: reverse middle segment
            const option1 = [
              ...segments[0],
              ...segments[1].reverse(),
              ...segments[2],
              ...segments[3],
            ];

            // Pattern 2: reverse last segment
            const option2 = [
              ...segments[0],
              ...segments[1],
              ...segments[2].reverse(),
              ...segments[3],
            ];

            // Pattern 3: swap middle segments
            const option3 = [
              ...segments[0],
              ...segments[2],
              ...segments[1],
              ...segments[3],
            ];

            const options = [option1, option2, option3];

            for (const option of options) {
              const distance = calculateTourDistance(option, distanceMatrix);
              if (distance < bestDistance) {
                bestTour = option;
                bestDistance = distance;
                improved = true;
              }
            }
          }
        }
      }
    }
  }

  return bestTour;
};

/**
 * Solves the Traveling Salesman Problem using the Lin-Kernighan algorithm.
 * Takes geographic coordinates and returns an optimized tour order.
 * @param points Array of geographic points with latitude and longitude
 * @returns Array of points in optimized tour order
 */

const tsp = (points: Point[]): Point[] => {
  if (points.length <= 1 || points.length === 2) {
    return points;
  }
  const distanceMatrix = haversineMatrix(points);
  // Generate initial tour using nearest neighbor heuristic
  let tour = nearestNeighborTour(distanceMatrix);
  // Optimize tour using Lin-Kernighan algorithm
  tour = linKernighan(tour, distanceMatrix);
  // Return points in optimized order
  return tour.map((index) => points[index]);
};

export default tsp;
