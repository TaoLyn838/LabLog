"use client"

import { useEffect, useState } from "react"

export default function HomePage() {
  const [projects, setProjects] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>("eyJhbGciOiJIUzI1NiIsImtpZCI6InArWUZVUE1FUEROTkFKemMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2dhbHN2c2pvbWhkdGRtemRoc214LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI3YjY4MTQ5OS1mYzFiLTQ1MzEtYmZlOS0zZmRkNmJlMDE3YTQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU2MjMxNDY3LCJpYXQiOjE3NTYyMjc4NjcsImVtYWlsIjoibHluY2hlbmd0YW9AZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NTYyMjc4Njd9XSwic2Vzc2lvbl9pZCI6IjY5YmFkOGQ3LTNhZGItNDMxYi1hYzMwLTA1YTdiNDdjYjc3ZCIsImlzX2Fub255bW91cyI6ZmFsc2V9.cVR-8S6PpxW5wS201PbczLtCEXRXE95lOddc6haXfAs")

  useEffect(() => {
    // const token = "eyJhbGciOiJIUzI1NiIsImtpZCI6InArWUZVUE1FUEROTkFKemMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2dhbHN2c2pvbWhkdGRtemRoc214LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI3YjY4MTQ5OS1mYzFiLTQ1MzEtYmZlOS0zZmRkNmJlMDE3YTQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU2MTgwMTE0LCJpYXQiOjE3NTYxNzY1MTQsImVtYWlsIjoibHluY2hlbmd0YW9AZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NTYxNzY1MTR9XSwic2Vzc2lvbl9pZCI6ImEwYTJhNDMyLTg5YzAtNDhmNC1iYmNmLTczOTY5YzU0ODU4YSIsImlzX2Fub255bW91cyI6ZmFsc2V9.NaYy60rXNaaKmg399X12aSoxtIb-7AYSYXZjtyXQW-k"

    fetch('/api/v1/projects', {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || "Request failed")
        }
        return res.json()
      })
        .then((data) => setProjects(data.projects))
        .catch((err) => setError(err.message))
  }, [])

  return (
    <div>
      <h1>My Projects</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <ul>
        {
          projects.map((p) => (
            <li key={p.id}>
              {p.name}
            </li>
          ))
        }
      </ul>

      <button
        onClick={async () => {
          const res = await fetch("/api/v1/projects", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: "Frontend Project" })
          })
          console.log(await res.json())
        }}
      >
        Add Project
      </button>
    </div>
  )
}