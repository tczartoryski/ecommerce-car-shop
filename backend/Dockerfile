# Use the official Python image as the base image
FROM python:3.10

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project code
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose the port for the ASGI server
EXPOSE 8000

# Start the Daphne server
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "ecommerce.asgi:application"]