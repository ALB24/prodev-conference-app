# Conference GO! Frontend

This is the Conference GO! frontend. It is a [React](https://reactjs.org/)
application that uses [React Router](https://reactrouter.com/) as its routing
mechanism. It uses contexts to maintain app-wide state. For making AJAX calls,
it uses the well-known [Axios](https://github.com/axios/axios) package. Finally,
it leverages the `.env`-file support built into the Create React App
scaffolding. 

## Running the application locally

Here are the steps that you should go through to get a working local development
(or running) application.

### Using the right version of Node.js

There is a `.nvmrc` file that pins the version of Node.js to use. To install
dependencies, make sure you have [Node Version
Manager](https://github.com/nvm-sh/nvm) or [Node Version Manager for
Windows](https://github.com/coreybutler/nvm-windows) installed and run the
following.

If you have any problems, check out the troubleshooting steps in the
installation instructions.

```sh
# Should work for Bash and Z-shell
nvm install $(cat .nvmrc)
nvm use
```

If you have any problems with nvm and are using macOS Catalina, try the following, then restart your terminal instance.

```sh
# Should work for Bash and Z-shell
touch ~/.zshrc
. ~/.nvm/nvm.sh
```

If you plan on doing development, then run

```sh
# For development
npm install
```

If this is "production", then run

```sh
# For production
npm install --prod
```

### Setting up your environment

The `template.env` file contains the skeleton of the environment variables
needed to get the application running. **Copy** it to `.env` and set the values
to how you will run your backend.

Here's what `template.env` looks like.

```sh
# Set this to http://«host»:«port»/«api»/«prefix» for your backend service. For
# example, host could be "localhost", port could be "8080", and /«api»/«prefix»
# could just be "/api" which is what the default backed implementation has.
REACT_APP_API_URL=      # Example: http://localhost:3900/api
```

### Run the application

```sh
# To run with nodemon to pick up changes
npm run start
```

### Now that it's running...

You can check out the API docs at http://localhost:«port»/swagger-ui for
whatever value for `PORT` you put in your `.env` file. This describes the full
interactions that will be used by a consumer (a graphical human interface).

## The DB model

Here's the entity relationship diagram for the application for referral.

![conference app erd](./src/docs/erd.png)

## Application workflow

The use of the application goes in the following order:

1. A person either registers or starts a session with some credentials using
   either the Register or Login page.
1. A person then creates a location for their event, if it does not exist.
   They'll access that by clicking on Locations in the main navigation.
1. A person creates an event, then updates it as they have more information.
   They'll access that by clicking on Events in the main navigation.
1. As people send in their interest to attend, the person will create _attendee_
   records by clicking on the event they want to add attendees to, and then
   clicking Attendees on the subnav.
1. As people send in their interest to speak, the person will create _presentation_
   records by clicking on the event they want to add presentations to, and then
   clicking Presentations on the subnav.
1. Once a _presentation_ is approved or disapproved, then the person will mark
   the presentation with that status by clicking on the appropriate button for
   the presentation on the presentation list for the conference.
1. Before the conference begins, the badges are pulled and printed. All badges
   for attendees and speakers are available from the Badges subnav on the page
   for an event.

## Coding patterns

This application is built like someone started it pre-React 16 and, then,
learned hooks when they came out. You can see an evolution of structure to the
components in the application that follow that mindset.

In the **/src/services** directory, you'll find a collection of files that
provide the HTTP interactions with the different endpoints. The HTTP service
also registers some global handlers for Axios to use on requests and responses,
primarily the Bearer token received after logging in or registering. HTTP
service also exposes the built-in value for the URL to use to prefix to the
endpoints needed by the frontend.

The React entry point is **App.js** which sets up routes, registers a date
formatter, and handles global styles.

In the **common/** directory, you'll find some widgets used throughout the
application.

In the **components** directory, you'll find all of the components the UI files.
Again, there is a mixture of frontend patterns that you would normally find in
any long-lived React application that the development team hasn't had to go
through and refactor everything to the exact same pattern.
