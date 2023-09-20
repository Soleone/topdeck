const ROOT_URL = "https://podcasters.spotify.com/pod/show/topdeckpodcast/embed/episodes/"

export default function Episode({ path }: { path: string }) {
  return <div>
    <iframe
      src={`${ROOT_URL}/${path}`}
      height="122px"
      width="600px"
      frameBorder="0"
      scrolling="no"
    ></iframe>
  </div>
}