# MEDORA - Healthcare Management System

A comprehensive Django-based healthcare management system with role-based dashboards for super admins, doctors, nurses, and patients.

## Features

- **Role-based Authentication**: Super Admin, Doctor, Nurse, Patient roles
- **Appointment Management**: Book, approve, reject appointments
- **Medical Records**: Create and manage patient medical records
- **Task Management**: Assign and track tasks for healthcare staff
- **Vital Signs**: Record and monitor patient vital signs
- **Notifications**: Real-time notification system
- **User Management**: Admin panel for user administration

## Quick Start

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Setup Database**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```

4. **Load Sample Data (Optional)**
   ```bash
   python manage.py loaddata sample_data.json
   ```

5. **Run Development Server**
   ```bash
   python manage.py runserver
   ```

6. **Access the Application**
   - Visit: http://127.0.0.1:8000/
   - Admin Panel: http://127.0.0.1:8000/admin/

## Demo Accounts

After running migrations, you can create demo accounts:

- **Super Admin**: admin / admin123
- **Doctor**: doctor / doctor123  
- **Nurse**: nurse / nurse123
- **Patient**: patient / patient123

## Project Structure

```
medora/
├── healthcare/          # Main Django app
│   ├── models.py       # Database models
│   ├── views.py        # View logic
│   ├── forms.py        # Django forms
│   ├── urls.py         # URL routing
│   └── admin.py        # Admin configuration
├── templates/          # HTML templates
├── static/            # CSS, JS, images
├── media/             # User uploads
├── requirements.txt   # Python dependencies
└── manage.py         # Django management script
```

## Key Models

- **User**: Extended Django user with roles
- **Appointment**: Patient-doctor appointments
- **MedicalRecord**: Patient medical history
- **Task**: Staff task management
- **VitalSigns**: Patient vital sign records
- **Notification**: User notifications

## Technologies Used

- **Backend**: Django 4.2, Python 3.8+
- **Frontend**: Bootstrap 5, HTML5, CSS3, JavaScript
- **Database**: SQLite (development), PostgreSQL (production)
- **Forms**: Django Crispy Forms with Bootstrap 5
- **Icons**: Font Awesome 6

## Development

1. **Create Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Development Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run Tests**
   ```bash
   python manage.py test
   ```

4. **Collect Static Files**
   ```bash
   python manage.py collectstatic
   ```

## Deployment

1. **Set Environment Variables**
   ```bash
   export SECRET_KEY="your-production-secret-key"
   export DEBUG=False
   export DATABASE_URL="your-database-url"
   ```

2. **Install Production Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run Migrations**
   ```bash
   python manage.py migrate
   ```

4. **Collect Static Files**
   ```bash
   python manage.py collectstatic --noinput
   ```

5. **Start Application**
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.