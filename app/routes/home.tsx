import { Link } from "@remix-run/react";
import { LogIn, Mail } from "lucide-react"


import Episode from "~/components/episode";
import { Button } from "~/components/ui/button";

interface Episode {
  path: string
  title: string
  src: string
}

const episodes: Episode[] = [
  {
    path: "There-Is-A-New-Podcast-In-Town--Episode-001-e2976nd",
    title: "There Is A New Podcast In Town",
    src: "https://d3ctxlq1ktw2nl.cloudfront.net/staging/2023-8-15/920a30e1-77dc-9fac-95ba-6673fae8c656.mp3",
  }
]

export default function HomeRoute() {
  return <div className="mx-auto max-w-md">
    <div className="text-center">
      {episodes.map((episode, index) => {
        return <>
          <span>Episode {index + 1}</span>
          <Episode key={episode.path} path={episode.path} title={episode.title} src={episode.src} />
        </>
      })}
    </div>

    <div className="mt-12 flex justify-center gap-x-4">
      <Button>
        <Mail className="mr-2 h-4 w-4" /><Link to="/feedback" prefetch="intent">Send feedback</Link>
      </Button>

      <Button variant="outline">
        <LogIn className="mr-2 h-4 w-4" /><Link to="/login" prefetch="intent">Login</Link>
      </Button>
    </div>
  </div >
}