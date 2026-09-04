import { useState } from "react";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");

  const [issues, setIssues] = useState([]);
  const [score, setScore] = useState(null);
  const [summary, setSummary] = useState("");

  const [skillsDemonstrated, setSkillsDemonstrated] = useState([]);
  const [skillsToImprove, setSkillsToImprove] = useState([]);

  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [verificationScore, setVerificationScore] = useState(null);
  const [verificationFeedback, setVerificationFeedback] = useState("");

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const analyzeCode = async () => {
    if (!code.trim()) {
      alert("Please paste some code first.");
      return;
    }

    setLoading(true);
    setIssues([]);
    setScore(null);
    setSummary("");
    setSkillsDemonstrated([]);
    setSkillsToImprove([]);
    setSubmitted(false);
    setAnswer("");
    setVerificationScore(null);
    setVerificationFeedback("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: code,
            language: language,
            project_context: "Beginner project",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Analyze request failed with status " + response.status
        );
      }

      const data = await response.json();

      setScore(data.overall_score);
      setSummary(data.summary || "");
      setSkillsDemonstrated(data.skills_demonstrated || []);
      setSkillsToImprove(data.skills_to_improve || []);
      setIssues(data.issues || []);
    } catch (error) {
      console.error("Analyze error:", error);
      alert(
        "Could not connect to the SkillGuard backend. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = async () => {
    if (!answer.trim() || issues.length === 0) {
      return;
    }

    setVerifying(true);
    setSubmitted(false);
    setVerificationScore(null);
    setVerificationFeedback("");

    try {
      const question = issues[0].verification_question;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question,
            answer: answer,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Verify request failed with status " + response.status
        );
      }

      const data = await response.json();

      setSubmitted(true);
      setVerificationScore(data.score);
      setVerificationFeedback(data.feedback || "");
    } catch (error) {
      console.error("Verify error:", error);
      alert(
        "Could not connect to the verification service. Please try again."
      );
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>SkillGuard</h1>
        <p>AI-Powered Code Review</p>
      </header>

      <main className="editor-container">
        <textarea
          className="code-input"
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <div className="controls">
          <select
            className="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>Python</option>
            <option>Java</option>
            <option>JavaScript</option>
            <option>C++</option>
          </select>

          <button
            className="analyze-button"
            onClick={analyzeCode}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Code"}
          </button>
        </div>

        {issues.length > 0 && (
          <div className="results">
            <h2>Analysis Results</h2>

            <div className="overall-analysis">
              <h3>Overall Score: {score}/100</h3>
              <p>{summary}</p>
            </div>

            {skillsDemonstrated.length > 0 && (
              <div className="overall-analysis">
                <h3>Skills Demonstrated</h3>

                {skillsDemonstrated.map((skill, index) => (
                  <p key={index}>• {skill}</p>
                ))}
              </div>
            )}

            {skillsToImprove.length > 0 && (
              <div className="overall-analysis">
                <h3>Skills to Improve</h3>

                {skillsToImprove.map((skill, index) => (
                  <p key={index}>• {skill}</p>
                ))}
              </div>
            )}

            {issues.map((issue, index) => (
              <div className="issue-card" key={index}>
                <h3>{issue.title}</h3>

                <p>
                  <strong>Severity:</strong> {issue.severity}
                </p>

                <p>
                  <strong>Explanation:</strong> {issue.explanation}
                </p>

                <p>
                  <strong>Why it matters:</strong>{" "}
                  {issue.why_it_matters}
                </p>

                <p>
                  <strong>Skill to learn:</strong>{" "}
                  {issue.skill_to_learn}
                </p>

                <p>
                  <strong>Recommended Improvement:</strong>{" "}
                  {issue.recommended_improvement}
                </p>

                {issue.reference && (
                  <p>
                    <strong>Reference:</strong>{" "}
                    <a
                      href={issue.reference.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {issue.reference.title}
                    </a>
                  </p>
                )}
              </div>
            ))}

            {issues[0]?.verification_question && (
              <div className="verification">
                <h2>Check Your Understanding</h2>

                <p className="verification-question">
                  {issues[0].verification_question}
                </p>

                <textarea
                  className="verification-input"
                  placeholder="Explain your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows="5"
                />

                <button
                  className="verify-button"
                  onClick={checkAnswer}
                  disabled={!answer.trim() || verifying}
                >
                  {verifying ? "Checking..." : "Submit Answer"}
                </button>

                {submitted && (
                  <div className="verification-feedback">
                    <h3>
                      Verification Score: {verificationScore}/100
                    </h3>

                    <p>{verificationFeedback}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

