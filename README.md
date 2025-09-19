# 🌟 TalentFlow – A Mini Hiring Platform

TalentFlow is a **React-based front-end application** that simulates a mini hiring platform for HR teams.  
It allows HR managers to manage **Jobs, Candidates, and Assessments** in an interactive, modern, and responsive interface.  
This project is **front-end only** with simulated APIs and local persistence.

---

## 🚀 Features

### 🔹 Jobs Management
- Create, edit, archive/unarchive jobs  
- Reorder jobs via drag-and-drop with optimistic updates & rollback  
- Deep linking: `/jobs/:jobId`  
- Validation (title required, unique slug)  

### 🔹 Candidates
- Virtualized list for 1000+ candidates  
- Client-side search & server-like filters  
- Candidate profile with timeline `/candidates/:id`  
- Kanban board to move candidates between stages  
- Notes with @mentions  

### 🔹 Assessments
- Assessment builder (single-choice, multi-choice, text, numeric, file upload stub)  
- Live preview pane & runtime validation  
- Conditional questions  
- Candidate responses persisted locally  

### 🔹 Data Layer
- **Simulated REST API** with MSW/MirageJS  
- **Persistence in IndexedDB** (via Dexie/localForage)  
- Artificial latency & error rate for real-world feel  

---

## 🏗️ Architecture

```mermaid
flowchart LR
  UI[React Frontend] -->|fetches| API[MSW/MirageJS Mock API]
  API --> DB[(IndexedDB - Local Persistence)]
  
  subgraph Modules
    Jobs
    Candidates
    Assessments
  end
  
  UI --> Jobs
  UI --> Candidates
  UI --> Assessments
