import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [queryInput, setQueryInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: queryInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult( data.result);
      setQueryInput(data.answer);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Thinking Machine</title>
        <link rel="icon" href="/imts.png" />
      </Head>

      <main className={styles.main}>
        <img src="/imts.png" className={styles.icon} />
        <h3>Ask Me a Question</h3>
        <form onSubmit={onSubmit}>
          <input 
            type="text"
            name="query"
            placeholder="Pose moi une question !"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
          />
          <input type="submit" value="Answer Me" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
