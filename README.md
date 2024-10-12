# HandmadeShop
- Languages: Python, ReactJS
- Database: MySQL
- Test API: Postman
- Others: Django (CKEditor, OAuth2, DRF), Cloudinary, TailwindCSS

# The steps run the project for APIs
- Cloning the project
- Openning one of projects
- Reinstalling the libraries: pip install -r requirements.txt
- Checking database in settings.py and creating an empty database
- Executing the migrations: python manage.py migrate
- Load database: python manage.py loaddata data.json
- Creating an superuser (python manage.py createsuperuser) and * accessing admin page to test