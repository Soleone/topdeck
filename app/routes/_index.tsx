import { Link } from "@remix-run/react";
import { Mail } from "lucide-react"
import Episode from "~/components/episode"
import { Button } from "~/components/ui/button"
import { db } from "~/lib/db.server";
import { superjson, useSuperLoaderData } from "~/lib/superjson";

export async function loader() {
  const episodes = await db.episode.findMany({ orderBy: { publishedOn: "desc" } })

  return superjson({ episodes })
}

export default function HomeRoute() {
  let { episodes } = useSuperLoaderData<typeof loader>()

  return <div className="mx-auto max-w-md">
    <div className="text-center">
      {episodes.map((episode, index) => {
        return <Episode key={episode.path} episode={episode} number={episodes.length - index} />
      })}
    </div>

    <div className="mt-12 flex justify-center gap-x-4">
      <Link to="/feedback" prefetch="intent">
        <Button className="group">
          <Mail className="mr-2 h-4 w-4 group-active:translate-x-1 transition" />
          <span className="group-active:translate-x-1 transition">Send feedback</span>
        </Button>
      </Link>
    </div>
  </div>
}