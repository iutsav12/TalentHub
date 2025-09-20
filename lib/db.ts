"use client"

import Dexie, { type Table } from "dexie"
import type { Job, Candidate, Assessment, AssessmentScore } from "./types"

export class TalentHubDB extends Dexie {
  jobs!: Table<Job>
  candidates!: Table<Candidate>
  assessments!: Table<Assessment>
  assessmentScores!: Table<AssessmentScore>

  constructor() {
    super("TalentHubDB")

    this.version(1).stores({
      jobs: "id, title, slug, status, createdAt, order",
      candidates: "id, name, email, currentStage, jobId, createdAt",
      assessments: "id, title, jobId, isActive, createdAt",
      assessmentScores: "assessmentId, candidateId, completedAt",
    })
  }
}

export const db = new TalentHubDB()

const ARTIFICIAL_LATENCY_MIN = 200
const ARTIFICIAL_LATENCY_MAX = 1200
const ERROR_RATE = 0.08 // 8% error rate on write operations

const simulateNetworkDelay = () => {
  const delay = Math.random() * (ARTIFICIAL_LATENCY_MAX - ARTIFICIAL_LATENCY_MIN) + ARTIFICIAL_LATENCY_MIN
  return new Promise((resolve) => setTimeout(resolve, delay))
}

const shouldSimulateError = () => {
  return Math.random() < ERROR_RATE
}

export class DatabaseService {
  // Jobs operations
  static async getAllJobs(): Promise<Job[]> {
    await simulateNetworkDelay()
    return db.jobs.orderBy("order").toArray()
  }

  static async getJob(id: string): Promise<Job | undefined> {
    await simulateNetworkDelay()
    return db.jobs.get(id)
  }

  static async createJob(job: Job): Promise<void> {
    await simulateNetworkDelay()
    if (shouldSimulateError()) {
      throw new Error("Network error: Failed to create job")
    }
    await db.jobs.add(job)
  }

  static async updateJob(id: string, updates: Partial<Job>): Promise<void> {
    await simulateNetworkDelay()
    if (shouldSimulateError()) {
      throw new Error("Network error: Failed to update job")
    }
    await db.jobs.update(id, updates)
  }

  static async deleteJob(id: string): Promise<void> {
    await simulateNetworkDelay()
    if (shouldSimulateError()) {
      throw new Error("Network error: Failed to delete job")
    }
    await db.jobs.delete(id)
  }

  // Candidates operations
  static async getAllCandidates(): Promise<Candidate[]> {
    await simulateNetworkDelay()
    return db.candidates.orderBy("createdAt").reverse().toArray()
  }

  static async getCandidate(id: string): Promise<Candidate | undefined> {
    await simulateNetworkDelay()
    return db.candidates.get(id)
  }

  static async createCandidate(candidate: Candidate): Promise<void> {
    await simulateNetworkDelay()
    if (shouldSimulateError()) {
      throw new Error("Network error: Failed to create candidate")
    }
    await db.candidates.add(candidate)
  }

  static async updateCandidate(id: string, updates: Partial<Candidate>): Promise<void> {
    await simulateNetworkDelay()
    if (shouldSimulateError()) {
      throw new Error("Network error: Failed to update candidate")
    }
    await db.candidates.update(id, updates)
  }

  static async deleteCandidate(id: string): Promise<void> {
    await simulateNetworkDelay()
    if (shouldSimulateError()) {
      throw new Error("Network error: Failed to delete candidate")
    }
    await db.candidates.delete(id)
  }

  // Assessments operations
  static async getAllAssessments(): Promise<Assessment[]> {
    await simulateNetworkDelay()
    return db.assessments.orderBy("createdAt").reverse().toArray()
  }

  static async getAssessment(id: string): Promise<Assessment | undefined> {
    await simulateNetworkDelay()
    return db.assessments.get(id)
  }

  static async createAssessment(assessment: Assessment): Promise<void> {
    await simulateNetworkDelay()
    if (shouldSimulateError()) {
      throw new Error("Network error: Failed to create assessment")
    }
    await db.assessments.add(assessment)
  }

  static async updateAssessment(id: string, updates: Partial<Assessment>): Promise<void> {
    await simulateNetworkDelay()
    if (shouldSimulateError()) {
      throw new Error("Network error: Failed to update assessment")
    }
    await db.assessments.update(id, updates)
  }

  static async deleteAssessment(id: string): Promise<void> {
    await simulateNetworkDelay()
    if (shouldSimulateError()) {
      throw new Error("Network error: Failed to delete assessment")
    }
    await db.assessments.delete(id)
  }

  // Assessment scores operations
  static async getAssessmentScores(assessmentId: string): Promise<AssessmentScore[]> {
    await simulateNetworkDelay()
    return db.assessmentScores.where("assessmentId").equals(assessmentId).toArray()
  }

  static async createAssessmentScore(score: AssessmentScore): Promise<void> {
    await simulateNetworkDelay()
    if (shouldSimulateError()) {
      throw new Error("Network error: Failed to save assessment score")
    }
    await db.assessmentScores.add(score)
  }
}

