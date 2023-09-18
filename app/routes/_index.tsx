import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Topdeck" },
    { name: "description", content: "Gods Unchained pro players discuss the latest news and state of the game." },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Topdeck</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://topdeckpodcast.com"
            rel="noreferrer"
          >
            Check out the podcast
          </a>
        </li>
      </ul>
    </div>
  );
}
