# MistHustlers Software Workflow

This file explains how the MistHustlers app works visually: who uses what, where data goes, and how the frontend, backend, admin dashboard, database, and bin files connect.

## 1. Main Actors

```mermaid
flowchart LR
  Visitor[Website Visitor / Client]
  Applicant[Student / Applicant]
  Admin[Admin / MistHustlers Team]
  Frontend[Frontend Website]
  Backend[Backend API]
  DB[(Database)]
  Bin[Bin Files JSON]

  Visitor --> Frontend
  Applicant --> Frontend
  Admin --> AdminUI[Admin Dashboard]

  Frontend --> Backend
  AdminUI --> Backend

  Backend --> DB
  Backend --> Bin
```

## 2. System Structure

```mermaid
flowchart TB
  subgraph Frontend_App["Frontend App"]
    Home[Home Page]
    Career[Career Page]
    Services[Services Page]
    Projects[Projects Page]
    Contact[Contact / Inquiry Forms]
  end

  subgraph Backend_App["Backend App"]
    PublicAPI[Public API Routes]
    InquiryAPI[Inquiry Routes]
    AdminAPI[Admin Routes]
    Auth[Admin Auth / API Key Auth]
  end

  subgraph Storage["Storage"]
    Inquiries[(Inquiries)]
    Opportunities[(Opportunities)]
    Applicants[(Applicants)]
    ProjectsTable[(Projects)]
    ContentJSON[Content JSON Files]
    BinJSON[bin-files.json]
  end

  Home --> PublicAPI
  Career --> PublicAPI
  Projects --> PublicAPI
  Services --> InquiryAPI
  Contact --> InquiryAPI

  AdminDashboard[Admin Dashboard] --> Auth
  Auth --> AdminAPI

  PublicAPI --> Opportunities
  PublicAPI --> ProjectsTable
  PublicAPI --> ContentJSON
  InquiryAPI --> Inquiries
  AdminAPI --> Inquiries
  AdminAPI --> Opportunities
  AdminAPI --> Applicants
  AdminAPI --> ProjectsTable
  AdminAPI --> BinJSON
```

## 3. User Website Workflow

```mermaid
flowchart TD
  Start[User opens website]
  Browse[Browse Home / Services / Career / Projects]
  Inquiry[Submit service/contact inquiry]
  CareerApply[Click Apply Now on Career]
  GoogleForm[Google Form opens]
  ProjectsPage[View Built by the community]

  Start --> Browse
  Browse --> Inquiry
  Browse --> CareerApply
  Browse --> ProjectsPage

  Inquiry --> BackendInquiry[/POST inquiry API/]
  BackendInquiry --> DBInquiries[(Inquiries table)]
  DBInquiries --> AdminLeads[Admin Section 01 Leads]

  CareerApply --> GoogleForm
  ProjectsPage --> PublicProjects[/GET api/projects/]
  PublicProjects --> DBProjects[(Projects table)]
```

Important: Google Form responses do not automatically enter the database yet. Admin can manually add applicants in Section 03, or a future Google Sheets/API integration can sync them.

## 4. Admin Dashboard Sections

```mermaid
flowchart LR
  Admin[Admin]

  Admin --> S1[Section 01 Leads]
  Admin --> S2[Section 02 Career Hub]
  Admin --> S3[Section 03 Applicants]
  Admin --> S4[Section 04 Projects]
  Admin --> S5[Section 05 Bin Files]

  S1 --> ContactLead[Contact / Call / Archive / Delete]
  S2 --> AddJob[Add Job]
  S2 --> AddProgram[Add Program]
  S2 --> AddEvent[Add Event]
  S2 --> PauseArchiveDelete[Pause / Archive / Delete]
  S3 --> AddApplicant[Add Applicant]
  S3 --> ApplicantStatus[Review / Shortlist / Accept / Reject / Delete]
  S4 --> CreateProject[Create Project]
  S4 --> MoveProject[Move Project Status]
  S4 --> DeleteProject[Delete Project]
  S5 --> ClearBin[Clear Bin / Remove Bin Item]
```

## 5. Leads Workflow

```mermaid
flowchart TD
  User[Client / Visitor]
  Form[Service or Contact Inquiry Form]
  Backend[/Inquiry API/]
  Inquiries[(Inquiries table)]
  Leads[Admin Section 01 Leads]
  Contact[Admin contacts lead]
  Archive[Archive lead]
  Delete[Delete lead]
  Bin[Section 05 Bin Files]

  User --> Form
  Form --> Backend
  Backend --> Inquiries
  Inquiries --> Leads
  Leads --> Contact
  Leads --> Archive
  Leads --> Delete
  Delete --> Bin
```

## 6. Career Hub Workflow