export async function seedDatabase() {
  const jobCount = await db.jobs.count()
  if (jobCount > 0) return // Already seeded

  console.log("Seeding database with sample data...")

  // Seed jobs with more variety
  const jobTitles = [
    "Senior Frontend Developer",
    "Backend Engineer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Product Manager",
    "UX Designer",
    "Data Scientist",
    "Mobile Developer",
    "QA Engineer",
    "Technical Lead",
    "Software Architect",
    "Site Reliability Engineer",
    "Machine Learning Engineer",
    "Security Engineer",
    "Database Administrator",
    "Cloud Engineer",
    "Platform Engineer",
    "Engineering Manager",
    "Principal Engineer",
    "Staff Engineer",
    "Senior Backend Developer",
    "Junior Frontend Developer",
    "Lead Product Designer",
    "Senior Data Analyst",
    "Infrastructure Engineer",
  ]

  const companies = ["TechCorp", "InnovateLabs", "DataFlow", "CloudTech", "StartupXYZ"]
  const locations = ["Remote", "Patna", "New York", "London", "Berlin", "Toronto"]
  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"]

  const jobs: Job[] = Array.from({ length: 25 }, (_, i) => ({
    id: `job-${i + 1}`,
    title: jobTitles[i],
    slug: jobTitles[i]
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    description: `Join our team as a ${jobTitles[i]} and help us build the future of technology. We're looking for passionate individuals who want to make a real impact in a fast-growing company. You'll work with cutting-edge technologies and collaborate with talented professionals from around the world.`,
    responsibilities: [
      "Design and develop scalable software solutions",
      "Collaborate with cross-functional teams to deliver high-quality products",
      "Participate in code reviews and maintain coding standards",
      "Mentor junior team members and share knowledge",
      "Stay up-to-date with industry trends and best practices",
      "Contribute to technical architecture decisions",
    ],
    qualifications: [
      `3+ years of experience in ${jobTitles[i].includes("Senior") ? "senior-level" : "professional"} development`,
      "Strong problem-solving and analytical skills",
      "Excellent communication and teamwork abilities",
      "Bachelor's degree in Computer Science or related field",
      "Experience with modern development tools and practices",
      "Passion for learning and continuous improvement",
    ],
    status: Math.random() > 0.7 ? "archived" : "active",
    tags: [
      locations[Math.floor(Math.random() * locations.length)],
      jobTypes[Math.floor(Math.random() * jobTypes.length)],
      companies[Math.floor(Math.random() * companies.length)],
    ].slice(0, Math.floor(Math.random() * 3) + 1),
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date within last 90 days
    updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
    order: i,
  }))

  await db.jobs.bulkAdd(jobs)

  // Seed candidates with more realistic data
  const firstNames = [
    "Utsav",
    "Harsh",
    "Aarav",
    "Vivaan",
    "Aditya",
    "Riya",
    "Shreya",
    "Jatin",
    "Himanshu",
    "Shivam",
    "Navneet",
    "Karan",
    "Sunil",
    "Shubham",
    "Hrishav",
    "Dipika",
    "Vishakha",
    "Gulshan",
    "Shamvhavi",
    "Muzahid",
  ]
  const lastNames = [
    "Kumar",
    "Vardhan",
    "singh",
    "Brown",
    "Kumar",
    "Kumari",
    "Pandey",
    "Bhojwani",
    "Kumar",
    "Raj",
    "Kumar",
    "Raj",
    "Singh",
    "Kumar",
    "Raj",
    "Rai",
    "Kumari",
    "Chaupal",
    "Singh",
    "Hussain",
  ]

  const stages = ["applied", "screening", "interview", "assessment", "offer", "hired", "rejected"] as const
  const domains = ["gmail.com", "yahoo.com", "outlook.com", "company.com", "tech.io"]

  const candidates: Candidate[] = Array.from({ length: 1000 }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${
      domains[Math.floor(Math.random() * domains.length)]
    }`

    return {
      id: `candidate-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email,
      phone: Math.random() > 0.3 ? `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}` : undefined,
      currentStage: stages[Math.floor(Math.random() * stages.length)],
      jobId: jobs[Math.floor(Math.random() * jobs.length)].id,
      notes: [],
      assessmentScores: [],
      createdAt: new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000), // Random date within last 120 days
      updatedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // Random date within last 60 days
      timeline: [
        {
          id: `timeline-${i + 1}-1`,
          type: "stage_change",
          description: "Application submitted",
          createdAt: new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000),
        },
      ],
    }
  })

  await db.candidates.bulkAdd(candidates)

  // Seed assessments with more detailed questions
  const assessmentTitles = ["Technical Skills Assessment", "Problem Solving Evaluation", "System Design Challenge"]

  const questionTemplates = {
    technical: [
      "What is your experience with React and modern JavaScript frameworks?",
      "Explain the difference between SQL and NoSQL databases.",
      "How do you approach debugging complex software issues?",
      "Describe your experience with version control systems like Git.",
      "What testing strategies do you use in your development process?",
    ],
    problemSolving: [
      "Describe a challenging technical problem you solved recently.",
      "How do you prioritize tasks when working on multiple projects?",
      "Walk us through your approach to learning new technologies.",
      "How do you handle disagreements with team members about technical decisions?",
      "Describe a time when you had to optimize application performance.",
    ],
    systemDesign: [
      "Design a scalable chat application architecture.",
      "How would you design a URL shortening service like bit.ly?",
      "Explain how you would implement a real-time notification system.",
      "Design a database schema for an e-commerce platform.",
      "How would you approach building a content delivery network?",
    ],
  }

  const assessments: Assessment[] = Array.from({ length: 3 }, (_, i) => ({
    id: `assessment-${i + 1}`,
    title: assessmentTitles[i],
    jobId: jobs[i].id,
    sections: [
      {
        id: `section-${i + 1}-1`,
        title: "Technical Knowledge",
        order: 0,
        questions: Array.from({ length: 5 }, (_, j) => ({
          id: `question-${i + 1}-1-${j + 1}`,
          type: j % 2 === 0 ? ("single-choice" as const) : ("long-text" as const),
          question: questionTemplates.technical[j],
          required: j < 3,
          options: j % 2 === 0 ? ["Beginner", "Intermediate", "Advanced", "Expert"] : undefined,
          validation:
            j % 2 === 1
              ? {
                  minLength: 50,
                  maxLength: 500,
                }
              : undefined,
          order: j,
        })),
      },
      {
        id: `section-${i + 1}-2`,
        title: "Problem Solving",
        order: 1,
        questions: Array.from({ length: 3 }, (_, j) => ({
          id: `question-${i + 1}-2-${j + 1}`,
          type: "long-text" as const,
          question: questionTemplates.problemSolving[j],
          required: true,
          validation: {
            minLength: 100,
            maxLength: 1000,
          },
          order: j,
        })),
      },
      {
        id: `section-${i + 1}-3`,
        title: "System Design",
        order: 2,
        questions: Array.from({ length: 2 }, (_, j) => ({
          id: `question-${i + 1}-3-${j + 1}`,
          type: "long-text" as const,
          question: questionTemplates.systemDesign[j],
          required: true,
          validation: {
            minLength: 200,
            maxLength: 2000,
          },
          order: j,
        })),
      },
    ],
    shareableLink: `${typeof window !== "undefined" ? window.location.origin : "https://talenthub.com"}/assessment/assessment-${i + 1}`,
    isActive: true,
    createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  }))

  await db.assessments.bulkAdd(assessments)

  // Seed some assessment scores
  const assessmentScores: AssessmentScore[] = Array.from({ length: 50 }, (_, i) => ({
    assessmentId: assessments[Math.floor(Math.random() * assessments.length)].id,
    candidateId: candidates[Math.floor(Math.random() * 100)].id, // Only first 100 candidates have scores
    responses: [], // Would contain actual responses in real app
    score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
    completedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  }))

  await db.assessmentScores.bulkAdd(assessmentScores)

  console.log("Database seeded successfully!")
  console.log(`- ${jobs.length} jobs created`)
  console.log(`- ${candidates.length} candidates created`)
  console.log(`- ${assessments.length} assessments created`)
  console.log(`- ${assessmentScores.length} assessment scores created`)
}

