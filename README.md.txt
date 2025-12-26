# Working Time Estimation System

## Project Overview
The Working Time Estimation System is a full-stack application designed to help Project Managers (PMs) assign tasks to Software Engineers and track task time estimates. The system calculates the task end date and time based on the start date/time, engineer-provided time estimates, working hours, and configured holidays. It supports both positive (future) and negative (past) fractional working day estimates.

-------------------------------------------------------------------------------------------------------
## Features

### Project Manager (PM)
- Login as Project Manager.
- Redirected to PM Dashboard upon login.
- Settings Page:
  - Configure daily working hours (e.g., 08:00 – 16:00).
  - Add recurring holidays (e.g., 17 May every year).
  - Add one-time holidays (e.g., 27 May 2004).
- Task Management:
  - Create tasks and assign them to Software Engineers.
  - Specify task start date and time.
  - View estimated time, end date, and end time for each task through the Time Estimate Page.
  - End date and time are calculated by the backend considering working hours and holidays.

Software Engineer
- Register/Login as Software Engineer.
- Redirected to Engineer Dashboard upon login.
- Assigned Tasks Page:
  - View all tasks assigned to them.
  - Enter fractional working day estimates (e.g., 3.25 days) for each task.

----------------------------------------------------------

Backend Logic
- Built with Node.js.
- REST APIs handle:
  - User authentication and role-based routing.
  - Task creation and assignment.
  - Settings management (working hours, holidays).
  - End date and time calculation.
-Time estimation calculation:
  - Excludes non-working hours.
  - Skips holidays (recurring and one-time).
  - Supports positive (future) and negative (past) fractional day estimates.

------------------------------------------------------------------------------

Frontend
- Built with React.js.
- Role-based dashboards:
  - PM Dashboard
  - Engineer Dashboard
- Clean UI for task management, time estimates, and settings.

------------------------------------------------------------------------

## Technology Stack
- Frontend: React.js
- Backend: Node.js,
- Database: MongoDB
- Testing: Jest for backend unit tests

----------------------------------------------------------------------------

## Setup Instructions

Backend
1. Navigate to the backend folder:
cd backend

2.Install dependencies:
npm install
 
3. Create a .env file with MongoDB connection.
MONGO_URI=working_time_estimate_system
PORT=5000

4. Start the server:
node server.js

FrontEnd

1.Navigate to the frontend folder:
cd frontend
 
2.Install dependencies:
npm install

3.Start the React app:
npm start

5. Access the app at http://localhost:3000

-------------------------------------------------------------------------------

Assumptions

Only one PM exists in the system for simplicity.

Engineers can only see tasks assigned to them.

Holidays are skipped in time estimation calculations.

Fractional working days are calculated using daily working hours configured in settings.

-------------------------------------------------------------------------------

Known Limitations

Unit tests may not cover all edge cases.

The system does not include authentication security for production (sample login is used).

UI is basic and not fully responsive for mobile devices.

Backend does not implement pagination for tasks or users.

----------------------------------------------------------------------------------

Usage

Create PM and Engineer accounts.

PM configures working hours and holidays via the Settings page.

PM creates tasks and assigns them to Engineers.

Engineers submit time estimates for tasks.

PM views the estimated end date/time for tasks on the Time Estimate page.






















  
