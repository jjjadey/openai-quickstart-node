import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Conversation() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState([]);
    const [conversationInput, setConversationInput] = useState("");

    async function onSubmitConversation(event) {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch("/api/conversation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question: conversationInput }),
            });

            const data = await response.json();
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }

            console.log(data.result)
            // setResult(data.result);

            console.log(JSON.parse(data.result))
            setResult(JSON.parse(data.result));
            // setConversationInput("");
            setIsLoading(false);
        } catch (error) {
            // Consider implementing your own error handling logic here
            console.error(error);
            alert(error.message);
        }
    }

    return (
        <>
            <h3>Conversation</h3>
            <form onSubmit={onSubmitConversation}>
                <textarea
                    type="text"
                    name="conversation"
                    placeholder="How can I help you today?"
                    value={conversationInput}
                    onChange={(e) => setConversationInput(e.target.value)}
                    style={{
                        height: '200px',
                    }}
                />
                <input type="submit" value="Submit" />
            </form>


            {isLoading ? <p>Loading...</p> :
                // <div className={styles.result}>{result}</div>
                <div style={{ textAlign: "left" }}>
                    <ol>
                        {result && result.map((data) => (
                            <li key={data.id}>{data.name} - {data.location}</li>
                        ))}
                    </ol>
                </div>
            }
        </>
    )
}
