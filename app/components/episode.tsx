import { Episode as EpisodeType } from "@prisma/client"
import { Button } from "./ui/button"
import { Share } from "lucide-react"
import { PartialEpisode } from "~/lib/types"

const ROOT_URL = "https://podcasters.spotify.com/pod/show/topdeckpodcast/embed/episodes/"

export interface Props {
  episode: PartialEpisode
  number: number
}

export default function Episode({ episode, number }: Props) {
  const { path, title, src, description, publishedOn } = episode

  return <div className="mb-12 p-4 rounded-3xl hover:bg-gray-50">
    <span>Episode {number}</span>
    &nbsp;&#8226;&nbsp;
    <span>{publishedOn.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: 'UTC'
    })}</span>
    <div>
      <div className="text-2xl mb-0">{title}</div>
      <div className="text-sm mb-2">{description}</div>
      <div className="flex items-center justify-center gap-2">
        {!!src &&
          <div>
            <audio controls className="mx-auto hover:shadow-sm hover:shadow-gray-300 rounded-full">
              <source src={src} type="audio/mpeg" />
            </audio>
          </div>}
        <a href={`https://podcasters.spotify.com/pod/show/topdeckpodcast/episodes/${path}`} target="_blank" className="hover:rotate-45 active:rotate-90 active active:scale-90 transition transform-gpu">
          <Button variant="outline" title="Share" className="rounded-full px-3">
            <Share className=" h-4 w-4" />
          </Button>
        </a>
      </div>
    </div>
  </div>
}