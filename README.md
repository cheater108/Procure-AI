
# Finance ai assistant
Procure AI - An AI assisted procurement tool which helps in creating Request for Proposals (RFPs), send emails and rank proposals.


## Project Setup

### Prequisites
- OpenAI API Key for LLMs.
- SendGrid API Key for Email feature.
- Node version atleast v20.
- Domain for SendGrid Email setup.

### Install steps

Clone the repo

```bash
  git clone https://github.com/cheater108/dashboard-accuknox
```

**Frontend Setup**

Go to the frontend and install dependencies

```bash
  cd frontend
  npm install
```

Create .env file in frontend folder see .env.example

Run the dev server

```bash
  npm run dev
```

**Backend Setup**

Go to the frontend and install dependencies

```bash
  cd ..\backend
  npm install
```

Create .env file in backend folder see .env.example.

For SendGrid Email setup a domain is required, see SendGrid docs for detailed setup. Follow their free trial onboarding setup. 

IMP: For running locally Ngrok is required to tunnel backend, so that SendGrid can post whenever a email is replied to. (Follow their guide)

Run the dev server

```bash
  npm run dev
```
## Tech Stack

**Client:** React.js, Tailwind, ShadCN, Vite.

**Backend:** TypeScript, Express.js, Mongoose, Ngrok.

**Database:** MongoDB.

**LLM:** OpenAI, LangChain.

**Email provider:** Twillio - SendGrid.

**AI-tools:** Windsurf + Gemini.




## API Reference

#### Get session based on localstorage

```http
  GET /api/session
```

#### Get all RFPs created in a Session

```http
  GET /api/rfps

  on success
  {
    rfps: []
  }

  on error 
  {
    error: "Failed to fetch RFPs"
  }
```
#### Post a RFP

```http
  POST /api/rfps
  body: {
    query
  }

  on success
  {
    rfp
  }

  on error 
  {
    error: "Failed to create RFP"
  }
```

#### Post a Vendor in RFP

```http
  POST /api/rfps/:id/vendors
  params: RFP Id

  on success: vendor

  on error 
  {
    error: "Failed to add vendor"
  }
```

#### Post Email to Vendors

```http
  POST /api/email/:id
  params: RFP Id
  body: vendorIds, body, subject

  on success:
  {
    message: "Email sent successfully"
  }

  on error 
  {
    error: "Failed to send emails"
  }
```

#### Post inbound Emails required by SendGrid

```http
  POST /api/email/inbound
  params: RFP Id
  body: vendorIds, body, subject

  on success: OK

  on error 
  {
    error: "Failed to send emails"
  }
```






## Decisions & Assumptions

### Key Design decisions
- **Models:** OpenAI gpt-4o model for resoning, and newer gpt-4o-search-preview model for search.
  - **RFP Agent:** Main task is to create Request for proposals and email body, by understanding user requirements.
  - **Search Agent:** Main task is to search web for vendors from given requirements.
  - **Ranking Agent:** Main task is to analyse the vendors responses, attachments and create a fair score and give feedback.

- **LangChain:** For easy agent creation and structured outputs. 

- **User flow:** Users start with a chat initially to create RFP and email. Then agent creates a RFP with email. User can see RFPs, add vendors, send email and see rank and feedback of the responses.

- **Assumptions:** 
  - Vendors send proposal and quotes in PDFs.
  - Users get the initial start with AI, further follow up is to be made by Human. 
  - Bulk send to multiple vendors requires generalized proposal. 
  - User is assumed to add atleast product name, quantity, and budget.
## AI Tools Usage

### Tools used
- **Windsurf:** For agent mode and good tab completions.
- **Gemini-3:** For troubleshooting and frontend integrations

### Tools Usage
- To Build Frontend
- Boilerplating code and code completions.
- Always specify Files and existing structure in detailed manner to get best results.
- Creating Frontend takes the most manual work, using AI here saves time from manual creation and integration headaches. 