```mermaid
flowchart TD
  Admin[Admin]
  QuickActions[Quick Actions]
  CareerHub[Section 02 Career Hub]
  Opportunities[(Opportunities table)]
  CareerPage[Frontend Career Page]
  Delete[Delete opportunity]
  Bin[Section 05 Bin Files]

  Admin --> QuickActions
  QuickActions --> AddJob[Add Job]
  QuickActions --> AddProgram[Add Program]
  QuickActions --> AddEvent[Add Event]

  AddJob --> Opportunities
  AddProgram --> Opportunities
  AddEvent --> Opportunities

  Opportunities --> CareerHub
  Opportunities --> CareerPage

  CareerHub --> Delete
  Delete --> Bin
```

## 7. Event Posting Workflow

When admin adds an event, the app creates two records:

1. Opportunity record for Career Hub and Career frontend.
2. Project record for Projects frontend section.

```mermaid
flowchart TD
  Admin[Admin clicks + Add Event]
  AdminUI[Admin Dashboard]
  Backend[/POST api/admin/opportunities/]
  Opportunities[(Opportunities table)]
  ProjectCopy[/POST api/admin/projects/]
  Projects[(Projects table)]
  CareerHub[Admin Career Hub]
  CareerPage[Frontend Career Page]
  ProjectsPage[Frontend Projects Page]

  Admin --> AdminUI
  AdminUI --> Backend
  Backend --> Opportunities
  Backend --> ProjectCopy
  ProjectCopy --> Projects

  Opportunities --> CareerHub
  Opportunities --> CareerPage
  Projects --> ProjectsPage
```

Frontend visibility:

```mermaid
flowchart LR
  Opportunities[(Opportunities)] --> ApiOpp[/GET api/opportunities/]
  ApiOpp --> Career[Career Page Opportunities]

  Projects[(Projects)] --> ApiProjects[/GET api/projects/]
  ApiProjects --> Built[Projects Page: Built by the community]
```

## 8. Applicants Workflow

```mermaid
flowchart TD
  Applicant[Applicant]
  ApplyButton[Career Apply Now]
  GoogleForm[Google Form]
  Admin[Admin]
  ManualAdd[Admin Section 03 Add Applicant]
  Applicants[(Applicants table)]
  ApplicantsUI[Section 03 Applicants]
  Status[Reviewed / Shortlisted / Accepted / Rejected]
  Delete[Delete applicant]
  Bin[Section 05 Bin Files]

  Applicant --> ApplyButton
  ApplyButton --> GoogleForm
  Admin --> ManualAdd
  ManualAdd --> Applicants
  Applicants --> ApplicantsUI
  ApplicantsUI --> Status
  ApplicantsUI --> Delete
  Delete --> Bin
```

## 9. Projects Workflow

```mermaid
flowchart TD
  Admin[Admin]
  Create[Create Project]
  Projects[(Projects table)]
  Board[Admin Section 04 Projects Board]
  PublicProjects[Frontend Projects Page]
  Move[Move: planning -> in-progress -> review -> completed]
  Delete[Delete project]
  Bin[Section 05 Bin Files]

  Admin --> Create
  Create --> Projects
  Projects --> Board
  Projects --> PublicProjects
  Board --> Move
  Board --> Delete
  Delete --> Bin
```

## 10. Delete And Bin Workflow

```mermaid
flowchart TD
  AnySection[Any admin section]
  Delete[Click Delete]
  BackendDelete[/DELETE api/admin/.../]
  ReadItem[Read original item]
  BinFile[Save copy to bin-files.json]
  RemoveDB[Remove item from main table]
  BinUI[Section 05 Bin Files]
  Clear[Clear Bin / Remove single bin item]

  AnySection --> Delete
  Delete --> BackendDelete
  BackendDelete --> ReadItem
  ReadItem --> BinFile
  BinFile --> RemoveDB
  BinFile --> BinUI
  BinUI --> Clear
```

## 11. Quick Actions Mapping

| Admin Button | Backend Table | Frontend Impact |
| --- | --- | --- |
| Add Job | Opportunities | Shows on Career page |
| Add Program | Opportunities | Shows on Career page |
| Add Event | Opportunities + Projects | Shows on Career page and Projects page |
| Create Project | Projects | Shows on Projects page |

## 12. Main Data Map

| Data | Created From | Stored In | Shown In Admin | Shown In Frontend |
| --- | --- | --- | --- | --- |
| Lead / Inquiry | Service/contact form | Inquiries table | Section 01 Leads | No public listing |
| Job | Admin Add Job | Opportunities table | Section 02 Career Hub | Career page |
| Program | Admin Add Program | Opportunities table | Section 02 Career Hub | Career page |
| Event | Admin Add Event | Opportunities + Projects tables | Career Hub + Projects | Career page + Projects page |
| Applicant | Admin manual add / future sync | Applicants table | Section 03 Applicants | No public listing |
| Project | Admin Create Project | Projects table | Section 04 Projects | Projects page |
| Deleted Item | Admin delete action | bin-files.json | Section 05 Bin Files | No public listing |

## 13. Current Limitation

Google Form applications currently open externally. They do not automatically sync into Section 03 Applicants unless a Google Sheets/API integration is added later.

