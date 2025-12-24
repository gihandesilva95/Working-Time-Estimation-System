## Working Time Estimation System


A Laravel-based backend with React frontend for managing tasks, time estimates, and work schedules for Project Managers (PM) and Engineers.

**Features**

- Project Manager can:
  - Create and assign tasks to Engineers  
  - View all tasks and submitted time estimates  
  - Calculate task end date/time based on working hours and holidays  
  - Configure daily working hours, recurring holidays, and one-time holidays  

- Engineer can:
  - View only tasks assigned to them  
  - Submit time estimates for tasks  

- Accurate calculation of end date/time, considering:
  - Working hours  
  - Weekends  
  - Recurring and one-time holidays  

- Fully responsive React frontend with Material-UI  

- Unit-tested for backend logic 

## Tech Stack

- **Backend:** Laravel 10, PHP 8+, MySQL  
- **Frontend:** React, Material-UI  
- **Unit Testing:** PHPUnit  


## 🚀 Installation

### Clone the repository
```bash
    git clone https://github.com/gihandesilva95/Working-Time-Estimation-System.git
    cd Working-Time-Estimation-System 
```
### Backend Setup

1. Install dependencies

```bash
    cd time-estimation-backend
    composer install
```

2. setup env file
```bash
    cp .env.example .env
```

3. Generate application key
```bash
    php artisan key:generate
```

4. Configure your .env database section (change this part according to your data)
```bash
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=working_time_estimation
    DB_USERNAME=root
    DB_PASSWORD=
```

5. Run migrations
```bash
    php artisan migrate --seed
```

6. Run seeders
```bash
    php artisan db:seed
```

7. Run the server
```bash
    php artisan serve
```


### Frontend Setup

1. Install dependencies
```bash
    cd time-estimation-frontend
    npm install
```

7. Run the Application
```bash
    npm start
```

Application Open your browser at http://localhost:3000


### Run backend unit tests
```bash
    php artisan test --env=testing
```