export async function restoreApplicationState() {
  try {
    // Check if database exists and has data
    const [jobCount, candidateCount, assessmentCount] = await Promise.all([
      db.jobs.count(),
      db.candidates.count(),
      db.assessments.count(),
    ])

    if (jobCount === 0 && candidateCount === 0 && assessmentCount === 0) {
      console.log("No existing data found, seeding database...")
      await seedDatabase()
    } else {
      console.log("Restored application state from IndexedDB:")
      console.log(`- ${jobCount} jobs`)
      console.log(`- ${candidateCount} candidates`)
      console.log(`- ${assessmentCount} assessments`)
    }

    return {
      jobCount,
      candidateCount,
      assessmentCount,
    }
  } catch (error) {
    console.error("Failed to restore application state:", error)
    throw error
  }
}

export async function exportData() {
  try {
    const [jobs, candidates, assessments, assessmentScores] = await Promise.all([
      db.jobs.toArray(),
      db.candidates.toArray(),
      db.assessments.toArray(),
      db.assessmentScores.toArray(),
    ])

    const exportData = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      data: {
        jobs,
        candidates,
        assessments,
        assessmentScores,
      },
    }

    return exportData
  } catch (error) {
    console.error("Failed to export data:", error)
    throw error
  }
}

export async function importData(importedData: any) {
  try {
    // Clear existing data
    await Promise.all([db.jobs.clear(), db.candidates.clear(), db.assessments.clear(), db.assessmentScores.clear()])

    // Import new data
    await Promise.all([
      db.jobs.bulkAdd(importedData.data.jobs),
      db.candidates.bulkAdd(importedData.data.candidates),
      db.assessments.bulkAdd(importedData.data.assessments),
      db.assessmentScores.bulkAdd(importedData.data.assessmentScores),
    ])

    console.log("Data imported successfully!")
  } catch (error) {
    console.error("Failed to import data:", error)
    throw error
  }
}
