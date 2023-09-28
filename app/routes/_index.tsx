import { Link } from "@remix-run/react";
import { Mail } from "lucide-react"
import Episode from "~/components/episode"
import { Episode as EpisodeType } from "~/lib/types"
import { Button } from "~/components/ui/button"

const episodes: EpisodeType[] = [
  {
    path: "There-Is-A-New-Podcast-In-Town--Episode-001-e2976nd",
    title: "There Is A New Podcast In Town",
    src: "https://d3ctxlq1ktw2nl.cloudfront.net/staging/2023-8-15/920a30e1-77dc-9fac-95ba-6673fae8c656.mp3",
    description: "Clutch and Aldous introduce the Topdeck podcast and talk about the Council of Mortals, the Meta, Superpower and Sealed mode.",
    publishedOn: "Sep 15, 2023"
  },
]

export default function HomeRoute() {
  return <div className="mx-auto max-w-md">
    <div className="text-center">
      {episodes.map((episode, index) => {
        return <Episode key={episode.path} episode={episode} number={index + 1} />
      })}
    </div>

    <div className="mt-12 flex justify-center gap-x-4">
      <Link to="/feedback" prefetch="intent">
        <Button>
          <Mail className="mr-2 h-4 w-4" />
          Send feedback
        </Button>
      </Link>
    </div>
  </div>
}