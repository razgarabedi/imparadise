# Image Uploader Web Application

This is a full-stack web application that allows users to register, upload images to private or public folders, and manage their content. It features a React frontend and a Node.js/Express backend, with PostgreSQL for data storage and AWS S3 for file storage.

## Features

*   **User Authentication**: Secure user registration and login with JWT-based authentication.
*   **Role-Based Access Control**: The first user to register becomes an administrator. Admins have special privileges.
*   **Folder Management**: Authenticated users can create, edit, and delete their own folders, and mark them as public or private.
*   **Image Uploads**: Users can upload images to their folders. Image files are stored securely in an AWS S3 bucket.
*   **Dynamic Content Viewing**: Users can view their own private folders and all public folders created by any user.
*   **Admin Dashboard**: A special dashboard for administrators to:
    *   View all registered users.
    *   Change user roles (e.g., promote a user to admin).
    *   Delete users.
    *   Manage application-wide settings, such as the maximum image upload size.

---

## Production Deployment on Ubuntu with NGINX and PostgreSQL

These instructions provide a step-by-step guide to deploying the application on a production Ubuntu server.

### 1. Prerequisites

Before you begin, ensure you have the following installed on your Ubuntu server:
*   **Node.js and npm**: Recommended to use `nvm` (Node Version Manager) to install a recent LTS version.
*   **PostgreSQL**: The database for the application.
*   **NGINX**: The web server that will act as a reverse proxy.
*   **Git**: For cloning the repository.
*   **PM2**: A process manager for Node.js to keep the backend running.

```bash
# Update package list
sudo apt update

# Install NGINX and Git
sudo apt install -y nginx git

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install nvm and Node.js (example)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
# Reload your shell or run source ~/.bashrc
nvm install --lts
nvm use --lts

# Install PM2 globally
npm install pm2 -g
```

### 2. Database Setup

1.  **Log in to PostgreSQL:**
    ```bash
    sudo -i -u postgres
    psql
    ```

2.  **Create a new database user and database:**
    Replace `your_db_user` and `your_db_password` with secure credentials.
    ```sql
    CREATE DATABASE imparadise;
    CREATE USER imparadise_user WITH ENCRYPTED PASSWORD 'your_db_password';
    GRANT ALL PRIVILEGES ON DATABASE imparadise TO imparadise_user;
    \q 
    ```

3.  **Exit the `postgres` user shell:**
    ```bash
    exit
    ```

### 3. Application Setup

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url> imparadise
    cd imparadise
    ```

2.  **Configure the Backend:**
    *   Navigate to the backend directory: `cd backend`
    *   Install dependencies: `npm install`
    *   Create a `.env` file: `cp .env.example .env` (assuming you create an example file) or `nano .env`
    *   Fill the `.env` file with your configuration. **This is a critical step.**

    ```dotenv
    # Database Connection
    DB_USER=imparadise_user
    DB_HOST=localhost
    DB_DATABASE=imparadise
    DB_PASSWORD=your_db_password
    DB_PORT=5432

    # JWT Secret - Use a long, random, and secure string
    JWT_SECRET="your_super_secret_key_here"

    # AWS S3 Configuration
    AWS_REGION=your-aws-region
    AWS_ACCESS_KEY_ID=your-aws-access-key-id
    AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
    AWS_BUCKET_NAME=your-s3-bucket-name
    ```

3.  **Run Database Migrations:**
    From the `backend` directory, run the migrations to set up the database tables and default settings.
    ```bash
    npm run migrate
    ```

4.  **Build the Frontend:**
    *   Navigate to the frontend directory: `cd ../frontend`
    *   Install dependencies: `npm install`
    *   Create the production build: `npm run build`
    This will create a `build` directory with the static files for the React app.

### 4. Start the Backend Server with PM2

From the `backend` directory (`cd ../backend`), start the server:

```bash
pm2 start server.js --name imparadise-backend

# Optional: Configure PM2 to restart on server reboot
pm2 startup
pm2 save
```

Your backend is now running and will restart automatically.

### 5. Configure NGINX

1.  **Create a new NGINX configuration file:**
    ```bash
    sudo nano /etc/nginx/sites-available/imparadise
    ```

2.  **Add the following server block configuration.**
    Replace `your_domain.com` with your server's domain name or IP address.

    ```nginx
    server {
        listen 80;
        server_name your_domain.com;

        # Root and index files for the React frontend
        root /path/to/your/project/imparadise/frontend/build;
        index index.html index.htm;

        # Handle all requests for static files first
        location / {
            try_files $uri /index.html;
        }

        # Reverse proxy for all API calls to the backend server
        location /api {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

3.  **Enable the site by creating a symbolic link:**
    ```bash
    sudo ln -s /etc/nginx/sites-available/imparadise /etc/nginx/sites-enabled/
    ```

4.  **Test your NGINX configuration and restart:**
    ```bash
    sudo nginx -t
    sudo systemctl restart nginx
    ```

### 6. Firewall and Security (Recommended)

1.  **Configure UFW (Uncomplicated Firewall):**
    ```bash
    sudo ufw allow 'Nginx Full'
    sudo ufw allow 'OpenSSH'
    sudo ufw enable
    ```

2.  **Set up SSL with Certbot (Let's Encrypt):**
    For a production site, it is highly recommended to use HTTPS.
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d your_domain.com
    ```
    Certbot will automatically update your NGINX configuration to handle SSL.

Your application should now be running and accessible at your domain.