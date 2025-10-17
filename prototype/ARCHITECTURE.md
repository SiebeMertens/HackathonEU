# CyberHubs Assessment Tool — Architecture & API Specification

## System Architecture

### Current (Prototype Phase)

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         React + Vite (SPA)                       │  │
│  │  - CyberAssessmentTool Component                │  │
│  │  - Adaptive Logic (Rule-based)                  │  │
│  │  - Localization (i18n)                          │  │
│  │  - localStorage (Persistence)                   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
     ↓ (No backend call in prototype)
  All logic runs client-side.
```

### Future (Production Phase)

```
┌──────────────────────────────────────────────────────────────────┐
│                      User Browser                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React SPA + Tailwind + Lucide Icons                    │   │
│  │  - Assessment UI                                        │   │
│  │  - Adaptive Logic (Enhanced with server feedback)      │   │
│  │  - Localization                                         │   │
│  │  - localStorage + Session Management                    │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
     ↓ HTTPS/WebSocket
┌──────────────────────────────────────────────────────────────────┐
│                 Backend API (Node.js/Python)                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Authentication & Authorization (OAuth2 / JWT)          │   │
│  │  - User management                                      │   │
│  │  - Session handling                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Assessment Engine                                      │   │
│  │  - Dynamic question selection                           │   │
│  │  - Adaptive algorithm (server-side scoring)             │   │
│  │  - Real-time feedback                                   │   │
│  │  - LLM integration (ChatGPT, Anthropic, etc.)          │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Learning Path & Recommendation Engine                  │   │
│  │  - Personalized course suggestions                      │   │
│  │  - Benchmarking (anonymous peer comparison)            │   │
│  │  - Career path insights                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Admin Dashboard API                                    │   │
│  │  - Content management (questions, domains)             │   │
│  │  - Analytics & reporting                               │   │
│  │  - User cohort insights                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
     ↓ (Database Layer)
