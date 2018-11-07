// Standard Node modules
const Path = require('path');   // Files and directories

// Hapi
const Boom = require('boom');   // Error reporting
const Joi = require('joi');     // Input validation
const Hapi = require('hapi');   // Server

// Other
const Handlebars = require('handlebars');   // Template engine

const server = Hapi.server({
    host: 'localhost',
    port: 3000,
    routes: {
        files: {
            // Make file requests relative to the public directory.
            relativeTo: Path.join(__dirname, 'public')
        }
    }
});

/**
 * Helper function that checks the validity of an entered password
 * @param {string} password password to check
 * @param {list} message_list list to push relevant messages to
 * @param {string} message message to be displayed
 */
function validate(password, message_list, message) {
    if (!password.match(/[A-Z]/)) {
        message_list.push(`${message} requires at least one upper-case letter`);
    }

    if (!password.match(/[a-z]/)) {
        message_list.push(`${message} requires at least one lower-case letter`);
    }

    if (!password.match(/[0-9]/)) {
        message_list.push(`${message} requires at least one digit`);
    }

    if (password.length < 8) {
      message_list.push(`${message} must be at least 8 characters`);
    }
}

async function init() {
    // Show routes at startup.
    await server.register(require('blipp'));

    // Output logging information.
    await server.register({
        plugin: require('hapi-pino'),
        options: {
            prettyPrint: true
        }
    });

    // Configure templating.
    await server.register(require('vision'));
    server.views({
        engines: {
            hbs: Handlebars,
            html: Handlebars
        },
        isCached: false,            // Don't cache pages during development.
        defaultExtension: 'hbs',    // Most common
        relativeTo: __dirname,      // Template directory tree right here
        path: './templates',        // Top-level template directory
        layout: 'base',             // Default layout file
        layoutPath: './templates/layout',       // Location of layout file(s)
        partialsPath: './templates/partials'    // Location of partial file(s)
    });

    // Configure static file service.
    await server.register(require('inert'));


    // Configure routes.
    server.route([
        {
            method: 'GET',
            path: '/',
            config: {
                description: 'Home page'
            },
            handler: async (request, h) => {
                return h.view('index');
            }
        },
        {
            method: 'GET',
            path: '/sign-up',
            config: {
                description: 'Sign-up page'
            },
            handler: async (request, h) => {
                return h.view('sign-up.hbs');
            }
        },
        {
            method: 'POST',
            path: '/sign-up',
            config: {
                description: 'Handle sign-up request',
                validate: {
                    payload: {
                        email: Joi.string().email().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request, h) => {
                let messages = [];
                if (!request.payload.email.match(/^\w+@\w+\.\w{2,}$/)) {
                    messages.push(`'${request.payload.email}' is an invalid email address`);
                }
                validate(request.payload.password, messages, 'Sign-up password');
                if (messages.length) {
                    return h.view('sign-up.hbs', {errors: messages})
                } else {
                    return h.view('index', {flash: ['Signed up successfully!']});
                }
            }
        },
        {
            method: 'GET',
            path: '/reset-password',
            config: {
                description: 'Reset Password Page',
            },
            handler: async (request, h) => {
                return h.view('reset-password.hbs');
            }
        },
        {
            method: 'GET',
            path: '/public/{param*}',
            config: {
                description: 'Public assets'
            },
            handler: {
                directory: {
                    path: '.',
                    redirectToSlash: true,
                    index: false
                }
            }
        }
    ]);

    // Start the server.
    await server.start();
    console.log(`Server running at ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
    console.error(err);
    process.exit(1);
});

// Go!
init();