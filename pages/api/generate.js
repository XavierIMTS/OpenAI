import { Configuration, OpenAIApi } from "openai";
// api key 
// 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
// https://beta.openai.com/docs/quickstart/add-your-api-key
// Creér un api key et copier la clef dans le fichier .env
//
// Dans le répertoire où sont cpié les fichiers éxécuter
// npm install
// npm run dev
// Dans un navigateur localhost:3000
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

  const query = req.body.query || '';
  if (query.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid query",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(query),
      temperature: 0.9,
      max_tokens: 300,
  
    });
    res.status(200).json({ result: completion.data.choices[0].text,
    answer: query
   });
  } catch(error) {
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

function generatePrompt(query) {
  const capitalizedQuery = query[0].toUpperCase() + query.slice(1).toLowerCase();
    console.log(capitalizedQuery);
  return `query: ${capitalizedQuery}`;

}
