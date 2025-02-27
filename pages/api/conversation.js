import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const question = req.body.question || '';
  if (question.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid question Input",
      }
    });
    return;
  }

  // I want to eat korean BBQ  and ice-cream. After that I want to see sunset near the river.  please recommend cafe and restaurant near Wat mangkon MRT Thailand
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      // prompt: `Human:${question}\n\nAI:`, //string
      // prompt: `Human:${question}. return result into array of object form\n\nAI:`, //array
      prompt: `Human:${question}. return result into array of object form {"id": number, "name": string, "location": string}\n\nAI:`, //set key
      temperature: 0.9,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      stop: [" Human:", " AI:"],
    });

    let result = '';
    completion.data.choices.forEach(choice => {
      result = result + choice.text;
    });
    console.log(completion.data)

    res.status(200).json({ result: result });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
