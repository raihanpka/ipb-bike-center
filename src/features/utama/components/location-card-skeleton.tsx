import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function LocationCardSkeleton() {
  return (
    <Card className="w-full h-full overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>

      {/* Map skeleton */}
      <div className="relative w-full h-[200px]">
        <Skeleton className="w-full h-full" />
      </div>

      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 rounded-full shrink-0" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-32" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Skeleton className="h-px w-full" />

          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 rounded-full shrink-0" />
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-40" />
      </CardFooter>
    </Card>
  )
}
