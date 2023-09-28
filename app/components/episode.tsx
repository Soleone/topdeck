import { Episode as EpisodeType } from "~/lib/types"
import { Button } from "./ui/button"
import { Share } from "lucide-react"

const ROOT_URL = "https://podcasters.spotify.com/pod/show/topdeckpodcast/embed/episodes/"

interface Props {
  episode: EpisodeType
  number: number
}

export default function Episode({ episode, number }: Props) {
  const { path, title, src, description, publishedOn } = episode

  return <div className="mb-8">
    <span>Episode {number}</span>
    &nbsp;&#8226;&nbsp;
    <span>{publishedOn}</span>
    <div>
      <div className="text-2xl mb-0">{title}</div>
      <div className="text-sm mb-2">{description}</div>
      <div className="flex items-center justify-center gap-2">
        {!!src &&
          <div>
            <audio controls className="mx-auto">
              <source src={src} type="audio/mpeg" />
            </audio>
          </div>}
        <a href={`https://podcasters.spotify.com/pod/show/topdeckpodcast/episodes/${path}`} target="_blank">
          <Button variant="outline" title="Share" className="rounded-full px-3">
            <Share className=" h-4 w-4" />
          </Button>
        </a>
      </div>
    </div>
  </div>
}