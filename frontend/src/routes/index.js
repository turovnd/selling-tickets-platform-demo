/* ============
 * Routes File
 * ============
 *
 * The routes and redirects are defined in this file.
 */

export default [
    // Main layout + Public pages
    {
        path: '/',
        component: () => import('../views/layouts/main'),
        children: [
            // Home page
            {
                path: '/',
                name: 'Home',
                component: () => import('../views/Home/main')
            },
            // About page
            {
                path: '/about',
                name: 'About',
                component: () => import('../views/About')
            },
            // Park pages with custom template
            {
                path: '/park/:link',
                name: 'ParkPage',
                component: () => import('../views/Park/main')
            },
            // Order page
            {
                path: '/order',
                name: 'OrderPage',
                component: () => import('../views/Order/main')
            },
            // Order details page
            {
                path: 'order/:id',
                name: 'OrderDetailsPage',
                component: () => import('../views/Order/Details')
            },
            // Confirmation page
            {
                path: '/confirmation',
                name: 'ConfirmationPage',
                component: () => import('../views/Confirmation/main')
            },
            // Handle Access Deny Pages
            {
                path: '/no-access',
                name: 'AccessDeny',
                component: () => import('../views/AccessDeny')
            },
            // Handle Not Found
            {
                path: '/not-found',
                name: 'NotFound',
                component: () => import('../views/NotFound')
            }
        ]
    },

    // Main layout + Auth pages
    {
        path: '/',
        component: () => import('../views/layouts/main'),
        children: [
            // Sign In page
            {
                path: '/signin',
                name: 'SignIn',
                meta: {
                    authPage: true
                },
                component: () => import('../views/SignIn')
            },
            // Sign Up page
            {
                path: '/signup',
                name: 'SignUp',
                meta: {
                    authPage: true
                },
                component: () => import('../views/SignUp')
            },
            // Reset page
            {
                path: '/reset',
                name: 'Reset',
                meta: {
                    authPage: true
                },
                component: () => import('../views/Reset')
            },
            // Recovery page
            {
                path: '/recovery',
                name: 'Recovery',
                meta: {
                    authPage: true
                },
                component: () => import('../views/Recovery')
            }
        ]
    },

    // Form layout + page
    {
        path: '/form',
        name: 'FormPage',
        component: () => import('../views/layouts/form')
    },

    // Redirect all other pages to Not Found page
    {
        path: '*',
        redirect: '/not-found'
    }
];