┌──────────────────────────────────────────────────────────────────┐
│                     PostgreSQL / MongoDB                          │
│  - User profiles (minimal PII)                                    │
│  - Assessment history (anonymized)                               │
│  - Questions & domains                                           │
│  - Learning resources                                            │
│  - Aggregate analytics                                           │
└──────────────────────────────────────────────────────────────────┘
```

---

## REST API Specification (Future Phase)

### Base URL
```
https://api.cyberhubs-assessment.example.com/v1
```

### Authentication
All endpoints (except `/auth/*` and `/public/*`) require a Bearer token:
```
Authorization: Bearer <JWT_TOKEN>
```

---

### Authentication Endpoints

#### 1. POST `/auth/register`
**Description:** Register a new user.

**Request:**
```json
{
  "email": "learner@example.com",
  "password": "securePassword123!",
  "country": "PL",
  "language": "pl"
}
```

**Response (201 Created):**
```json
{
  "userId": "uuid-1234",
  "email": "learner@example.com",
  "token": "eyJhbGc...",
  "expiresIn": 86400
}
```

#### 2. POST `/auth/login`
**Description:** Authenticate user and return token.

**Request:**
```json
{
  "email": "learner@example.com",
  "password": "securePassword123!"
}
```

**Response (200 OK):**
```json
{
  "userId": "uuid-1234",
  "token": "eyJhbGc...",
  "expiresIn": 86400
}
```

#### 3. POST `/auth/logout`
**Description:** Revoke user session.

**Response (204 No Content)**

---

### Assessment Endpoints

#### 4. GET `/assessments/domains`
**Description:** Fetch available assessment domains.

**Response (200 OK):**
```json
{
  "domains": [
    {
      "id": "network-security",
      "name": "Network Security",
      "description": "Firewalls, IDS/IPS, network architecture",
      "difficulty": "beginner",
      "icon": "shield"
    },
    {
      "id": "secure-coding",
      "name": "Secure Coding",
      "description": "OWASP Top 10, input validation, secure SDLC",
      "difficulty": "intermediate",
      "icon": "code"
    }
  ]
}
```

#### 5. POST `/assessments/start`
**Description:** Start a new assessment.

**Request:**
```json
{
  "domainId": "network-security"
}
```

**Response (201 Created):**
```json
{
  "assessmentId": "uuid-5678",
  "domainId": "network-security",
  "startedAt": "2025-10-17T10:30:00Z",
  "expiresAt": "2025-10-17T11:30:00Z",
  "initialQuestions": [
    {
      "id": "ns1",
      "text": "What does a firewall primarily do?",
      "options": ["A", "B", "C", "D"],
      "difficulty": "beginner"
    }
  ]
}
```

#### 6. POST `/assessments/{assessmentId}/answer`
**Description:** Submit an answer and get feedback + next question.

**Request:**
```json
{
  "questionId": "ns1",
  "selectedOption": 1,
  "responseTime": 8.5,
  "confidence": "high"
}
```

**Response (200 OK):**
```json
{
  "isCorrect": true,
  "explanation": "A firewall filters incoming and outgoing network traffic...",
  "difficulty": "intermediate",
  "nextQuestion": {
    "id": "ns3",
    "text": "In a DDoS attack, what is the primary goal...",
    "options": ["A", "B", "C", "D"],
    "difficulty": "intermediate"
  },
  "adaptiveStatus": {
    "currentLevel": "intermediate",
    "recentScore": 0.67,
    "escalateNext": false
  }
}
```

#### 7. POST `/assessments/{assessmentId}/finish`
**Description:** Finalize assessment and get results.

**Response (200 OK):**
```json
{
  "assessmentId": "uuid-5678",
  "domainId": "network-security",
  "completedAt": "2025-10-17T10:45:00Z",
  "results": {
    "score": 78,
    "correctAnswers": 7,
    "totalQuestions": 9,
    "avgResponseTime": 7.2,
    "skillLevel": "Intermediate",
    "certificationsRecommended": ["CISSP", "CEH"]
  },
  "badges": [
    {
      "name": "Quick Learner",
      "earnedAt": "2025-10-17T10:45:00Z"
    }
  ],
  "learningPath": {
    "title": "Skill Enhancement",
    "recommendations": [
      "Intermediate Network Security online courses",
      "Hands-on labs on TryHackMe",
      "Join CyberHubs community workshops"
    ]
  }
}
```

#### 8. GET `/assessments/{userId}/history`
**Description:** Retrieve user's assessment history (anonymized for privacy).

**Response (200 OK):**
```json
{
  "assessments": [
    {
      "assessmentId": "uuid-5678",
      "domainId": "network-security",
      "completedAt": "2025-10-17T10:45:00Z",
      "score": 78,
      "skillLevel": "Intermediate"
    },
    {
      "assessmentId": "uuid-9999",
      "domainId": "secure-coding",
      "completedAt": "2025-10-16T15:20:00Z",
      "score": 85,
      "skillLevel": "Advanced"
    }
  ]
}
```

---

### Benchmarking & Analytics Endpoints

#### 9. GET `/analytics/benchmarks/{domainId}`
**Description:** Fetch anonymized peer benchmarks for a domain.

**Query Parameters:**
- `country` (optional): Filter by country code (PL, PT, HU, etc.).

**Response (200 OK):**
```json
{
  "domainId": "network-security",
  "benchmarks": {
    "global": {
      "averageScore": 72,
      "medianScore": 75,
      "p25": 60,
      "p75": 85,
      "sampleSize": 1500
    },
    "country": {
      "PL": {
        "averageScore": 74,
        "sampleSize": 150
      },
      "PT": {
        "averageScore": 70,
        "sampleSize": 120
      }
    }
  }
}
```

#### 10. GET `/analytics/leaderboard`
**Description:** Fetch anonymous leaderboard (opt-in).

**Query Parameters:**
- `country` (optional): Leaderboard for specific country.
- `period`: `week`, `month`, `all-time` (default: `month`).
- `limit`: 1-100 (default: 10).

**Response (200 OK):**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "pseudonym": "ShadowCoder#1234",
      "averageScore": 92,
      "assessmentsCompleted": 5
    },
    {
      "rank": 2,
      "pseudonym": "NetSecWizard#5678",
      "averageScore": 88,
      "assessmentsCompleted": 4
    }
  ]
}
```

---

### Learning Resources Endpoints

#### 11. GET `/resources/learning-paths/{skillLevel}`
**Description:** Fetch curated learning resources by skill level.

**Query Parameters:**
- `domain`: Filter by domain (e.g., `network-security`).
- `country`: Localized resources (PL, PT, etc.).

**Response (200 OK):**
```json
{
  "skillLevel": "Intermediate",
  "domain": "network-security",
  "resources": [
    {
      "id": "resource-1",
      "title": "Advanced Network Security",
      "type": "course",
      "provider": "Coursera",
      "url": "https://...",
      "duration": "40 hours",
      "cost": "Free",
      "language": "en"
    },
    {
      "id": "resource-2",
      "title": "Network Segmentation Best Practices",
      "type": "whitepaper",
      "provider": "ENISA",
      "url": "https://...",
      "language": "pl"
    }
  ]
}
```

---

### Admin Endpoints (Protected: Admin Role Required)

#### 12. POST `/admin/questions`
**Description:** Add new question.

**Request:**
```json
{
  "domainId": "network-security",
  "difficulty": "advanced",
  "type": "mcq",
  "text": "New question text?",
  "options": ["A", "B", "C", "D"],
  "correctOption": 2,
  "explanation": "Explanation...",
  "tags": ["networking", "firewalls"]
}
```

**Response (201 Created):**
```json
{
  "id": "ns-new-1",
  "domainId": "network-security",
  "createdAt": "2025-10-17T10:00:00Z"
}
```

#### 13. GET `/admin/analytics/cohorts`
**Description:** View anonymized cohort analytics.

**Query Parameters:**
- `country`, `institutionId`, `dateRange`.

**Response (200 OK):**
```json
{
  "cohorts": [
    {
      "cohortId": "cohort-1",
      "institution": "University of Warsaw",
      "country": "PL",
      "averageScore": 75,
      "participantCount": 45,
      "completionRate": 0.88,
      "strongDomains": ["secure-coding"],
      "weakDomains": ["incident-response"]
    }
  ]
}
```

---

## Data Models

### User Profile (Minimal PII)
```json
{
  "userId": "uuid",
  "email": "hashed",
  "country": "PL",
  "language": "pl",
  "joinedAt": "2025-10-17T10:00:00Z",
  "lastActivityAt": "2025-10-17T15:30:00Z"
}
```

### Assessment Record (Anonymized)
```json
{
  "assessmentId": "uuid",
  "userId": "anonymized-hash",
  "domainId": "network-security",
  "score": 78,
  "questions": [
    {
      "questionId": "ns1",
      "selectedOption": 1,
      "isCorrect": true,
      "responseTime": 8.5,
      "difficulty": "beginner"
    }
  ],
  "completedAt": "2025-10-17T10:45:00Z"
}
```

### Badge Record
```json
{
  "badgeId": "uuid",
  "userId": "uuid",
  "badgeName": "Quick Learner",
  "domainId": "network-security",
  "earnedAt": "2025-10-17T10:45:00Z"
}
```

---

## Security Considerations

1. **Authentication:** OAuth2 / OpenID Connect for enterprise SSO.
2. **Authorization:** Role-based access control (Learner, Instructor, Admin).
3. **Data Encryption:** TLS 1.3 for transport; AES-256 for sensitive fields at rest.
4. **Rate Limiting:** 100 requests/minute per user.
5. **CORS:** Whitelist trusted domains.
6. **Input Validation:** Strict sanitization and type checking.
7. **GDPR Compliance:** Right to access, deletion, data portability.
8. **Logging & Monitoring:** Audit trails for all user actions.

---

## Scalability & Performance

- **Caching:** Redis for session data, assessment benchmarks.
- **Database Indexing:** On `userId`, `domainId`, `completedAt`.
- **API Rate Limiting:** Token bucket algorithm.
- **Load Balancing:** Multiple API servers behind load balancer.
- **CDN:** Static assets (questions, learning resources) via CDN.
- **Monitoring:** Datadog, New Relic, or similar for performance tracking.

---

## Future Enhancements

1. **GraphQL API:** Flexible querying for mobile/web clients.
2. **WebSocket Support:** Real-time leaderboard updates, live coaching.
3. **LLM Integration:** AI-powered question generation, personalized coaching.
4. **Batch Import:** Bulk upload questions from CSV/Excel.
5. **Webhooks:** For institutional system integrations.

---

## Testing Strategy

- **Unit Tests:** Jest/Vitest for React components and logic.
- **Integration Tests:** API endpoint tests with test database.
- **Load Testing:** Apache JMeter or k6 for stress testing.
- **Security Testing:** OWASP ZAP, Burp Suite for vulnerabilities.

---

## Deployment Infrastructure

- **Containerization:** Docker + Kubernetes for orchestration.
- **CI/CD:** GitHub Actions / GitLab CI for automated testing & deployment.
- **Database:** PostgreSQL (relational) + Redis (caching).
- **Hosting:** AWS ECS, GCP Cloud Run, or Azure App Service.
- **Monitoring:** Prometheus + Grafana for metrics.

---

## Contact & Collaboration

For architecture questions or contributions, reach out to the development team or open an issue in the repository.
