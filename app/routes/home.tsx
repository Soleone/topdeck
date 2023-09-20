import { Mail } from "lucide-react"


import Episode from "~/components/episode";
import { Button } from "~/components/ui/button";

const episodes = [
  "There-Is-A-New-Podcast-In-Town--Episode-001-e2976nd",
]

export default function IndexRoute() {
  return <div className="mx-auto max-w-screen-md">
    <h2 className="text-2xl mb-4">Episodes</h2>
    <div>
      {episodes.map((path) => <Episode path={path} />)}
    </div>

    <div className="mt-6">
      <Button>
        <Mail className="mr-2 h-4 w-4" /><a href="/feedback">Send feedback</a>
      </Button>
    </div>
  </div >
}