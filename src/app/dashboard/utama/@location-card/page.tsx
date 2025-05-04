import { LocationCard } from "@/features/utama/components/location-card"

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default async function LocationCardPage() {
  // Simulate data fetching delay like in the area-graph example
  await delay(1000)
  return <LocationCard />
}
