import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Conversation() {
    const [result, setResult] = useState();
    const [conversationInput, setConversationInput] = useState("");

    async function onSubmitConversation(event) {
        event.preventDefault();
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

            setResult(data.result);
            setConversationInput("");
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
                <input
                    type="text"
                    name="conversation"
                    placeholder="How can I help you today?"
                    value={conversationInput}
                    onChange={(e) => setConversationInput(e.target.value)}
                />
                <input type="submit" value="Submit" />
            </form>
            <div className={styles.result}>{result}</div>
        </>
    )
}
