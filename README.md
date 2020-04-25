See this app live at [https://circa-survive-lyric-machine.herokuapp.com](https://circa-survive-lyric-machine.herokuapp.com). It may take a minute to load as Heroku auto-sleeps apps after 30 minutes.

# Backend

The backend Flask API lives in the `api` folder. To set up the API, execute the `scripts/build` script (from the root of the project). You will need to be in a Python >= 3.7 shell to setup the API properly. The script will create a virtual environment and install all Python and Node dependencies.
You can run tests (still need to implement), linting, and typechecking by executing `scripts/test`. To develop, run `scripts/develop` this will install some development packages (i.e. flake8, autopep8, mypy) start the local flask server and frontend concurrently. Finally, `scripts/local` can be used to build the production frontend bundle and start a local gunicorn server to test the app in a production environment. The app will be served at [http://localhost:8000](http://localhost:8000)

## Set up the model and run the server

You will need to create a new folder `api/model` and place two files in it `circa_model.h5` (the tensorflow binary) and `idx_to_char.json` which is a JSON array of the characters placed in ascending order (i.e. the vocabulary list used to train the model).Start the server from the root of the directory by executing `scripts/develop` script. This will export the default Flask app and start the development server and frontend. Use `scripts/local` to build the static frontend and run the production gunicorn server.

### TODO

- Instructions on training and saving text generation model
- API and deployment tests

## Available Scripts

In the project directory, you can run:

### `scripts/build`

Builds the Python 3 virtual environment, installs required Python dependencies, and installs required npm dependencies with Yarn. Make sure `python3` points to an executable >= 3.7.

### `scripts/test`

Runs unit tests, linting, and typechecking on the Flask API. Tests the React app.

### `scripts/develop`

Install development dependencies, start the Flask server, and start the frontend React app.

### `scripts/local`

Start a local Gunicorn server to test the app as it would run in a production environment.

# Frontend
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn start-api`

Runs the Flask API development server. The API can be accesed at [http://localhost:8000](http://localhost:8000).

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn test-api`

Tests the Flask API. You may need to install `tox` in the virtual environment (i.e. `.venv/bin/pip install tox`).

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
