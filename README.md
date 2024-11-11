# Carpark Optimisation (Frontend Visualization)

## Dependencies

### 3. Node.js Dependencies
To run this project, you will need the following dependencies on your system:
- Node.js 
- Node Package Manager

After installing the dependencies, run the following commands:
```sh
# Installs node modules
npm i
```

### 2. Google Maps API Key ENV
This project uses Google Maps as its preferred maps provider.

In order to run the project, you will need a Google Maps API Key, you can follow
the steps in the official [Google Maps API Setup](https://developers.google.com/maps/documentation/javascript/get-api-key) to get the key.

After obtaining the key, run the following command (to create a .env file with
the key inside of it):
```sh
echo 'NEXT_PUBLIC_GOOGLE_MAP_API=<your key>' >> .env
```

You've now succesfully configured `.env` file with the Google Maps API Key.
Now you're able to run the project locally with the following command:

```sh
npm run dev
```

### 3. Backend URL ENV (Optional)
If you're running the [backend](https://github.com/carpark-optimisation/optimisation-model) locally,
you will not have to configure this variable as the default value of this
variable is set to `'http://127.0.0.1:5061'` by default.

However, if you're running the Backend on a hosted service such as
Heroku/Vercel, run the following command configure the frontend to point to the
correct backend:
```sh
# Head to your service provider/server and add the following env variable
# You may not be running export and instead may be configuring it in a Web GUI
export BACKEND_URL=http://<your-backend-url>:<port-number>
```

If you need to configure it locally, you can run the following command:
```sh
# e.g. https://somehost, http://somehost, http://somehost:5061
echo 'BACKEND_URL=http://<your-backend-url>:<port-number>' >> .env
```
