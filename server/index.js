const express = require('express');
const cors = require('cors');
const connection = require('./db');
const userRoute = require('./routes/userRoute');
const newsRoute = require('./routes/newsRoute');
const jobRoute = require('./routes/jobRoute');
const pollRoute = require('./routes/pollRoute');
const alumniRoute = require('./routes/alumniRoute');
const GeminiRoutes = require('./routes/GeminiRoutes');

require('dotenv').config();


const multer = require('multer');
const pdfParse = require('pdf-parse');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Enable credentials for cookies, headers
    allowedHeaders: ['Content-Type', 'Authorization'] 
}));
app.use(express.json());
 


const {GoogleGenAI} = require("@google/genai")

const ai = new GoogleGenAI({ apiKey: "AIzaSyCmx42XEOgJexuMizCsiaZKFMb-_spG0iQ" });


app.post("/analyze-resume", upload.single("resume"), async (req, res) =>{

   
  try {

    const {jobDescription} = req.body;

    if(!req.file || !jobDescription){
      return res.status(400).json({
        message : "file And description required"
      });
    }

    const text = await pdfParse(req.file.buffer).then((data) => data.text);


  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents:  `Analyze this resume and compare it with the following job description:
    Job Description: ${jobDescription}
    Resume: ${text}
    
    Return the following in strictly json format:
    {
      "name": "Candidate's Name",
      "experience": "Summary of experience",
      "skills": ["Skill1", "Skill2"],
      "education": "Degree and CGPA",
      "resumeScore": "Score out of 100",
      "improvements": ["Point1", "Point2", "Point3"]
    }`
  });

  const generatedText = response.candidates?.[0]?.content?.parts?.map(part => part.text).join(" ") || "No response";
  console.log(generatedText);
    
  

  return res.json(generatedText);

  } catch (error) {
    res.status(400).json({
      message : "Failed to analyze "
    })
  }
})








const frontendUrl = process.env.FRONTENDURI || "http://localhost:3000"; // Default for local development
const allowedOrigins = [
    frontendUrl,
   // "https://your-production-frontend.com", // Add production URLs
];



app.options('*', cors()); 


//-----------------------------------------------------Routers----------------------------------------------------------------

app.use('/user',userRoute);
app.use('/news',newsRoute);
app.use('/job',jobRoute);
app.use('/poll',pollRoute);
app.use('/alumni',alumniRoute);
app.use('/gemini',GeminiRoutes);
// app.use('/paymentOrder',paymentRoutes);

//---------------------------------------------------Milldewares--------------------------------------------------

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Server Side Error");
});

//---------------------------------------------Connection to Database----------------------------------------------------
connection();

//----------------------------------------------------Listening---------------------------------------------------------------

app.get('/', (req, res) =>{
    res.send("Server up and running")
})

const port = process.env.PORT || 5000;
app.listen(port, () =>{
    console.log("Server up and running on ", port);
})







