const {GoogleGenAI} = require("@google/genai")
const ai = new GoogleGenAI({ apiKey: "AIzaSyCmx42XEOgJexuMizCsiaZKFMb-_spG0iQ" });

const AskSomething = async (req,res) => {

    try {
         const {prompt} = req.body;
// console.log(prompt);

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  const generatedText = response.candidates?.[0]?.content?.parts?.map(part => part.text).join(" ") || "No response";
  console.log(generatedText);

  return res.json(generatedText);

//   res.status(200).json({
//     success : true,
//     message : "Request executed successfully"
//   })
        
    } catch (error) {
        console.log(error);
    }


}

module.exports ={AskSomething}