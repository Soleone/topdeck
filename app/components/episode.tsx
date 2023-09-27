const ROOT_URL = "https://podcasters.spotify.com/pod/show/topdeckpodcast/embed/episodes/"

interface Props {
  path: string
  title: string
  src: string
}

export default function Episode({ path, title, src }: Props) {
  return <div>
    <div className="text-2xl mb-2">{title}</div>
    {!!src &&
      <div>
        <audio controls className="mx-auto">
          <source src={src} type="audio/mpeg" />
        </audio>
      </div>}
  </div>
}