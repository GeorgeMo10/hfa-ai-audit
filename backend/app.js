// Load environment variables first
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// Try multiple paths to find .env file
let envPath = path.resolve(__dirname, ".env");

// Check if file exists
if (!fs.existsSync(envPath)) {
  // Try current working directory
  envPath = path.resolve(process.cwd(), ".env");
}

// Load the .env file
dotenv.config({ path: envPath });

// If still no API key, try default dotenv behavior
if (!process.env.OPENAI_API_KEY) {
  dotenv.config();
}

const express = require("express");
const cors = require("cors");
const audit = require("./audit");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Audit endpoint
app.post("/api/audit", async (req, res) => {
  try {
    const { text, context } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ 
        error: "Text is required" 
      });
    }

    if (!context) {
      return res.status(400).json({ 
        error: "Context is required" 
      });
    }

    // Call the audit function
    const auditResult = await audit.performAudit(text, context);

    res.json(auditResult);
  } catch (error) {
    console.error("Audit error:", error);
    res.status(500).json({ 
      error: "Failed to perform audit", 
      message: error.message 
    });
  }
});

// Improve text endpoint
app.post("/api/improve", async (req, res) => {
  try {
    const { originalText, issues, context } = req.body;

    if (!originalText || !originalText.trim()) {
      return res.status(400).json({ 
        error: "Original text is required" 
      });
    }

    if (!issues || !Array.isArray(issues) || issues.length === 0) {
      return res.status(400).json({ 
        error: "Issues array is required" 
      });
    }

    if (!context) {
      return res.status(400).json({ 
        error: "Context is required" 
      });
    }

    const improvedText = await audit.improveText(originalText, issues, context);

    res.json({ improvedText });
  } catch (error) {
    console.error("Improve error:", error);
    res.status(500).json({ 
      error: "Failed to improve text", 
      message: error.message 
    });
  }
});

// Compare models endpoint
app.post("/api/compare-models", async (req, res) => {
  try {
    const { prompt, context, models } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ 
        error: "Prompt is required" 
      });
    }

    if (!context) {
      return res.status(400).json({ 
        error: "Context is required" 
      });
    }

    // Default models if not specified
    const modelNames = models || ["gpt-4o-mini", "gpt-3.5-turbo", "gpt-4o"];

    const comparison = await audit.compareModels(prompt, context, modelNames);

    res.json(comparison);
  } catch (error) {
    console.error("Compare models error:", error);
    res.status(500).json({ 
      error: "Failed to compare models", 
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Audit endpoint: http://localhost:${PORT}/api/audit`);
});
