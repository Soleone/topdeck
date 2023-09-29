import { Link } from "@remix-run/react";
import Episode from "~/components/episode";
import { Button } from "~/components/ui/button";
import { db } from "~/lib/db.server";
import { superjson, useSuperLoaderData } from "~/lib/superjson";

export async function loader() {
  const episodes = await db.episode.findMany({ orderBy: { publishedOn: "desc" } })

  return superjson({ episodes })
}

export default function AdminEpisodesRoute() {
  let { episodes } = useSuperLoaderData<typeof loader>()

  return <div className="mx-auto max-w-md">
    <div className="text-center">
      <h2 className="text-2xl mb-6">Episodes Admin</h2>
      {episodes.map((episode, index) => {
        return <div key={episode.path}>
          <Episode episode={episode} number={episodes.length - index} />
        </div>
      })}
    </div>

    <div className="mt-8">
      <div className="mt-8">
        <Link to="/admin/episodes/new">
          <Button>
            Submit episode
          </Button>
        </Link>
      </div>
    </div>
  </div>
}